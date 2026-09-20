import React from 'react';
import { ArrowDownUp, Download, RotateCw } from 'lucide-react';

interface ReversePdfEditorProps {
  tUi?: Record<string, string>;
  onApply: () => void;
  isProcessing: boolean;
}

export const ReversePdfEditor: React.FC<ReversePdfEditorProps> = ({
  tUi = {},
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowDownUp size={18} className="text-brand-primary" />
          <span>{t("reverse_pdf", "Reverse PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("reverse_desc", "Reverse document page sequence from back to front (e.g. 1-2-3 becomes 3-2-1).")}
        </p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><RotateCw size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? t("reversing_btn", "Reversing...") : t("apply_reverse", "Reverse Page Order")}</span>
        </button>
      </div>
    </div>
  );
};
