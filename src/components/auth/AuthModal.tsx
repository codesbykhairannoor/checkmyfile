import React, { useState, useEffect, useCallback } from 'react';
import { X, Loader2, AlertCircle, CheckCircle2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../config/firebase';
import { authTranslations } from '../../i18n/authTranslations';

interface AuthModalProps {
  currentLang?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentLang = 'en' }) => {
  const {
    user,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    confirmNewPassword,
  } = useAuth();

  const t = authTranslations[currentLang] || authTranslations['en'];

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check URL query parameters for password reset links (?mode=resetPassword&oobCode=XYZ)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');

    if (urlMode === 'resetPassword' && oobCode) {
      setResetCode(oobCode);
      setMode('reset');
      openAuthModal();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [openAuthModal]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(false);
  }, []);

  // Close modal when user is logged in
  useEffect(() => {
    if (user && isAuthModalOpen) {
      resetForm();
      closeAuthModal();
    }
  }, [user, isAuthModalOpen, closeAuthModal, resetForm]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    if (isAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen || user) return null;

  const handleSwitchMode = (newMode: 'signin' | 'signup' | 'forgot' | 'reset') => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      setErrorMsg(t.auth_config_missing || 'Firebase configuration missing.');
      return;
    }

    // In-app Reset Password confirmation flow
    if (mode === 'reset') {
      if (!resetCode) {
        setErrorMsg('Invalid or expired password reset link.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg(t.auth_weak_password || 'Password must be at least 6 characters.');
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        await confirmNewPassword(resetCode, password);
        setSuccessMsg(t.auth_password_reset_success || 'Password has been successfully updated! Please sign in.');
        setTimeout(() => {
          setMode('signin');
          setPassword('');
          setErrorMsg(null);
        }, 1500);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to reset password. Link may have expired.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim()) {
      setErrorMsg(t.auth_fill_email || 'Please enter your email address.');
      return;
    }

    // Forgot password flow
    if (mode === 'forgot') {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        await sendPasswordReset(email);
        setSuccessMsg(t.auth_reset_email_sent || 'Password reset link sent to your email.');
      } catch (err: any) {
        const code = err?.code;
        if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
          setErrorMsg(t.auth_invalid_credentials || 'No account found with this email address.');
        } else {
          setErrorMsg(err?.message || t.auth_generic_error || 'Error sending password reset email.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg(t.auth_fill_password || 'Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t.auth_weak_password || 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      resetForm();
      closeAuthModal();
    } catch (err: any) {
      const code = err?.code;
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-email'
      ) {
        setErrorMsg(t.auth_invalid_credentials || 'Invalid email or password.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg(t.auth_email_in_use || 'This email is already registered. Please sign in instead.');
      } else if (code === 'auth/weak-password') {
        setErrorMsg(t.auth_weak_password || 'Password must be at least 6 characters.');
      } else {
        setErrorMsg(err?.message || t.auth_generic_error || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setErrorMsg(t.auth_config_missing || 'Firebase configuration missing.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      resetForm();
      closeAuthModal();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || t.auth_generic_error || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeAuthModal();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          fontFamily: 'var(--font-main)',
          backgroundColor: 'var(--bg-card, #111520)',
          color: 'var(--text-main, #f8fafc)',
          borderRadius: '16px',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
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
            {mode !== 'signin' && mode !== 'reset' && (
              <button
                type="button"
                onClick={() => handleSwitchMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main, #ffffff)' }}>
              {mode === 'signin' && (t.auth_signin_title || 'Sign in to HandleMyFile')}
              {mode === 'signup' && (t.auth_signup_title || 'Create your account')}
              {mode === 'forgot' && (t.auth_forgot_title || 'Reset Password')}
              {mode === 'reset' && (t.auth_reset_title || 'Set New Password')}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
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

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {/* Alert Messages */}
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          {mode !== 'forgot' && mode !== 'reset' && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-card, #ffffff)',
                  color: '#1e293b',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'background-color 0.15s ease',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{t.auth_continue_google || 'Continue with Google'}</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '20px 0',
                  color: 'var(--text-muted, #64748b)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color, #334155)' }} />
                <span style={{ padding: '0 12px' }}>{t.auth_or_email || 'or with email'}</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color, #334155)' }} />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode !== 'reset' && (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '6px',
                    color: 'var(--text-main, #e2e8f0)',
                  }}
                >
                  {t.auth_email_label || 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted, #64748b)',
                    }}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px 10px 38px',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid var(--border-color, #334155)',
                      borderRadius: '8px',
                      color: 'var(--text-main, #ffffff)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-main, #e2e8f0)',
                    }}
                  >
                    {mode === 'reset' ? (t.auth_new_password_label || 'New Password') : (t.auth_password_label || 'Password')}
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('forgot')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand-primary, #e11d48)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {t.auth_forgot_password_link || 'Forgot password?'}
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted, #64748b)',
                    }}
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'reset' ? 'Minimum 6 characters' : '••••••••'}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px 10px 38px',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                      borderRadius: '8px',
                      color: 'var(--text-main, #ffffff)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '4px',
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--brand-primary, #e11d48)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>
                {mode === 'signin' && (t.auth_signin_btn || 'Sign In')}
                {mode === 'signup' && (t.auth_signup_btn || 'Create Free Account')}
                {mode === 'forgot' && (t.auth_send_reset_btn || 'Send Reset Link')}
                {mode === 'reset' && (t.auth_update_password_btn || 'Update Password')}
              </span>
            </button>
          </form>

          {/* Mode Switching Footer */}
          {mode !== 'reset' && (
            <div
              style={{
                marginTop: '20px',
                textAlign: 'center',
                fontSize: '13px',
                color: 'var(--text-muted, #94a3b8)',
              }}
            >
              {mode === 'signin' && (
                <>
                  {t.auth_dont_have_account || "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-primary, #e11d48)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {t.auth_signup_free_link || 'Sign up free'}
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  {t.auth_already_have_account || 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-primary, #e11d48)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {t.auth_signin_link || 'Sign in'}
                  </button>
                </>
              )}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary, #e11d48)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {t.auth_back_to_signin || 'Return to sign in'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
