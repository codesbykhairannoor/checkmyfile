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
          <span>{t("repair_pdf", "Perbaiki PDF (PDF Repair)")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          {t("repair_desc", "Pulihkan dokumen PDF yang rusak, error saat dibuka, atau tabel xref terpotong secara instan di memori browser.")}
        </p>
      </div>

      {/* Diagnostics / Recovery Checklist */}
      <div style={{ background: 'var(--bg-input)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
          <ShieldCheck size={16} color="var(--brand-primary)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t("repair_pipeline_title", "Pemeriksaan & Rekonstruksi Biner:")}
          </span>
        </div>

        {[
          { label: 'Pembersihan Header %PDF- & Trailer %%EOF Rusak', desc: 'Menghapus byte sampah dan null bytes di awal/akhir file' },
          { label: 'Rekonstruksi Tabel Cross-Reference (XRef)', desc: 'Membangun ulang indeks byte offset seluruh objek PDF' },
          { label: 'Pemulihan Pohon Halaman (/Type /Page)', desc: 'Menyelamatkan seluruh halaman valid yang terputus' },
          { label: 'Pembersihan Objek Yatim & Stream Corrupt', desc: 'Menghasilkan dokumen baru berstandar ISO 32000' },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.label}</div>
              <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: 12, borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FileCheck size={18} color="#10b981" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
          {t("repair_zero_knowledge", "100% Aman & Privat: Seluruh proses recovery dilakukan di RAM browser tanpa mengunggah dokumen ke server.")}
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
          <span>{isProcessing ? t("repairing_btn", "Memulihkan Dokumen...") : t("repair_now_btn", "Perbaiki PDF Sekarang")}</span>
        </button>
      </div>
    </div>
  );
};
