import React from 'react';
import { Sparkles, Crown, X, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { redirectToLemonSqueezy } from '../../utils/lemonSqueezy';

export type BatchGateType = 'auth' | 'upgrade';

interface BatchGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: BatchGateType;
  currentLang?: string;
  filesCount?: number;
}

export const BatchGateModal: React.FC<BatchGateModalProps> = ({
  isOpen,
  onClose,
  type,
  currentLang = 'en',
  filesCount = 0,
}) => {
  const { user, signInWithGoogle, openAuthModal } = useAuth();
  const isId = currentLang === 'id';

  if (!isOpen) return null;

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
    if (!user) {
      onClose();
      openAuthModal();
      return;
    }
    redirectToLemonSqueezy(user, 'monthly');
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
        backgroundColor: 'rgba(15, 23, 42, 0.68)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'var(--bg-card, #ffffff)',
          color: 'var(--text-main, #0f172a)',
          borderRadius: '24px',
          border: '1px solid var(--border-color, rgba(15, 23, 42, 0.1))',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          padding: '32px 28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          animation: 'fadeIn 0.15s ease-out',
          fontFamily: 'var(--font-main)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            padding: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
        >
          <X size={18} />
        </button>

        {type === 'auth' ? (
          /* ========================================================
             STATE 1: USER NOT LOGGED IN (Reference Image 3)
             ======================================================== */
          <>
            {/* Top Icon in Rounded Square */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 8px 18px rgba(225, 29, 72, 0.25)',
              }}
            >
              <Sparkles size={22} />
            </div>

            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 12px',
                borderRadius: 9999,
                background: 'rgba(225, 29, 72, 0.1)',
                color: 'var(--brand-primary)',
                fontSize: '0.74rem',
                fontWeight: 800,
                marginTop: 14,
                letterSpacing: '0.04em',
              }}
            >
              <span>{isId ? '✨ 3 BATCH GRATIS / BULAN' : '✨ 3 FREE BATCHES / MONTH'}</span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '12px 0 8px',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                fontFamily: 'var(--font-display)',
              }}
            >
              {isId ? 'Coba 3 Batch Gratis per Bulan' : 'Try 3 Free Batches per Month'}
            </h3>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                maxWidth: 360,
                margin: '0 auto 22px',
              }}
            >
              {isId
                ? `Masuk dengan Google atau Email untuk membuka 3x pemrosesan batch dokumen gratis setiap bulan (${filesCount > 0 ? `${filesCount} dokumen antre` : 'tanpa batasan ukuran'}).`
                : `Sign in with Google or Email to unlock 3 free batch document processings every month (${filesCount > 0 ? `${filesCount} documents queued` : 'with zero size limits'}).`}
            </p>

            {/* Button 1: Google (1-Click) */}
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
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
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

            {/* Button 2: Email / Password */}
            <button
              type="button"
              onClick={handleEmailClick}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 10,
                transition: 'all 0.15s ease',
              }}
            >
              <LogIn size={15} color="var(--text-muted)" />
              <span>{isId ? 'Atau masuk dengan Email / Password' : 'Or continue with Email / Password'}</span>
            </button>

            {/* Link: Maybe later */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 16,
                padding: '6px',
              }}
            >
              {isId ? 'Nanti saja' : 'Maybe later'}
            </button>
          </>
        ) : (
          /* ========================================================
             STATE 2: USER LOGGED IN BUT REACHED 3 BATCHES (Reference Image 4)
             ======================================================== */
          <>
            {/* Top Icon in Rounded Square */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 8px 18px rgba(225, 29, 72, 0.25)',
              }}
            >
              <Crown size={24} />
            </div>

            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 12px',
                borderRadius: 9999,
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#d97706',
                fontSize: '0.74rem',
                fontWeight: 800,
                marginTop: 14,
                letterSpacing: '0.04em',
              }}
            >
              <span>{isId ? '👑 FITUR PRO' : '👑 PRO FEATURE'}</span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '12px 0 8px',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                fontFamily: 'var(--font-display)',
              }}
            >
              {isId ? 'Buka Akses Batch Tanpa Batas' : 'Unlock Unlimited Batch Processing'}
            </h3>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                maxWidth: 360,
                margin: '0 auto 22px',
              }}
            >
              {isId
                ? 'Anda telah menggunakan 3 batch gratis bulan ini. Upgrade ke PRO untuk memproses batch tanpa batas (100+ file) di semua alat dokumen.'
                : "You've used your 3 free batches this month. Upgrade to PRO for unlimited batch processing (100+ files) across all document tools."}
            </p>

            {/* Primary CTA Button: Upgrade to PRO */}
            <button
              type="button"
              onClick={handleUpgradeClick}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '13px 20px',
                borderRadius: 12,
                fontSize: '0.94rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(225, 29, 72, 0.25)',
              }}
            >
              <span>{isId ? 'Upgrade ke PRO — Mulai $9.99' : 'Upgrade to PRO — From $9.99'}</span>
              <ArrowRight size={16} />
            </button>

            {/* Link: Maybe later */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 16,
                padding: '6px',
              }}
            >
              {isId ? 'Nanti saja' : 'Maybe later'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
