import React, { useState } from 'react';
import { Minimize2, Download, Settings2, Zap, Shield, Image as ImageIcon, Sliders } from 'lucide-react';

export type CompressQuality = 'extreme' | 'balanced' | 'high' | 'custom' | 'target';

interface CompressPdfEditorProps {
  tUi?: Record<string, string>;
  quality: CompressQuality;
  setQuality: (quality: CompressQuality) => void;
  percent?: number;
  setPercent?: (percent: number) => void;
  targetSizeKB?: number;
  setTargetSizeKB?: (size: number) => void;
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
  targetSizeKB = 200,
  setTargetSizeKB,
  onApply,
  isProcessing,
  originalSizeKB = 0
}) => {
  const [mode, setMode] = useState<'preset' | 'custom' | 'target'>(
    quality === 'target' ? 'target' : quality === 'custom' ? 'custom' : 'preset'
  );

  const handleModeChange = (newMode: 'preset' | 'custom' | 'target') => {
    setMode(newMode);
    if (newMode === 'custom') {
      setQuality('custom');
    } else if (newMode === 'target') {
      setQuality('target');
      if (!targetSizeKB && setTargetSizeKB) setTargetSizeKB(200);
    } else {
      setQuality('balanced');
    }
  };

  const getEstimatedSize = () => {
    if (!originalSizeKB) return 'TBD';
    if (mode === 'target') {
      const target = targetSizeKB || 200;
      const reduction = Math.max(0, Math.round(((originalSizeKB - target) / originalSizeKB) * 100));
      return `Target: ≤ ${target} KB (-${reduction}%)`;
    }
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
          {t("compress_desc", "Choose compression level, set percentage slider, or enter target file size.")}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: 'var(--bg-input)', padding: 4, borderRadius: 12, border: '1px solid var(--border-color)', gap: 4 }}>
        <button
          type="button"
          onClick={() => handleModeChange('preset')}
          style={{
            padding: '7px 8px',
            borderRadius: 8,
            fontSize: '0.76rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            background: mode === 'preset' ? 'var(--brand-primary)' : 'transparent',
            color: mode === 'preset' ? '#fff' : 'var(--text-muted)'
          }}
        >
          {t("preset_mode", "Presets")}
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('custom')}
          style={{
            padding: '7px 8px',
            borderRadius: 8,
            fontSize: '0.76rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            background: mode === 'custom' ? 'var(--brand-primary)' : 'transparent',
            color: mode === 'custom' ? '#fff' : 'var(--text-muted)'
          }}
        >
          {t("custom_slider_mode", "Slider (%)")}
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('target')}
          style={{
            padding: '7px 8px',
            borderRadius: 8,
            fontSize: '0.76rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            background: mode === 'target' ? 'var(--brand-primary)' : 'transparent',
            color: mode === 'target' ? '#fff' : 'var(--text-muted)'
          }}
        >
          🎯 {t("target_kb_mode", "Target (KB)")}
        </button>
      </div>

      {/* Mode 3: Target Size (KB) Precision Optimizer */}
      {mode === 'target' && (
        <div style={{ background: 'var(--bg-input)', padding: 18, borderRadius: 14, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                {t("target_size_label", "Max File Size Limit (Target)")}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {t("target_size_sub", "Compresses precisely below this limit for strict portal uploads.")}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-card)', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
              <input
                type="number"
                min={20}
                max={50000}
                value={targetSizeKB || 200}
                onChange={(e) => setTargetSizeKB?.(Math.max(10, parseInt(e.target.value) || 200))}
                style={{
                  width: 60,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--brand-primary)',
                  fontWeight: 900,
                  fontSize: '1rem',
                  textAlign: 'right',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>KB</span>
            </div>
          </div>

          {/* Quick Target Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {t("target_presets_label", "Common Size Standards:")}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                { labelKey: 'preset_target_200', defaultLabel: 'Strict Web Portals', size: 200, badge: '200 KB' },
                { labelKey: 'preset_target_300', defaultLabel: 'Government / ID Forms', size: 300, badge: '300 KB' },
                { labelKey: 'preset_target_500', defaultLabel: 'Job & College Applications', size: 500, badge: '500 KB' },
                { labelKey: 'preset_target_1000', defaultLabel: 'Email Attachment (1 MB)', size: 1000, badge: '1 MB' },
              ].map((chip) => (
                <button
                  key={chip.size}
                  type="button"
                  onClick={() => setTargetSizeKB?.(chip.size)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: targetSizeKB === chip.size ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                    background: targetSizeKB === chip.size ? 'rgba(225, 29, 72, 0.08)' : 'var(--bg-card)',
                    color: targetSizeKB === chip.size ? 'var(--brand-primary)' : 'var(--text-main)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{chip.badge}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    {t(chip.labelKey, chip.defaultLabel)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
            <span>10% ({t("compress_high_title", "High Quality")})</span>
            <span>50% ({t("compress_balanced_title", "Balanced")})</span>
            <span>95% ({t("compress_extreme_title", "Smallest")})</span>
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
