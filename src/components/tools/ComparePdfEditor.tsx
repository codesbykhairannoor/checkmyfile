import React, { useState, useRef } from 'react';
import { Scale, UploadCloud, File as FileIcon, X } from 'lucide-react';

interface ComparePdfEditorProps {
  tUi?: Record<string, string>;
  compareFile2?: File | null;
  setCompareFile2?: (file: File | null) => void;
  onApply?: () => void;
  onProcess?: (options: { compareFile2: File }) => void;
  isProcessing: boolean;
}

export const ComparePdfEditor: React.FC<ComparePdfEditorProps> = ({
  tUi = {},
  compareFile2: propCompareFile2,
  setCompareFile2: propSetCompareFile2,
  onApply,
  onProcess,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalCompareFile2, setInternalCompareFile2] = useState<File | null>(null);

  const activeCompareFile2 = propCompareFile2 !== undefined ? propCompareFile2 : internalCompareFile2;

  const handleUpdateFile2 = (file: File | null) => {
    setInternalCompareFile2(file);
    if (propSetCompareFile2) {
      propSetCompareFile2(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpdateFile2(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleRunCompare = () => {
    if (!activeCompareFile2) return;
    if (onProcess) {
      onProcess({ compareFile2: activeCompareFile2 });
    } else if (onApply) {
      onApply();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280, maxWidth: '100%', boxSizing: 'border-box', height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Scale size={18} className="text-brand-primary" color="#10b981" />
          <span>{t("compare_pdf", "Compare PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("compare_desc", "Visually compare two PDF documents side-by-side with highlight diffs.")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: '100%' }}>
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

        {activeCompareFile2 ? (
          <div style={{
            background: 'var(--bg-input)',
            padding: 14,
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', minWidth: 0, flex: 1 }}>
              <FileIcon size={20} className="text-brand-primary" style={{ flexShrink: 0, color: '#10b981' }} />
              <div style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }} title={activeCompareFile2.name}>
                  {activeCompareFile2.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{(activeCompareFile2.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleUpdateFile2(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}
              title="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: '2px dashed var(--border-color)', background: 'var(--bg-input)', borderRadius: 12, cursor: 'pointer', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
          >
            <UploadCloud size={28} className="text-brand-primary" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t("choose_second_pdf_btn", "Click to Upload Second PDF")}</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={handleRunCompare}
          disabled={isProcessing || !activeCompareFile2}
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
