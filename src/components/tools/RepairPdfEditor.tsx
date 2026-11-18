import React from 'react';
import { Wrench, Download, Settings2, ShieldCheck, CheckCircle2, FileCheck } from 'lucide-react';

interface RepairPdfEditorProps {
  tUi?: Record<string, string>;
  onApply: () => void;
  isProcessing: boolean;
}

export const RepairPdfEditor: React.FC<RepairPdfEditorProps> = ({
  tUi = {},
  onApply,
  isProcessing,
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wrench size={18} className="text-brand-primary" />
          <span>{t("repair_pdf", "Repair PDF Document")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          {t("repair_desc", "Recover corrupted, damaged, or unreadable PDF files instantly in client-side browser memory.")}
        </p>
      </div>

      {/* Diagnostics / Recovery Checklist */}
      <div style={{ background: 'var(--bg-input)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
          <ShieldCheck size={16} color="var(--brand-primary)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t("repair_pipeline_title", "Binary Inspection & Reconstruction:")}
          </span>
        </div>

        {[
          { labelKey: 'repair_step_header', defaultLabel: 'Header & Trailer Sanitization', descKey: 'repair_step_header_desc', defaultDesc: 'Strips garbage bytes, null bytes, and fixes malformed stream boundaries.' },
          { labelKey: 'repair_step_xref', defaultLabel: 'XRef Table Reconstruction', descKey: 'repair_step_xref_desc', defaultDesc: 'Scans and recalculates byte offsets for all valid PDF objects.' },
          { labelKey: 'repair_step_pages', defaultLabel: 'Page Tree Hierarchy Recovery', descKey: 'repair_step_pages_desc', defaultDesc: 'Rescues and relinks orphaned page objects and content streams.' },
          { labelKey: 'repair_step_iso', defaultLabel: 'ISO 32000 Conformance Repack', descKey: 'repair_step_iso_desc', defaultDesc: 'Generates a clean, compliant PDF structure readable by all PDF viewers.' },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>{t(item.labelKey, item.defaultLabel)}</div>
              <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>{t(item.descKey, item.defaultDesc)}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: 12, borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FileCheck size={18} color="#10b981" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
          {t("repair_zero_knowledge", "100% Private & Safe: Entire recovery runs in your local browser memory without uploading files to any server.")}
        </span>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? t("repairing_btn", "Repairing Document...") : t("repair_now_btn", "Repair PDF Now")}</span>
        </button>
      </div>
    </div>
  );
};
