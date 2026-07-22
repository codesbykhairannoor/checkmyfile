import React from 'react';
import { ArrowDownUp, Download, RotateCw } from 'lucide-react';

interface ReversePdfEditorProps {
  onApply: () => void;
  isProcessing: boolean;
}

export const ReversePdfEditor: React.FC<ReversePdfEditorProps> = ({ onApply, isProcessing }) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowDownUp size={18} className="text-brand-primary" />
          <span>Reverse PDF</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Urutan halaman PDF Anda akan dibalik dari belakang ke depan (contoh: dari 1-2-3 menjadi 3-2-1). Tidak ada konfigurasi tambahan yang diperlukan.
        </p>
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
          <span>{isProcessing ? 'Memproses...' : 'Balikkan Urutan'}</span>
        </button>
      </div>
    </div>
  );
};
