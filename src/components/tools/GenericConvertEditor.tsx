import React from 'react';
import { Settings2, Download } from 'lucide-react';

interface GenericConvertEditorProps {
  tUi?: Record<string, string>;
  toolId: string;
  onApply: (options?: any) => void;
  isProcessing: boolean;
}

export const GenericConvertEditor: React.FC<GenericConvertEditorProps> = ({
  tUi = {},
  toolId, onApply, isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const isOcr = toolId === 'ocr-pdf';
  const [ocrFormat, setOcrFormat] = React.useState<'txt' | 'xlsx'>('txt');

  const handleStart = () => {
    if (isOcr) {
      onApply({ extractImageFormat: ocrFormat });
    } else {
      onApply();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings2 size={18} className="text-brand-primary" />
          <span>{isOcr ? t("ocr_convert_title", "OCR Document Extraction") : t("generic_convert", "Convert Document")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {isOcr
            ? t("ocr_convert_desc", "Extract text and tabular data from scanned PDFs or images into structured document formats.")
            : t("generic_convert_desc", "Fast client-side document conversion with preserved fonts and layouts.")}
        </p>
      </div>

      {isOcr && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-input)', padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {t("ocr_output_format", "Select Output Format:")}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setOcrFormat('txt')}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: ocrFormat === 'txt' ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                background: ocrFormat === 'txt' ? 'rgba(225, 29, 72, 0.08)' : 'var(--bg-card)',
                color: ocrFormat === 'txt' ? 'var(--brand-primary)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              📄 {t("ocr_format_txt", "Plain Text (.txt)")}
            </button>
            <button
              type="button"
              onClick={() => setOcrFormat('xlsx')}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: ocrFormat === 'xlsx' ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                background: ocrFormat === 'xlsx' ? 'rgba(225, 29, 72, 0.08)' : 'var(--brand-primary)',
                color: ocrFormat === 'xlsx' ? 'var(--brand-primary)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              📊 {t("ocr_format_xlsx", "Excel Spreadsheet (.xlsx)")}
            </button>
          </div>
          {ocrFormat === 'xlsx' && (
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
              ✨ {t("ocr_table_hint", "AI Table Detector maps scanned columns and rows directly into native Excel cells.")}
            </span>
          )}
        </div>
      )}

      <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-accent)' }}>
        {t("local_privacy_badge", "✨ 100% Client-Side Privacy: Your files never leave your device.")}
      </div>

      <button
        onClick={handleStart}
        disabled={isProcessing}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10
        }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>{isProcessing ? t("generic_converting_btn", "Converting...") : (isOcr ? t("start_ocr_btn", "Start OCR Extraction") : t("apply_generic_convert", "Start Conversion"))}</span>
      </button>
    </div>
  );
};
