import React from 'react';
import { RotatePdfEditor } from './RotatePdfEditor';
import { WatermarkPdfEditor } from './WatermarkPdfEditor';
import { PageNumbersPdfEditor } from './PageNumbersPdfEditor';
import { SplitPdfEditor } from './SplitPdfEditor';
import { MergePdfEditor } from './MergePdfEditor';
import { CompressPdfEditor } from './CompressPdfEditor';
import { PdfToImageEditor } from './PdfToImageEditor';
import { GenericConvertEditor } from './GenericConvertEditor';
import { RemovePdfEditor } from './RemovePdfEditor';
import { OrganizePdfEditor } from './OrganizePdfEditor';
import { SignPdfEditor } from './SignPdfEditor';
import { ProtectPdfEditor } from './ProtectPdfEditor';
import { UnlockPdfEditor } from './UnlockPdfEditor';
import { CropPdfEditor } from './CropPdfEditor';
import { ExtractImagesEditor } from './ExtractImagesEditor';
import { GrayscalePdfEditor } from './GrayscalePdfEditor';
import { ScanToPdfEditor } from './ScanToPdfEditor';
import { RemoveMetadataEditor } from './RemoveMetadataEditor';
import { EditMetadataEditor } from './EditMetadataEditor';
import { ComparePdfEditor } from './ComparePdfEditor';
import { RedactPdfEditor } from './RedactPdfEditor';
import { ReversePdfEditor } from './ReversePdfEditor';
import { ResizePdfEditor } from './ResizePdfEditor';
import { EditPdfEditor } from './EditPdfEditor';
import { RepairPdfEditor } from './RepairPdfEditor';
import { getCanonicalToolId, type ToolDefinition } from '../../catalog/toolsCatalog';
import { editorTranslations } from '../../i18n/editorTranslations';
import { useAuth } from '../../context/AuthContext';
import { checkBatchQuota } from '../../utils/batchQuota';

interface ToolSidebarProps {
  tool: ToolDefinition;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  activeFileIndex: number;
  setActiveFileIndex: (idx: number) => void;
  isProcessing: boolean;
  handleStartProcessing: (options?: any) => void;
  // Tool options
  splitRange: string; setSplitRange: (v: string) => void;
  rotateDegrees: number; setRotateDegrees: (v: number) => void;
  watermarkConfig: any;
  setWatermarkConfig: (v: any) => void;
  pageNumberConfig: any;
  setPageNumberConfig: (v: any) => void;
  compressQuality: 'extreme' | 'balanced' | 'high' | 'custom' | 'target';
  setCompressQuality: (v: 'extreme' | 'balanced' | 'high' | 'custom' | 'target') => void;
  compressPercent?: number;
  setCompressPercent?: (v: number) => void;
  compressTargetSizeKB?: number;
  setCompressTargetSizeKB?: (v: number) => void;

  extractImageFormat?: 'png' | 'jpg';
  setExtractImageFormat?: (v: 'png' | 'jpg') => void;

  removeRange?: string; setRemoveRange?: (v: string) => void;
  insertFile?: File | null; setInsertFile?: (v: File | null) => void;
  insertAtIndex?: number; setInsertAtIndex?: (v: number) => void;
  signatureConfig?: any; setSignatureConfig?: (v: any) => void;
  pdfPassword?: string; setPdfPassword?: (v: string) => void;
  cropConfig?: any; setCropConfig?: (v: any) => void;
  redactConfig?: any; setRedactConfig?: (v: any) => void;

  // New tools config
  resizeConfig?: any; setResizeConfig?: (v: any) => void;
  editElements?: any[]; setEditElements?: React.Dispatch<React.SetStateAction<any[]>>;
  selectedEditId?: string | null; setSelectedEditId?: (id: string | null) => void;

  formatSize: (bytes: number) => string;
  acceptTypes?: string;
  allowMultiple?: boolean;
  pdfPagesCount?: number;
  currentLang: string;
  onBatchBlocked?: (type: 'auth' | 'upgrade') => void;
  sidebarRef?: React.Ref<HTMLDivElement>;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  tool, files, setFiles, activeFileIndex, setActiveFileIndex, isProcessing, handleStartProcessing,
  splitRange, setSplitRange, rotateDegrees, setRotateDegrees,
  pageNumberConfig, setPageNumberConfig, watermarkConfig, setWatermarkConfig, compressQuality, setCompressQuality,
  compressPercent, setCompressPercent, compressTargetSizeKB, setCompressTargetSizeKB,
  extractImageFormat, setExtractImageFormat,
  removeRange, setRemoveRange, insertFile, setInsertFile, insertAtIndex, setInsertAtIndex, signatureConfig, setSignatureConfig,
  pdfPassword, setPdfPassword, cropConfig, setCropConfig, redactConfig, setRedactConfig,
  resizeConfig, setResizeConfig, editElements, setEditElements, selectedEditId, setSelectedEditId,
  formatSize, acceptTypes = '*', allowMultiple = false, pdfPagesCount = 100, currentLang,
  onBatchBlocked,
  sidebarRef,
}) => {
  const { user, profile, isPro } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tUi = editorTranslations[currentLang] || editorTranslations['en'] || {};
  const canonicalId = getCanonicalToolId(tool.id);
  const isMultiFileInput = ['merge-pdf', 'image-to-pdf'].includes(canonicalId);

  const handleAddFilesClick = () => {
    if (allowMultiple && !isPro) {
      const isBatchBlocked = isMultiFileInput ? files.length >= 10 : files.length >= 1;
      if (isBatchBlocked) {
        if (!user) {
          onBatchBlocked?.('auth');
          return;
        }
        const quota = checkBatchQuota(user, isPro, profile);
        if (!quota.allowed) {
          onBatchBlocked?.('upgrade');
          return;
        }
      }
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (allowMultiple) {
        const combined = [...files, ...newFiles];
        const isBatchTrigger = isMultiFileInput ? combined.length > 10 : combined.length > 1;
        if (isBatchTrigger && !isPro) {
          if (!user) {
            onBatchBlocked?.('auth');
            return;
          }
          const quota = checkBatchQuota(user, isPro, profile);
          if (!quota.allowed) {
            onBatchBlocked?.('upgrade');
            return;
          }
        }
        setFiles(combined);
      } else {
        setFiles(newFiles);
        setActiveFileIndex(0);
      }
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="mobile-full-width tool-workspace-right"
      style={{
        flex: '1 1 0%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxSizing: 'border-box',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptTypes}
        multiple={allowMultiple}
        style={{ display: 'none' }}
      />

      {canonicalId !== 'merge-pdf' && files.length > 0 && (
        <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          {files.length > 1 && (
            <div style={{ paddingBottom: 10, marginBottom: 12, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', padding: '2px 8px', borderRadius: 6 }}>
                  BATCH MODE
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {files.length} {tUi.files || 'Files Selected'}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {formatSize(files.reduce((acc, f) => acc + f.size, 0))}
              </span>
            </div>
          )}

          {files.length > 1 && (
            <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                {tUi.select_preview_document || tUi["Pilih Dokumen Pratinjau:"] || "Select Preview Document:"}
              </label>
              <select
                value={activeFileIndex}
                onChange={(e) => setActiveFileIndex(Number(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                {files.map((f, idx) => {
                  const lastDot = f.name.lastIndexOf('.');
                  const ext = lastDot !== -1 ? f.name.slice(lastDot) : '';
                  const base = lastDot !== -1 ? f.name.slice(0, lastDot) : f.name;
                  const truncatedBase = base.length > 20 ? `${base.slice(0, 18).trim()}…` : base;
                  const displayName = `${truncatedBase}${ext}`;
                  return (
                    <option key={idx} value={idx} title={f.name}>
                      #{idx + 1}: {displayName} ({formatSize(f.size)})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', overflowWrap: 'break-word', wordBreak: 'break-word', lineHeight: 1.4 }}>
              {files[activeFileIndex]?.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '2px 8px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                {formatSize(files[activeFileIndex]?.size || 0)}
              </span>
              {files.length > 1 && (
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  #{activeFileIndex + 1} / {files.length}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions for Files */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 8 }}>
            <button
              onClick={handleAddFilesClick}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', background: 'var(--bg-input)' }}
            >
              {allowMultiple ? (tUi.add_more_files || '+ Add More Files') : (tUi.change_document || tUi["Ganti Dokumen"] || "Change Document")}
            </button>
          </div>
        </div>
      )}

      {canonicalId === 'rotate-pdf' && <RotatePdfEditor rotation={rotateDegrees} setRotation={setRotateDegrees} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />}
      {canonicalId === 'watermark-pdf' && <WatermarkPdfEditor config={watermarkConfig} setConfig={setWatermarkConfig} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />}
      {canonicalId === 'page-numbers' && <PageNumbersPdfEditor config={pageNumberConfig} setConfig={setPageNumberConfig} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />}
      {canonicalId === 'split-pdf' && <SplitPdfEditor splitRange={splitRange} setSplitRange={setSplitRange} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />}
      {canonicalId === 'merge-pdf' && <MergePdfEditor files={files} setFiles={setFiles} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />}
      {canonicalId === 'compress-pdf' && (
        <CompressPdfEditor
          quality={compressQuality}
          setQuality={setCompressQuality}
          percent={compressPercent ?? 50}
          setPercent={setCompressPercent}
          targetSizeKB={compressTargetSizeKB}
          setTargetSizeKB={setCompressTargetSizeKB}
          onApply={handleStartProcessing}
          tUi={tUi}
          isProcessing={isProcessing}
          originalSizeKB={files[activeFileIndex] ? Math.round(files[activeFileIndex].size / 1024) : 0}
        />
      )}

      {canonicalId === 'pdf-to-image' && extractImageFormat && setExtractImageFormat && (
        <PdfToImageEditor format={extractImageFormat} setFormat={setExtractImageFormat} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'remove-pdf' && removeRange !== undefined && setRemoveRange && (
        <RemovePdfEditor removeRange={removeRange} setRemoveRange={setRemoveRange} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'organize-pdf' && insertAtIndex !== undefined && setInsertAtIndex && setInsertFile && (
        <OrganizePdfEditor insertFile={insertFile || null} setInsertFile={setInsertFile} insertAtIndex={insertAtIndex} setInsertAtIndex={setInsertAtIndex} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} totalPages={pdfPagesCount} />
      )}
      {canonicalId === 'sign-pdf' && signatureConfig && setSignatureConfig && (
        <SignPdfEditor signatureConfig={signatureConfig} setSignatureConfig={setSignatureConfig} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'protect-pdf' && pdfPassword !== undefined && setPdfPassword && (
        <ProtectPdfEditor pdfPassword={pdfPassword} setPdfPassword={setPdfPassword} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'unlock-pdf' && pdfPassword !== undefined && setPdfPassword && (
        <UnlockPdfEditor pdfPassword={pdfPassword} setPdfPassword={setPdfPassword} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'crop-pdf' && cropConfig && setCropConfig && (
        <CropPdfEditor cropConfig={cropConfig} setCropConfig={setCropConfig} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'redact-pdf' && redactConfig && setRedactConfig && (
        <RedactPdfEditor redactConfig={redactConfig} setRedactConfig={setRedactConfig} onProcess={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} activeFileIndex={activeFileIndex} />
      )}
      {canonicalId === 'reverse-pdf' && (
        <ReversePdfEditor onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'resize-pdf' && resizeConfig && setResizeConfig && (
        <ResizePdfEditor config={resizeConfig} setConfig={setResizeConfig} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'repair-pdf' && (
        <RepairPdfEditor onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'edit-pdf' && editElements && setEditElements && setSelectedEditId && (
        <EditPdfEditor
          elements={editElements} setElements={setEditElements}
          selectedId={selectedEditId || null} setSelectedId={setSelectedEditId}
          activePageIndex={activeFileIndex} onApply={() => handleStartProcessing({ toolId: 'edit-pdf' })} tUi={tUi} isProcessing={isProcessing}
        />
      )}
      {canonicalId === 'extract-images-pdf' && (
        <ExtractImagesEditor onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'grayscale-pdf' && (
        <GrayscalePdfEditor onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'scan-to-pdf' && (
        <ScanToPdfEditor onProcess={() => handleStartProcessing()} tUi={tUi} isProcessing={isProcessing} />
      )}
      {canonicalId === 'remove-pdf-metadata' && (
        <RemoveMetadataEditor
          file={files[activeFileIndex] || files[0]}
          onProcess={() => handleStartProcessing()}
          tUi={tUi}
          currentLang={currentLang}
          isProcessing={isProcessing}
        />
      )}
      {canonicalId === 'edit-pdf-metadata' && (
        <EditMetadataEditor
          file={files[activeFileIndex] || files[0]}
          onApply={(metadataConfig) => handleStartProcessing({ metadataConfig })}
          tUi={tUi}
          currentLang={currentLang}
          isProcessing={isProcessing}
        />
      )}
      {canonicalId === 'compare-pdf' && (
        <ComparePdfEditor
          onProcess={(options) => handleStartProcessing(options)}
          onApply={() => handleStartProcessing()}
          tUi={tUi}
          isProcessing={isProcessing}
        />
      )}

      {['pdf-to-word', 'word-to-pdf', 'excel-to-pdf', 'image-to-pdf', 'ppt-to-pdf', 'pdf-to-ppt', 'csv-to-pdf', 'txt-to-pdf', 'csv-to-excel', 'excel-to-csv', 'ocr-pdf'].includes(canonicalId) && (
        <GenericConvertEditor toolId={canonicalId} onApply={handleStartProcessing} tUi={tUi} isProcessing={isProcessing} currentLang={currentLang} />
      )}
    </div>
  );
};
