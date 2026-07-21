import React from 'react';
import { ScanLine, Lightbulb } from 'lucide-react';

interface ScanToPdfEditorProps {
  onProcess: () => void;
  isProcessing: boolean;
}

export const ScanToPdfEditor: React.FC<ScanToPdfEditorProps> = ({ onProcess, isProcessing }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: 12, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 12 }}>
          <ScanLine size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            Rasterize PDF (Jadikan Permanen)
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Sistem akan menggambar ulang setiap teks dan komponen PDF menjadi gambar statis beresolusi tinggi, membuat dokumen ini 100% aman dari proses pengeditan atau salin-tempel.
          </p>
        </div>
      </div>

      <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Lightbulb size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.5 }}>
          File PDF hasil pemrosesan akan memiliki ukuran sedikit lebih besar karena semua teks diubah menjadi gambar, namun ini adalah cara paling efektif untuk mencegah pemalsuan dokumen.
        </p>
      </div>

      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
      >
        {isProcessing ? 'Memproses Rasterisasi...' : 'Jadikan PDF Permanen Sekarang'}
      </button>
    </div>
  );
};
