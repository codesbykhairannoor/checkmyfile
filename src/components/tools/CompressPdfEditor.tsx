import React from 'react';
import { Minimize2, Download, Settings2, Zap, Shield, Image as ImageIcon } from 'lucide-react';

export type CompressQuality = 'extreme' | 'balanced' | 'high';

interface CompressPdfEditorProps {
  quality: CompressQuality;
  setQuality: (quality: CompressQuality) => void;
  onApply: () => void;
  isProcessing: boolean;
  originalSizeKB?: number;
}

export const CompressPdfEditor: React.FC<CompressPdfEditorProps> = ({
  quality,
  setQuality,
  onApply,
  isProcessing,
  originalSizeKB = 0
}) => {
  const getEstimatedSize = () => {
    if (!originalSizeKB) return 'TBD';
    if (quality === 'extreme') return `${Math.max(10, Math.round(originalSizeKB * 0.3))} KB`;
    if (quality === 'balanced') return `${Math.max(20, Math.round(originalSizeKB * 0.55))} KB`;
    return `${Math.max(30, Math.round(originalSizeKB * 0.8))} KB`;
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Minimize2 size={18} className="text-brand-primary" />
          <span>Interactive Compress</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Pilih tingkat kompresi. Live Preview akan mensimulasikan penurunan kualitas gambar.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={() => setQuality('extreme')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px', 
            background: quality === 'extreme' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
            border: quality === 'extreme' ? 'none' : '1px solid var(--border-color)', 
            borderRadius: 12, cursor: 'pointer', textAlign: 'left',
            color: quality === 'extreme' ? '#fff' : 'var(--text-main)'
          }}
        >
          <Zap size={24} color={quality === 'extreme' ? '#fff' : '#ef4444'} />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Extreme (Kecil)</div>
            <div style={{ fontSize: '0.75rem', color: quality === 'extreme' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>Kualitas terendah, ukuran terkecil</div>
          </div>
        </button>

        <button
          onClick={() => setQuality('balanced')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px', 
            background: quality === 'balanced' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
            border: quality === 'balanced' ? 'none' : '1px solid var(--border-color)', 
            borderRadius: 12, cursor: 'pointer', textAlign: 'left',
            color: quality === 'balanced' ? '#fff' : 'var(--text-main)'
          }}
        >
          <Shield size={24} color={quality === 'balanced' ? '#fff' : '#3b82f6'} />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Balanced (Rekomendasi)</div>
            <div style={{ fontSize: '0.75rem', color: quality === 'balanced' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>Kualitas bagus, ukuran optimal</div>
          </div>
        </button>

        <button
          onClick={() => setQuality('high')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px', 
            background: quality === 'high' ? 'var(--brand-gradient)' : 'var(--bg-input)', 
            border: quality === 'high' ? 'none' : '1px solid var(--border-color)', 
            borderRadius: 12, cursor: 'pointer', textAlign: 'left',
            color: quality === 'high' ? '#fff' : 'var(--text-main)'
          }}
        >
          <ImageIcon size={24} color={quality === 'high' ? '#fff' : '#10b981'} />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>High (Terbaik)</div>
            <div style={{ fontSize: '0.75rem', color: quality === 'high' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>Kualitas tinggi, ukuran lumayan besar</div>
          </div>
        </button>
      </div>

      {originalSizeKB > 0 && (
        <div style={{ background: 'var(--bg-input)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ukuran Asli:</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{originalSizeKB} KB</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimasi Hasil:</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-primary)' }}>~{getEstimatedSize()}</div>
          </div>
        </div>
      )}

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
          <span>{isProcessing ? 'Mengompres...' : 'Kompres Sekarang'}</span>
        </button>
      </div>
    </div>
  );
};
