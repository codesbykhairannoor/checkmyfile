import React from 'react';
import { Image, Info } from 'lucide-react';

interface ExtractImagesEditorProps {
  onApply: () => void;
  isProcessing: boolean;
}

export const ExtractImagesEditor: React.FC<ExtractImagesEditorProps> = ({
  onApply,
  isProcessing
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
            <Image size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Ekstrak Gambar</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Ambil semua foto dari dalam dokumen.</p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Info size={24} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: 4 }} />
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>Bagaimana cara kerjanya?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Alat ini akan memindai seluruh dokumen PDF Anda untuk mencari file gambar asli (seperti foto atau ilustrasi) yang tertanam di dalamnya. 
                Semua gambar yang ditemukan akan dikumpulkan secara otomatis ke dalam satu file ZIP tanpa mengurangi kualitas aslinya.
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
            <><Image size={20} /> Ekstrak Semua Gambar</>
          )}
        </button>
      </div>
    </div>
  );
};
