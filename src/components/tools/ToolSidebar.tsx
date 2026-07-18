import React from 'react';
import { RotatePdfEditor } from './RotatePdfEditor';
import { WatermarkPdfEditor } from './WatermarkPdfEditor';
import { PageNumbersPdfEditor } from './PageNumbersPdfEditor';
import { SplitPdfEditor } from './SplitPdfEditor';
import { MergePdfEditor } from './MergePdfEditor';
import { CompressPdfEditor } from './CompressPdfEditor';
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
  pageNumberPos: string;
  setPageNumberPos: (v: string) => void;
  compressQuality: 'extreme' | 'balanced' | 'high';
  setCompressQuality: (v: 'extreme' | 'balanced' | 'high') => void;
  formatSize: (bytes: number) => string;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  tool, files, setFiles, activeFileIndex, setActiveFileIndex, isProcessing, handleStartProcessing,
  splitRange, setSplitRange, rotateDegrees, setRotateDegrees,
  pageNumberPos, setPageNumberPos, watermarkConfig, setWatermarkConfig, compressQuality, setCompressQuality,
  formatSize
}) => {
  return (
    <div style={{ width: 440, flexShrink: 0, flex: 1, minHeight: 0, paddingRight: 8, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 0, overflowY: 'auto' }}>
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
      {tool.id === 'rotate-pdf' && (
        <RotatePdfEditor rotation={rotateDegrees} setRotation={setRotateDegrees} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'watermark-pdf' && (
        <WatermarkPdfEditor config={watermarkConfig} setConfig={setWatermarkConfig} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'page-numbers' && (
        <PageNumbersPdfEditor position={pageNumberPos as any} setPosition={setPageNumberPos as any} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'split-pdf' && (
        <SplitPdfEditor splitRange={splitRange} setSplitRange={setSplitRange} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'merge-pdf' && (
        <MergePdfEditor files={files} setFiles={setFiles} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}
      {tool.id === 'compress-pdf' && (
        <CompressPdfEditor quality={compressQuality} setQuality={setCompressQuality} onApply={handleStartProcessing} isProcessing={isProcessing} />
      )}


    </div>
  );
};
