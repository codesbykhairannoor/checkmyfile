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
  config, setConfig, onApply, isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Maximize size={18} className="text-brand-primary" />
          <span>{t("resize_pdf", "Resize PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("resize_desc", "Change PDF page dimensions and paper size without cropping content.")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {t("target_page_size", "Target Paper Size")}
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
            {t("orientation", "Orientation")}
          </label>
          <select 
            className="select-input" 
            value={config.orientation || 'Auto'} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, orientation: e.target.value }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="Auto">{t("auto_fit", "Auto (Keep Original)")}</option>
            <option value="Portrait">{t("portrait", "Portrait (Vertical)")}</option>
            <option value="Landscape">{t("landscape", "Landscape (Horizontal)")}</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><RotateCw size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? t("resizing_btn", "Resizing...") : t("apply_resize", "Resize PDF Now")}</span>
        </button>
      </div>
    </div>
  );
};
