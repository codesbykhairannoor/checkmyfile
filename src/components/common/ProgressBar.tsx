import React from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

interface ProgressBarProps {
  currentLang: string;
  isProcessing: boolean;
  progress: number;
  statusText?: string;
  isCompleted: boolean;
  onDownload: (filename?: string) => void;
  onReset: () => void;
  downloadLabel?: string;
  style?: React.CSSProperties;
  originalFilename?: string;
  originalSize?: number;
  compressedSize?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentLang,
  isProcessing,
  progress,
  statusText,
  isCompleted,
  onDownload,
  onReset,
  downloadLabel,
  style,
  originalFilename,
  originalSize,
  compressedSize,
}) => {
  const t = getUiTranslations(currentLang);
  const [filename, setFilename] = React.useState('Checkmyfile');

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownloadClick = () => {
    if (!filename.trim()) {
      alert("⚠️ Nama file tidak boleh kosong! Silakan berikan nama untuk berkas Anda.");
      return;
    }
    
    let ext = '.pdf';
    if (originalFilename && originalFilename.includes('.')) {
      ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
    
    let finalName = filename.trim();
    if (!finalName.toLowerCase().endsWith(ext.toLowerCase())) {
      finalName += ext;
    }
    
    onDownload(finalName);
  };

  if (!isProcessing && !isCompleted) return null;

  return (
    <div
      className="glass-panel"
      style={{
        padding: isCompleted ? '12px 24px' : 28,
        margin: '28px 0',
        textAlign: isCompleted ? 'left' : 'center',
        background: isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(99, 102, 241, 0.05)',
        border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
        ...style,
      }}
    >
      {isProcessing && !isCompleted && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
            <Loader2 size={24} className="text-indigo-400 animate-spin" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {statusText || t.processingText}
            </h4>
          </div>

          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(5, progress))}%` }} />
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Wasm Client-Side Memory Processing — {Math.round(progress)}%
          </div>
        </div>
      )}

      {isCompleted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Masukkan nama file..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
            <button onClick={handleDownloadClick} className="btn-primary" style={{ background: '#10b981', padding: '10px', fontSize: '0.9rem', justifyContent: 'center' }}>
              <Download size={16} />
              <span>{downloadLabel || t.downloadBtn}</span>
            </button>

            <button onClick={onReset} className="btn-secondary" style={{ padding: '10px', fontSize: '0.9rem', justifyContent: 'center' }}>
              <RefreshCw size={16} />
              <span>{t.resetBtn}</span>
            </button>
          </div>
          
          {originalSize !== undefined && compressedSize !== undefined && (
            <div style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: 4, background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: 8, color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span>
                <span style={{ textDecoration: 'line-through', opacity: 0.7, marginRight: 6 }}>{formatSize(originalSize)}</span> 
                ➔ 
                <span style={{ marginLeft: 6 }}>{formatSize(compressedSize)}</span> 
              </span>
              <span style={{ background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: 12, fontSize: '0.75rem' }}>
                -{((1 - compressedSize / originalSize) * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
