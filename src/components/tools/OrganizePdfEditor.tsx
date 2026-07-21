import React, { useRef } from 'react';
import { LayoutList, Download, Settings2, FileUp, Info } from 'lucide-react';

interface OrganizePdfEditorProps {
  insertFile: File | null;
  setInsertFile: (file: File | null) => void;
  insertAtIndex: number;
  setInsertAtIndex: (idx: number) => void;
  onApply: () => void;
  isProcessing: boolean;
  totalPages: number; // to restrict insertAtIndex
}

export const OrganizePdfEditor: React.FC<OrganizePdfEditorProps> = ({
  insertFile,
  setInsertFile,
  insertAtIndex,
  setInsertAtIndex,
  onApply,
  isProcessing,
  totalPages
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <LayoutList size={18} className="text-brand-primary" color="#8b5cf6" />
          <span>Sisipkan PDF</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Tambahkan dokumen PDF lain ke dalam dokumen utama ini pada posisi yang Anda tentukan.
        </p>
      </div>

      {/* Upload Secondary PDF */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          Dokumen yang Akan Disisipkan
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
          <span>{insertFile ? insertFile.name : 'Pilih File PDF Kedua...'}</span>
        </button>
      </div>

      {/* Insert Position */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          Sisipkan Setelah Halaman:
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
            {insertAtIndex === 0 ? 'Paling Awal (0)' : insertAtIndex}
          </div>
        </div>

        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Info size={16} color="#8b5cf6" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: '#a78bfa', margin: 0, lineHeight: 1.4 }}>
            File kedua akan disisipkan tepat SETELAH halaman ke-{insertAtIndex}.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !insertFile}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? 'Menyisipkan...' : 'Terapkan Sisipan'}</span>
        </button>
      </div>
    </div>
  );
};
