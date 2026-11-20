import React, { useState, useMemo } from 'react';
import { getLocalizedSeo, supportsMultipleFiles, getCanonicalToolId, type ToolDefinition } from '../catalog/toolsCatalog';
import { trackFileDownloaded } from '../lib/analytics';
import { SeoHead } from '../components/seo/SeoHead';
import { RelatedTools } from '../components/seo/RelatedTools';
import { FileDropzone } from '../components/common/FileDropzone';
import { ProgressBar } from '../components/common/ProgressBar';
import { SeoRichSections, useSeoData } from '../components/common/SeoRichSections';
import { ToolResearchSection } from '../components/seo-sections/ToolResearchSection';
import { Download, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProGateModal } from '../components/common/ProGateModal';
import { BatchGateModal, type BatchGateType } from '../components/common/BatchGateModal';
import { checkBatchQuota, recordBatchUsage } from '../utils/batchQuota';
import { checkCryptoAuditQuota, recordCryptoAuditUsage } from '../utils/cryptoAuditQuota';
import { checkOcrExcelQuota, recordOcrExcelUsage } from '../utils/ocrExcelQuota';
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
  const canonicalId = getCanonicalToolId(tool.id);
  const isMultiFileInput = ['merge-pdf', 'image-to-pdf'].includes(canonicalId);
  const [showProGateModal, setShowProGateModal] = useState<boolean>(false);
  const [proGateReason, setProGateReason] = useState<{ title?: string; desc?: string; featureName?: string; filesCount?: number }>({});

  // Batch Mode Quota & Gate Modal States (3 free batches/mo for logged-in free users)
  const [showBatchGateModal, setShowBatchGateModal] = useState<boolean>(false);
  const [batchGateType, setBatchGateType] = useState<BatchGateType>('auth');
  const [batchQuota, setBatchQuota] = useState(() => checkBatchQuota(user, isPro, profile));
  const [pendingBatchFiles, setPendingBatchFiles] = useState<File[] | null>(null);

  React.useEffect(() => {
    const updateQuota = () => {
      setBatchQuota(checkBatchQuota(user, isPro, profile));
    };
    updateQuota();
    window.addEventListener('batch-quota-updated', updateQuota);
    return () => window.removeEventListener('batch-quota-updated', updateQuota);
  }, [user, isPro, profile]);

  React.useEffect(() => {
    if (user && pendingBatchFiles) {
      const isBatchMode = isMultiFileInput ? pendingBatchFiles.length > 10 : pendingBatchFiles.length > 1;
      if (isBatchMode) {
        const quota = checkBatchQuota(user, isPro, profile);
        if (quota.allowed) {
          setFiles(pendingBatchFiles);
          setPendingBatchFiles(null);
        }
      } else {
        setFiles(pendingBatchFiles);
        setPendingBatchFiles(null);
      }
    }
  }, [user, isPro, pendingBatchFiles, isMultiFileInput]);

  const { files, setFiles } = useWorkspaceFiles(tool.id);
  const {
    isProcessing, progress, statusText, isCompleted, downloadBlobUrl, downloadFilename, resultFile, resultPreviewFiles, errorMessage,
    processorMetadata,
    startProcessing, resetProcessor
  } = useDocumentProcessor();

  const stableResultPreviewFiles = useMemo(() => {
    if (resultPreviewFiles && resultPreviewFiles.length > 0) return resultPreviewFiles;
    return resultFile ? [resultFile] : [];
  }, [resultPreviewFiles, resultFile]);

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
  const [compressQuality, setCompressQuality] = useState<'extreme' | 'balanced' | 'high' | 'custom' | 'target'>('balanced');
  const [compressPercent, setCompressPercent] = useState<number>(50);
  const [compressTargetSizeKB, setCompressTargetSizeKB] = useState<number>(200);
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

  const rightSidebarRef = React.useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState<number | null>(null);

  React.useEffect(() => {
    if (!rightSidebarRef.current) return;
    const updateHeight = () => {
      if (rightSidebarRef.current) {
        const h = Math.round(rightSidebarRef.current.offsetHeight);
        if (h > 0) setSidebarHeight(h);
      }
    };
    updateHeight();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(
          entry.borderBoxSize?.[0]?.blockSize ?? (entry.target as HTMLElement).offsetHeight ?? entry.contentRect.height
        );
        if (h > 0) setSidebarHeight(h);
      }
    });

    observer.observe(rightSidebarRef.current);
    return () => observer.disconnect();
  }, [files, activeFileIndex, tool.id, compressQuality, compressPercent]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const seo = getLocalizedSeo(tool, currentLang);
  const t = getUiTranslations(currentLang);
  const tAuth = authTranslations[currentLang] || authTranslations['en'] || {};

  const handleStartProcessing = (options?: any) => {
    // Batch processing gating (files.length > 1 for single-file tools, > 10 for merge/combine tools)
    const isBatchMode = isMultiFileInput ? files.length > 10 : files.length > 1;
    if (isBatchMode && !isPro) {
      if (!user) {
        setBatchGateType('auth');
        setShowBatchGateModal(true);
        return;
      }
      const quota = checkBatchQuota(user, isPro, profile);
      if (!quota.allowed) {
        if (quota.reason === 'unverified_email') {
          openAuthModal();
          return;
        }
        setBatchGateType('upgrade');
        setShowBatchGateModal(true);
        return;
      }
      // Consume 1 batch usage
      recordBatchUsage(user.uid);
    }

    // Crypto Audit Certificate gating (Adobe Acrobat Sign Standard - PRO or Free 3x/month)
    const activeSignatureConfig = options?.signatureConfig || signatureConfig;
    const isSigningWithAudit = (tool.id === 'sign-pdf' || options?.toolId === 'sign-pdf') && activeSignatureConfig?.includeAuditTrail === true;

    if (isSigningWithAudit && !isPro) {
      if (!user) {
        openAuthModal();
        return;
      }
      const auditQuota = checkCryptoAuditQuota(user, isPro, profile);
      if (!auditQuota.allowed) {
        if (auditQuota.reason === 'unverified_email') {
          openAuthModal();
          return;
        }
        setProGateReason({
          featureName: 'SHA-256 Audit Trail Certificate',
          title: currentLang === 'id' ? 'Buka Sertifikat Audit Kriptografis' : 'Unlock Cryptographic Audit Trail',
          desc: currentLang === 'id'
            ? 'Batas kuota gratis 3x sertifikat audit bulan ini telah tercapai. Upgrade ke PRO untuk akses tanda tangan bersertifikat tanpa batas.'
            : 'Your monthly 3 free audit certificate limit has been reached. Upgrade to PRO for unlimited enterprise certified signing.',
        });
        setShowProGateModal(true);
        return;
      }
      // Record 1 crypto audit usage for free user
      recordCryptoAuditUsage(user.uid);
    }

    // OCR to Excel gating (PRO or Free Trial 3x/month for authenticated accounts, Guest blocked)
    const isOcrToExcel = (tool.id === 'ocr-pdf' || options?.toolId === 'ocr-pdf') && (options?.extractImageFormat === 'xlsx');
    if (isOcrToExcel && !isPro) {
      if (!user) {
        openAuthModal();
        return;
      }
      const ocrQuota = checkOcrExcelQuota(user, isPro, profile);
      if (!ocrQuota.allowed) {
        if (ocrQuota.reason === 'unverified_email') {
          openAuthModal();
          return;
        }
        setProGateReason({
          featureName: 'AI OCR to Excel Table Extraction',
          title: currentLang === 'id' ? 'Buka Fitur OCR ke Excel (PRO)' : 'Unlock OCR to Excel (PRO)',
          desc: currentLang === 'id'
            ? 'Batas uji coba gratis 3x OCR ke Excel bulan ini telah tercapai. Upgrade ke PRO untuk ekstraksi tabel tak terbatas.'
            : 'Your monthly 3 free OCR to Excel limit has been reached. Upgrade to PRO for unlimited table extraction.',
        });
        setShowProGateModal(true);
        return;
      }
      // Record 1 OCR Excel usage for free user
      recordOcrExcelUsage(user.uid);
    }

    startProcessing({
      files, toolId: tool.id, toolCategory: tool.category, currentLang, isPro,
      splitRange, rotateDegrees, pageNumberConfig, watermarkConfig, compressQuality, compressPercent, targetSizeKB: compressTargetSizeKB, extractImageFormat,
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
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-app)',
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
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              maxWidth: 820,
              margin: '0 auto',
              lineHeight: 1.7,
              fontWeight: 500
            }}>
              {seoData.data?.description || seoData.data?.heroDescription || seo.description}
            </p>
          </div>
        )}

        {/* Interactive Document Live Preview & Editor */}
        {files.length > 0 && !isCompleted && (
          <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', padding: '24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Batch Processing Quota Banner */}
            {!isPro && (isMultiFileInput ? files.length > 10 : files.length > 1) && (
              <div
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  backgroundColor: !user
                    ? 'rgba(225, 29, 72, 0.08)'
                    : batchQuota.remaining > 0
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(234, 179, 8, 0.1)',
                  border: !user
                    ? '1px solid rgba(225, 29, 72, 0.25)'
                    : batchQuota.remaining > 0
                      ? '1px solid rgba(16, 185, 129, 0.25)'
                      : '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: 12,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                  color: 'var(--text-main)',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {!user ? (
                    <Sparkles size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                  ) : batchQuota.remaining > 0 ? (
                    <Sparkles size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  ) : (
                    <Crown size={18} color="#ca8a04" style={{ flexShrink: 0 }} />
                  )}
                  <span>
                    {!user
                      ? (currentLang === 'id'
                        ? `Mode Batch (${files.length} dokumen) memerlukan akun gratis. Dapatkan 3 batch gratis setiap bulan.`
                        : `Batch Mode (${files.length} documents) requires a free account. Get 3 free batches every month.`)
                      : batchQuota.remaining > 0
                        ? (currentLang === 'id'
                          ? `Paket Free: Tersisa ${batchQuota.remaining} dari 3 batch gratis bulan ini.`
                          : `Free Plan: ${batchQuota.remaining} of 3 free batches remaining this month.`)
                        : (currentLang === 'id'
                          ? `Batas 3 Batch Gratis Bulanan Telah Tercapai. Upgrade ke PRO untuk memproses semua dokumen.`
                          : `Monthly Free Batch Limit (3/3) Reached. Upgrade to PRO to process all documents.`)}
                  </span>
                </div>

                {!user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setBatchGateType('auth');
                      setShowBatchGateModal(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 16px',
                      borderRadius: 8,
                      background: 'var(--brand-primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(225, 29, 72, 0.25)',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>{currentLang === 'id' ? 'Masuk & Buka 3 Batch Gratis' : 'Sign In for 3 Free Batches'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setBatchGateType('upgrade');
                      setShowBatchGateModal(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 8,
                      background: batchQuota.remaining > 0 ? 'rgba(245, 158, 11, 0.15)' : '#eab308',
                      color: batchQuota.remaining > 0 ? '#d97706' : '#000000',
                      border: batchQuota.remaining > 0 ? '1px solid rgba(245, 158, 11, 0.3)' : 'none',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <Crown size={14} />
                    <span>
                      {batchQuota.remaining > 0
                        ? (currentLang === 'id' ? 'Buka Batch Tanpa Batas (PRO)' : 'Unlock Unlimited (PRO)')
                        : (tAuth.batch_upgrade_btn || 'Upgrade to PRO')}
                    </span>
                  </button>
                )}
              </div>
            )}
            <React.Suspense fallback={<div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="spinner" style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>}>
              <div className="tool-workspace-container" style={{ display: 'flex', width: '100%', gap: 24, justifyContent: 'center', alignItems: 'flex-start', paddingBottom: 64 }}>
                {/* Left Workspace */}
                <div
                  className="tool-workspace-left"
                  style={{
                    flex: '1 1 0%',
                    minWidth: 0,
                    height: sidebarHeight ? `${Math.max(sidebarHeight, 520)}px` : 'calc(100vh - 120px)',
                    minHeight: 520,
                    display: 'flex',
                    flexDirection: 'column',
                    paddingRight: 4,
                    boxSizing: 'border-box',
                  }}
                >
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
                  sidebarRef={rightSidebarRef}
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
                  compressTargetSizeKB={compressTargetSizeKB} setCompressTargetSizeKB={setCompressTargetSizeKB}
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
                  onBatchBlocked={(type) => {
                    setBatchGateType(type);
                    setShowBatchGateModal(true);
                  }}
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
                  const isBatchMode = isMultiFileInput ? selected.length > 10 : selected.length > 1;
                  if (isBatchMode && !isPro) {
                    if (!user) {
                      setPendingBatchFiles(selected);
                      setBatchGateType('auth');
                      setShowBatchGateModal(true);
                      setFiles(isMultiFileInput ? selected.slice(0, 10) : [selected[0]]);
                      resetProcessor();
                      return;
                    }
                    const quota = checkBatchQuota(user, isPro, profile);
                    if (!quota.allowed) {
                      if (quota.reason === 'unverified_email') {
                        openAuthModal();
                      } else {
                        setBatchGateType('upgrade');
                        setShowBatchGateModal(true);
                      }
                      setFiles(isMultiFileInput ? selected.slice(0, 10) : [selected[0]]);
                      resetProcessor();
                      return;
                    }
                  }
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
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', maxWidth: 1440, margin: '0 auto', width: '100%', padding: '32px 24px 0' }}>
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
                  files={stableResultPreviewFiles}
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
                              ? 'Beri nama dan atur file unduhan Anda secara bebas tanpa batasan.'
                              : 'Name and organize your processed output files freely without restrictions.',
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

      <BatchGateModal
        isOpen={showBatchGateModal}
        onClose={() => setShowBatchGateModal(false)}
        type={batchGateType}
        currentLang={currentLang}
        filesCount={files.length}
      />
    </main>
  );
};
