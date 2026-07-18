import React from 'react';
import { Type, Download, Settings2 } from 'lucide-react';

interface WatermarkConfig {
  text: string;
  opacity: number;
  color: string;
  scale: number;
  rotation: number;
}

interface WatermarkPdfEditorProps {
  config: WatermarkConfig;
  setConfig: React.Dispatch<React.SetStateAction<WatermarkConfig>>;
  onApply: () => void;
  isProcessing: boolean;
}

export const WatermarkPdfEditor: React.FC<WatermarkPdfEditorProps> = ({
  config,
  setConfig,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Type size={18} className="text-brand-primary" />
          <span>Interactive Watermark</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Tambahkan teks watermark kustom. Perubahan akan terlihat langsung pada layar pratinjau.
        </p>
      </div>

      {/* Text Input */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          Teks Watermark
        </label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => setConfig({ ...config, text: e.target.value })}
          placeholder="e.g. CONFIDENTIAL"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Color */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>Warna</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: 12 }}>
            <input
              type="color"
              value={config.color}
              onChange={(e) => setConfig({ ...config, color: e.target.value })}
              style={{ width: 24, height: 24, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-muted)' }}>{config.color.toUpperCase()}</span>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
            Transparansi ({(config.opacity * 100).toFixed(0)}%)
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={config.opacity}
            onChange={(e) => setConfig({ ...config, opacity: parseFloat(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer', marginTop: 6 }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Scale */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
            Ukuran ({(config.scale * 100).toFixed(0)}%)
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={config.scale}
            onChange={(e) => setConfig({ ...config, scale: parseFloat(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer', marginTop: 6 }}
          />
        </div>

        {/* Rotation */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
            Rotasi ({config.rotation}°)
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={config.rotation}
            onChange={(e) => setConfig({ ...config, rotation: parseInt(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer', marginTop: 6 }}
          />
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !config.text.trim()}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)' }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? 'Menyimpan...' : 'Terapkan Watermark'}</span>
        </button>
      </div>
    </div>
  );
};
