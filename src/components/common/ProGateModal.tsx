import React from 'react';
import { Crown, X, Check, ArrowRight } from 'lucide-react';
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

  const isId = currentLang === 'id';

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
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
          maxWidth: '510px',
          fontFamily: 'var(--font-main)',
          backgroundColor: 'var(--bg-card, #ffffff)',
          color: 'var(--text-main, #0f172a)',
          borderRadius: '24px',
          border: '1px solid var(--border-color, rgba(15, 23, 42, 0.1))',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          animation: 'fadeIn 0.15s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#d97706',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <Crown size={13} color="#d97706" />
            <span>{isId ? 'Akses Penuh PRO' : 'PRO All-Access'}</span>
          </div>

          {filesCount !== undefined && filesCount > 10 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: 20,
                backgroundColor: 'rgba(225, 29, 72, 0.08)',
                color: 'var(--brand-primary)',
                fontSize: '0.74rem',
                fontWeight: 800,
              }}
            >
              {filesCount} {t.pro_documents_queued || 'documents queued'}
            </div>
          )}
        </div>

        {/* Title & Short Description */}
        <div>
          <h3
            style={{
              margin: '0 0 6px 0',
              fontSize: '1.3rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            {title || defaultTitle}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
            }}
          >
            {description || defaultDesc}
          </p>
        </div>

        {/* 3 Crisp Value Items (Global SaaS Standard - Linear/Raycast) */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '14px',
            backgroundColor: 'rgba(225, 29, 72, 0.03)',
            border: '1px solid rgba(225, 29, 72, 0.14)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={11} color="#10b981" strokeWidth={3} />
            </div>
            <span>{t.pro_benefit_unlimited_batch || 'Unlimited ultra-batch processing (100+ files across all tools)'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={11} color="#10b981" strokeWidth={3} />
            </div>
            <span>{t.pro_benefit_suite || 'Connected PRO access to 4 Privacy Suite apps'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={11} color="#10b981" strokeWidth={3} />
            </div>
            <span>{t.pro_benefit_custom_name || 'Custom output file renaming without restrictions'}</span>
          </div>
        </div>

        {/* Plan Switcher: Monthly vs Yearly vs Lifetime */}
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {t.pro_choose_plan || 'Choose Your PRO Plan:'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {/* Monthly Card */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              style={{
                padding: '10px 10px',
                borderRadius: 14,
                border: selectedPlan === 'monthly'
                  ? '2px solid var(--brand-primary, #e11d48)'
                  : '1px solid var(--border-color, rgba(15, 23, 42, 0.1))',
                backgroundColor: selectedPlan === 'monthly'
                  ? 'rgba(225, 29, 72, 0.05)'
                  : 'var(--bg-app, #f8fafc)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: selectedPlan === 'monthly' ? 'var(--brand-primary, #e11d48)' : 'var(--text-main)' }}>
                {t.pro_plan_monthly_name || 'Monthly'}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
                $9.99<span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>/mo</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                {isId ? 'Batal kapan saja' : 'Cancel anytime'}
              </div>
            </div>

            {/* Yearly Card */}
            <div
              onClick={() => setSelectedPlan('yearly')}
              style={{
                padding: '10px 10px',
                borderRadius: 14,
                border: selectedPlan === 'yearly'
                  ? '2px solid var(--brand-primary, #e11d48)'
                  : '1px solid var(--border-color, rgba(15, 23, 42, 0.1))',
                backgroundColor: selectedPlan === 'yearly'
                  ? 'rgba(225, 29, 72, 0.05)'
                  : 'var(--bg-app, #f8fafc)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: selectedPlan === 'yearly' ? 'var(--brand-primary, #e11d48)' : 'var(--text-main)' }}>
                  {t.pro_plan_yearly_name || 'Yearly'}
                </span>
                <span
                  style={{
                    padding: '1px 5px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontSize: '0.58rem',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                  }}
                >
                  -34%
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
                $79<span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>/yr</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                ~$6.58/mo
              </div>
            </div>

            {/* Lifetime Card */}
            <div
              onClick={() => setSelectedPlan('lifetime')}
              style={{
                padding: '10px 10px',
                borderRadius: 14,
                border: selectedPlan === 'lifetime'
                  ? '2px solid var(--brand-primary, #e11d48)'
                  : '1px solid var(--border-color, rgba(15, 23, 42, 0.1))',
                backgroundColor: selectedPlan === 'lifetime'
                  ? 'rgba(225, 29, 72, 0.05)'
                  : 'var(--bg-app, #f8fafc)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: selectedPlan === 'lifetime' ? 'var(--brand-primary, #e11d48)' : 'var(--text-main)' }}>
                  {t.pro_plan_lifetime_name || 'Lifetime'}
                </span>
                <span
                  style={{
                    padding: '1px 5px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(225, 29, 72, 0.12)',
                    color: 'var(--brand-primary)',
                    fontSize: '0.58rem',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                  }}
                >
                  {t.pro_plan_best_value || 'BEST'}
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
                $129<span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}> {isId ? 'sekali' : 'once'}</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                {isId ? 'Milik selamanya' : 'Pay once, forever'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={handleUpgrade}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 12,
              backgroundColor: 'var(--brand-primary, #e11d48)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.94rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.28)',
              transition: 'all 0.15s ease',
            }}
          >
            <Crown size={16} />
            <span>
              {!user
                ? (selectedPlan === 'monthly'
                  ? (t.pro_signin_subscribe_monthly_btn || 'Sign In & Subscribe Monthly')
                  : selectedPlan === 'yearly'
                    ? (t.pro_signin_subscribe_yearly_btn || 'Sign In & Subscribe Yearly')
                    : (t.pro_signin_get_pass || 'Sign In & Get Lifetime Pass'))
                : (selectedPlan === 'monthly'
                  ? (t.pro_subscribe_monthly_btn || 'Subscribe Monthly ($9.99/mo)')
                  : selectedPlan === 'yearly'
                    ? (t.pro_subscribe_yearly_btn || 'Subscribe Yearly ($79/yr)')
                    : (t.pro_get_lifetime_pass || 'Get Lifetime Pass ($129)'))}
            </span>
            <ArrowRight size={15} />
          </button>

          {onContinueFree && (
            <button
              type="button"
              onClick={onContinueFree}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 12,
                backgroundColor: 'transparent',
                color: 'var(--text-muted, #94a3b8)',
                border: '1px solid var(--border-color, rgba(15, 23, 42, 0.1))',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {continueFreeLabel || t.pro_continue_free || 'Process First 10 Files (Free)'}
            </button>
          )}
        </div>

        {/* Micro-Trust Guarantee (Zero Wall of Text) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
          }}
        >
          <span>🔒 {isId ? 'Aktivasi Instan' : 'Instant Activation'}</span>
          <span>•</span>
          <span>⚡ {isId ? '0% Upload Server' : 'Zero Server Uploads'}</span>
          <span>•</span>
          <span>🛡️ {isId ? 'Garansi 30 Hari' : '30-Day Guarantee'}</span>
        </div>
      </div>
    </div>
  );
};
