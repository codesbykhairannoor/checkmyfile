import React, { useState } from 'react';
import { Lock, Download, Settings2 } from 'lucide-react';

interface ProtectPdfEditorProps {
  tUi?: Record<string, string>;
  pdfPassword?: string;
  setPdfPassword: (pw: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ProtectPdfEditor: React.FC<ProtectPdfEditorProps> = ({
  tUi = {},
  pdfPassword = '',
  setPdfPassword,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const [confirmPassword, setConfirmPassword] = useState('');
  
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={18} className="text-brand-primary" color="#3b82f6" />
          <span>{t("protect_pdf", "Protect PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("protect_desc", "Secure your PDF document with strong password encryption completely in your browser.")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {t("new_password", "New Password")}
        </label>
        <input
          type="password"
          value={pdfPassword}
          onChange={(e) => setPdfPassword(e.target.value)}
          placeholder={t("enter_password_placeholder", "Enter password...")}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border-color)', background: 'var(--bg-input)',
            color: 'var(--text-main)', outline: 'none'
          }}
        />
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 8 }}>
          {t("confirm_password", "Confirm Password")}
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("retype_password_placeholder", "Retype password...")}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border-color)', background: 'var(--bg-input)',
            color: 'var(--text-main)', outline: 'none'
          }}
        />
        {pdfPassword && confirmPassword && pdfPassword !== confirmPassword && (
          <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
            {t("passwords_not_match", "Passwords do not match.")}
          </span>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !pdfPassword || pdfPassword !== confirmPassword}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{isProcessing ? t("protecting_btn", "Encrypting...") : t("apply_protect", "Apply PDF Encryption")}</span>
        </button>
      </div>
    </div>
  );
};
