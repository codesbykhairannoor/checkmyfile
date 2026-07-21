import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface PdfToImageEditorProps {
  format: 'png' | 'jpg';
  setFormat: (val: 'png' | 'jpg') => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const PdfToImageEditor: React.FC<PdfToImageEditorProps> = ({
  format,
  setFormat,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ImageIcon size={18} className="text-brand-primary" />
          <span>Ekstrak Gambar</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Pilih format gambar yang ingin dihasilkan. Setiap halaman PDF akan diubah menjadi gambar berkualitas tinggi.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setFormat('png')}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: format === 'png' ? 'var(--brand-gradient)' : 'var(--bg-input)',
              color: format === 'png' ? '#fff' : 'var(--text-main)',
              border: format === 'png' ? '1px solid transparent' : '1px solid var(--border-color)',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>PNG</span>
            <span style={{ fontWeight: 600, fontSize: '0.75rem', opacity: format === 'png' ? 0.9 : 0.6 }}>Kualitas Terbaik</span>
          </button>
          <button
            onClick={() => setFormat('jpg')}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: format === 'jpg' ? 'var(--brand-gradient)' : 'var(--bg-input)',
              color: format === 'jpg' ? '#fff' : 'var(--text-main)',
              border: format === 'jpg' ? '1px solid transparent' : '1px solid var(--border-color)',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>JPG</span>
            <span style={{ fontWeight: 600, fontSize: '0.75rem', opacity: format === 'jpg' ? 0.9 : 0.6 }}>Ukuran Kecil</span>
          </button>
        </div>
      </div>

      <button
        onClick={onApply}
        disabled={isProcessing}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          background: 'var(--brand-gradient)',
          color: '#fff',
          border: 'none',
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? 'not-allowed' : 'pointer'
        }}
      >
        {isProcessing ? 'Memproses...' : 'Ekstrak Gambar Sekarang'}
      </button>
    </div>
  );
};
