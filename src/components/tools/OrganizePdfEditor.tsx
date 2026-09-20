import React, { useRef } from 'react';
import { LayoutList, Download, Settings2, FileUp, Info } from 'lucide-react';

interface OrganizePdfEditorProps {
  tUi?: Record<string, string>;
  insertFile: File | null;
  setInsertFile: (file: File | null) => void;
  insertAtIndex: number;
  setInsertAtIndex: (idx: number) => void;
  onApply: () => void;
  isProcessing: boolean;
  totalPages: number;
}

export const OrganizePdfEditor: React.FC<OrganizePdfEditorProps> = ({
  tUi = {},
  insertFile,
  setInsertFile,
  insertAtIndex,
  setInsertAtIndex,
  onApply,
  isProcessing,
  totalPages
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <LayoutList size={18} className="text-brand-primary" color="#8b5cf6" />
          <span>{t("organize_pdf", "Organize PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("organize_desc", "Insert or reorder pages inside your PDF document.")}
        </p>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          {t("insert_file_label", "Insert Document")}
        </label>
        
        <input 
          type="file" 
          accept="application/pdf" 
          style={{ display: 'none' }} 
          ref={fileRef}
          onChange={(e) => {
            if (e.target.files?.[0]) setInsertFile(e.target.files[0]);
          }}
        />
        
        <button 
          onClick={() => fileRef.current?.click()}
          className="btn-secondary"
          style={{ width: '100%', padding: '12px', justifyContent: 'center', background: 'var(--bg-input)' }}
        >
          <FileUp size={16} />
          <span>{insertFile ? insertFile.name : t("select_second_pdf", "Select PDF File to Insert...")}</span>
        </button>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          {t("insert_after_page", "Insert After Page:")}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="range"
            min="0"
            max={totalPages || 1}
            value={insertAtIndex}
            onChange={(e) => setInsertAtIndex(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#8b5cf6' }}
          />
          <div style={{ background: 'var(--bg-input)', padding: '6px 12px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700 }}>
            {insertAtIndex === 0 ? t("insert_at_start", "At the Very Beginning (0)") : insertAtIndex}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !insertFile}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? t("inserting_btn", "Inserting...") : t("apply_insert", "Apply Page Insertion")}</span>
        </button>
      </div>
    </div>
  );
};
