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

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => setFormat('png')}
          className="btn-secondary"
          style={{
            flex: 1,
            padding: '12px 0',
            fontWeight: 700,
            background: format === 'png' ? 'var(--brand-gradient)' : 'var(--bg-input)',
            color: format === 'png' ? '#fff' : 'var(--text-main)',
            border: format === 'png' ? 'none' : '1px solid var(--border-color)',
          }}
        >
          PNG (Kualitas Terbaik)
        </button>
        <button
          onClick={() => setFormat('jpg')}
          className="btn-secondary"
          style={{
            flex: 1,
            padding: '12px 0',
            fontWeight: 700,
            background: format === 'jpg' ? 'var(--brand-gradient)' : 'var(--bg-input)',
            color: format === 'jpg' ? '#fff' : 'var(--text-main)',
            border: format === 'jpg' ? 'none' : '1px solid var(--border-color)',
          }}
        >
          JPG (Ukuran Kecil)
        </button>
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
