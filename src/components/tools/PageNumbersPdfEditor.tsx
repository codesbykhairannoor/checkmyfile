import React from 'react';
import { Hash, Download, Settings2, AlignCenter, AlignRight } from 'lucide-react';

export type PageNumberPosition = 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right';

interface PageNumbersPdfEditorProps {
  position: PageNumberPosition;
  setPosition: (pos: PageNumberPosition) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const PageNumbersPdfEditor: React.FC<PageNumbersPdfEditorProps> = ({
  position,
  setPosition,
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={() => setPosition('top-center')}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: position === 'top-center' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: position === 'top-center' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: position === 'top-center' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignCenter size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: position === 'top-center' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>Top Center</span>
          </button>

          <button
            onClick={() => setPosition('top-right')}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: position === 'top-right' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: position === 'top-right' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: position === 'top-right' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignRight size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: position === 'top-right' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>Top Right</span>
          </button>

          <button
            onClick={() => setPosition('bottom-center')}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: position === 'bottom-center' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: position === 'bottom-center' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: position === 'bottom-center' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignCenter size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: position === 'bottom-center' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>Bottom Center</span>
          </button>

          <button
            onClick={() => setPosition('bottom-right')}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', 
              background: position === 'bottom-right' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
              border: position === 'bottom-right' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: 12, cursor: 'pointer',
              color: position === 'bottom-right' ? '#fff' : 'var(--text-main)'
            }}
          >
            <AlignRight size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: position === 'bottom-right' ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>Bottom Right</span>
          </button>
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
