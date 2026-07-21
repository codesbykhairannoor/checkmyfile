import React from 'react';
import { Contrast, AlertTriangle } from 'lucide-react';

interface GrayscalePdfEditorProps {
  onApply: () => void;
  isProcessing: boolean;
}

export const GrayscalePdfEditor: React.FC<GrayscalePdfEditorProps> = ({
  onApply,
  isProcessing
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
            <Contrast size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Grayscale PDF</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Ubah warna dokumen menjadi hitam putih.</p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: 4 }} />
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: '#f59e0b' }}>Perhatian: Rasterisasi</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Untuk memastikan akurasi konversi warna di peramban, dokumen Anda akan diubah menjadi gambar statis (raster) beresolusi tinggi. 
                Ini berarti teks dalam file hasil tidak akan bisa di-blok (copy/paste), tetapi sangat cocok untuk kebutuhan cetak (printing) yang hemat tinta.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <button onClick={onApply} disabled={isProcessing} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {isProcessing ? (
            <span className="spinner" style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <><Contrast size={20} /> Ubah Jadi Hitam Putih</>
          )}
        </button>
      </div>
    </div>
  );
};
