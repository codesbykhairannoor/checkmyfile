import React from 'react';
import { Maximize, Download, RotateCw } from 'lucide-react';

interface ResizePdfEditorProps {
  config: any;
  setConfig: (c: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ResizePdfEditor: React.FC<ResizePdfEditorProps> = ({ config, setConfig, onApply, isProcessing }) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Maximize size={18} className="text-brand-primary" />
          <span>Resize PDF</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Ubah ukuran kertas PDF Anda dan tambahkan margin tanpa memotong konten asli.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Ukuran Kertas Target
          </label>
          <select 
            className="select-input" 
            value={config.pageSize || 'A4'} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, pageSize: e.target.value }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="A4">A4 (210 x 297 mm)</option>
            <option value="A3">A3 (297 x 420 mm)</option>
            <option value="Letter">Letter (8.5 x 11 in)</option>
            <option value="Legal">Legal (8.5 x 14 in)</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Orientasi
          </label>
          <select 
            className="select-input" 
            value={config.orientation || 'Auto'} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, orientation: e.target.value }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="Auto">Otomatis (Sesuai Asli)</option>
            <option value="Portrait">Portrait (Tegak)</option>
            <option value="Landscape">Landscape (Mendatar)</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Tambah Margin Putih
          </label>
          <select 
            className="select-input" 
            value={config.margin !== undefined ? config.margin : 0} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, margin: parseInt(e.target.value, 10) }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="0">Tanpa Margin (0px)</option>
            <option value="15">Margin Kecil (15px)</option>
            <option value="30">Margin Normal (30px)</option>
            <option value="60">Margin Besar (60px)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)' }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><RotateCw size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? 'Memproses...' : 'Ubah Ukuran'}</span>
        </button>
      </div>
    </div>
  );
};
