import React, { useState } from 'react';
import { getLocalizedSeo, supportsMultipleFiles, type ToolDefinition } from '../catalog/toolsCatalog';
import { trackFileDownloaded } from '../lib/analytics';
import { SeoHead } from '../components/seo/SeoHead';
import { RelatedTools } from '../components/seo/RelatedTools';
import { FileDropzone } from '../components/common/FileDropzone';
import { ProgressBar } from '../components/common/ProgressBar';
import { SeoRichSections, useSeoData } from '../components/common/SeoRichSections';
import { ToolResearchSection } from '../components/seo-sections/ToolResearchSection';
import { Download, Crown, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProGateModal } from '../components/common/ProGateModal';
import { useWorkspaceFiles } from '../hooks/useWorkspaceFiles';
import { useDocumentProcessor } from '../hooks/useDocumentProcessor';
import { smartHighlight } from '../utils/textFormatting';
import { getUiTranslations } from '../i18n/translations';
import { authTranslations } from '../i18n/authTranslations';

import { DocumentLivePreview } from '../components/common/DocumentLivePreview';
import { ToolSidebar } from '../components/tools/ToolSidebar';

interface ToolPageProps {
  tool: ToolDefinition;
  currentLang: string;
  onBackToHome: () => void;
  onEditorActive?: (active: boolean) => void;
}

// Map each tool to the file types it should accept using canonical tool resolution
const getAcceptTypes = (toolId: string): string => {
  const canonicalId = getCanonicalToolId(toolId);
  switch (canonicalId) {
    case 'word-to-pdf':
      return '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'excel-to-pdf':
    case 'excel-to-csv':
      return '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'ppt-to-pdf':
      return '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'txt-to-pdf':
      return '.txt,text/plain';
    case 'csv-to-excel':
      return '.csv,text/csv';
    case 'image-to-pdf':
      return '.png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif';
    default:
      return '.pdf,application/pdf';
  }
};

export const ToolPage: React.FC<ToolPageProps> = ({ tool, currentLang, onEditorActive }) => {
  const { user, isPro, openAuthModal } = useAuth();
  const [showProGateModal, setShowProGateModal] = useState<boolean>(false);
  const [proGateReason, setProGateReason] = useState<{ title?: string; desc?: string; featureName?: string; filesCount?: number }>({});

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
  const [compressQuality, setCompressQuality] = useState<'extreme' | 'balanced' | 'high' | 'custom'>('balanced');
  const [compressPercent, setCompressPercent] = useState<number>(50);
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
  const t = getUiTranslations(currentLang);
  const tAuth = authTranslations[currentLang] || authTranslations['en'] || {};

  const handleStartProcessing = (options?: any) => {
    // 10-document batch limit for Free users across all tools
    if (!isPro && files.length > 10) {
      setProGateReason({
        title: tAuth.batch_free_limit_title || 'Batch Limit Exceeded (10 Documents)',
        desc: tAuth.batch_free_limit_desc || `The Free Starter plan processes up to 10 files simultaneously (${files.length} files selected). Upgrade to PRO Lifetime for unlimited batch processing in browser RAM.`,
        filesCount: files.length,
      });
      setShowProGateModal(true);
      return;
    }

    startProcessing({
      files, toolId: tool.id, toolCategory: tool.category, currentLang, isPro,
      splitRange, rotateDegrees, pageNumberConfig, watermarkConfig, compressQuality, compressPercent, extractImageFormat,
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
    // Track file download event (key conversion signal for GA4)
    const finalName = customName || downloadFilename;
    const ext = finalName.split('.').pop() || 'unknown';
    trackFileDownloaded({
      tool_id: tool.id,
      filename: finalName,
      file_type: ext,
      file_size_kb: resultFile ? resultFile.size / 1024 : 0,
      language: currentLang,
    });
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
      
      <article style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

      {/* Dynamic Header - Hidden in Workspace Mode and Result Mode to maximize preview space */}
      {files.length === 0 && !isCompleted && (
        <div style={{ textAlign: 'center', padding: '0 24px', maxWidth: 1440, margin: '64px auto 40px auto', width: '100%' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 20, letterSpacing: '-0.03em', lineHeight: 1.15, fontFamily: 'var(--font-display)' }}>
            {(() => {
              const fullTitle = seoData.data?.h1 || seoData.data?.heroTitle || seo.h1 || '';
              return smartHighlight(fullTitle);
            })()}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
            {seoData.data?.description || seoData.data?.heroDescription || seo.description}
          </p>
        </div>
      )}

      {/* Interactive Document Live Preview & Editor */}
      {files.length > 0 && !isCompleted && (
        <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', padding: '24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!isPro && files.length > 10 && (
            <div
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: 12,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                color: '#ca8a04',
                fontSize: '0.86rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>
                  {tAuth.batch_limit_warning || `Free plan allows max 10 files. First 10 will be processed. Upgrade to PRO to process all files.`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProGateReason({
                    title: tAuth.batch_free_limit_title || 'Batch Limit Exceeded (10 Documents)',
                    filesCount: files.length,
                  });
                  setShowProGateModal(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: '#eab308',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Crown size={14} />
                <span>{tAuth.batch_upgrade_btn || 'Upgrade to PRO'}</span>
              </button>
            </div>
          )}
          <React.Suspense fallback={<div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="spinner" style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>}>
            <div className="tool-workspace-container" style={{ display: 'flex', width: '100%', height: '100%', maxHeight: 800, flex: 1, gap: 24, minHeight: 0, justifyContent: 'center' }}>
              {/* Left Workspace */}
              <div className="tool-workspace-left" style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden', paddingRight: 8, paddingBottom: 24 }}>
                <DocumentLivePreview
                  files={files}
                  currentLang={currentLang}
                  activeFileIndex={activeFileIndex}
                  externalRotate={rotateDegrees}
                  watermarkConfig={tool.id === 'watermark-pdf' ? watermarkConfig : undefined}
                  pageNumberConfig={tool.id === 'page-numbers' ? pageNumberConfig : undefined}
                  splitRange={tool.id === 'split-pdf' ? splitRange : undefined}
                  compressQuality={['compress-pdf', 'compress-pdf-for-email', 'compress-pdf-to-100kb', 'compress-pdf-without-losing-quality'].includes(tool.id) ? compressQuality : undefined}
                  removeRange={tool.id === 'remove-pdf' ? removeRange : undefined}
                  signatureConfig={['sign-pdf', 'sign-pdf-without-registration'].includes(tool.id) ? signatureConfig : undefined}
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
                currentLang={currentLang}
                tool={tool} files={files} setFiles={setFiles} activeFileIndex={activeFileIndex} setActiveFileIndex={setActiveFileIndex}
                isProcessing={isProcessing}
                handleStartProcessing={(options) => handleStartProcessing({
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
                  editElements,
                  ...options
                })}
                splitRange={splitRange} setSplitRange={setSplitRange}
                rotateDegrees={rotateDegrees} setRotateDegrees={setRotateDegrees}
                pageNumberConfig={pageNumberConfig} setPageNumberConfig={setPageNumberConfig}
                watermarkConfig={watermarkConfig} setWatermarkConfig={setWatermarkConfig}
                compressQuality={compressQuality} setCompressQuality={setCompressQuality}
                compressPercent={compressPercent} setCompressPercent={setCompressPercent}
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
                allowMultiple={supportsMultipleFiles(tool.id)}
              />
            </div>
          </React.Suspense>
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
              multiple={supportsMultipleFiles(tool.id)}
            />
          </div>
          {seoData.loading ? (
            <div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="spinner" style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>
          ) : (
            <>
              <SeoRichSections data={seoData.data} />
              {tool.id.includes('redact') && <ToolResearchSection toolType="redact" lang={currentLang} />}
              {(tool.id.includes('ocr') || tool.id.includes('scanned')) && <ToolResearchSection toolType="ocr" lang={currentLang} />}
              {tool.id.includes('compress') && <ToolResearchSection toolType="compress" lang={currentLang} />}
              {tool.id.includes('sign') && <ToolResearchSection toolType="sign" lang={currentLang} />}
            </>
          )}
        </>
      )}

      {/* Live Preview of the Converted / Processed Result */}
      {isCompleted && resultFile && (
        <React.Suspense fallback={<div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="spinner" style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>}>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 1440, margin: '0 auto', width: '100%', padding: '32px 24px 0' }}>
            {tool.id === 'compare-pdf' ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 24, alignItems: 'center' }}>
                <div className="tool-workspace-container" style={{ display: 'flex', flex: 1, width: '100%', minHeight: 0, maxHeight: 800, gap: 24, overflow: 'hidden', justifyContent: 'center' }}>

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
                renderBottomRight={
                  tool.id !== 'compare-pdf' ? (
                    <ProgressBar
                      currentLang={currentLang}
                      isProcessing={isProcessing}
                      progress={progress}
                      statusText={statusText}
                      isCompleted={isCompleted}
                      onDownload={handleDownload}
                      onReset={handleReset}
                      originalFilename={downloadFilename}
                      originalSize={['compress-pdf', 'compress-pdf-for-email', 'compress-pdf-to-100kb', 'compress-pdf-without-losing-quality'].includes(tool.id) && files.length > 0 ? files[0].size : undefined}
                      compressedSize={['compress-pdf', 'compress-pdf-for-email', 'compress-pdf-to-100kb', 'compress-pdf-without-losing-quality'].includes(tool.id) && resultFile ? resultFile.size : undefined}
                      isPro={isPro}
                      onOpenProModal={() => {
                        setProGateReason({
                          featureName: currentLang === 'id' ? 'Kustomisasi Nama File' : 'Custom File Name',
                          desc: currentLang === 'id'
                            ? 'Fitur kustomisasi nama file unduhan khusus untuk anggota PRO Lifetime. Upgrade sekali bayar untuk akses selamanya.'
                            : 'Renaming and customizing output download file names is an exclusive PRO Lifetime feature.',
                        });
                        setShowProGateModal(true);
                      }}
                    />
                  ) : undefined
                }
              />
            )}

            {/* THE ANCHOR SECTION: Only for Compare PDF */}
            {tool.id === 'compare-pdf' && (
              <div style={{ width: '100%', maxWidth: 1440, margin: '24px auto', padding: '0 24px' }}>
                <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: processorMetadata?.accuracy && processorMetadata.accuracy > 95 ? '#10b981' : '#f59e0b', lineHeight: 1 }}>
                      {processorMetadata?.accuracy?.toFixed(1) || '0'}%
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{t.previewAccuracy || 'Akurasi Kemiripan'}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.previewComparisonDone || 'Hasil perbandingan dokumen telah selesai.'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleReset} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: 12 }}>{t.resetBtn}</button>
                    <button onClick={() => handleDownload()} className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Download size={18} /> {t.downloadBtn}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </React.Suspense>
      )}

      {/* Internal Linking Silo (White Hat AEO) - Only show when idle */}
      {files.length === 0 && !isCompleted && (
        <RelatedTools currentToolId={tool.id} category={tool.category} currentLang={currentLang} />
      )}

      </article>

      <ProGateModal
        isOpen={showProGateModal}
        onClose={() => setShowProGateModal(false)}
        currentLang={currentLang}
        title={proGateReason.title}
        description={proGateReason.desc}
        featureName={proGateReason.featureName}
        filesCount={proGateReason.filesCount || files.length}
        onContinueFree={files.length > 10 ? () => {
          setFiles(files.slice(0, 10));
          setShowProGateModal(false);
        } : undefined}
        continueFreeLabel={tAuth.batch_continue_free_btn || 'Process First 10 Files (Free)'}
      />
    </main>
  );
};
