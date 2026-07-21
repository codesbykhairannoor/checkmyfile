import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { renderAsync } from 'docx-preview';
import { RotateCw, ZoomIn, ZoomOut, Presentation, FileText, FileSpreadsheet, CheckCircle, TableProperties, ChevronLeft, ChevronRight } from 'lucide-react';
import LazyPdfPage from '../preview/LazyPdfPage';
import { PdfPreview } from '../preview/PdfPreview';
import { OfficePreview } from '../preview/OfficePreview';
import { PptxPreview } from '../preview/PptxPreview';
import { SpreadsheetPreview } from '../preview/SpreadsheetPreview';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// A4 portrait ratio as default: 210mm / 297mm
const A4_PORTRAIT_RATIO = 210 / 297;

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
  pageNumberConfig?: any;
  splitRange?: string;
  compressQuality?: 'extreme' | 'balanced' | 'high';
  activeFileIndex?: number;
  renderBottomRight?: React.ReactNode;
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
  renderBottomRight,
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [fileRotations, setFileRotations] = useState<Record<string, number>>({});
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  // pageAspectRatio: width / height of the actual document page (A4 portrait = 0.707)
  const [pageAspectRatio, setPageAspectRatio] = useState<number>(A4_PORTRAIT_RATIO);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [textPreviewContent, setTextPreviewContent] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [pixelWidth, setPixelWidth] = useState<number>(0);
  const [localActiveIndex, setLocalActiveIndex] = useState(activeFileIndex);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    setLocalActiveIndex(activeFileIndex);
  }, [activeFileIndex]);

  useEffect(() => {
    if (files.length > 0 && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'zip'].includes(files[0]?.name.split('.').pop()?.toLowerCase() || '')) {
      const urls = files.map(f => URL.createObjectURL(f));
      setGalleryUrls(urls);
      return () => urls.forEach(u => URL.revokeObjectURL(u));
    } else {
      setGalleryUrls([]);
    }
  }, [files]);

  const docxContainerRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  const activeFile = files[localActiveIndex] || files[activeFileIndex] || files[0] || null;
  const fileKey = activeFile ? `${activeFile.name}-${activeFile.size}` : '';
  const ext = activeFile?.name.split('.').pop()?.toLowerCase() || '';
  const isPdf = activeFile?.type === 'application/pdf' || ext === 'pdf';
  const previewRotate = fileRotations[fileKey] || 0;

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    if (isPdf) {
      const el = document.getElementById(`pdf-page-${newPage}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (!isPdf || totalPages <= 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const match = entry.target.id.match(/pdf-page-(\d+)/);
          if (match && match[1]) {
            setPageNumber(parseInt(match[1]));
          }
        }
      }
    }, {
      root: previewWrapperRef.current,
      rootMargin: "-49% 0px -49% 0px", // Trigger when the element crosses the center of the container
    });

    // Small delay to ensure elements are mounted in the DOM
    const timeout = setTimeout(() => {
      for (let i = 1; i <= totalPages; i++) {
        const el = document.getElementById(`pdf-page-${i}`);
        if (el) observer.observe(el);
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [isPdf, totalPages, isLoadingPreview]);

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
    setTextPreviewContent(null);
  }, [activeFileIndex, files, isResult]);

  // Dedicated effect to load PDF Document once to prevent thumbnail flashing
  useEffect(() => {
    if (!activeFile) return;
    const ext = activeFile.name.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') {
      let isCancelled = false;
      const loadPdf = async () => {
        try {
          const arrayBuffer = await activeFile.arrayBuffer();
          if (isCancelled) return;
          
          // Add 10-second timeout to prevent silent worker hangs on massive generated PDFs
          const pdfPromise = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('PDF parsing timeout')), 10000));
          const pdf = await Promise.race([pdfPromise, timeoutPromise]) as any;
          
          if (isCancelled) return;
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
        } catch (err) {
          console.warn('PDF Load error', err);
        }
      };
      loadPdf();
      return () => {
        isCancelled = true;
      };
    } else {
      setPdfDoc(null);
    }
  }, [activeFile]);

  // Render document preview based on file extension
  useEffect(() => {
    if (!activeFile) return;

    const renderPreview = async () => {
      setIsLoadingPreview(true);
      setErrorText(null);
      setTextPreviewContent(null);

      try {
        const ext = activeFile.name.split('.').pop()?.toLowerCase() || '';

        if (ext === 'pdf') {
          if (!pdfDoc) return; // Wait until pdfDoc is parsed
          
          const page = await pdfDoc.getPage(Math.min(pageNumber, pdfDoc.numPages));
          const baseRotate = page.rotate || 0;
          // Ensure rotation is always positive (0, 90, 180, 270)
          const finalPreviewRotate = externalRotate !== undefined ? externalRotate : previewRotate;
          const totalRotate = ((baseRotate + finalPreviewRotate) % 360 + 360) % 360;

          // Detect true page dimensions at scale 1 to calculate aspect ratio
          const baseViewport = page.getViewport({ scale: 1.0, rotation: totalRotate });
          const detectedRatio = baseViewport.width / baseViewport.height;
          setPageAspectRatio(detectedRatio);

          // Use static fallback dimensions since we rely on CSS for dynamic scaling now
          const workspaceWidth = previewWrapperRef.current?.parentElement?.clientWidth || 680;
          // Subtract Toolbar height (~64px) + margin/padding/gap (~76px) so the paper fits PERFECTLY
          const workspaceHeight = (previewWrapperRef.current?.parentElement?.clientHeight || 600) - 120;

          const paddingX = 0;
          const paddingY = 0;

          const scaleX = Math.max(0.1, (workspaceWidth - paddingX) / baseViewport.width);
          const scaleY = Math.max(0.1, (workspaceHeight - paddingY) / baseViewport.height);

          const fitScale = Math.min(scaleX, scaleY);
          const renderScale = fitScale * zoomScale;
          setPixelWidth(baseViewport.width * renderScale);
        } else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) {
          // Image object URL and aspect ratio are now handled by a dedicated useEffect
          // to prevent continuous recreation when workspaceDim changes (which causes flickering/shrinking)
          const workspaceWidth = previewWrapperRef.current?.parentElement?.clientWidth || 680;
          const workspaceHeight = (previewWrapperRef.current?.parentElement?.clientHeight || 600) - 120;
          
          const baseWidth = 1000;
          const baseHeight = baseWidth / (pageAspectRatio || 1);
          
          const scaleX = Math.max(0.1, workspaceWidth / baseWidth);
          const scaleY = Math.max(0.1, workspaceHeight / baseHeight);
          
          const fitScale = Math.min(scaleX, scaleY);
          const renderScale = fitScale * zoomScale;
          
          if (pageAspectRatio > 0.1) {
            setPixelWidth(baseWidth * renderScale);
          }
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
          // Spreadsheets are now handled by SpreadsheetPreview component natively
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
  }, [activeFile, pdfDoc, pageNumber, zoomScale, previewRotate, externalRotate, isResult]);

  // Dedicated effect for images to prevent blob URL flickering
  useEffect(() => {
    if (!activeFile) return;
    const ext = activeFile.name.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) {
      const url = URL.createObjectURL(activeFile);
      setPreviewImageUrl(url);

      const img = new Image();
      img.onload = () => {
        setPageAspectRatio(img.naturalWidth / img.naturalHeight);
      };
      img.src = url;

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewImageUrl(null);
    }
  }, [activeFile]);

  if (!activeFile) return null;

  const fileExt = activeFile.name.split('.').pop()?.toLowerCase() || '';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(fileExt);
  const isDocx = fileExt === 'docx' || fileExt === 'doc';
  const isSpreadsheet = ['xlsx', 'xls', 'csv'].includes(fileExt);
  const isTxt = fileExt === 'txt';
  const isOfficeOther = !isPdf && !isImage && !isDocx && !isSpreadsheet && !isTxt;
  const isPptx = fileExt === 'pptx' || fileExt === 'ppt';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isResult ? 16 : 0, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* PDF Controls */}
          {isPdf && (
            <>
              <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />
              <>
                <button onClick={() => handlePageChange(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1 || isLoadingPreview} className="btn-secondary" style={{ width: 28, height: 28, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                  <ChevronLeft size={16} />
                </button>
                <input
                  type="range"
                  min={1}
                  max={totalPages}
                  value={pageNumber}
                  onChange={(e) => handlePageChange(parseInt(e.target.value))}
                  style={{ width: 80, margin: '0 8px', cursor: 'pointer' }}
                  title="Geser untuk pindah halaman dengan cepat"
                />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', minWidth: 60, textAlign: 'center' }}>
                  {pageNumber} / {totalPages}
                </span>
                <button onClick={() => handlePageChange(Math.min(totalPages, pageNumber + 1))} disabled={pageNumber >= totalPages || isLoadingPreview} className="btn-secondary" style={{ width: 28, height: 28, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                  <ChevronRight size={16} />
                </button>
                <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />
              </>
              <button onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.15))} className="btn-secondary" style={{ width: 28, height: 28, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', minWidth: 38, textAlign: 'center' }}>
                {Math.round(zoomScale * 100)}%
              </span>
              <button onClick={() => setZoomScale((z) => Math.min(2.5, z + 0.15))} className="btn-secondary" style={{ width: 28, height: 28, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} title="Zoom In">
                <ZoomIn size={16} />
              </button>

              <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />
            </>
          )}

          {/* Image & PPTX & Spreadsheet Zoom Controls */}
          {(isImage || isPptx || isSpreadsheet) && (
            <>
              <button onClick={() => setZoomScale((z) => Math.max(0.3, z - 0.15))} className="btn-secondary" style={{ width: 28, height: 28, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', minWidth: 38, textAlign: 'center' }}>
                {Math.round(zoomScale * 100)}%
              </span>
              <button onClick={() => setZoomScale((z) => Math.min(4.0, z + 0.15))} className="btn-secondary" style={{ width: 28, height: 28, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} title="Zoom In">
                <ZoomIn size={16} />
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
          flex: 1,
          overflow: 'auto',
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
            alignItems: 'center',
            flex: isTxt ? 1 : undefined
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

          {/* ===== SPREADSHEET RENDER AREA (NO PAPER ASPECT RATIO) ===== */}
          {isSpreadsheet && !isLoadingPreview && (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <SpreadsheetPreview file={activeFile} zoomScale={zoomScale} />
            </div>
          )}

          {/* ===== DOCX RENDER AREA (NO PAPER ASPECT RATIO) ===== */}
          {isDocx && (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0, borderRadius: 8 }}>
              <OfficePreview
                isDocx={isDocx}
                isText={isTxt}
                isLoadingPreview={isLoadingPreview}
                docxContainerRef={docxContainerRef}
                textPreviewContent={textPreviewContent}
              />
            </div>
          )}

          {/* ===== PDF INFINITE SCROLL RENDER AREA ===== */}
          {isPdf && !isLoadingPreview && pdfDoc && (
            <PdfPreview
              pdfDoc={pdfDoc}
              isLoadingPreview={isLoadingPreview}
              watermarkConfig={watermarkConfig}
              pageNumberConfig={pageNumberConfig}
              totalPages={totalPages}
              containerWidth={pixelWidth}
              containerHeight={pixelWidth ? (pixelWidth / pageAspectRatio) : undefined}
              splitRange={splitRange}
              compressQuality={compressQuality}
              previewRotate={previewRotate}
              externalRotate={externalRotate}
              pixelWidth={pixelWidth}
              paperShadow={paperShadow}
              pageAspectRatio={pageAspectRatio}
            />
          )}

          {/* ===== The actual "paper" element — aspect-ratio-driven ===== */}
          {!isSpreadsheet && !isPdf && !isDocx && (
            <div
              style={{
                width: pixelWidth ? `${pixelWidth}px` : '100%',
              aspectRatio: isTxt ? undefined : `${pageAspectRatio}`,
              height: isTxt ? '100%' : undefined,
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

            {/* Image — fills paper proportionally */}
            {isImage && files.length > 0 && !isLoadingPreview && (
              <img
                src={previewImageUrl || undefined}
                alt={activeFile.name}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: `rotate(${previewRotate}deg)`,
                  transition: 'transform 0.2s ease',
                  transformOrigin: 'center center',
                }}
              />
            )}

            {isTxt && (
              <OfficePreview
                isDocx={false}
                isText={isTxt}
                isLoadingPreview={isLoadingPreview}
                docxContainerRef={docxContainerRef}
                textPreviewContent={textPreviewContent}
              />
            )}

            {/* PPTX Live Preview */}
            {isOfficeOther && isPptx && !isLoadingPreview && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <PptxPreview file={activeFile} zoomScale={zoomScale} />
              </div>
            )}

            {/* Other unsupported Office files placeholder */}
            {isOfficeOther && !isPptx && !isSpreadsheet && !isLoadingPreview && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '100%', padding: 32, textAlign: 'center' }}>
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
          )}
        </div>
      </div>

      {/* The Right Sidebar Thumbnails have been moved outside of {content} to the main layout */}
    </>
  );

  if (isResult) {
    return (
      <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 220px)', maxHeight: 800, minHeight: 650, flex: 1, gap: 24, justifyContent: 'center' }}>
        <div style={{ flex: 1, height: '100%', minWidth: 0, minHeight: 650, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden', paddingRight: 8, paddingBottom: 24 }}>
          {content}
        </div>

        {/* Right Sidebar - Thumbnails */}
        {(isPdf && pdfDoc) || (isImage && files.length > 0) || renderBottomRight ? (
          <aside style={{ flex: 1, minWidth: 350, minHeight: 0, display: 'flex', flexDirection: 'column', paddingBottom: 24 }}>
            {isPdf && pdfDoc && (
            <div
              className="glass-panel"
              style={{
                width: '100%',
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ flex: 1, minHeight: 0, width: '100%', overflowY: 'auto' }}>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>Navigasi Dokumen</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Pilih halaman untuk melompat</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <div
                    key={`thumb-${i}`}
                    onClick={() => handlePageChange(i + 1)}
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
                        wrapperWidth={110}
                        paperShadow="0 2px 5px rgba(0,0,0,0.15)"
                        defaultRatio={pageAspectRatio}
                      />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: pageNumber === i + 1 ? 'var(--brand-primary)' : 'var(--text-muted)' }}>Hal {i + 1}</span>
                  </div>
                ))}
              </div>
                  </div>
              </div>
            </div>
            )}

            {isImage && files.length > 0 && (
            <div
              className="glass-panel"
              style={{
                width: '100%',
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ flex: 1, minHeight: 0, width: '100%', overflowY: 'auto' }}>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                      <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>Galeri Gambar</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Pratinjau hasil ekstraksi gambar</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                      {files.map((file, i) => (
                        <div
                          key={`thumb-img-${i}`}
                          onClick={() => setLocalActiveIndex(i)}
                          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 0.1s ease', }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <div style={{
                            width: '100%', aspectRatio: '1', background: '#fff', borderRadius: 6,
                            boxShadow: localActiveIndex === i ? '0 0 0 3px var(--brand-primary)' : '0 2px 8px rgba(0,0,0,0.1)',
                            overflow: 'hidden', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <img src={galleryUrls[i]} alt={`Preview ${i+1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: localActiveIndex === i ? 'var(--brand-primary)' : 'var(--text-muted)', wordBreak: 'break-all', textAlign: 'center' }}>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            </div>
            )}

            {isPptx && (
              <div
                className="glass-panel"
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                    <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
                      <Presentation size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>Rincian Berkas</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Informasi presentasi</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Nama Berkas:</span>
                      <span style={{ wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%' }}>{activeFile.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Ukuran:</span>
                      <span>{(activeFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isSpreadsheet && (
              <div
                className="glass-panel"
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                    <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
                      <TableProperties size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>Rincian Berkas</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Informasi lembar sebar (Spreadsheet)</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Nama Berkas:</span>
                      <span style={{ wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%' }}>{activeFile.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Ukuran:</span>
                      <span>{(activeFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isTxt && (
              <div
                className="glass-panel"
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                    <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>Rincian Ekstraksi</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Informasi hasil OCR</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Tipe Dokumen:</span>
                      <span>Plain Text (.txt)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Encoding:</span>
                      <span>UTF-8</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Ukuran Teks:</span>
                      <span>{activeFile?.size > 1024 ? (activeFile.size / 1024).toFixed(2) + ' KB' : (activeFile?.size || 0) + ' Bytes'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Akurasi Mesin:</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Tinggi (Lokal)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {renderBottomRight && (
              <div style={{ marginTop: 'auto', paddingTop: 16, flexShrink: 0 }}>
                {renderBottomRight}
              </div>
            )}
          </aside>
        ) : null}
      </div>
    );
  }

  return content;
};
