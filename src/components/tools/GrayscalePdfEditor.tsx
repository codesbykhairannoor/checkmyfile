import React from 'react';
import { Contrast, AlertTriangle } from 'lucide-react';

interface GrayscalePdfEditorProps {
  tUi?: Record<string, string>;
  onApply: () => void;
  isProcessing: boolean;
}

export const GrayscalePdfEditor: React.FC<GrayscalePdfEditorProps> = ({
  tUi = {},
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: '#64748b', color: 'white', padding: '8px', borderRadius: 8 }}>
            <Contrast size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{t("grayscale_pdf", "Grayscale PDF")}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {t("grayscale_desc", "Convert all document colors and images to black & white grayscale for printing.")}
        </p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: 16, background: 'rgba(100, 116, 139, 0.1)', border: '1px solid rgba(100, 116, 139, 0.2)', borderRadius: 12, display: 'flex', gap: 12 }}>
          <AlertTriangle color="#94a3b8" size={24} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {t("local_privacy_badge", "✨ 100% Client-Side Privacy: Your files never leave your device.")}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#475569', borderRadius: 12 }}
        >
          {isProcessing ? (
            <span className="spinner" style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <><Contrast size={20} />{t("apply_grayscale", "Convert to Grayscale")}</>
          )}
        </button>
      </div>
    </div>
  );
};
