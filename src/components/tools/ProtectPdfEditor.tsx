import React from 'react';
import { Lock } from 'lucide-react';

interface ProtectPdfEditorProps {
  mode: 'protect' | 'unlock';
  password: string;
  setPassword: (val: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ProtectPdfEditor: React.FC<ProtectPdfEditorProps> = ({
  mode,
  password,
  setPassword,
  onApply,
  isProcessing
}) => {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={18} className="text-brand-primary" />
          <span>{mode === 'protect' ? 'Amankan Dokumen' : 'Buka Kunci Dokumen'}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {mode === 'protect' 
            ? 'Tambahkan kata sandi enkripsi tingkat tinggi pada PDF Anda untuk melindunginya dari akses tidak sah.' 
            : 'Masukkan kata sandi untuk menghapus proteksi dari dokumen PDF ini secara permanen.'}
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', marginBottom: 8 }}>
          {mode === 'protect' ? 'Buat Kata Sandi Baru' : 'Masukkan Kata Sandi Saat Ini'}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'protect' ? 'Ketik kata sandi rahasia...' : 'Ketik kata sandi pembuka...'}
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
      </div>
      
      <button
        onClick={onApply}
        disabled={isProcessing || !password}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          background: 'var(--brand-gradient)',
          color: '#fff',
          border: 'none',
          opacity: (isProcessing || !password) ? 0.7 : 1,
          cursor: (isProcessing || !password) ? 'not-allowed' : 'pointer'
        }}
      >
        {isProcessing ? 'Memproses...' : (mode === 'protect' ? 'Enkripsi Dokumen' : 'Buka Kunci')}
      </button>
    </div>
  );
};
