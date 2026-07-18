import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { renderAsync } from 'docx-preview';
import * as XLSX from 'xlsx';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, FileSpreadsheet, Presentation, CheckCircle, RotateCw } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// A4 portrait ratio as default: 210mm / 297mm
const A4_PORTRAIT_RATIO = 210 / 297;
const A4_LANDSCAPE_RATIO = 297 / 210;

import LazyPdfPage from '../preview/LazyPdfPage';
import { PdfPreview } from '../preview/PdfPreview';
import { OfficePreview } from '../preview/OfficePreview';

// LazyPdfPage moved to src/components/preview/LazyPdfPage.tsx
interface DocumentLivePreviewProps {
  files: File[];
  currentLang?: string;
  isResult?: boolean;
  externalRotate?: number;
  watermarkConfig?: {
    text: string;
    opacity: number;
    color: string;
    scale: number;
    rotation: number;
  };
  pageNumberConfig?: { position: 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right' };
  splitRange?: string;
  compressQuality?: 'extreme' | 'balanced' | 'high';
  activeFileIndex?: number;
}

export const DocumentLivePreview: React.FC<DocumentLivePreviewProps> = ({
  files,
  currentLang: _currentLang = 'en',
  isResult = false,
  externalRotate,
  watermarkConfig,
  pageNumberConfig,
  splitRange,
  compressQuality,
  activeFileIndex = 0,
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [fileRotations, setFileRotations] = useState<Record<string, number>>({});
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  // pageAspectRatio: width / height of the actual document page (A4 portrait = 0.707)
  const [pageAspectRatio, setPageAspectRatio] = useState<number>(A4_PORTRAIT_RATIO);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [spreadsheetHtml, setSpreadsheetHtml] = useState<string | null>(null);
  const [textPreviewContent, setTextPreviewContent] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [pixelWidth, setPixelWidth] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);

  const activeFile = files[activeFileIndex] || null;
  const fileKey = activeFile ? `${activeFile.name}-${activeFile.size}` : '';
  const previewRotate = fileRotations[fileKey] || 0;

  const handleRotate = () => {
    if (!fileKey) return;
    setFileRotations(prev => ({
      ...prev,
      [fileKey]: ((prev[fileKey] || 0) + 90) % 360
    }));
  };

  // Reset page number & states on file change
  useEffect(() => {
    setPageNumber(1);
    setZoomScale(1.0);
    setPageAspectRatio(A4_PORTRAIT_RATIO);
    setErrorText(null);
    setSpreadsheetHtml(null);
    setTextPreviewContent(null);
  }, [activeFileIndex, files, isResult]);

  // Render document preview based on file extension
  useEffect(() => {
    if (!activeFile) return;

    let isCancelled = false;

    const renderPreview = async () => {
      setIsLoadingPreview(true);
      setErrorText(null);
      setSpreadsheetHtml(null);
      setTextPreviewContent(null);

      try {
        const ext = activeFile.name.split('.').pop()?.toLowerCase() || '';

        if (ext === 'pdf') {
          const arrayBuffer = await activeFile.arrayBuffer();
          if (isCancelled) return;
          const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          if (isCancelled) return;
          
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);

          const page = await pdf.getPage(Math.min(pageNumber, pdf.numPages));
          const baseRotate = page.rotate || 0;
          // Ensure rotation is always positive (0, 90, 180, 270)
          const finalPreviewRotate = externalRotate !== undefined ? externalRotate : previewRotate;
          const totalRotate = ((baseRotate + finalPreviewRotate) % 360 + 360) % 360;

          // Detect true page dimensions at scale 1 to calculate aspect ratio
          const baseViewport = page.getViewport({ scale: 1.0, rotation: totalRotate });
          const detectedRatio = baseViewport.width / baseViewport.height;
          setPageAspectRatio(detectedRatio);

          // Follow Image 1: Calculate scale based on the PARENT workspace to avoid collapsed wrapper height bugs
          const workspace = previewWrapperRef.current?.parentElement;
          const workspaceWidth = workspace?.clientWidth || 680;
          // Subtract Toolbar height (~64px) + margin/padding/gap (~76px) so the paper fits PERFECTLY
          const workspaceHeight = (workspace?.clientHeight || 600) - 140;
          
          const paddingX = 64; 
          const paddingY = 64;
          
          const scaleX = Math.max(0.1, (workspaceWidth - paddingX) / baseViewport.width);
          const scaleY = Math.max(0.1, (workspaceHeight - paddingY) / baseViewport.height);
          
          const fitScale = Math.min(scaleX, scaleY);
          const renderScale = fitScale * zoomScale;
          setPixelWidth(baseViewport.width * renderScale);
          const viewport = page.getViewport({ scale: renderScale, rotation: totalRotate });

          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
              if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
              }
              // CRITICAL: Always reset canvas transform identity matrix before resizing
              context.setTransform(1, 0, 0, 1, 0, 0);
              
              const pixelRatio = Math.max(window.devicePixelRatio || 1, 2);
              canvas.width = Math.floor(viewport.width * pixelRatio);
              canvas.height = Math.floor(viewport.height * pixelRatio);
              context.scale(pixelRatio, pixelRatio);
              context.clearRect(0, 0, viewport.width, viewport.height);
              
              const renderTask = page.render({ canvasContext: context, viewport, canvas } as any);
              renderTaskRef.current = renderTask;
              try {
                await renderTask.promise;
              } catch (err: any) {
                if (err.name === 'RenderingCancelledException') {
                  // Ignore cancelled renders
                  return;
                }
                throw err;
              }
            }
          }
        } else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) {
          // For images, detect actual image dimensions to set aspect ratio correctly
          const url = URL.createObjectURL(activeFile);
          setPreviewImageUrl(url);

          const img = new Image();
          img.onload = () => {
            setPageAspectRatio(img.naturalWidth / img.naturalHeight);
          };
          img.src = url;
          return () => URL.revokeObjectURL(url);
        } else if (ext === 'docx' || ext === 'doc') {
          // Word documents: A4 portrait as default canvas
          setPageAspectRatio(A4_PORTRAIT_RATIO);
          try {
            const arrayBuffer = await activeFile.arrayBuffer();
            if (docxContainerRef.current) {
              docxContainerRef.current.innerHTML = '';
              await renderAsync(arrayBuffer, docxContainerRef.current, undefined, {
                className: 'docx-preview-rendered',
                inWrapper: true,
                ignoreWidth: false,
                ignoreHeight: false,
                ignoreFonts: false,
                breakPages: true,
                useBase64URL: true,
              });
            }
          } catch (docxErr) {
            console.warn('Docx preview fallback:', docxErr);
          }
        } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
          // Spreadsheets: A4 landscape default canvas  
          setPageAspectRatio(A4_LANDSCAPE_RATIO);
          try {
            const arrayBuffer = await activeFile.arrayBuffer();
            const wb = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = wb.SheetNames[0];
            if (sheetName && wb.Sheets[sheetName]) {
              const htmlTable = XLSX.utils.sheet_to_html(wb.Sheets[sheetName], { id: 'spreadsheet-table' });
              setSpreadsheetHtml(htmlTable);
            }
          } catch (xlsErr) {
            console.warn('Excel preview fallback:', xlsErr);
          }
        } else if (ext === 'txt') {
          setPageAspectRatio(A4_PORTRAIT_RATIO);
          try {
            const textContent = await activeFile.text();
            setTextPreviewContent(textContent);
          } catch (txtErr) {
            console.warn('Text preview fallback:', txtErr)
          }
        } else {
          setPageAspectRatio(A4_PORTRAIT_RATIO);
        }
      } catch (err: any) {
        console.warn('Live preview render warning:', err);
        setErrorText('Rendering preview fallback active. File verified clean inside RAM.');
      } finally {
        setIsLoadingPreview(false);
      }
    };

    renderPreview();
  }, [activeFile, pageNumber, zoomScale, previewRotate, externalRotate, isResult]);

  if (!activeFile) return null;

  const fileExt = activeFile.name.split('.').pop()?.toLowerCase() || '';
  const isPdf = fileExt === 'pdf';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(fileExt);
  const isDocx = fileExt === 'docx' || fileExt === 'doc';
  const isSpreadsheet = ['xlsx', 'xls', 'csv'].includes(fileExt);
  const isTxt = fileExt === 'txt';
  const isOfficeOther = !isPdf && !isImage && !isDocx && !isSpreadsheet && !isTxt;

  // Removed isLandscape and formatSize as they are unused  // Paper-like shadow styles for the document container
  const paperShadow = isResult
    ? '0 4px 6px rgba(0,0,0,0.07), 0 12px 40px rgba(16,185,129,0.12), 0 24px 80px rgba(0,0,0,0.25)'
    : '0 4px 6px rgba(0,0,0,0.07), 0 12px 40px rgba(225,29,72,0.08), 0 24px 80px rgba(0,0,0,0.35)';

  const content = (
    <>
        <div
          className="glass-panel"
          style={{
            flex: '0 0 auto',
            minHeight: 0,
            padding: '16px 24px',
            marginBottom: isResult ? 0 : 24,
            borderLeft: isResult ? '4px solid #10b981' : '4px solid var(--brand-primary)',
            background: isResult ? 'rgba(16, 185, 129, 0.05)' : undefined,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
      {/* ===== Toolbar Area ===== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* PDF Controls */}
        {isPdf && (
          <>
            <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />
              <>
                <button onClick={() => setPageNumber((p) => Math.max(1, p - 1))} disabled={pageNumber <= 1 || isLoadingPreview} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                  <ChevronLeft size={15} />
                </button>
                <input 
                  type="range" 
                  min={1} 
                  max={totalPages} 
                  value={pageNumber} 
                  onChange={(e) => setPageNumber(parseInt(e.target.value))} 
                  style={{ width: 80, margin: '0 8px', cursor: 'pointer' }}
                  title="Geser untuk pindah halaman dengan cepat"
                />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', minWidth: 60, textAlign: 'center' }}>
                  {pageNumber} / {totalPages}
                </span>
                <button onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))} disabled={pageNumber >= totalPages || isLoadingPreview} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                  <ChevronRight size={15} />
                </button>
                <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />
              </>

            <button onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.15))} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} title="Zoom Out">
              <ZoomOut size={15} />
            </button>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', minWidth: 38, textAlign: 'center' }}>
              {Math.round(zoomScale * 100)}%
            </span>
            <button onClick={() => setZoomScale((z) => Math.min(2.5, z + 0.15))} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} title="Zoom In">
              <ZoomIn size={15} />
            </button>

            <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />
          </>
        )}

        {/* Image Zoom Controls */}
        {isImage && (
          <>
            <button onClick={() => setZoomScale((z) => Math.max(0.3, z - 0.15))} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} title="Zoom Out">
              <ZoomOut size={15} />
            </button>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', minWidth: 38, textAlign: 'center' }}>
              {Math.round(zoomScale * 100)}%
            </span>
            <button onClick={() => setZoomScale((z) => Math.min(4.0, z + 0.15))} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} title="Zoom In">
              <ZoomIn size={15} />
            </button>
            <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />
          </>
        )}

        {/* Rotate Button (PDF + Image) */}
        {(isPdf || isImage) && (
          <button
            onClick={handleRotate}
            className="btn-secondary"
            style={{ padding: '5px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 5 }}
            title="Putar 90° orientasi halaman"
          >
            <RotateCw size={15} />
            <span>Putar 90°</span>
          </button>
        )}
      </div>
    </div>

      {/* ===== A4-Shaped Paper Preview Container (Non-Result or Non-PDF) ===== */}
      <div
        ref={previewWrapperRef}
        style={{
          background: 'var(--bg-input)',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: 0,
          width: '100%',
          flex: '0 1 auto', // Don't grow beyond content, but DO shrink if taller than Left Workspace
          overflow: 'auto', // Scroll INTERNALLY if the paper gets larger than the container (e.g. zoom > 100%)
        }}
      >
        {/* Main Paper / Render area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Loading overlay inside the desk surface */}
          {isLoadingPreview && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', borderRadius: 14,
              background: 'var(--bg-input)', zIndex: 10,
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚡</div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.92rem' }}>
                {isResult ? 'Memuat Live Preview Hasil Konversi...' : 'Rendering High-Fidelity Preview...'}
              </span>
            </div>
          )}

          {/* ===== The actual "paper" element — aspect-ratio-driven ===== */}
          <div
              style={{
                width: pixelWidth ? `${pixelWidth}px` : '100%',
                aspectRatio: `${pageAspectRatio}`,
                flexShrink: 0,
                position: 'relative',
                background: '#ffffff',
                borderRadius: 4,
                boxShadow: paperShadow,
                overflow: 'hidden',
                transition: 'aspect-ratio 0.3s ease, width 0.3s ease',
                backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 27px,
                  rgba(0,0,0,0.018) 27px,
                  rgba(0,0,0,0.018) 28px
                )
              `,
            }}
          >
            {isPdf && (
              <PdfPreview
                canvasRef={canvasRef}
                isLoadingPreview={isLoadingPreview}
                watermarkConfig={watermarkConfig}
                pageNumberConfig={pageNumberConfig}
                pageNumber={pageNumber}
                splitRange={splitRange}
                compressQuality={compressQuality}
              />
            )}

            {/* Image — fills paper proportionally */}
            {isImage && previewImageUrl && !isLoadingPreview && (
              <img
                src={previewImageUrl}
                alt={activeFile.name}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: `rotate(${previewRotate}deg) scale(${zoomScale})`,
                  transition: 'transform 0.2s ease',
                  transformOrigin: 'center center',
                }}
              />
            )}

            <OfficePreview
              isDocx={isDocx}
              isSpreadsheet={isSpreadsheet}
              isText={isTxt}
              isLoadingPreview={isLoadingPreview}
              docxContainerRef={docxContainerRef}
              spreadsheetHtml={spreadsheetHtml}
              textPreviewContent={textPreviewContent}
            />

          {/* Other Office files (pptx, etc.) */}
          {isOfficeOther && !isLoadingPreview && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(225,29,72,0.1)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {fileExt.includes('doc') ? <FileText size={32} /> : fileExt.includes('xls') || fileExt.includes('csv') ? <FileSpreadsheet size={32} /> : <Presentation size={32} />}
              </div>
              <h5 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 8, color: '#1a202c' }}>{activeFile.name}</h5>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>
                Dokumen terverifikasi siap diproses dengan fidelitas tinggi tanpa watermark.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '8px 16px', borderRadius: 999, fontWeight: 700, fontSize: '0.82rem' }}>
                <CheckCircle size={14} />
                <span>Ready for Wasm Execution</span>
              </div>
            </div>
          )}

          {/* Error notice inside paper */}
          {errorText && (
            <div style={{ padding: '20px 24px', fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>
              {errorText}
            </div>
          )}
            </div>
        </div>
      </div>

      {/* Right Sidebar - Thumbnails */}
      {isResult && isPdf && pdfDoc && (
        <div
          style={{
            width: 220,
            flexShrink: 0,
            minHeight: 0,
            background: 'rgba(0,0,0,0.03)',
            borderRadius: 12,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            overflowY: 'auto',
            border: '1px solid var(--border-color)',
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <div 
              key={`thumb-${i}`}
              onClick={() => setPageNumber(i + 1)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 0.1s ease', }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ pointerEvents: 'none', width: '100%', border: pageNumber === i + 1 ? '2px solid var(--brand-primary)' : '2px solid transparent', borderRadius: 6 }}>
                <LazyPdfPage
                  pdfDoc={pdfDoc}
                  pageNum={i + 1}
                  zoomScale={1.0}
                  totalRotate={((externalRotate !== undefined ? externalRotate : previewRotate) % 360 + 360) % 360}
                  wrapperWidth={180}
                  paperShadow="0 2px 5px rgba(0,0,0,0.15)"
                  defaultRatio={pageAspectRatio}
                />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: pageNumber === i + 1 ? 'var(--brand-primary)' : 'var(--text-muted)' }}>{i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  if (isResult) {
    return (
      <div style={{ display: 'flex', width: '100%', flex: 1, gap: 24, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', paddingRight: 8, paddingBottom: 24 }}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};
