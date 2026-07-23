import React, { useState } from 'react';
import { getLocalizedSeo, type ToolDefinition } from '../catalog/toolsCatalog';
import { SeoHead } from '../components/seo/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { RelatedTools } from '../components/seo/RelatedTools';
import { FileDropzone } from '../components/common/FileDropzone';
import { ProgressBar } from '../components/common/ProgressBar';
import { DocumentLivePreview } from '../components/common/DocumentLivePreview';
import { SeoRichSections, useSeoData } from '../components/common/SeoRichSections';
import { Download } from 'lucide-react';
import { useWorkspaceFiles } from '../hooks/useWorkspaceFiles';
import { useDocumentProcessor } from '../hooks/useDocumentProcessor';
import { ToolSidebar } from '../components/tools/ToolSidebar';
import { smartHighlight } from '../utils/textFormatting';
import { getUiTranslations } from '../i18n/translations';

interface ToolPageProps {
  tool: ToolDefinition;
  currentLang: string;
  onBackToHome: () => void;
  onEditorActive?: (active: boolean) => void;
}

// Map each tool to the file types it should accept
const getAcceptTypes = (toolId: string): string => {
  switch (toolId) {
    // PDF-only tools
    case 'merge-pdf':
    case 'split-pdf':
    case 'rotate-pdf':
    case 'compress-pdf':
    case 'watermark-pdf':
    case 'page-numbers':
    case 'ocr-pdf':
    case 'pdf-to-word':
    case 'pdf-ke-word':
    case 'pdf-to-ppt':
    case 'pdf-ke-ppt':
    case 'pdf-to-image':
    case 'pdf-ke-gambar':
    case 'remove-pdf':
    case 'hapus-halaman-pdf':
    case 'organize-pdf':
    case 'sisip-halaman-pdf':
    case 'sign-pdf':
    case 'tanda-tangan-pdf':
    case 'protect-pdf':
    case 'kunci-pdf':
    case 'unlock-pdf':
    case 'buka-kunci-pdf':
    case 'crop-pdf':
    case 'potong-margin-pdf':
    case 'extract-images-pdf':
    case 'ambil-gambar-dari-pdf':
    case 'grayscale-pdf':
    case 'ubah-pdf-jadi-hitam-putih':
    case 'scan-to-pdf':
    case 'remove-pdf-metadata':
    case 'compare-pdf':
    case 'redact-pdf':
    case 'reverse-pdf':
    case 'resize-pdf':
      return '.pdf,application/pdf';

    // Word files only
    case 'word-to-pdf':
    case 'word-ke-pdf':
      return '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Excel files only
    case 'excel-to-pdf':
    case 'excel-ke-pdf':
    case 'excel-to-csv':
    case 'excel-ke-csv':
      return '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    // PowerPoint files only
    case 'ppt-to-pdf':
    case 'ppt-ke-pdf':
      return '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';

    // Text files only
    case 'txt-to-pdf':
    case 'teks-ke-pdf':
      return '.txt,text/plain';

    // CSV files only
    case 'csv-to-pdf':
    case 'csv-ke-pdf':
    case 'csv-to-excel':
    case 'csv-ke-excel':
      return '.csv,text/csv';

    // Image files only
    case 'image-to-pdf':
    case 'gambar-ke-pdf':
      return '.png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif';

    // Default: everything
    default:
      return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.csv';
  }
};

export const ToolPage: React.FC<ToolPageProps> = ({ tool, currentLang, onEditorActive }) => {
  const { files, setFiles } = useWorkspaceFiles(tool.id);
  const {
    isProcessing, progress, statusText, isCompleted, downloadBlobUrl, downloadFilename, resultFile, resultPreviewFiles, errorMessage,
    processorMetadata,
    startProcessing, resetProcessor
  } = useDocumentProcessor();

  const isWorkspaceMode = files.length > 0;

  React.useEffect(() => {
    if (onEditorActive) {
      onEditorActive(isWorkspaceMode);
    }
  }, [isWorkspaceMode, onEditorActive]);

  // Tool Specific Options States
  const [splitRange, setSplitRange] = useState<string>('');
  const [rotateDegrees, setRotateDegrees] = useState<number>(0);

  const [pageNumberConfig, setPageNumberConfig] = useState({
    position: 'bottom-center' as const,
    format: '{n} / {p}',
    startPage: 1,
    startNumber: 1,
    numberStyle: 'arabic' as const
  });
  const [watermarkConfig, setWatermarkConfig] = useState({
    type: 'text' as 'text' | 'image',
    text: 'CONFIDENTIAL',
    imageUrl: '', // Base64 data URL
    opacity: 0.22,
    color: '#bf2626',
    scale: 1,
    rotation: 45
  });
  const [compressQuality, setCompressQuality] = useState<'extreme' | 'balanced' | 'high'>('balanced');
  const [extractImageFormat, setExtractImageFormat] = useState<'png' | 'jpg'>('png');

  // New Tools States
  const [removeRange, setRemoveRange] = useState<string>('');
  const [insertFile, setInsertFile] = useState<File | null>(null);
  const [insertAtIndex, setInsertAtIndex] = useState<number>(0);
  const [signatureConfig, setSignatureConfig] = useState({
    pageIndex: 0,
    x: 50,
    y: 50,
    width: 30,
    height: 10,
    imageUrl: ''
  });

  const seoData = useSeoData(tool.id, currentLang);
  const [pdfPassword, setPdfPassword] = useState<string>('');

  const [cropConfig, setCropConfig] = useState({
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0
  });

  const [redactConfig, setRedactConfig] = useState<any>({
    mode: 'black', // 'black' | 'blur'
    showLock: false,
    boxes: {}
  });

  const [resizeConfig, setResizeConfig] = useState({
    pageSize: 'A4',
    orientation: 'Auto',
    margin: 0
  });

  const [editElements, setEditElements] = useState<any[]>([]);
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);

  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const seo = getLocalizedSeo(tool, currentLang);

  const handleStartProcessing = (options?: any) => {
    startProcessing({
      files, toolId: tool.id, toolCategory: tool.category, currentLang,
      splitRange, rotateDegrees, pageNumberConfig, watermarkConfig, compressQuality, extractImageFormat,
      removeRange, insertFile, insertAtIndex, signatureConfig, pdfPassword, cropConfig, redactConfig,
      resizePageSize: resizeConfig.pageSize, resizeOrientation: resizeConfig.orientation, resizeMargin: resizeConfig.margin,
      ...options
    });
  };

  const handleDownload = (customName?: string) => {
    if (!downloadBlobUrl) return;
    const a = document.createElement('a');
    a.href = downloadBlobUrl;
    a.download = customName || downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setFiles([]);
    resetProcessor();
  };

  return (
    <main style={{
      flex: 1,
      minHeight: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    }}>
      <SeoHead tool={tool} lang={currentLang} />
      
      {/* ── Breadcrumb Navigation (Semantic AEO & UI UX) ── */}
      <Breadcrumbs 
        currentLang={currentLang} 
        items={[
          { label: getUiTranslations(currentLang)[`nav${tool.category === 'pdf' ? 'OrganizePdf' : tool.category === 'compress' ? 'OptimizeEnhance' : tool.category === 'office' ? 'SpreadsheetTools' : tool.category === 'image' ? 'ImageTools' : 'OcrTools'}` as keyof ReturnType<typeof getUiTranslations>] || 'Tools', url: `/${currentLang}` },
          { label: seoData.data ? seoData.data.h1 : seo.h1 }
        ]} 
      />

      <article style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>


      {/* Dynamic Header - Hidden in Workspace Mode and Result Mode to maximize preview space */}
      {files.length === 0 && !isCompleted && (
        <div style={{ textAlign: 'center', padding: '0 24px', maxWidth: 1440, margin: '64px auto 40px auto', width: '100%' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 20, letterSpacing: '-0.03em', lineHeight: 1.15, fontFamily: 'var(--font-display)' }}>
            {(() => {
              const fullTitle = seoData.data ? seoData.data.h1 : seo.h1;
              return smartHighlight(fullTitle);
            })()}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
            {seoData.data ? seoData.data.description : seo.description}
          </p>
        </div>
      )}

      {/* Interactive Document Live Preview & Editor */}
      {files.length > 0 && !isCompleted && (
        <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', padding: '24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="tool-workspace-container" style={{ display: 'flex', width: '100%', height: '100%', maxHeight: 800, flex: 1, gap: 24, minHeight: 0, justifyContent: 'center' }}>
            {/* Left Workspace */}
          <div className="tool-workspace-left" style={{ flex: 1, minWidth: 0, minHeight: 650, display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden', paddingRight: 8, paddingBottom: 24 }}>
            <DocumentLivePreview
              files={files}
              currentLang={currentLang}
              activeFileIndex={activeFileIndex}
              externalRotate={rotateDegrees}
              watermarkConfig={tool.id === 'watermark-pdf' ? watermarkConfig : undefined}
              pageNumberConfig={tool.id === 'page-numbers' ? pageNumberConfig : undefined}
              splitRange={tool.id === 'split-pdf' ? splitRange : undefined}
              compressQuality={tool.id === 'compress-pdf' ? compressQuality : undefined}
              removeRange={tool.id === 'remove-pdf' ? removeRange : undefined}
              signatureConfig={tool.id === 'sign-pdf' ? signatureConfig : undefined}
              cropConfig={tool.id === 'crop-pdf' ? cropConfig : undefined}
              redactConfig={tool.id === 'redact-pdf' ? redactConfig : undefined}
              resizeConfig={tool.id === 'resize-pdf' ? resizeConfig : undefined}
              editElements={tool.id === 'edit-pdf' ? editElements : undefined}
              setEditElements={setEditElements}
              selectedEditId={tool.id === 'edit-pdf' ? selectedEditId : undefined}
              setSelectedEditId={setSelectedEditId}
              setRedactConfig={setRedactConfig}
              onSignatureUpdate={(x, y, pageIndex) => setSignatureConfig(prev => prev ? ({ ...prev, x, y, ...(pageIndex !== undefined ? { pageIndex } : {}) }) : prev)}
            />
          </div>
          <ToolSidebar
            tool={tool} files={files} setFiles={setFiles} activeFileIndex={activeFileIndex} setActiveFileIndex={setActiveFileIndex}
            isProcessing={isProcessing}
            handleStartProcessing={() => handleStartProcessing({
              splitRange,
              rotateDegrees,
              pageNumberConfig,
              watermarkConfig,
              compressQuality,
              extractImageFormat,
              removeRange,
              insertFile,
              insertAtIndex,
              signatureConfig,
              pdfPassword,
              cropConfig,
              redactConfig,
              resizeConfig,
              editElements
            })}
            splitRange={splitRange} setSplitRange={setSplitRange}
            rotateDegrees={rotateDegrees} setRotateDegrees={setRotateDegrees}
            pageNumberConfig={pageNumberConfig} setPageNumberConfig={setPageNumberConfig}
            watermarkConfig={watermarkConfig} setWatermarkConfig={setWatermarkConfig}
            compressQuality={compressQuality} setCompressQuality={setCompressQuality}
            extractImageFormat={extractImageFormat} setExtractImageFormat={setExtractImageFormat}
            removeRange={removeRange} setRemoveRange={setRemoveRange}
            insertFile={insertFile} setInsertFile={setInsertFile}
            insertAtIndex={insertAtIndex} setInsertAtIndex={setInsertAtIndex}
            signatureConfig={signatureConfig} setSignatureConfig={setSignatureConfig}
            pdfPassword={pdfPassword} setPdfPassword={setPdfPassword}
            cropConfig={cropConfig} setCropConfig={setCropConfig}
            redactConfig={redactConfig} setRedactConfig={setRedactConfig}
            resizeConfig={resizeConfig} setResizeConfig={setResizeConfig}
            editElements={editElements} setEditElements={setEditElements}
            selectedEditId={selectedEditId} setSelectedEditId={setSelectedEditId}
            formatSize={formatSize}
            acceptTypes={getAcceptTypes(tool.id)}
            allowMultiple={tool.id === 'merge-pdf' || tool.id === 'gabung-pdf' || tool.id === 'image-to-pdf' || tool.id === 'gambar-ke-pdf'}
          />
        </div>
      </div>
      )}



      {/* Error Notice */}
      {errorMessage && (
        <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', padding: '0 24px' }}>
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            <strong>Processing Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Dropzone (Hidden when files are already selected to keep UI clean and avoid clutter) */}
      {files.length === 0 && (
        <>
          <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', padding: '0 24px' }}>
            <FileDropzone
              currentLang={currentLang}
              onFilesSelected={(selected) => {
                setFiles(selected);
                resetProcessor();
              }}
              accept={getAcceptTypes(tool.id)}
              multiple={tool.id === 'merge-pdf' || tool.id === 'gabung-pdf' || tool.id === 'image-to-pdf' || tool.id === 'gambar-ke-pdf'}
            />
          </div>
          {seoData.loading ? (
            <div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="spinner" style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>
          ) : (
            <SeoRichSections data={seoData.data} />
          )}
        </>
      )}

      {/* Live Preview of the Converted / Processed Result */}
      {isCompleted && resultFile && (
        <div style={{ flex: 1, minHeight: 650, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 1440, margin: '0 auto', width: '100%', padding: '32px 24px 0' }}>
          {tool.id === 'compare-pdf' ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 650, gap: 24, alignItems: 'center' }}>
              <div className="tool-workspace-container" style={{ display: 'flex', flex: 1, width: '100%', minHeight: 650, maxHeight: 800, gap: 24, overflow: 'hidden', justifyContent: 'center' }}>

                {/* DOKUMEN ASLI PANEL */}
                <div className="tool-workspace-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', maxWidth: 800 }}>
                  <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, pointerEvents: 'none' }}>Dokumen Asli</div>
                  <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <DocumentLivePreview
                      files={[
                        processorMetadata?.originalAnnotatedBytes
                          ? new File([processorMetadata.originalAnnotatedBytes], "Dokumen_Asli.pdf", { type: 'application/pdf' })
                          : files[0]
                      ]}
                      currentLang={currentLang} isResult={true} hideSidebar={true}
                    />
                  </div>
                </div>

                {/* PERBANDINGAN PANEL */}
                <div className="tool-workspace-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', maxWidth: 800 }}>
                  <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(239,68,68,0.9)', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, pointerEvents: 'none' }}>Perbandingan (Diff)</div>

                  <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <DocumentLivePreview files={[resultFile]} currentLang={currentLang} isResult={true} hideSidebar={true} />
                  </div>

                  {/* CTA dipindah ke Anchor Bawah */}
                </div>

              </div>
            </div>
          ) : (
            <DocumentLivePreview
              files={resultPreviewFiles || [resultFile]}
              currentLang={currentLang}
              isResult={true}
            />
          )}

          {/* THE ANCHOR SECTION: Full Width Download Box */}
          <div style={{ width: '100%', maxWidth: 1440, margin: '24px auto', padding: '0 24px' }}>
            {tool.id === 'compare-pdf' ? (
              <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: processorMetadata?.accuracy && processorMetadata.accuracy > 95 ? '#10b981' : '#f59e0b', lineHeight: 1 }}>
                    {processorMetadata?.accuracy?.toFixed(1) || '0'}%
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Akurasi Kemiripan</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hasil perbandingan dokumen telah selesai.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={handleReset} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: 12 }}>Ulangi</button>
                  <button onClick={() => handleDownload()} className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Download size={18} /> Unduh Hasil
                  </button>
                </div>
              </div>
            ) : (
              <ProgressBar
                currentLang={currentLang}
                isProcessing={isProcessing}
                progress={progress}
                statusText={statusText}
                isCompleted={isCompleted}
                onDownload={handleDownload}
                onReset={handleReset}
                originalFilename={downloadFilename}
                originalSize={tool.id === 'compress-pdf' && files.length > 0 ? files[0].size : undefined}
                compressedSize={tool.id === 'compress-pdf' && resultFile ? resultFile.size : undefined}
                style={{ margin: 0 }}
              />
            )}
          </div>
        </div>
      )}

      {/* Internal Linking Silo (White Hat AEO) - Only show when idle */}
      {files.length === 0 && !isCompleted && (
        <RelatedTools currentToolId={tool.id} category={tool.category} currentLang={currentLang} />
      )}

      </article>
    </main>
  );
};
