import React from 'react';
import { Image as ImageIcon, Download, Settings2 } from 'lucide-react';

interface PdfToImageEditorProps {
  tUi?: Record<string, string>;
  format: 'png' | 'jpg';
  setFormat: (val: 'png' | 'jpg') => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const PdfToImageEditor: React.FC<PdfToImageEditorProps> = ({
  tUi = {},
  format,
  setFormat,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ImageIcon size={18} className="text-brand-primary" />
          <span>{t("convert_to_image", "Convert PDF to Images")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("convert_to_image_desc", "Extract high-resolution image files from every page of your PDF.")}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setFormat('png')}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: format === 'png' ? 'var(--brand-gradient)' : 'var(--bg-input)',
              color: format === 'png' ? '#fff' : 'var(--text-main)',
              border: format === 'png' ? '1px solid transparent' : '1px solid var(--border-color)',
              borderRadius: 12
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>PNG</span>
            <span style={{ fontWeight: 600, fontSize: '0.75rem', opacity: format === 'png' ? 0.9 : 0.6 }}>High Quality</span>
          </button>
          <button
            onClick={() => setFormat('jpg')}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: format === 'jpg' ? 'var(--brand-gradient)' : 'var(--bg-input)',
              color: format === 'jpg' ? '#fff' : 'var(--text-main)',
              border: format === 'jpg' ? '1px solid transparent' : '1px solid var(--border-color)',
              borderRadius: 12
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>JPG</span>
            <span style={{ fontWeight: 600, fontSize: '0.75rem', opacity: format === 'jpg' ? 0.9 : 0.6 }}>Compact Size</span>
          </button>
        </div>
      </div>

      <button
        onClick={onApply}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: '100%', padding: '14px 24px', fontSize: '1rem', fontWeight: 700, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>{isProcessing ? t("extracting_btn", "Extracting Images...") : t("apply_image_convert", "Extract Images Now")}</span>
      </button>
    </div>
  );
};
