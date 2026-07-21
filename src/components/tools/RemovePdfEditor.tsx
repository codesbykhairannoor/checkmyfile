import React from 'react';
import { Trash2, Download, Settings2, Info } from 'lucide-react';

interface RemovePdfEditorProps {
  removeRange: string;
  setRemoveRange: (range: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const RemovePdfEditor: React.FC<RemovePdfEditorProps> = ({
  removeRange,
  setRemoveRange,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trash2 size={18} className="text-brand-primary" color="#e11d48" />
          <span>Hapus Halaman</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Ketik rentang atau nomor halaman yang ingin Anda hapus secara permanen.
        </p>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          Halaman yang Dihapus (Contoh: 1, 3-5)
        </label>
        <input
          type="text"
          value={removeRange}
          onChange={(e) => setRemoveRange(e.target.value)}
          placeholder="e.g. 1, 3-5, 8"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        />
        
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Info size={16} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: '#f87171', margin: 0, lineHeight: 1.4 }}>
            Halaman yang masuk dalam rentang ini akan ditandai dengan label merah "HAPUS" di Live Preview.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 20px rgba(225, 29, 72, 0.25)' }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? 'Menghapus...' : 'Hapus Sekarang'}</span>
        </button>
      </div>
    </div>
  );
};
