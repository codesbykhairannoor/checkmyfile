// src/components/common/ProGateModal.tsx
// Ultra-clean Canva/Figma style Micro-Modal (Silicon Valley Standard)
// Zero walls of text, 1 icon, 1 headline, 1-line benefit, 1 primary action.

import React from 'react';
import { Crown, Sparkles, X, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authTranslations } from '../../i18n/authTranslations';

export interface ProGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: string;
  title?: string;
  description?: string;
  featureName?: string;
  filesCount?: number;
  onContinueFree?: () => void;
  continueFreeLabel?: string;
}

export const ProGateModal: React.FC<ProGateModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
  title,
  description,
  featureName,
  filesCount,
  onContinueFree,
  continueFreeLabel,
}) => {
  const { user, signInWithGoogle, openAuthModal } = useAuth();
  const t = authTranslations[currentLang] || authTranslations['en'] || {};
  const isId = currentLang === 'id';

  if (!isOpen) return null;

  // Sanitize headline to prevent "PRO Feature: Custom File Name: Custom File Name" bug
  const cleanFeatureName = featureName
    ? featureName.replace(/^(PRO Feature:?|Fitur PRO:?)\s*/i, '').trim()
    : '';

  let resolvedTitle = '';
  if (cleanFeatureName) {
    resolvedTitle = isId ? `Buka ${cleanFeatureName}` : `Unlock ${cleanFeatureName}`;
  } else if (title) {
    resolvedTitle = title.replace(/^(PRO Feature:?|Fitur PRO:?)\s*/i, '').trim();
    if (resolvedTitle && !resolvedTitle.toLowerCase().startsWith('unlock') && !resolvedTitle.toLowerCase().startsWith('buka')) {
      resolvedTitle = isId ? `Buka ${resolvedTitle}` : `Unlock ${resolvedTitle}`;
    }
  } else if (filesCount && filesCount > 10) {
    resolvedTitle = isId ? 'Buka Akses Batch Tanpa Batas' : 'Unlock Unlimited Batch Processing';
  } else {
    resolvedTitle = isId ? 'Buka Akses Penuh PRO' : 'Unlock PRO All-Access';
  }

  // Crisp 1-line benefit description (Zero walls of text)
  let resolvedDesc = '';
  if (description && !description.toLowerCase().includes('exclusive pro lifetime feature')) {
    resolvedDesc = description;
  } else if (cleanFeatureName.toLowerCase().includes('nama') || cleanFeatureName.toLowerCase().includes('name') || cleanFeatureName.toLowerCase().includes('filename')) {
    resolvedDesc = isId
      ? 'Beri nama dan atur file unduhan Anda secara bebas tanpa batasan.'
      : 'Name and organize your processed output files freely without restrictions.';
  } else if (filesCount && filesCount > 10) {
    resolvedDesc = isId
      ? 'Paket Gratis memproses hingga 10 file sekaligus. Upgrade ke PRO untuk memproses tanpa batas di RAM browser.'
      : 'Free Starter plan processes up to 10 files. Upgrade to PRO to process unlimited documents in browser RAM.';
  } else {
    resolvedDesc = isId
      ? 'Nikmati pemrosesan dokumen tanpa batas, privasi 100% offline di RAM, dan fitur eksklusif.'
      : 'Enjoy unlimited document processing, 100% offline client-side privacy, and exclusive PRO features.';
  }

  const handleGoogleClick = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const handleEmailClick = () => {
    onClose();
    openAuthModal();
  };

  const handleUpgradeClick = () => {
    onClose();
    const targetUrl = currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`;
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
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
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          fontFamily: 'var(--font-main)',
          backgroundColor: 'var(--bg-card, #ffffff)',
          color: 'var(--text-main, #0f172a)',
          borderRadius: '24px',
          border: '1px solid var(--border-color, rgba(15, 23, 42, 0.1))',
          boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.35)',
          padding: '28px 24px 22px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          animation: 'fadeIn 0.15s ease-out',
        }}
      >
        {/* Minimal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-input, rgba(15, 23, 42, 0.05))',
            border: 'none',
            color: 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <X size={15} />
        </button>

        {/* Clean Center Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'var(--brand-gradient, linear-gradient(135deg, #e11d48 0%, #be123c 100%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 18px rgba(225, 29, 72, 0.25)',
            marginBottom: 12,
          }}
        >
          {!user ? <Sparkles size={24} /> : <Crown size={24} />}
        </div>

        {/* Small Micro-Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 12px',
            borderRadius: 9999,
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            color: '#d97706',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>
            {!user
              ? (isId ? '✨ AKSES PRO GRATIS' : '✨ PRO ACCESS')
              : (isId ? '👑 FITUR PRO' : '👑 PRO FEATURE')}
          </span>
        </div>

        {/* Punchy Headline (1 line) */}
        <h3
          style={{
            margin: '0 0 6px 0',
            fontSize: '1.25rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
          }}
        >
          {resolvedTitle}
        </h3>

        {/* Clean 1-Line Benefit Description */}
        <p
          style={{
            margin: '0 0 20px 0',
            fontSize: '0.86rem',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1.5,
            maxWidth: '340px',
          }}
        >
          {resolvedDesc}
        </p>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!user ? (
            <>
              {/* 1-Click Google Sign In (Primary) */}
              <button
                type="button"
                onClick={handleGoogleClick}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 12,
                  backgroundColor: 'var(--bg-app, #ffffff)',
                  border: '1px solid var(--border-color, rgba(15, 23, 42, 0.15))',
                  color: 'var(--text-main, #0f172a)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isId ? 'Lanjutkan dengan Google (1-Klik)' : 'Continue with Google (1-Click)'}</span>
              </button>

              {/* Email Alternative (Secondary) */}
              <button
                type="button"
                onClick={handleEmailClick}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '11px 16px',
                  borderRadius: 12,
                  backgroundColor: 'var(--bg-input, rgba(15, 23, 42, 0.04))',
                  border: '1px solid var(--border-color, rgba(15, 23, 42, 0.08))',
                  color: 'var(--text-main, #334155)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <LogIn size={15} color="var(--text-muted, #94a3b8)" />
                <span>{isId ? 'Atau masuk dengan Email / Password' : 'Or continue with Email / Password'}</span>
              </button>
            </>
          ) : (
            /* Logged-in User: Upgrade Button */
            <button
              type="button"
              onClick={handleUpgradeClick}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '13px 20px',
                borderRadius: 12,
                background: 'var(--brand-gradient, linear-gradient(135deg, #e11d48 0%, #be123c 100%))',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(225, 29, 72, 0.28)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{isId ? 'Upgrade ke PRO — Mulai $9.99' : 'Upgrade to PRO — From $9.99'}</span>
              <ArrowRight size={16} />
            </button>
          )}

          {/* Optional: Continue Free button if queued > 10 files */}
          {onContinueFree && (
            <button
              type="button"
              onClick={onContinueFree}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                backgroundColor: 'transparent',
                color: 'var(--text-muted, #64748b)',
                border: '1px solid var(--border-color, rgba(15, 23, 42, 0.12))',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {continueFreeLabel || (isId ? 'Proses 10 File Pertama (Gratis)' : 'Process First 10 Files (Free)')}
            </button>
          )}

          {/* Minimal Text Dismiss Link */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #94a3b8)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 4,
              padding: '6px',
              transition: 'color 0.15s ease',
            }}
          >
            {isId ? 'Nanti saja' : 'Maybe later'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Also export alias ProAlertModal for unified naming across sister projects
export const ProAlertModal = ProGateModal;
export default ProGateModal;
