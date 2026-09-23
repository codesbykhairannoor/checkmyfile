import React from 'react';
import { Hash, Download, Settings2, AlignCenter, AlignRight } from 'lucide-react';

export type PageNumberPosition = 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right';

interface PageNumbersPdfEditorProps {
  tUi?: Record<string, string>;
  config: any;
  setConfig: (config: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const PageNumbersPdfEditor: React.FC<PageNumbersPdfEditorProps> = ({
  tUi = {},
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
          <span>{tUi['interactive_page_numbers'] || tUi['Interactive Page Numbers'] || 'Interactive Page Numbers'}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {tUi['page_numbers_desc'] || tUi['Atur posisi penomoran halaman. Angka akan muncul secara *real-time* di kanvas.'] || 'Set page numbering position and style. Numbers will appear in real-time on the canvas.'}
        </p>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
          {tUi['select_number_position'] || tUi['Pilih Posisi Angka'] || 'Select Number Position'}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            type="button"
            onClick={() => setConfig({ ...config, position: 'top-center' })}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: config.position === 'top-center' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: config.position === 'top-center' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: config.position === 'top-center' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignCenter size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: config.position === 'top-center' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>
              {tUi['top_center'] || 'Top Center'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setConfig({ ...config, position: 'top-right' })}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: config.position === 'top-right' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: config.position === 'top-right' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: config.position === 'top-right' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignRight size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: config.position === 'top-right' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>
              {tUi['top_right'] || 'Top Right'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setConfig({ ...config, position: 'bottom-center' })}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: config.position === 'bottom-center' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: config.position === 'bottom-center' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: config.position === 'bottom-center' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignCenter size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: config.position === 'bottom-center' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>
              {tUi['bottom_center'] || 'Bottom Center'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setConfig({ ...config, position: 'bottom-right' })}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: config.position === 'bottom-right' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: config.position === 'bottom-right' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: config.position === 'bottom-right' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignRight size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: config.position === 'bottom-right' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>
              {tUi['bottom_right'] || 'Bottom Right'}
            </span>
          </button>
        </div>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
          {tUi['numbering_style'] || tUi['Gaya Penomoran'] || 'Numbering Style'}
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
          {tUi['text_format'] || tUi['Format Teks'] || 'Text Format'}
        </label>
        <select
          value={config.format}
          onChange={(e) => setConfig({ ...config, format: e.target.value })}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
        >
          <option value="{n}">{`{n}`}</option>
          <option value="{n} / {p}">{`{n} / {p}`}</option>
          <option value="Page {n}">{`Page {n}`}</option>
          <option value="Page {n} of {p}">{`Page {n} of {p}`}</option>
          <option value="- {n} -">{`- {n} -`}</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 12 }}>
            {tUi['start_at_page'] || tUi['Mulai di Halaman'] || 'Start at Page'}
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
            {tUi['starting_number'] || tUi['Angka Awal'] || 'Starting Number'}
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
          <span>{isProcessing ? (tUi['numbering_btn'] || tUi['saving_btn'] || 'Applying Numbers...') : (tUi['apply_page_numbers'] || tUi['Terapkan Penomoran'] || 'Apply Page Numbers')}</span>
        </button>
      </div>
    </div>
  );
};
