import React from 'react';
import { Unlock, Download, Settings2 } from 'lucide-react';

interface UnlockPdfEditorProps {
  tUi?: Record<string, string>;
  pdfPassword?: string;
  setPdfPassword: (pw: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const UnlockPdfEditor: React.FC<UnlockPdfEditorProps> = ({
  tUi = {},
  pdfPassword = '',
  setPdfPassword,
  onApply,
  isProcessing
}) => {
  void tUi;
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Unlock size={18} className="text-brand-primary" color="#3b82f6" />
          <span>{tUi["Buka Kunci PDF"] || (tUi["Buka Kunci PDF"] || "Buka Kunci PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{tUi["Hapus kata sandi dari dokumen PDF Anda secara permanen. Proses dekripsi dilakukan 100% di browser Anda."] || (tUi["Hapus kata sandi dari dokumen PDF Anda secara permanen. Proses dekripsi dilakukan 100% di browser Anda."] || "Hapus kata sandi dari dokumen PDF Anda secara permanen. Proses dekripsi dilakukan 100% di browser Anda.")}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{tUi["Kata Sandi Dokumen Saat Ini"] || (tUi["Kata Sandi Dokumen Saat Ini"] || "Kata Sandi Dokumen Saat Ini")}</label>
        <input
          type="password"
          value={pdfPassword}
          onChange={(e) => setPdfPassword(e.target.value)}
          placeholder={tUi["Masukkan kata sandi..."] || "Masukkan kata sandi..."}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border-color)', background: 'var(--bg-input)',
            color: 'var(--text-main)', outline: 'none'
          }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tUi["*Kami tidak menyimpan atau mengirimkan kata sandi Anda ke server mana pun."] || (tUi["*Kami tidak menyimpan atau mengirimkan kata sandi Anda ke server mana pun."] || "*Kami tidak menyimpan atau mengirimkan kata sandi Anda ke server mana pun.")}</p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !pdfPassword}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: (tUi["linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)"] || "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)") }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{isProcessing ? (tUi["Memproses..."] || "Memproses...") : (tUi["Buka & Unduh Dokumen"] || (tUi["Buka & Unduh Dokumen"] || "Buka & Unduh Dokumen"))}</span>
        </button>
      </div>
    </div>
  );
};
