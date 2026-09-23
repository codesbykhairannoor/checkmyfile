import React from 'react';
import { Type, Download, Settings2, Grid, Repeat } from 'lucide-react';

export type WatermarkPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface WatermarkConfig {
  type: 'text' | 'image';
  text: string;
  imageUrl: string;
  opacity: number;
  color: string;
  scale: number;
  rotation: number;
  position?: WatermarkPosition;
  isRepeating?: boolean;
}

interface WatermarkPdfEditorProps {
  tUi?: Record<string, string>;
  config: WatermarkConfig;
  setConfig: React.Dispatch<React.SetStateAction<WatermarkConfig>>;
  onApply: () => void;
  isProcessing: boolean;
}

export const WatermarkPdfEditor: React.FC<WatermarkPdfEditorProps> = ({
  tUi = {},
  config,
  setConfig,
  onApply,
  isProcessing
}) => {
  const currentPos = config.position || 'center';
  const isRepeating = !!config.isRepeating;

  const positions: { id: WatermarkPosition; labelKey: string; defaultLabel: string }[] = [
    { id: 'top-left', labelKey: 'top_left', defaultLabel: 'Top Left' },
    { id: 'top-center', labelKey: 'top_center', defaultLabel: 'Top Center' },
    { id: 'top-right', labelKey: 'top_right', defaultLabel: 'Top Right' },
    { id: 'center-left', labelKey: 'center_left', defaultLabel: 'Center Left' },
    { id: 'center', labelKey: 'center', defaultLabel: 'Center' },
    { id: 'center-right', labelKey: 'center_right', defaultLabel: 'Center Right' },
    { id: 'bottom-left', labelKey: 'bottom_left', defaultLabel: 'Bottom Left' },
    { id: 'bottom-center', labelKey: 'bottom_center', defaultLabel: 'Bottom Center' },
    { id: 'bottom-right', labelKey: 'bottom_right', defaultLabel: 'Bottom Right' }
  ];

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Type size={18} className="text-brand-primary" />
          <span>{tUi['interactive_watermark'] || tUi['Interactive Watermark'] || 'Interactive Watermark'}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {tUi['watermark_desc'] || tUi['Tambahkan teks watermark kustom. Perubahan akan terlihat langsung pada layar pratinjau.'] || 'Add custom watermark text. Changes will be visible immediately on the preview canvas.'}
        </p>
      </div>

      {/* Text vs Image Tab */}
      <div style={{ display: 'flex', gap: 10, background: 'var(--bg-input)', padding: 4, borderRadius: 12 }}>
        <button
          type="button"
          onClick={() => setConfig({ ...config, type: 'text' })}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700,
            background: config.type === 'text' ? 'var(--brand-gradient)' : 'transparent',
            color: config.type === 'text' ? '#fff' : 'var(--text-muted)',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          {tUi['watermark_text_tab'] || tUi['Teks'] || 'Text'}
        </button>
        <button
          type="button"
          onClick={() => setConfig({ ...config, type: 'image' })}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700,
            background: config.type === 'image' ? 'var(--brand-gradient)' : 'transparent',
            color: config.type === 'image' ? '#fff' : 'var(--text-muted)',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          {tUi['watermark_image_tab'] || tUi['Logo (Gambar)'] || 'Logo (Image)'}
        </button>
      </div>

      {config.type === 'text' ? (
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            {tUi['watermark_text_input'] || tUi['Teks Watermark'] || 'Watermark Text'}
          </label>
          <input
            type="text"
            value={config.text}
            onChange={(e) => setConfig({ ...config, text: e.target.value })}
            placeholder={tUi['watermark_text_placeholder'] || 'e.g. CONFIDENTIAL'}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', fontWeight: 600 }}
          />
        </div>
      ) : (
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            {tUi['upload_watermark_logo'] || tUi['Unggah Logo Watermark'] || 'Upload Watermark Logo'}
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

      {/* Repeat Watermark Toggle (Mosaic / Tile) */}
      <div style={{ background: 'var(--bg-input)', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Repeat size={18} className="text-brand-primary" />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {tUi['watermark_repeat'] || 'Repeat Watermark (Tile Pattern)'}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {tUi['watermark_repeat_desc'] || 'Tile the watermark diagonally across the entire page'}
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isRepeating}
            onChange={(e) => setConfig({ ...config, isRepeating: e.target.checked })}
            style={{ width: 18, height: 18, accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
          />
        </label>
      </div>

      {/* Position 3x3 Grid (Active when not repeating) */}
      <div style={{ opacity: isRepeating ? 0.45 : 1, pointerEvents: isRepeating ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Grid size={15} />
          <span>{tUi['watermark_position'] || 'Watermark Position'}</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {positions.map((p) => {
            const isSelected = !isRepeating && currentPos === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setConfig({ ...config, position: p.id })}
                style={{
                  padding: '10px 4px',
                  borderRadius: 10,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  background: isSelected ? 'var(--brand-gradient)' : 'var(--bg-input)',
                  color: isSelected ? '#fff' : 'var(--text-main)',
                  border: isSelected ? 'none' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isSelected ? '#fff' : 'var(--text-muted)',
                  opacity: isSelected ? 1 : 0.6
                }} />
                <span style={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                  {tUi[p.labelKey] || p.defaultLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {/* Color (Only for Text) */}
        {config.type === 'text' && (
          <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 120 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
              {tUi['watermark_color'] || tUi['Warna'] || 'Color'}
            </label>
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
            {tUi['watermark_transparency'] || tUi['Transparansi'] || 'Transparency'} ({(config.opacity * 100).toFixed(0)}%)
          </label>
          <input
            type="range"
            min="0.05"
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
            {tUi['watermark_scale'] || tUi['Ukuran'] || 'Size / Scale'} ({(config.scale * 100).toFixed(0)}%)
          </label>
          <input
            type="range"
            min="0.3"
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
            {tUi['watermark_rotation'] || tUi['Rotasi'] || 'Rotation'} ({config.rotation}°)
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

      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
        {((config.type === 'text' && !config.text.trim()) || (config.type === 'image' && !config.imageUrl)) && (
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: 8, textAlign: 'center', marginBottom: 12, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            {config.type === 'text'
              ? (tUi['watermark_text_empty_err'] || tUi['Harap masukkan teks watermark.'] || 'Please enter watermark text.')
              : (tUi['watermark_img_empty_err'] || tUi['Harap unggah gambar watermark.'] || 'Please upload watermark image.')
            }
          </div>
        )}
        <button
          onClick={onApply}
          disabled={isProcessing || (config.type === 'text' ? !config.text.trim() : !config.imageUrl)}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: (isProcessing || (config.type === 'text' ? !config.text.trim() : !config.imageUrl)) ? 0.5 : 1,
            cursor: (isProcessing || (config.type === 'text' ? !config.text.trim() : !config.imageUrl)) ? 'not-allowed' : 'pointer',
            boxShadow: (isProcessing || (config.type === 'text' ? !config.text.trim() : !config.imageUrl)) ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.25)'
          }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? (tUi['saving_btn'] || tUi['Menyimpan...'] || 'Saving...') : (tUi['apply_watermark'] || tUi['Terapkan Watermark'] || 'Apply Watermark')}</span>
        </button>
      </div>
    </div>
  );
};
