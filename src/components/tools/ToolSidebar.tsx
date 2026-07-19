import React from 'react';
import { RotatePdfEditor } from './RotatePdfEditor';
import { WatermarkPdfEditor } from './WatermarkPdfEditor';
import { PageNumbersPdfEditor } from './PageNumbersPdfEditor';
import { SplitPdfEditor } from './SplitPdfEditor';
import { MergePdfEditor } from './MergePdfEditor';
import { CompressPdfEditor } from './CompressPdfEditor';

import { PdfToImageEditor } from './PdfToImageEditor';
import { GenericConvertEditor } from './GenericConvertEditor';
import type { ToolDefinition } from '../../catalog/toolsCatalog';

interface ToolSidebarProps {
  tool: ToolDefinition;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  activeFileIndex: number;
  setActiveFileIndex: (idx: number) => void;
  isProcessing: boolean;
  handleStartProcessing: () => void;
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
  formatSize: (bytes: number) => string;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  tool, files, setFiles, activeFileIndex, setActiveFileIndex, isProcessing, handleStartProcessing,
  splitRange, setSplitRange, rotateDegrees, setRotateDegrees,
  pageNumberConfig, setPageNumberConfig, watermarkConfig, setWatermarkConfig, compressQuality, setCompressQuality,
  extractImageFormat, setExtractImageFormat,
  formatSize
}) => {
  return (
    <div style={{ flexShrink: 0, flex: 1, minWidth: 350, minHeight: 0, paddingRight: 8, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 0, overflowY: 'auto' }}>
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
      {['pdf-to-word', 'word-to-pdf', 'excel-to-pdf', 'image-to-pdf', 'ppt-to-pdf', 'pdf-to-ppt', 'csv-to-pdf', 'txt-to-pdf', 'csv-to-excel', 'excel-to-csv'].includes(tool.id) && (
        <GenericConvertEditor toolId={tool.id} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
    </div>
  );
};
