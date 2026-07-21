import React from 'react';
import { Crop, Settings } from 'lucide-react';

interface CropPdfEditorProps {
  cropConfig: { marginTop: number; marginBottom: number; marginLeft: number; marginRight: number };
  setCropConfig: (config: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const CropPdfEditor: React.FC<CropPdfEditorProps> = ({
  cropConfig,
  setCropConfig,
  onApply,
  isProcessing
}) => {
  const handleChange = (key: string, value: number) => {
    setCropConfig({ ...cropConfig, [key]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
            <Crop size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Crop Margin PDF</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Potong pinggiran putih pada halaman.</p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={16} /> Pengaturan Margin (%)
          </h3>

          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Margin Atas</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginTop}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginTop} onChange={(e) => handleChange('marginTop', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Margin Bawah</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginBottom}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginBottom} onChange={(e) => handleChange('marginBottom', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Margin Kiri</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginLeft}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginLeft} onChange={(e) => handleChange('marginLeft', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Margin Kanan</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginRight}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginRight} onChange={(e) => handleChange('marginRight', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>
          </div>
          
          <div style={{ marginTop: 24, padding: 12, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, fontSize: '0.8rem', color: '#3b82f6', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: '1rem' }}>💡</span>
            <p style={{ margin: 0, lineHeight: 1.5 }}>Geser nilai di atas untuk menyesuaikan ukuran margin yang akan dipotong. Pratinjau hasil akan ditampilkan setelah Anda menekan tombol di bawah.</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <button onClick={onApply} disabled={isProcessing} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {isProcessing ? (
            <span className="spinner" style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <><Crop size={20} /> Potong PDF Sekarang</>
          )}
        </button>
      </div>
    </div>
  );
};
