import React, { useState } from 'react';
import { getUiTranslations } from '../i18n/translations';
import { getLocalizedSeo, type ToolDefinition } from '../catalog/toolsCatalog';
import { SeoHead } from '../components/seo/SeoHead';
import { FileDropzone } from '../components/common/FileDropzone';
import { ProgressBar } from '../components/common/ProgressBar';
import { DocumentLivePreview } from '../components/common/DocumentLivePreview';
import { HelpCircle, ShieldCheck, Download } from 'lucide-react';
import { useWorkspaceFiles } from '../hooks/useWorkspaceFiles';

import { useDocumentProcessor } from '../hooks/useDocumentProcessor';
import { ToolSidebar } from '../components/tools/ToolSidebar';

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
    startNumber: 1
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

  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const t = getUiTranslations(currentLang);
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

  const isEditorMode = files.length > 0 && !isProcessing && !isCompleted;

  return (
    <main style={{
      maxWidth: 1440,
      margin: '0 auto',
      padding: isEditorMode ? '24px' : '32px 24px',
      flex: 1,
      minHeight: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    }}>
      <SeoHead tool={tool} lang={currentLang} />


      {/* Header - Hidden in Workspace Mode and Result Mode to maximize preview space */}
      {files.length === 0 && !isCompleted && (
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            {seo.h1}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 700, margin: '0 auto' }}>
            {seo.description}
          </p>
        </div>
      )}

      {/* Interactive Document Live Preview & Editor */}
      {files.length > 0 && !isCompleted && (
        <div style={{ display: 'flex', width: '100%', height: '100%', maxHeight: 800, flex: 1, gap: 24, minHeight: 0, justifyContent: 'center' }}>
          {/* Left Workspace */}
          <div style={{ flex: 1, minWidth: 0, minHeight: 650, display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden', paddingRight: 8, paddingBottom: 24 }}>
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
                setRedactConfig={setRedactConfig}
                onSignatureUpdate={(x, y, pageIndex) => setSignatureConfig(prev => prev ? ({ ...prev, x, y, ...(pageIndex !== undefined ? { pageIndex } : {}) }) : prev)}
              />
          </div>

          <ToolSidebar
            tool={tool} files={files} setFiles={setFiles} activeFileIndex={activeFileIndex} setActiveFileIndex={setActiveFileIndex}
            isProcessing={isProcessing} handleStartProcessing={handleStartProcessing}
            splitRange={splitRange} setSplitRange={setSplitRange}
            rotateDegrees={rotateDegrees} setRotateDegrees={setRotateDegrees}
            pageNumberConfig={pageNumberConfig} setPageNumberConfig={setPageNumberConfig}
            watermarkConfig={watermarkConfig} setWatermarkConfig={setWatermarkConfig}
            compressQuality={compressQuality} setCompressQuality={setCompressQuality}

            extractImageFormat={extractImageFormat}
            setExtractImageFormat={setExtractImageFormat}
            
            removeRange={removeRange} setRemoveRange={setRemoveRange}
            insertFile={insertFile} setInsertFile={setInsertFile}
            insertAtIndex={insertAtIndex} setInsertAtIndex={setInsertAtIndex}
            signatureConfig={signatureConfig} setSignatureConfig={setSignatureConfig}
            pdfPassword={pdfPassword} setPdfPassword={setPdfPassword}
            cropConfig={cropConfig} setCropConfig={setCropConfig}
            redactConfig={redactConfig} setRedactConfig={setRedactConfig}
            resizeConfig={resizeConfig} setResizeConfig={setResizeConfig}

            formatSize={formatSize}
            acceptTypes={getAcceptTypes(tool.id)}
            allowMultiple={tool.id === 'merge-pdf' || tool.id === 'gabung-pdf' || tool.id === 'image-to-pdf' || tool.id === 'gambar-ke-pdf'}
            pdfPagesCount={100}
          />
        </div>
      )}



      {/* Error Notice */}
      {errorMessage && (
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
      )}

      {/* Dropzone (Hidden when files are already selected to keep UI clean and avoid clutter) */}
      {files.length === 0 && (
        <FileDropzone
          currentLang={currentLang}
          onFilesSelected={(selected) => {
            setFiles(selected);
            resetProcessor();
          }}
          accept={getAcceptTypes(tool.id)}
          multiple={tool.id === 'merge-pdf' || tool.id === 'gabung-pdf' || tool.id === 'image-to-pdf' || tool.id === 'gambar-ke-pdf'}
        />
      )}

      {/* Live Preview of the Converted / Processed Result */}
      {isCompleted && resultFile && (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {tool.id === 'compare-pdf' ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 24, alignItems: 'center' }}>
              <div style={{ display: 'flex', flex: 1, width: '100%', minHeight: 0, maxHeight: 800, gap: 24, overflow: 'hidden', justifyContent: 'center' }}>
                
                {/* DOKUMEN ASLI PANEL */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', maxWidth: 800 }}>
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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', maxWidth: 800 }}>
                  <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(239,68,68,0.9)', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, pointerEvents: 'none' }}>Perbandingan (Diff)</div>
                  
                  <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <DocumentLivePreview files={[resultFile]} currentLang={currentLang} isResult={true} hideSidebar={true} />
                  </div>
                  
                  {/* FLOATING ACTION PILL */}
                  <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 20, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '12px 24px', borderRadius: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 24, border: '1px solid rgba(0,0,0,0.05)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: processorMetadata?.accuracy && processorMetadata.accuracy > 95 ? '#10b981' : '#f59e0b', lineHeight: 1 }}>
                        {processorMetadata?.accuracy?.toFixed(1) || '0'}%
                      </div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', lineHeight: 1.2, letterSpacing: 0.5 }}>AKURASI<br/>KEMIRIPAN</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: 'var(--border-color)' }}></div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={handleReset} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: 100 }}>
                        Ulangi
                      </button>
                      <button onClick={() => handleDownload()} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Download size={16} /> Unduh Hasil
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <DocumentLivePreview 
              files={resultPreviewFiles || [resultFile]} 
              currentLang={currentLang} 
              isResult={true} 
              renderBottomRight={
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
                />
              }
            />
          )}
        </div>
      )}


      {/* Localized FAQ Accordion (Programmatic SEO Schema integration) */}
      {files.length === 0 && !isCompleted && (
        <section style={{ marginTop: 64 }}>
          <div className="glass-panel" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <HelpCircle size={24} className="text-indigo-400" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {t.faqTitle}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {seo.faqs.map((faq: { q: string; a: string }, index: number) => (
                <div key={index} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8, color: 'var(--text-main)' }}>
                    {faq.q}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>All conversions executed inside your browser using WebAssembly. Files never leave your computer.</span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
