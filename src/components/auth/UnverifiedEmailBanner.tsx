// src/components/auth/UnverifiedEmailBanner.tsx
// Persistent, friendly notification banner for logged-in users with unverified emails
import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authTranslations } from '../../i18n/authTranslations';

interface UnverifiedEmailBannerProps {
  currentLang?: string;
}

export const UnverifiedEmailBanner: React.FC<UnverifiedEmailBannerProps> = ({ currentLang = 'en' }) => {
  const { user, isPro, sendVerificationEmail, reloadUser } = useAuth();
  const t = authTranslations[currentLang] || authTranslations['en'];

  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Only display if user is logged in, not Pro lifetime bypass, and email is unverified
  if (!user || user.emailVerified || isPro) return null;

  const handleResend = async () => {
    if (cooldown > 0 || sending) return;
    setSending(true);
    setNotice(null);
    try {
      await sendVerificationEmail(user);
      setCooldown(60);
      setNotice(
        t.auth_unverified_banner_sent ||
          (currentLang === 'id'
            ? `Tautan verifikasi baru berhasil dikirim ke ${user.email}! Periksa kotak masuk atau spam.`
            : `A new verification link has been sent to ${user.email}! Please check your inbox or spam.`)
      );
    } catch (err: any) {
      console.error('[UnverifiedBanner] Resend error:', err);
      let msg =
        err?.message ||
        (currentLang === 'id'
          ? 'Gagal mengirim ulang email verifikasi. Coba beberapa saat lagi.'
          : 'Failed to resend verification email. Please try again.');
      if (err?.code === 'auth/too-many-requests') {
        msg =
          t.auth_unverified_banner_too_many ||
          (currentLang === 'id'
            ? 'Terlalu banyak permintaan. Harap tunggu beberapa menit.'
            : 'Too many requests. Please wait a few minutes before trying again.');
      }
      setNotice(msg);
    } finally {
      setSending(false);
    }
  };

  const handleCheckStatus = async () => {
    if (checking) return;
    setChecking(true);
    setNotice(null);
    try {
      const refreshed = await reloadUser();
      if (refreshed?.emailVerified) {
        setNotice(t.auth_verify_success || 'Email verified successfully!');
      } else {
        setNotice(
          t.auth_unverified_banner_not_yet ||
            (currentLang === 'id'
              ? 'Email belum diverifikasi. Silakan klik tautan di email yang telah kami kirimkan.'
              : 'Email not verified yet. Please click the verification link sent to your inbox.')
        );
      }
    } catch (e) {
      console.warn('[UnverifiedBanner] Reload status error:', e);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.12) 0%, rgba(245, 158, 11, 0.14) 100%)',
        borderBottom: '1px solid rgba(234, 179, 8, 0.28)',
        color: 'var(--text-main)',
        padding: '10px 16px',
        fontSize: '0.84rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        position: 'relative',
        zIndex: 90,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Mail size={16} color="#eab308" style={{ flexShrink: 0 }} />
        <span style={{ fontWeight: 600 }}>
          {t.auth_unverified_banner_text ||
            (currentLang === 'id'
              ? 'Email Anda belum diverifikasi. Harap verifikasi email untuk membuka semua fitur dan kuota gratis.'
              : 'Your email is unverified. Please verify your email to unlock all features and free quotas.')}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || sending}
          style={{
            background: cooldown > 0 ? 'rgba(255,255,255,0.06)' : 'rgba(234, 179, 8, 0.2)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            color: cooldown > 0 ? 'var(--text-muted)' : '#eab308',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: cooldown > 0 || sending ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {sending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          <span>
            {cooldown > 0
              ? `${t.auth_unverified_banner_resend || 'Resend Email'} (${cooldown}s)`
              : t.auth_unverified_banner_resend || 'Resend Email'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleCheckStatus}
          disabled={checking}
          style={{
            background: '#eab308',
            border: 'none',
            color: '#000000',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: checking ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {checking && <Loader2 size={12} className="animate-spin" />}
          <span>
            {checking
              ? t.auth_unverified_banner_checking || 'Checking...'
              : t.auth_unverified_banner_check_btn || "I've Verified"}
          </span>
        </button>
      </div>

      {notice && (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: notice.includes('success') || notice.includes('berhasil') ? '#10b981' : '#eab308',
            marginTop: 4,
          }}
        >
          {notice}
        </div>
      )}
    </div>
  );
};
