import React from 'react';
import { Scale, UploadCloud, File as FileIcon, X } from 'lucide-react';

interface ComparePdfEditorProps {
  tUi?: Record<string, string>;
  compareFile2?: File | null;
  setCompareFile2?: (file: File | null) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ComparePdfEditor: React.FC<ComparePdfEditorProps> = ({
  tUi = {},
  compareFile2,
  setCompareFile2,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && setCompareFile2) {
      setCompareFile2(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Scale size={18} className="text-brand-primary" color="#10b981" />
          <span>{t("compare_pdf", "Compare PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("compare_desc", "Visually compare two PDF documents side-by-side with highlight diffs.")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {t("select_second_pdf", "Select Comparison PDF (Revised)")}
        </label>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          style={{ display: 'none' }}
        />

        {compareFile2 ? (
          <div style={{ background: 'var(--bg-input)', padding: 14, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <FileIcon size={20} className="text-brand-primary" />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{compareFile2.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{(compareFile2.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            {setCompareFile2 && (
              <button onClick={() => setCompareFile2(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: '2px dashed var(--border-color)', background: 'var(--bg-input)', borderRadius: 12, cursor: 'pointer' }}
          >
            <UploadCloud size={28} className="text-brand-primary" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t("choose_second_pdf_btn", "Click to Upload Second PDF")}</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !compareFile2}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Scale size={18} /></div> : <Scale size={18} />}
          <span>{isProcessing ? t("comparing_btn", "Analyzing Differences...") : t("apply_compare", "Compare Documents Now")}</span>
        </button>
      </div>
    </div>
  );
};
