// src/components/auth/DeleteAccountModal.tsx
// Global SaaS Standard GDPR Article 17 (Right to Erasure) Account Deletion Modal
// Informs user of single sign-on deletion across all 4 ThisMyOwn Privacy Suite apps

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authTranslations } from '../../i18n/authTranslations';
import {
  AlertTriangle,
  Trash2,
  X,
  FileText,
  Image as ImageIcon,
  Film,
  QrCode,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface DeleteAccountModalProps {
  currentLang?: string;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ currentLang = 'en' }) => {
  const { user, profile, isDeleteModalOpen, closeDeleteModal, deleteAccount } = useAuth();
  const t = authTranslations[currentLang] || authTranslations['en'];

  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isDeleteModalOpen || !user) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';
  const isPasswordUser = user.providerData?.some((p: any) => p.providerId === 'password');

  const handleClose = () => {
    if (loading) return;
    setConfirmText('');
    setPassword('');
    setRequiresPassword(false);
    setErrorMsg(null);
    setSuccess(false);
    closeDeleteModal();
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;

    if (isPasswordUser && requiresPassword && !password) {
      setErrorMsg(t.auth_delete_password_required || 'Please enter your password to confirm account deletion.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await deleteAccount(password || undefined);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/requires-recent-login' || code === 'auth/requires-password-confirmation') {
        setRequiresPassword(true);
        setErrorMsg(t.auth_delete_password_required || 'Recent login required. Please enter your account password to verify your identity.');
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg(t.auth_invalid_credentials || 'Invalid password. Please check your credentials and try again.');
      } else {
        setErrorMsg(err?.message || t.auth_delete_error || 'Failed to delete account. Please try again.');
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
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
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
          maxWidth: '520px',
          fontFamily: 'var(--font-main)',
          backgroundColor: 'var(--bg-card, #111520)',
          color: 'var(--text-main, #f8fafc)',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
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
            backgroundColor: 'rgba(239, 68, 68, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#ef4444' }}>
                {t.auth_delete_account_title || 'Delete Account & Erasure Request'}
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
                GDPR Article 17 (Right to Erasure) & CCPA Compliant
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
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {success ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 0', gap: '14px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main, #ffffff)' }}>
                {t.auth_delete_success || 'Your account and data have been permanently deleted across all 4 suite applications.'}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted, #94a3b8)' }}>
                Thank you for using HandleMyFile. You are now safely logged out.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Alert message if error */}
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
                  }}
                >
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Warning Notice Box */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: 'var(--text-main, #ffffff)',
                  lineHeight: 1.55,
                }}
              >
                <div style={{ fontWeight: 800, color: '#ef4444', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={15} />
                  <span>{t.auth_delete_warning_permanent || 'Permanent Action — Cannot Be Undone'}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted, #94a3b8)', fontSize: '12.5px' }}>
                  {t.auth_delete_warning_desc || 'In compliance with GDPR Article 17 (Right to Erasure), deleting your account will permanently wipe your profile and credentials.'}
                </p>
              </div>

              {/* 4-App Ecosystem Warning Section */}
              <div
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-app, rgba(0,0,0,0.25))',
                  border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                  borderRadius: '10px',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main, #ffffff)', marginBottom: '10px' }}>
                  {t.auth_delete_ecosystem_warning || 'Single Sign-On Impact: Deleting this account will immediately revoke your login and erase your profile across ALL 4 ecosystem web apps:'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '12px' }}>
                    <FileText size={14} color="#e11d48" />
                    <span style={{ fontWeight: 600 }}>HandleMyFile</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '12px' }}>
                    <ImageIcon size={14} color="#3b82f6" />
                    <span style={{ fontWeight: 600 }}>HelpMyIMG</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '12px' }}>
                    <Film size={14} color="#a855f7" />
                    <span style={{ fontWeight: 600 }}>SolveMyMedia</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '12px' }}>
                    <QrCode size={14} color="#10b981" />
                    <span style={{ fontWeight: 600 }}>CreateMy-QR</span>
                  </div>
                </div>
              </div>

              {/* LemonSqueezy Subscription Notice for PRO users */}
              {profile?.plan === 'pro' && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f59e0b',
                    lineHeight: 1.5,
                  }}
                >
                  <strong>{t.auth_delete_subscription_note || 'Active Subscriptions: If you have an active PRO recurring subscription via LemonSqueezy, please cancel your renewal in your billing portal before deleting your account.'}</strong>
                </div>
              )}

              {/* Password confirmation if required */}
              {(requiresPassword || isPasswordUser) && (
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main, #ffffff)' }}>
                    {t.auth_delete_password_required || 'Confirm Password:'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth_delete_password_placeholder || 'Enter your account password'}
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
              )}

              {/* Confirmation Keyword Input (DELETE) */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main, #ffffff)' }}>
                  {t.auth_delete_confirm_instruction || 'To confirm permanent deletion, please type DELETE below:'}
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={t.auth_delete_confirm_placeholder || 'Type DELETE to confirm'}
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-app, rgba(0,0,0,0.3))',
                    border: isConfirmed ? '1px solid #ef4444' : '1px solid var(--border-color, rgba(255,255,255,0.15))',
                    borderRadius: '8px',
                    color: isConfirmed ? '#ef4444' : 'var(--text-main, #ffffff)',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={!isConfirmed || loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: isConfirmed ? '#ef4444' : 'rgba(239, 68, 68, 0.25)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: isConfirmed && !loading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isConfirmed ? 1 : 0.65,
                    boxShadow: isConfirmed ? '0 4px 14px rgba(239, 68, 68, 0.35)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>{t.auth_delete_btn_submit || 'Permanently Delete Account & Data'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main, #ffffff)',
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {t.auth_delete_btn_cancel || 'Keep My Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
