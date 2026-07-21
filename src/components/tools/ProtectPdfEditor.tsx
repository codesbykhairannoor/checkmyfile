import React from 'react';
import { Lock, Download, Settings2 } from 'lucide-react';

interface ProtectPdfEditorProps {
  pdfPassword?: string;
  setPdfPassword: (pw: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ProtectPdfEditor: React.FC<ProtectPdfEditorProps> = ({
  pdfPassword = '',
  setPdfPassword,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={18} className="text-brand-primary" color="#3b82f6" />
          <span>Kunci PDF</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Lindungi dokumen PDF Anda dari akses tidak sah. Semua proses enkripsi dilakukan secara lokal di perangkat Anda.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Kata Sandi Baru</label>
        <input
          type="password"
          value={pdfPassword}
          onChange={(e) => setPdfPassword(e.target.value)}
          placeholder="Masukkan kata sandi..."
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border-color)', background: 'var(--bg-input)',
            color: 'var(--text-main)', outline: 'none'
          }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          *Simpan kata sandi ini baik-baik. File yang terkunci tidak bisa dibuka jika Anda lupa kata sandinya.
        </p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !pdfPassword}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)' }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{isProcessing ? 'Memproses...' : 'Kunci Dokumen'}</span>
        </button>
      </div>
    </div>
  );
};
