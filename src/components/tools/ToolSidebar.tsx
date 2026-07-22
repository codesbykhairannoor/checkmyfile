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
import { ComparePdfEditor } from './ComparePdfEditor';
import { RedactPdfEditor } from './RedactPdfEditor';
import { ReversePdfEditor } from './ReversePdfEditor';
import { ResizePdfEditor } from './ResizePdfEditor';
import type { ToolDefinition } from '../../catalog/toolsCatalog';

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
  compressQuality: 'extreme' | 'balanced' | 'high';
  setCompressQuality: (v: 'extreme' | 'balanced' | 'high') => void;

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

  formatSize: (bytes: number) => string;
  acceptTypes?: string;
  allowMultiple?: boolean;
  pdfPagesCount?: number;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  tool, files, setFiles, activeFileIndex, setActiveFileIndex, isProcessing, handleStartProcessing,
  splitRange, setSplitRange, rotateDegrees, setRotateDegrees,
  pageNumberConfig, setPageNumberConfig, watermarkConfig, setWatermarkConfig, compressQuality, setCompressQuality,
  extractImageFormat, setExtractImageFormat,
  removeRange, setRemoveRange, insertFile, setInsertFile, insertAtIndex, setInsertAtIndex, signatureConfig, setSignatureConfig,
  pdfPassword, setPdfPassword, cropConfig, setCropConfig, redactConfig, setRedactConfig,
  resizeConfig, setResizeConfig,
  formatSize, acceptTypes = '*', allowMultiple = false, pdfPagesCount = 100
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (allowMultiple) {
        setFiles(prev => [...prev, ...newFiles]);
      } else {
        setFiles(newFiles);
        setActiveFileIndex(0);
      }
    }
  };

  return (
    <div style={{ flexShrink: 0, flex: 1, minWidth: 350, minHeight: 0, paddingRight: 8, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 0, overflowY: 'auto' }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept={acceptTypes} 
        multiple={allowMultiple} 
        style={{ display: 'none' }} 
      />

      {files.length > 0 && (
        <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          {files.length > 1 && (
            <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                Pilih Dokumen Pratinjau:
              </label>
              <select
                value={activeFileIndex}
                onChange={(e) => setActiveFileIndex(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {files.map((f, idx) => (
                  <option key={idx} value={idx}>
                    #{idx + 1}: {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', wordBreak: 'break-all' }}>
              {files[activeFileIndex]?.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: 'var(--bg-input)', padding: '2px 8px', borderRadius: 12 }}>
                {formatSize(files[activeFileIndex]?.size || 0)}
              </span>
            </span>
          </div>

          {/* Quick Actions for Files */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 8 }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', background: 'var(--bg-input)' }}
            >
              {allowMultiple ? '+ Tambah File Lagi' : 'Ganti Dokumen'}
            </button>
          </div>
        </div>
      )}
      {tool.id === 'rotate-pdf' && <RotatePdfEditor rotation={rotateDegrees} setRotation={setRotateDegrees} onApply={handleStartProcessing} isProcessing={isProcessing} />}
      {tool.id === 'watermark-pdf' && <WatermarkPdfEditor config={watermarkConfig} setConfig={setWatermarkConfig} onApply={handleStartProcessing} isProcessing={isProcessing} />}
      {tool.id === 'page-numbers' && <PageNumbersPdfEditor config={pageNumberConfig} setConfig={setPageNumberConfig} onApply={handleStartProcessing} isProcessing={isProcessing} />}
      {tool.id === 'split-pdf' && <SplitPdfEditor splitRange={splitRange} setSplitRange={setSplitRange} onApply={handleStartProcessing} isProcessing={isProcessing} />}
      {tool.id === 'merge-pdf' && <MergePdfEditor files={files} setFiles={setFiles} onApply={handleStartProcessing} isProcessing={isProcessing} />}
      {tool.id === 'compress-pdf' && <CompressPdfEditor quality={compressQuality} setQuality={setCompressQuality} onApply={handleStartProcessing} isProcessing={isProcessing} />}

      {tool.id === 'pdf-to-image' && extractImageFormat && setExtractImageFormat && (
        <PdfToImageEditor format={extractImageFormat} setFormat={setExtractImageFormat} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'remove-pdf' && removeRange !== undefined && setRemoveRange && (
        <RemovePdfEditor removeRange={removeRange} setRemoveRange={setRemoveRange} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'organize-pdf' && insertAtIndex !== undefined && setInsertAtIndex && setInsertFile && (
        <OrganizePdfEditor insertFile={insertFile || null} setInsertFile={setInsertFile} insertAtIndex={insertAtIndex} setInsertAtIndex={setInsertAtIndex} onApply={handleStartProcessing} isProcessing={isProcessing} totalPages={pdfPagesCount} />
      )}
      {tool.id === 'sign-pdf' && signatureConfig && setSignatureConfig && (
        <SignPdfEditor signatureConfig={signatureConfig} setSignatureConfig={setSignatureConfig} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'protect-pdf' && pdfPassword !== undefined && setPdfPassword && (
        <ProtectPdfEditor pdfPassword={pdfPassword} setPdfPassword={setPdfPassword} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'unlock-pdf' && pdfPassword !== undefined && setPdfPassword && (
        <UnlockPdfEditor pdfPassword={pdfPassword} setPdfPassword={setPdfPassword} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'crop-pdf' && cropConfig && setCropConfig && (
        <CropPdfEditor cropConfig={cropConfig} setCropConfig={setCropConfig} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'redact-pdf' && redactConfig && setRedactConfig && (
        <RedactPdfEditor redactConfig={redactConfig} setRedactConfig={setRedactConfig} onProcess={handleStartProcessing} isProcessing={isProcessing} activeFileIndex={activeFileIndex} />
      )}
      {tool.id === 'reverse-pdf' && (
        <ReversePdfEditor onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'resize-pdf' && resizeConfig && setResizeConfig && (
        <ResizePdfEditor config={resizeConfig} setConfig={setResizeConfig} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'extract-images-pdf' && (
        <ExtractImagesEditor onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'grayscale-pdf' && (
        <GrayscalePdfEditor onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'scan-to-pdf' && (
        <ScanToPdfEditor onProcess={() => handleStartProcessing()} isProcessing={isProcessing} />
      )}
      {tool.id === 'remove-pdf-metadata' && (
        <RemoveMetadataEditor onProcess={() => handleStartProcessing()} isProcessing={isProcessing} />
      )}
      {tool.id === 'compare-pdf' && (
        <ComparePdfEditor onProcess={(options) => handleStartProcessing(options)} isProcessing={isProcessing} />
      )}
      {tool.id === 'redact-pdf' && redactConfig && setRedactConfig && (
        <RedactPdfEditor 
          redactConfig={redactConfig} setRedactConfig={setRedactConfig} 
          activeFileIndex={activeFileIndex}
          onProcess={() => handleStartProcessing()} isProcessing={isProcessing} 
        />
      )}
      {['pdf-to-word', 'word-to-pdf', 'excel-to-pdf', 'image-to-pdf', 'ppt-to-pdf', 'pdf-to-ppt', 'csv-to-pdf', 'txt-to-pdf', 'csv-to-excel', 'excel-to-csv', 'ocr-pdf'].includes(tool.id) && (
        <GenericConvertEditor toolId={tool.id} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
    </div>
  );
};
