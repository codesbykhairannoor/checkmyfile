// src/components/auth/LogoutConfirmModal.tsx
// Global SaaS Standard Logout Confirmation Modal supporting all 30 languages

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authTranslations } from '../../i18n/authTranslations';
import { LogOut, X, Loader2, Crown } from 'lucide-react';

interface LogoutConfirmModalProps {
  currentLang?: string;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ currentLang = 'en' }) => {
  const { user, profile, isPro, isLogoutConfirmOpen, closeLogoutConfirmModal, signOut } = useAuth();
  const t = authTranslations[currentLang] || authTranslations['en'];
  const [loading, setLoading] = useState(false);

  if (!isLogoutConfirmOpen || !user) return null;

  const handleConfirmLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      closeLogoutConfirmModal();
    } catch (err) {
      console.error('Logout error:', err);
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
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          closeLogoutConfirmModal();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeInDown 0.15s ease-out',
          color: 'var(--text-main)',
          fontFamily: 'var(--font-main)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(225, 29, 72, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
                flexShrink: 0,
              }}
            >
              <LogOut size={18} />
            </div>
            <h3
              id="logout-confirm-title"
              style={{
                margin: 0,
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: 1.2,
              }}
            >
              {t.auth_logout_confirm_title || 'Log Out of Your Account?'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeLogoutConfirmModal}
            disabled={loading}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Active User Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.displayName || t.nav_account || 'User'}
                </div>
                <div
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.email}
                </div>
              </div>
            </div>

            {isPro && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#f59e0b',
                  color: '#000000',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  flexShrink: 0,
                }}
              >
                <Crown size={12} />
                PRO
              </span>
            )}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: 'var(--text-muted)',
            }}
          >
            {t.auth_logout_confirm_desc ||
              'Are you sure you want to log out? You will need to sign in again to access PRO features and your account settings.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            padding: '16px 20px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          <button
            type="button"
            onClick={closeLogoutConfirmModal}
            disabled={loading}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            {t.auth_logout_cancel_btn || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-primary)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s ease',
            }}
          >
            {loading ? <Loader2 size={16} className="spinner" /> : <LogOut size={15} />}
            <span>{t.auth_logout_confirm_btn || 'Yes, Log Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
