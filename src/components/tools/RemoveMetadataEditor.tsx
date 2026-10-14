import React from 'react';
import { Eraser, Download, Settings2, ArrowRight } from 'lucide-react';

interface RemoveMetadataEditorProps {
  tUi?: Record<string, string>;
  onProcess: () => void;
  isProcessing: boolean;
  currentLang?: string;
}

export const RemoveMetadataEditor: React.FC<RemoveMetadataEditorProps> = ({
  tUi = {},
  onProcess,
  isProcessing,
  currentLang = 'id',
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-color)' }}>
        <div style={{ padding: 12, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 12 }}>
          <Eraser size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            {t("remove_metadata", "Remove Metadata")}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {t("remove_metadata_desc", "Sanitize author, creator, GPS, and creation timestamps permanently.")}
          </p>
        </div>
      </div>

      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>{isProcessing ? t("sanitizing_btn", "Sanitizing...") : t("apply_remove_metadata", "Sanitize Metadata Now")}</span>
      </button>

      {/* Cross-link to Edit Metadata */}
      <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <a
          href={currentLang === 'id' ? '/id/edit-metadata-pdf' : '/edit-pdf-metadata'}
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <span>{currentLang === 'id' ? 'Ingin mengubah nama penulis atau judul?' : 'Want to customize author or title instead?'}</span>
          <strong style={{ color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {currentLang === 'id' ? 'Edit Metadata' : 'Edit Metadata'} <ArrowRight size={12} />
          </strong>
        </a>
      </div>
    </div>
  );
};
