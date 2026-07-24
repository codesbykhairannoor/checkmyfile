import React from 'react';
import { Maximize, Download, RotateCw } from 'lucide-react';

interface ResizePdfEditorProps {
  tUi?: Record<string, string>;
  config: any;
  setConfig: (c: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ResizePdfEditor: React.FC<ResizePdfEditorProps> = ({
  tUi = {},
 config, setConfig, onApply, isProcessing }) => {
  void tUi;
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Maximize size={18} className="text-brand-primary" />
          <span>{tUi["Resize PDF"] || (tUi["Resize PDF"] || "Resize PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{tUi["Ubah ukuran kertas PDF Anda dan tambahkan margin tanpa memotong konten asli."] || (tUi["Ubah ukuran kertas PDF Anda dan tambahkan margin tanpa memotong konten asli."] || "Ubah ukuran kertas PDF Anda dan tambahkan margin tanpa memotong konten asli.")}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{tUi["Ukuran Kertas Target"] || (tUi["Ukuran Kertas Target"] || "Ukuran Kertas Target")}</label>
          <select 
            className="select-input" 
            value={config.pageSize || 'A4'} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, pageSize: e.target.value }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="A4">{tUi["A4 (210 x 297 mm)"] || (tUi["A4 (210 x 297 mm)"] || "A4 (210 x 297 mm)")}</option>
            <option value="A3">{tUi["A3 (297 x 420 mm)"] || (tUi["A3 (297 x 420 mm)"] || "A3 (297 x 420 mm)")}</option>
            <option value="Letter">{tUi["Letter (8.5 x 11 in)"] || (tUi["Letter (8.5 x 11 in)"] || "Letter (8.5 x 11 in)")}</option>
            <option value="Legal">{tUi["Legal (8.5 x 14 in)"] || (tUi["Legal (8.5 x 14 in)"] || "Legal (8.5 x 14 in)")}</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{tUi["Orientasi"] || "Orientasi"}</label>
          <select 
            className="select-input" 
            value={config.orientation || 'Auto'} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, orientation: e.target.value }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="Auto">{tUi["Otomatis (Sesuai Asli)"] || (tUi["Otomatis (Sesuai Asli)"] || "Otomatis (Sesuai Asli)")}</option>
            <option value="Portrait">{tUi["Portrait (Tegak)"] || (tUi["Portrait (Tegak)"] || "Portrait (Tegak)")}</option>
            <option value="Landscape">{tUi["Landscape (Mendatar)"] || (tUi["Landscape (Mendatar)"] || "Landscape (Mendatar)")}</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{tUi["Tambah Margin Putih"] || (tUi["Tambah Margin Putih"] || "Tambah Margin Putih")}</label>
          <select 
            className="select-input" 
            value={config.margin !== undefined ? config.margin : 0} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, margin: parseInt(e.target.value, 10) }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="0">{tUi["Tanpa Margin (0px)"] || (tUi["Tanpa Margin (0px)"] || "Tanpa Margin (0px)")}</option>
            <option value="15">{tUi["Margin Kecil (15px)"] || (tUi["Margin Kecil (15px)"] || "Margin Kecil (15px)")}</option>
            <option value="30">{tUi["Margin Normal (30px)"] || (tUi["Margin Normal (30px)"] || "Margin Normal (30px)")}</option>
            <option value="60">{tUi["Margin Besar (60px)"] || (tUi["Margin Besar (60px)"] || "Margin Besar (60px)")}</option>
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
          <span>{isProcessing ? (tUi["Memproses..."] || "Memproses...") : (tUi["Ubah Ukuran"] || (tUi["Ubah Ukuran"] || "Ubah Ukuran"))}</span>
        </button>
      </div>
    </div>
  );
};
