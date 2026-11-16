import React from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { authTranslations } from '../../i18n/authTranslations';
import { Download, RefreshCw, Loader2, Crown, Lock } from 'lucide-react';

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
  isPro?: boolean;
  onOpenProModal?: () => void;
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
  isPro = false,
  onOpenProModal,
}) => {
  const t = getUiTranslations(currentLang);
  const tAuth = authTranslations[currentLang] || authTranslations['en'] || {};
  const [filename, setFilename] = React.useState('HandleMyFile');

  React.useEffect(() => {
    if (originalFilename) {
      // Remove extension for the input box
      const lastDot = originalFilename.lastIndexOf('.');
      if (lastDot > -1) {
        setFilename(originalFilename.substring(0, lastDot));
      } else {
        setFilename(originalFilename);
      }
    }
  }, [originalFilename]);

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
        padding: isCompleted ? '16px 24px' : 28,
        margin: '28px 0',
        textAlign: isCompleted ? 'left' : 'center',
        background: isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(225, 29, 72, 0.05)',
        border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(225, 29, 72, 0.25)',
        fontFamily: 'var(--font-main)',
        ...style,
      }}
    >
      {isProcessing && !isCompleted && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
            <Loader2 size={24} style={{ color: 'var(--brand-primary, #e11d48)' }} className="animate-spin" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {statusText || t.processingText}
            </h4>
          </div>

          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(5, progress))}%`, background: 'var(--brand-primary, #e11d48)' }} />
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Wasm Client-Side Memory Processing — {Math.round(progress)}%
          </div>
        </div>
      )}

      {isCompleted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* File Name Header with PRO Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {tAuth.pro_download_filename_label || 'Download File Name:'}
            </span>
            {isPro ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: '0.74rem', fontWeight: 800 }}>
                <Crown size={12} color="#f59e0b" />
                <span>{tAuth.pro_active_badge || 'PRO Active'}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenProModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title={tAuth.pro_custom_filename_desc || 'Upgrade to PRO to customize file name'}
              >
                <Crown size={12} />
                <span>{tAuth.pro_custom_filename_badge || 'PRO: Custom File Name'}</span>
              </button>
            )}
          </div>

          {/* File Name Input Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={filename}
              onChange={(e) => {
                if (isPro) {
                  setFilename(e.target.value);
                } else if (onOpenProModal) {
                  onOpenProModal();
                }
              }}
              onClick={() => {
                if (!isPro && onOpenProModal) {
                  onOpenProModal();
                }
              }}
              readOnly={!isPro}
              placeholder={tAuth.pro_custom_filename_title || 'Enter file name...'}
              style={{
                width: '100%',
                padding: '10px 14px',
                paddingRight: !isPro ? '36px' : '14px',
                borderRadius: 8,
                border: !isPro ? '1px dashed var(--border-color)' : '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: !isPro ? 'pointer' : 'text',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
            {!isPro && (
              <div
                onClick={onOpenProModal}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#f59e0b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={tAuth.pro_custom_filename_title || 'PRO Feature'}
              >
                <Lock size={15} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            <button onClick={handleDownloadClick} className="btn-primary" style={{ flex: '1 1 min-content', padding: '10px', fontSize: '0.9rem', justifyContent: 'center', whiteSpace: 'nowrap', background: 'var(--brand-primary, #e11d48)' }}>
              <Download size={16} />
              <span>{downloadLabel || t.downloadBtn}</span>
            </button>

            <button onClick={onReset} className="btn-secondary" style={{ flex: '1 1 min-content', padding: '10px', fontSize: '0.9rem', justifyContent: 'center', whiteSpace: 'nowrap' }}>
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
