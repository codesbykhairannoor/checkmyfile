import React from 'react';
import { Settings2, Download } from 'lucide-react';

interface GenericConvertEditorProps {
  tUi?: Record<string, string>;
  toolId: string;
  onApply: () => void;
  isProcessing: boolean;
}

export const GenericConvertEditor: React.FC<GenericConvertEditorProps> = ({
  tUi = {},
  toolId, onApply, isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings2 size={18} className="text-brand-primary" />
          <span>{t("generic_convert", "Convert Document")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("generic_convert_desc", "Fast client-side document conversion with preserved fonts and layouts.")}
        </p>
      </div>
      
      <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-accent)' }}>
        {t("local_privacy_badge", "✨ 100% Client-Side Privacy: Your files never leave your device.")}
      </div>

      <button
        onClick={onApply}
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
        <span>{isProcessing ? t("generic_converting_btn", "Converting...") : t("apply_generic_convert", "Start Conversion")}</span>
      </button>
    </div>
  );
};
