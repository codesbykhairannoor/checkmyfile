import React from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { Download, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';

interface ProgressBarProps {
  currentLang: string;
  isProcessing: boolean;
  progress: number;
  statusText?: string;
  isCompleted: boolean;
  onDownload: () => void;
  onReset: () => void;
  downloadLabel?: string;
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
}) => {
  const t = getUiTranslations(currentLang);

  if (!isProcessing && !isCompleted) return null;

  return (
    <div
      className="glass-panel"
      style={{
        padding: 28,
        margin: '28px 0',
        textAlign: 'center',
        background: isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(99, 102, 241, 0.05)',
        border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <CheckCircle2 size={32} className="text-emerald-400" />
            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
              Conversion Completed Locally!
            </h4>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
            Your document was processed safely inside your browser memory without being uploaded anywhere.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={onDownload} className="btn-primary" style={{ background: '#10b981' }}>
              <Download size={18} />
              <span>{downloadLabel || t.downloadBtn}</span>
            </button>

            <button onClick={onReset} className="btn-secondary">
              <RefreshCw size={18} />
              <span>{t.resetBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
