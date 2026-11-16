import React from 'react';
import { Crown, X, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { redirectToLemonSqueezy, type PlanType } from '../../utils/lemonSqueezy';
import { authTranslations } from '../../i18n/authTranslations';

interface ProGateModalProps {
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
  const { user, openAuthModal } = useAuth();
  const [selectedPlan, setSelectedPlan] = React.useState<PlanType>('lifetime');
  const t = authTranslations[currentLang] || authTranslations['en'] || {};

  if (!isOpen) return null;

  const defaultTitle = featureName
    ? `${t.pro_custom_filename_title || 'PRO Feature'}: ${featureName}`
    : (t.batch_pro_gate_title || 'Batch Processing Limit (10 Files)');

  const defaultDesc = filesCount && filesCount > 10
    ? (t.batch_free_limit_desc || `The Free Starter plan processes up to 10 files simultaneously. You selected ${filesCount} files. Upgrade to PRO Lifetime to process unlimited documents in browser RAM.`)
    : (t.pro_custom_filename_desc || 'This feature is part of the PRO Lifetime Pass. Enjoy full freedom to process documents without limitations.');

  const handleUpgrade = () => {
    if (!user) {
      onClose();
      openAuthModal();
      return;
    }
    redirectToLemonSqueezy(user, selectedPlan);
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
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          fontFamily: 'var(--font-main)',
          backgroundColor: 'var(--bg-card, #111520)',
          color: 'var(--text-main, #f8fafc)',
          borderRadius: '20px',
          border: '2px solid var(--brand-primary, #e11d48)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            padding: 4,
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Crown size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
              {title || defaultTitle}
            </h3>
            {filesCount !== undefined && filesCount > 10 && (
              <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                {filesCount} {t.pro_documents_queued || 'documents queued'}
              </span>
            )}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {description || defaultDesc}
        </p>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(225, 29, 72, 0.08)',
            border: '1px solid rgba(225, 29, 72, 0.25)',
            fontSize: '0.84rem',
            lineHeight: 1.5,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--brand-primary, #e11d48)' }}>
            <Sparkles size={15} />
            <span>{t.pro_benefits_heading || 'PRO Lifetime All-Access Benefits:'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
            <Check size={14} color="#10b981" />
            <span>{t.pro_benefit_unlimited_batch || 'Unlimited batch processing (100+ files across all tools)'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
            <Check size={14} color="#10b981" />
            <span>{t.pro_benefit_custom_name || 'Custom output file renaming without restrictions'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
            <Check size={14} color="#10b981" />
            <span>{t.pro_benefit_lifetime || 'One-time payment, lifetime updates, zero subscriptions'}</span>
          </div>
        </div>

        {/* Plan Switcher: Monthly vs Lifetime */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.pro_choose_plan || 'Choose Your PRO Plan:'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Monthly Card */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              style={{
                padding: '12px 14px',
                borderRadius: 14,
                border: selectedPlan === 'monthly'
                  ? '2px solid var(--brand-primary, #e11d48)'
                  : '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                backgroundColor: selectedPlan === 'monthly'
                  ? 'rgba(225, 29, 72, 0.08)'
                  : 'var(--bg-app, #0b0f19)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: selectedPlan === 'monthly' ? 'var(--brand-primary, #e11d48)' : 'var(--text-main)' }}>
                {t.pro_plan_monthly_name || 'PRO Monthly'}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                {t.pro_plan_monthly_price || '$4.99 / mo'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                {t.pro_plan_monthly_desc || 'Cancel anytime in 1 click'}
              </div>
            </div>

            {/* Lifetime Card */}
            <div
              onClick={() => setSelectedPlan('lifetime')}
              style={{
                padding: '12px 14px',
                borderRadius: 14,
                border: selectedPlan === 'lifetime'
                  ? '2px solid var(--brand-primary, #e11d48)'
                  : '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                backgroundColor: selectedPlan === 'lifetime'
                  ? 'rgba(225, 29, 72, 0.08)'
                  : 'var(--bg-app, #0b0f19)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -9,
                  right: 8,
                  padding: '2px 8px',
                  borderRadius: 100,
                  backgroundColor: 'var(--brand-primary, #e11d48)',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                }}
              >
                {t.pro_plan_best_value || 'BEST VALUE'}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: selectedPlan === 'lifetime' ? 'var(--brand-primary, #e11d48)' : 'var(--text-main)' }}>
                {t.pro_plan_lifetime_name || 'Lifetime Pass'}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                {t.pro_plan_lifetime_price || '$39 once'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                {t.pro_plan_lifetime_desc || 'Pay once, own forever'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <button
            type="button"
            onClick={handleUpgrade}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              backgroundColor: 'var(--brand-primary, #e11d48)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
            }}
          >
            <Crown size={18} />
            <span>
              {!user
                ? (selectedPlan === 'monthly'
                    ? (t.pro_signin_subscribe_monthly_btn || 'Sign In & Subscribe Monthly')
                    : (t.pro_signin_get_pass || 'Sign In & Get Lifetime Pass'))
                : (selectedPlan === 'monthly'
                    ? (t.pro_subscribe_monthly_btn || 'Subscribe Monthly ($4.99/mo)')
                    : (t.pro_get_lifetime_pass || 'Get Lifetime PRO Pass ($39)'))}
            </span>
          </button>

          {onContinueFree && (
            <button
              type="button"
              onClick={onContinueFree}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 12,
                backgroundColor: 'transparent',
                color: 'var(--text-muted, #94a3b8)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {continueFreeLabel || t.pro_continue_free || 'Continue with Free Version'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
