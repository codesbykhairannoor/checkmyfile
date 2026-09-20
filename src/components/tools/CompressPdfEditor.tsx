import React, { useState } from 'react';
import { Minimize2, Download, Settings2, Zap, Shield, Image as ImageIcon, Sliders } from 'lucide-react';

export type CompressQuality = 'extreme' | 'balanced' | 'high' | 'custom';

interface CompressPdfEditorProps {
  tUi?: Record<string, string>;
  quality: CompressQuality;
  setQuality: (quality: CompressQuality) => void;
  percent?: number;
  setPercent?: (percent: number) => void;
  onApply: () => void;
  isProcessing: boolean;
  originalSizeKB?: number;
}

export const CompressPdfEditor: React.FC<CompressPdfEditorProps> = ({
  tUi = {},
  quality,
  setQuality,
  percent = 50,
  setPercent,
  onApply,
  isProcessing,
  originalSizeKB = 0
}) => {
  const [mode, setMode] = useState<'preset' | 'custom'>(quality === 'custom' ? 'custom' : 'preset');

  const handleModeChange = (newMode: 'preset' | 'custom') => {
    setMode(newMode);
    if (newMode === 'custom') {
      setQuality('custom');
    } else {
      setQuality('balanced');
    }
  };

  const getEstimatedSize = () => {
    if (!originalSizeKB) return 'TBD';
    if (mode === 'custom') {
      const reduction = (percent / 100) * 0.75; // up to ~75% reduction
      const estimated = Math.max(10, Math.round(originalSizeKB * (1 - reduction)));
      return `${estimated} KB (-${Math.round(reduction * 100)}%)`;
    }
    if (quality === 'extreme') return `${Math.max(10, Math.round(originalSizeKB * 0.3))} KB (-70%)`;
    if (quality === 'balanced') return `${Math.max(20, Math.round(originalSizeKB * 0.55))} KB (-45%)`;
    return `${Math.max(30, Math.round(originalSizeKB * 0.8))} KB (-20%)`;
  };

  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Minimize2 size={18} className="text-brand-primary" />
          <span>{t("interactive_compress", "Interactive Compress")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {t("compress_desc", "Choose compression level or adjust percentage slider. Live preview will simulate result.")}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg-input)', padding: 4, borderRadius: 12, border: '1px solid var(--border-color)', gap: 4 }}>
        <button
          type="button"
          onClick={() => handleModeChange('preset')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: '0.82rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: mode === 'preset' ? 'var(--brand-primary)' : 'transparent',
            color: mode === 'preset' ? '#fff' : 'var(--text-muted)'
          }}
        >
          {t("preset_mode", "Preset Mode")}
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('custom')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: '0.82rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: mode === 'custom' ? 'var(--brand-primary)' : 'transparent',
            color: mode === 'custom' ? '#fff' : 'var(--text-muted)'
          }}
        >
          <Sliders size={14} />
          <span>{t("custom_slider_mode", "Custom Slider (%)")}</span>
        </button>
      </div>

      {/* Mode 1: Preset Options */}
      {mode === 'preset' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            onClick={() => setQuality('extreme')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', 
              background: quality === 'extreme' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: quality === 'extreme' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              color: quality === 'extreme' ? '#fff' : 'var(--text-main)',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={22} color={quality === 'extreme' ? '#fff' : '#ef4444'} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{t("compress_extreme_title", "Extreme (Smallest)")}</div>
              <div style={{ fontSize: '0.75rem', color: quality === 'extreme' ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>{t("compress_extreme_desc", "Lowest quality, smallest size")}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setQuality('balanced')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', 
              background: quality === 'balanced' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: quality === 'balanced' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              color: quality === 'balanced' ? '#fff' : 'var(--text-main)',
              transition: 'all 0.2s ease'
            }}
          >
            <Shield size={22} color={quality === 'balanced' ? '#fff' : '#3b82f6'} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{t("compress_balanced_title", "Balanced (Recommended)")}</div>
              <div style={{ fontSize: '0.75rem', color: quality === 'balanced' ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>{t("compress_balanced_desc", "Good quality, optimal size")}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setQuality('high')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', 
              background: quality === 'high' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: quality === 'high' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              color: quality === 'high' ? '#fff' : 'var(--text-main)',
              transition: 'all 0.2s ease'
            }}
          >
            <ImageIcon size={22} color={quality === 'high' ? '#fff' : '#10b981'} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{t("compress_high_title", "High (Best Quality)")}</div>
              <div style={{ fontSize: '0.75rem', color: quality === 'high' ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>{t("compress_high_desc", "High quality, moderate size")}</div>
            </div>
          </button>
        </div>
      )}

      {/* Mode 2: Custom Percentage Slider */}
      {mode === 'custom' && (
        <div style={{ background: 'var(--bg-input)', padding: 18, borderRadius: 14, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t("compress_slider_label", "Target Compression Level")}
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--brand-primary)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              {percent}%
            </span>
          </div>

          <input
            type="range"
            min={10}
            max={95}
            step={5}
            value={percent}
            onChange={(e) => setPercent && setPercent(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--brand-primary)',
              cursor: 'pointer',
              height: 6
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>10% (High Quality)</span>
            <span>50% (Balanced)</span>
            <span>95% (Smallest)</span>
          </div>
        </div>
      )}

      {/* Size Estimate Box */}
      {originalSizeKB > 0 && (
        <div style={{ background: 'var(--bg-input)', padding: 14, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t("original_size", "Original Size:")}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{originalSizeKB} KB</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t("estimated_result", "Estimated Result:")}</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--brand-primary)' }}>~{getEstimatedSize()}</div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)', borderRadius: 12 }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? t("compressing_btn", "Compressing...") : t("compress_now", "Compress Now")}</span>
        </button>
      </div>
    </div>
  );
};
