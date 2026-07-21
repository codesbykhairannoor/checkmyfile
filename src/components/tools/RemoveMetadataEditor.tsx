import React from 'react';
import { Eraser, ShieldCheck } from 'lucide-react';

interface RemoveMetadataEditorProps {
  onProcess: () => void;
  isProcessing: boolean;
}

export const RemoveMetadataEditor: React.FC<RemoveMetadataEditorProps> = ({ onProcess, isProcessing }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: 12, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 12 }}>
          <Eraser size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            Bersihkan Jejak Digital (Metadata)
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Alat ini akan menghapus semua properti tersembunyi dari PDF Anda secara permanen.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)' }}>
            <ShieldCheck size={18} className="text-accent" /> Data yang akan dihapus:
          </h4>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Nama Pembuat Dokumen (Author)',
            'Aplikasi Pembuat (Creator/Producer)',
            'Tanggal Pembuatan & Modifikasi',
            'Judul dan Subjek Dokumen',
            'Kata Kunci Tersembunyi (Keywords)'
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
      >
        {isProcessing ? 'Membersihkan Metadata...' : 'Hapus Metadata Sekarang'}
      </button>
    </div>
  );
};
