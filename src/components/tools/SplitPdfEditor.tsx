import React from 'react';
import { Scissors, Download, Settings2, Info } from 'lucide-react';

interface SplitPdfEditorProps {
  tUi?: Record<string, string>;
  splitRange: string;
  setSplitRange: (range: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const SplitPdfEditor: React.FC<SplitPdfEditorProps> = ({
  tUi = {},
  splitRange,
  setSplitRange,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Scissors size={18} className="text-brand-primary" />
          <span>{tUi['interactive_split'] || tUi['Interactive Split'] || 'Interactive Split'}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {tUi['split_desc'] || tUi['Ketik rentang halaman yang ingin Anda potong/ekstrak.'] || 'Enter the page range you want to split or extract.'}
        </p>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          {tUi['page_range_label'] || tUi['Rentang Halaman (Contoh: 1-3, 5, 8)'] || 'Page Range (Example: 1-3, 5, 8)'}
        </label>
        <input
          type="text"
          value={splitRange}
          onChange={(e) => setSplitRange(e.target.value)}
          placeholder={tUi['e.g. 1-3, 5, 8'] || 'e.g. 1-3, 5, 8'}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        />
        
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Info size={16} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: '#60a5fa', margin: 0, lineHeight: 1.4 }}>
            {tUi['split_range_hint'] || tUi['Halaman yang masuk dalam rentang ini akan ditandai dengan label "EXTRACT" berwarna hijau pada Live Preview di sebelah kiri.'] || 'Pages in this range will be marked with a green "EXTRACT" label in the Live Preview on the left.'}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        {!splitRange.trim() && (
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: 8, textAlign: 'center', marginBottom: 12, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            {tUi['split_range_empty_err'] || tUi['Harap masukkan rentang halaman (contoh: 1-3, 5).'] || 'Please enter the page range (e.g. 1-3, 5).'}
          </div>
        )}
        <button
          onClick={onApply}
          disabled={isProcessing || !splitRange.trim()}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: (!splitRange.trim() || isProcessing) ? 0.5 : 1,
            cursor: (!splitRange.trim() || isProcessing) ? 'not-allowed' : 'pointer',
            boxShadow: (!splitRange.trim() || isProcessing) ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.25)'
          }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? (tUi['splitting_btn'] || tUi['saving_btn'] || 'Splitting...') : (tUi['split_now'] || tUi['Potong Sekarang'] || 'Split Now')}</span>
        </button>
      </div>
    </div>
  );
};
