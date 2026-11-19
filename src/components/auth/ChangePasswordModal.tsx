// src/components/auth/ChangePasswordModal.tsx
// Comprehensive Modal for logged-in users to update password directly via current password verification
// with fallback to email password reset link if they forgot their current password

import React, { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
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
  Lock,
} from 'lucide-react';

interface ChangePasswordModalProps {
  currentLang?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ currentLang = 'en' }) => {
  const { user, isChangePasswordModalOpen, closeChangePasswordModal, sendPasswordReset } = useAuth();
  const t = authTranslations[currentLang] || authTranslations['en'];

  const [mode, setMode] = useState<'direct' | 'email'>('direct');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [directSuccess, setDirectSuccess] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  if (!isChangePasswordModalOpen || !user) return null;

  const isGoogleUser = user.providerData?.some((p: any) => p.providerId === 'google.com');

  const handleClose = () => {
    if (loading) return;
    setMode('direct');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg(null);
    setDirectSuccess(false);
    setEmailSuccess(false);
    closeChangePasswordModal();
  };

  const handleDirectPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.email) return;

    if (!currentPassword) {
      setErrorMsg(t.auth_fill_password || 'Please enter your current password.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(t.auth_weak_password || 'Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(t.auth_change_pw_mismatch || 'New passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Re-authenticate user with current password to ensure security
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Update password directly in Firebase Auth
      await updatePassword(user, newPassword);

      setDirectSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      const code = err?.code;
      if (
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/user-mismatch'
      ) {
        setErrorMsg(
          currentLang === 'id'
            ? 'Kata sandi saat ini salah. Jika Anda lupa, klik "Lupa kata sandi saat ini?" di bawah.'
            : 'Current password is incorrect. If you forgot it, click "Forgot current password?" below.'
        );
      } else if (code === 'auth/weak-password') {
        setErrorMsg(t.auth_weak_password || 'Password must be at least 6 characters.');
      } else {
        setErrorMsg(err?.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.email) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      await sendPasswordReset(user.email);
      setEmailSuccess(true);
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
            /* Google Provider Account */
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
          ) : directSuccess ? (
            /* Direct Password Change Success */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', padding: '16px 0' }}>
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
                  {t.auth_change_pw_success || 'Your password has been updated successfully!'}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted, #94a3b8)' }}>
                  You can now use your new password for all future logins.
                </p>
              </div>
            </div>
          ) : emailSuccess ? (
            /* Email Reset Link Sent Success */
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
          ) : mode === 'direct' ? (
            /* Mode 1: Direct In-App Password Change (Current Password -> New Password) */
            <form onSubmit={handleDirectPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main, #ffffff)' }}>
                  {t.auth_change_pw_current_label || 'Current Password'}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-app, rgba(0,0,0,0.3))',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                    borderRadius: '8px',
                    color: 'var(--text-main, #ffffff)',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode('email');
                  }}
                  style={{
                    marginTop: '5px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary, #e11d48)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                  }}
                >
                  {t.auth_change_pw_forgot_link || 'Forgot current password? Send reset link to email'}
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main, #ffffff)' }}>
                  {t.auth_change_pw_new_label || 'New Password'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-app, rgba(0,0,0,0.3))',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                    borderRadius: '8px',
                    color: 'var(--text-main, #ffffff)',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main, #ffffff)' }}>
                  {t.auth_change_pw_confirm_label || 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-app, rgba(0,0,0,0.3))',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                    borderRadius: '8px',
                    color: 'var(--text-main, #ffffff)',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
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
                  <Lock size={15} />
                  <span>{t.auth_change_pw_save_btn || 'Update Password'}</span>
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
          ) : (
            /* Mode 2: Forgot Password -> Send Reset Link to Email */
            <form onSubmit={handleSendResetEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <Mail size={15} />
                  <span>{t.auth_change_password_btn || 'Send Password Reset Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode('direct');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    color: 'var(--brand-primary, #e11d48)',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {t.auth_change_pw_switch_direct || 'Know your current password? Update directly'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
