import React from 'react';
import { Hash, Download, Settings2, AlignCenter, AlignRight } from 'lucide-react';

export type PageNumberPosition = 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right';

interface PageNumbersPdfEditorProps {
  config: any;
  setConfig: (config: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const PageNumbersPdfEditor: React.FC<PageNumbersPdfEditorProps> = ({
  config,
  setConfig,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Hash size={18} className="text-brand-primary" />
          <span>Interactive Page Numbers</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Atur posisi penomoran halaman. Angka akan muncul secara *real-time* di kanvas.
        </p>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
          Pilih Posisi Angka
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button
            onClick={() => setConfig({ ...config, position: 'top-center' })}
            style={{ 
              flex: '1 1 calc(50% - 10px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: config.position === 'top-center' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: config.position === 'top-center' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: config.position === 'top-center' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignCenter size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: config.position === 'top-center' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>Top Center</span>
          </button>

          <button
            onClick={() => setConfig({ ...config, position: 'top-right' })}
            style={{ 
              flex: '1 1 calc(50% - 10px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: config.position === 'top-right' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: config.position === 'top-right' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: config.position === 'top-right' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignRight size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: config.position === 'top-right' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>Top Right</span>
          </button>

          <button
            onClick={() => setConfig({ ...config, position: 'bottom-center' })}
            style={{ 
              flex: '1 1 calc(50% - 10px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: config.position === 'bottom-center' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: config.position === 'bottom-center' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: config.position === 'bottom-center' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignCenter size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: config.position === 'bottom-center' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>Bottom Center</span>
          </button>

          <button
            onClick={() => setConfig({ ...config, position: 'bottom-right' })}
            style={{ 
              flex: '1 1 calc(50% - 10px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: config.position === 'bottom-right' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: config.position === 'bottom-right' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: config.position === 'bottom-right' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignRight size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: config.position === 'bottom-right' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>Bottom Right</span>
          </button>
        </div>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
          Gaya Penomoran
        </label>
        <select
          value={config.numberStyle || 'arabic'}
          onChange={(e) => setConfig({ ...config, numberStyle: e.target.value })}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', marginBottom: 16 }}
        >
          <option value="arabic">1, 2, 3 (Arabic)</option>
          <option value="roman_upper">I, II, III (Roman Upper)</option>
          <option value="roman_lower">i, ii, iii (Roman Lower)</option>
          <option value="alpha_upper">A, B, C (Alpha Upper)</option>
          <option value="alpha_lower">a, b, c (Alpha Lower)</option>
        </select>

        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
          Format Teks
        </label>
        <select
          value={config.format}
          onChange={(e) => setConfig({ ...config, format: e.target.value })}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
        >
          <option value="{n}">{`{n}`}</option>
          <option value="{n} / {p}">{`{n} / {p}`}</option>
          <option value="Hal {n}">{`Hal {n}`}</option>
          <option value="Halaman {n} dari {p}">{`Halaman {n} dari {p}`}</option>
          <option value="- {n} -">{`- {n} -`}</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
            Mulai di Halaman
          </label>
          <input
            type="number"
            min="1"
            value={config.startPage}
            onChange={(e) => setConfig({ ...config, startPage: parseInt(e.target.value) || 1 })}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
            Angka Awal
          </label>
          <input
            type="number"
            min="1"
            value={config.startNumber}
            onChange={(e) => setConfig({ ...config, startNumber: parseInt(e.target.value) || 1 })}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
          />
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
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? 'Menyimpan...' : 'Terapkan Penomoran'}</span>
        </button>
      </div>
    </div>
  );
};
