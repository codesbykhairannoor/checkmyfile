import React from 'react';
import { Crop, Settings } from 'lucide-react';

interface CropPdfEditorProps {
  tUi?: Record<string, string>;
  cropConfig: { marginTop: number; marginBottom: number; marginLeft: number; marginRight: number };
  setCropConfig: (config: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const CropPdfEditor: React.FC<CropPdfEditorProps> = ({
  tUi = {},
  cropConfig,
  setCropConfig,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{t("crop_pdf", "Crop PDF")}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {t("crop_desc", "Trim white margins around document pages visually.")}
        </p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={16} /> {t("crop_pdf", "Margin Settings (%)")}
          </h3>

          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t("margin_top", "Top Margin")}</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginTop}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginTop} onChange={(e) => handleChange('marginTop', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t("margin_bottom", "Bottom Margin")}</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginBottom}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginBottom} onChange={(e) => handleChange('marginBottom', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t("margin_left", "Left Margin")}</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginLeft}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginLeft} onChange={(e) => handleChange('marginLeft', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t("margin_right", "Right Margin")}</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginRight}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginRight} onChange={(e) => handleChange('marginRight', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || (cropConfig.marginTop === 0 && cropConfig.marginBottom === 0 && cropConfig.marginLeft === 0 && cropConfig.marginRight === 0)}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 }}
        >
          {isProcessing ? (
            <span className="spinner" style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <><Crop size={20} />{t("apply_crop", "Crop PDF Now")}</>
          )}
        </button>
      </div>
    </div>
  );
};
