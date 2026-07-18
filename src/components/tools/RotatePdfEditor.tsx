import React from 'react';
import { RotateCw, RotateCcw, CheckCircle2, Download } from 'lucide-react';

interface RotatePdfEditorProps {
  rotation: number;
  setRotation: (r: number) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const RotatePdfEditor: React.FC<RotatePdfEditorProps> = ({
  rotation,
  setRotation,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <RotateCw size={18} className="text-brand-primary" />
          <span>Interactive Rotate</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Putar orientasi dokumen Anda. Perubahan akan terlihat langsung pada layar pratinjau.
        </p>
      </div>

      {/* Quick Rotation Buttons */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
          Rotasi Cepat
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={() => setRotation((rotation + 270) % 360)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, cursor: 'pointer' }}
          >
            <RotateCcw size={20} style={{ color: 'var(--text-main)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>-90° (Kiri)</span>
          </button>
          <button
            onClick={() => setRotation((rotation + 90) % 360)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, cursor: 'pointer' }}
          >
            <RotateCw size={20} style={{ color: 'var(--text-main)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>+90° (Kanan)</span>
          </button>
          <button
            onClick={() => setRotation(180)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, cursor: 'pointer' }}
          >
            <RotateCw size={20} style={{ color: 'var(--text-main)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>180° (Putar Balik)</span>
          </button>
          <button
            onClick={() => setRotation(0)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, cursor: 'pointer' }}
          >
            <CheckCircle2 size={20} style={{ color: 'var(--text-main)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>0° (Normal)</span>
          </button>
        </div>
      </div>

      {/* Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)' }}>Derajat Khusus</label>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'monospace' }}>{rotation}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="359"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
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
          <span>{isProcessing ? 'Menyimpan...' : 'Terapkan Rotasi'}</span>
        </button>
      </div>
    </div>
  );
};
