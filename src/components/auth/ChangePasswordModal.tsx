// src/components/auth/ChangePasswordModal.tsx
// Modal for logged-in users to change or reset their password securely via email link

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authTranslations } from '../../i18n/authTranslations';
import {
  KeyRound,
  Mail,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface ChangePasswordModalProps {
  currentLang?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ currentLang = 'en' }) => {
  const { user, isChangePasswordModalOpen, closeChangePasswordModal, sendPasswordReset } = useAuth();
  const t = authTranslations[currentLang] || authTranslations['en'];

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isChangePasswordModalOpen || !user) return null;

  const isGoogleUser = user.providerData?.some((p: any) => p.providerId === 'google.com');

  const handleClose = () => {
    if (loading) return;
    setErrorMsg(null);
    setSuccess(false);
    closeChangePasswordModal();
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.email) {
      setErrorMsg('No email address associated with this account.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await sendPasswordReset(user.email);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          fontFamily: 'var(--font-main)',
          backgroundColor: 'var(--bg-card, #111520)',
          color: 'var(--text-main, #f8fafc)',
          borderRadius: '16px',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(225, 29, 72, 0.1)',
                color: 'var(--brand-primary, #e11d48)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--text-main, #ffffff)' }}>
                {t.auth_change_password_title || 'Change Password'}
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
                {user.email}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {isGoogleUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.6 }}>
                {t.auth_change_password_google_notice ||
                  'Your account is signed in with Google. Passwords are securely managed directly through your Google Account settings.'}
              </p>

              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-main, #ffffff)',
                  border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <span>{t.auth_change_password_google_btn || 'Manage Google Security'}</span>
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted, #94a3b8)',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          ) : success ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', padding: '12px 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.12)',
                  color: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 800, color: 'var(--text-main, #ffffff)' }}>
                  {t.auth_change_password_sent_title || 'Reset Link Sent!'}
                </h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.55 }}>
                  {t.auth_change_password_sent_desc ||
                    "We've sent a password reset link to your email. Click the link in your inbox to set a new password."}
                </p>
                <div
                  style={{
                    marginTop: '10px',
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-main, #ffffff)',
                    display: 'inline-block',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  }}
                >
                  {user.email}
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--brand-primary, #e11d48)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                }}
              >
                Got It
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendResetLink} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.6 }}>
                {t.auth_change_password_desc ||
                  'Send a secure reset link to your email to create a new password.'}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                  borderRadius: '10px',
                }}
              >
                <Mail size={16} color="var(--brand-primary, #e11d48)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main, #ffffff)' }}>
                  {user.email}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'var(--brand-primary, #e11d48)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                  }}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>{t.auth_change_password_btn || 'Send Password Reset Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted, #94a3b8)',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
