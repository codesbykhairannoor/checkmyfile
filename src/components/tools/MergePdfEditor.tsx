import React from 'react';
import { Layers, Download, Settings2 } from 'lucide-react';
import { MergeWorkspace } from './MergeWorkspace';

interface MergePdfEditorProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onApply: () => void;
  isProcessing: boolean;
}

export const MergePdfEditor: React.FC<MergePdfEditorProps> = ({
  files,
  setFiles,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280, minHeight: 0 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={18} className="text-brand-primary" />
          <span>Interactive Merge</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Atur urutan file PDF di bawah dengan menggeser (Drag & Drop) kartu dokumen.
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 4 }}>
        <MergeWorkspace files={files} setFiles={setFiles} />
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        {files.length < 2 && (
          <div style={{ fontSize: '0.8rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 8, textAlign: 'center', marginBottom: 12 }}>
            Minimal butuh 2 file untuk digabungkan.
          </div>
        )}
        <button
          onClick={onApply}
          disabled={isProcessing || files.length < 2}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)' }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? 'Menggabungkan...' : 'Gabungkan Sekarang'}</span>
        </button>
      </div>
    </div>
  );
};
