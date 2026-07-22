import React from 'react';
import { Type, Download, Settings2 } from 'lucide-react';

interface WatermarkConfig {
  type: 'text' | 'image';
  text: string;
  imageUrl: string;
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

      <div style={{ display: 'flex', gap: 12, background: 'var(--bg-input)', padding: 4, borderRadius: 12 }}>
        <button
          onClick={() => setConfig({ ...config, type: 'text' })}
          style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, background: config.type === 'text' ? 'var(--brand-gradient)' : 'transparent', color: config.type === 'text' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
        >
          Teks
        </button>
        <button
          onClick={() => setConfig({ ...config, type: 'image' })}
          style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, background: config.type === 'image' ? 'var(--brand-gradient)' : 'transparent', color: config.type === 'image' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
        >
          Logo (Gambar)
        </button>
      </div>

      {config.type === 'text' ? (
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            Teks Watermark
          </label>
          <input
            type="text"
            value={config.text}
            onChange={(e) => setConfig({ ...config, text: e.target.value })}
            placeholder="e.g. CONFIDENTIAL"
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', fontWeight: 600 }}
          />
        </div>
      ) : (
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            Unggah Logo Watermark
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  if (ev.target?.result) {
                    setConfig({ ...config, imageUrl: ev.target.result as string });
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.85rem' }}
          />
          {config.imageUrl && (
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <img src={config.imageUrl} alt="Watermark Logo" style={{ maxWidth: '100%', maxHeight: 80, objectFit: 'contain', borderRadius: 8, background: 'rgba(0,0,0,0.05)' }} />
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {/* Color (Only for Text) */}
        {config.type === 'text' && (
          <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 120 }}>
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
        )}

        {/* Opacity */}
        <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 120 }}>
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {/* Scale */}
        <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 120 }}>
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
        <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 120 }}>
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
