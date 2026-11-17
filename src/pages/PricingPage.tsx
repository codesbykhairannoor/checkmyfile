import React, { useState } from 'react';
import { getUiTranslations } from '../i18n/translations';
import { SeoHead } from '../components/seo/SeoHead';
import { Check, X, ShieldCheck, Zap, ServerOff, Coffee, Container, Copy, CheckCircle2, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { redirectToLemonSqueezy, type PlanType } from '../utils/lemonSqueezy';
import { authTranslations } from '../i18n/authTranslations';

interface Props {
  currentLang: string;
}

export const PricingPage: React.FC<Props> = ({ currentLang }) => {
  const t = getUiTranslations(currentLang);
  const tAuth = authTranslations[currentLang] || authTranslations['en'] || {};
  const { user, isPro, openAuthModal } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleBuyPlan = (plan: PlanType) => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (isPro) {
      return;
    }
    redirectToLemonSqueezy(user, plan);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://handlemyfile.com';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'HandleMyFile - 100% Private Document Tools',
          text: 'Free, private client-side document processing with zero server uploads.',
          url: shareUrl,
        });
        return;
      } catch (_) {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (_) {}
    }
  };

  return (
    <>
      <SeoHead
        title={`${t.footerPricing || 'Pricing'} - HandleMyFile`}
        description={t.pagePricingHeroSub || 'Zero monthly subscriptions. Generous free starter tier and lifetime pass.'}
        currentLang={currentLang}
        slug="pricing"
      />
      
      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        
        {/* Section 1: Hero */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: '#eff6ff', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, border: '1px solid #bfdbfe' }}>
              <Zap size={16} /> {t.pagePricingBadge || 'Fair & Transparent Pricing'}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {t.pagePricingHero || 'Zero Subscriptions. Fair & Private.'}
            </h1>
            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>
              {t.pagePricingHeroSub || 'Enterprise-grade document tools usually cost $20/month. We believe privacy and utility should be accessible to everyone. HandleMyFile offers a generous free tier and an affordable lifetime pass.'}
            </p>
          </div>
        </section>

        {/* Section 2: Pricing Table (4 Cards Grid) */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
              
              {/* Card 1: HandleMyFile Web (Free Starter Plan) */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '1.5px solid var(--border-color)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
                  {tAuth.pro_plan_free_name || 'Free Starter'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  {tAuth.pro_plan_free_desc || 'Essential private document tools for everyone'}
                </p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1 }}>
                  $0<span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>/forever</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}><Check size={18} color="var(--brand-primary)" /> {t.pricingHmfItem1 || '100% Client-side processing'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}><Check size={18} color="var(--brand-primary)" /> {t.pricingHmfItem2 || 'Standard batch up to 10 files'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}><Check size={18} color="var(--brand-primary)" /> {t.pricingHmfItem3 || 'No account or credit card needed'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}><Check size={18} color="var(--brand-primary)" /> {t.pricingHmfItem4 || 'Instant WebAssembly speed'}</li>
                </ul>
                <div style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') window.location.href = currentLang === 'en' ? '/' : `/${currentLang}`;
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                    }}
                  >
                    {t.useFreeToolsBtn || 'Use Free Tools'}
                  </button>
                </div>
              </div>

              {/* Card 2: PRO Monthly ($9.99/mo) */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '1.5px solid var(--border-color)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
                  {tAuth.pro_plan_monthly_name || 'PRO Monthly'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  {tAuth.pro_plan_monthly_desc || 'Flexible monthly billing, cancel anytime in 1 click'}
                </p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1 }}>
                  $9.99<span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.86rem' }}>
                    <Sparkles size={16} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span><strong>4 Web Apps:</strong> HandleMyFile + HelpMyIMG + SolveMyMedia + CreateMy-QR</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <span>{tAuth.pro_benefit_unlimited_batch || 'Unlimited ultra-batch (100+ files)'}</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <span>{tAuth.pro_benefit_custom_name || 'Custom output file renaming'}</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <span>Priority WebAssembly CPU & RAM acceleration</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <span>Commercial licensing included</span>
                  </li>
                </ul>
                <div style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => handleBuyPlan('monthly')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'var(--bg-app)',
                      border: '1.5px solid var(--brand-primary)',
                      color: 'var(--brand-primary)',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Crown size={16} />
                    {!user
                      ? (tAuth.pro_signin_subscribe_monthly_btn || 'Sign In & Subscribe Monthly')
                      : (tAuth.pro_subscribe_monthly_btn || 'Subscribe Monthly ($9.99/mo)')}
                  </button>
                </div>
              </div>

              {/* Card 3: PRO Yearly ($79/yr) - MOST POPULAR */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '2px solid #10b981', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', padding: '4px 18px', borderRadius: 100, fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  POPULAR • {tAuth.pro_plan_yearly_save || 'SAVE 34%'}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
                  {tAuth.pro_plan_yearly_name || 'PRO Yearly'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {tAuth.pro_plan_yearly_desc || 'Save 34% (was $119.88) • Just $6.58/mo billed annually'}
                </p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1 }}>
                  $79<span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>/yr</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  <span style={{ textDecoration: 'line-through', marginRight: 6, fontWeight: 600 }}>$119.88</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>~ $6.58 / month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.86rem' }}>
                    <Sparkles size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span><strong>4 Web Apps:</strong> HandleMyFile + HelpMyIMG + SolveMyMedia + CreateMy-QR</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>{tAuth.pro_benefit_unlimited_batch || 'Unlimited ultra-batch (100+ files)'}</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>{tAuth.pro_benefit_custom_name || 'Custom output file renaming'}</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>Priority WebAssembly CPU & RAM acceleration</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>Commercial licensing & continuous updates</span>
                  </li>
                </ul>
                <div style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => handleBuyPlan('yearly')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: '#10b981',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    }}
                  >
                    <Crown size={16} />
                    {!user
                      ? (tAuth.pro_signin_subscribe_yearly_btn || 'Sign In & Subscribe Yearly')
                      : (tAuth.pro_subscribe_yearly_btn || 'Subscribe Yearly ($79/yr)')}
                  </button>
                </div>
              </div>

              {/* Card 4: Founder Lifetime Pass ($129) - BEST VALUE */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '2px solid var(--brand-primary)', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--brand-primary)', color: '#fff', padding: '4px 18px', borderRadius: 100, fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  {tAuth.pro_plan_best_value || 'BEST VALUE'} • {tAuth.pro_lifetime_apps_included || '4 WEBS + WINDOWS + APK'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Crown size={20} color="var(--brand-primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--brand-primary)', margin: 0 }}>
                    {tAuth.pro_plan_lifetime_name || 'Founder Lifetime Pass'}
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {tAuth.pro_plan_lifetime_desc || 'Was $169 • Pay once, own forever • 4 Web Apps + Windows App + Mobile APK'}
                </p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1 }}>
                  $129<span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}> once</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  <span style={{ textDecoration: 'line-through', marginRight: 6, fontWeight: 600 }}>$169</span>
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>Zero subscriptions forever</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.86rem' }}>
                    <Sparkles size={16} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span><strong>Lifetime 4 Web Apps:</strong> HandleMyFile + HelpMyIMG + SolveMyMedia + CreateMy-QR</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.86rem' }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span><strong>Windows App & Mobile APK:</strong> Free lifetime access to upcoming desktop & mobile apps</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <span>Unlimited Ultra-Batch (100+ files simultaneously)</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <span>Custom output file renaming without restrictions</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <span>VIP founder status, zero renewal fees forever</span>
                  </li>
                </ul>
                <div style={{ marginTop: 24 }}>
                  {isPro ? (
                    <button
                      type="button"
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: '#22c55e',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <CheckCircle2 size={18} />
                      PRO Membership Active
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBuyPlan('lifetime')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'var(--brand-primary)',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                      }}
                    >
                      <Crown size={18} />
                      {!user
                        ? (tAuth.pro_signin_get_pass || 'Sign In & Get Lifetime Pass')
                        : (tAuth.pro_get_lifetime_pass || 'Get Lifetime Pass ($129)')}
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Comparison with Cloud Competitors & Docker Self-Hosted */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {/* Traditional Cloud Competitors */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8 }}>
                  {t.pagePricingComp || 'Traditional Cloud Tools'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>Cloud document converters</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>
                  $20<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}><X size={18} color="#ef4444" /> {t.pricingCompItem1 || 'Data uploaded to their remote servers'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}><X size={18} color="#ef4444" /> {t.pricingCompItem2 || 'File size & daily task throttling'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}><X size={18} color="#ef4444" /> {t.pricingCompItem3 || 'Mandatory email login required'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}><X size={18} color="#ef4444" /> {t.pricingCompItem4 || 'Slow network upload & processing'}</li>
                </ul>
              </div>

              {/* Enterprise On-Premise Docker */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700, marginBottom: 8 }}>
                  <Container size={15} color="var(--brand-primary)" /> {t.pricingEnterpriseTitle || 'On-Premises / Docker'}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
                  {t.pricingEnterprisePrice || 'Self-Hosted'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>Deploy to your own servers</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>
                  $0<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}> (Open)</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.88rem' }}><Check size={18} color="var(--brand-primary)" /> {t.pricingEnterpriseItem1 || '100% Air-Gapped (Runs offline without internet)'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.88rem' }}><Check size={18} color="var(--brand-primary)" /> {t.pricingEnterpriseItem2 || 'Docker & Kubernetes deployment ready'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.88rem' }}><Check size={18} color="var(--brand-primary)" /> {t.pricingEnterpriseItem3 || 'Unlimited internal employee seats'}</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontSize: '0.88rem' }}><Check size={18} color="var(--brand-primary)" /> {t.pricingEnterpriseItem4 || 'Zero server cost, zero data egress'}</li>
                </ul>
                <div style={{ marginTop: 24 }}>
                  <a
                    href="https://github.com/codesbykhairannoor/checkmyfile/blob/main/DOCKER.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'var(--bg-app)',
                      border: '1.5px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                    }}
                  >
                    {t.pricingEnterpriseBtn || 'View Docker Guide'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why Free */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <ServerOff size={48} color="var(--brand-primary)" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>
              {t.pagePricingSec3Title || 'How is this possible?'}
            </h2>
            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {t.pagePricingSec3Desc || 'Traditional tools have expensive server bills because they process your files on their cloud. We ported C++ and Rust engines to run inside your browser. Your computer does the heavy lifting, meaning our server costs are near zero. We pass those savings directly to you.'}
            </p>
          </div>
        </section>

        {/* Section 4: Transparent & Sustainable */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>
                {t.pagePricingSec4Title || 'Sustainable & Transparent'}
              </h2>
              <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pagePricingSec4Desc || 'To keep HandleMyFile sustainable, we offer a generous Free Starter plan alongside an optional Founder Lifetime Pass. Your privacy is our top priority: all files are processed locally on your device in browser RAM with zero server uploads.'}
              </p>
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: 60, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={64} color="var(--brand-primary)" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Enterprise Ready */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap-reverse' }}>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ padding: 32, background: 'var(--bg-app)', borderRadius: 24, border: '1px solid var(--border-color)', width: '100%' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: 'var(--brand-primary)' }}></div>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.pricingEnterpriseCompliant || 'Enterprise Compliant'}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: 'var(--brand-primary)' }}></div>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.pricingZeroDataRetention || 'Zero-Data Retention'}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: 'var(--brand-primary)' }}></div>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.pricingGdprFriendly || 'GDPR & CCPA Friendly'}</span>
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>
                {t.pagePricingSec5Title || 'Free for Business Use'}
              </h2>
              <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pagePricingSec5Desc || 'Yes, you can use HandleMyFile for your company. In fact, our local processing architecture makes us the only platform safe enough for strict corporate environments, legal teams, and healthcare professionals.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Support Us */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--brand-primary)', color: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Coffee size={48} style={{ margin: '0 auto 24px', opacity: 0.95 }} />
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: '#fff' }}>
              {t.pagePricingSec6Title || 'Support the Project'}
            </h2>
            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', opacity: 0.95, lineHeight: 1.8, marginBottom: 40, color: '#fff' }}>
              {t.pagePricingSec6Desc || 'We don\'t charge a subscription, but keeping the domain and development alive takes time. If HandleMyFile saved your day, consider sharing it with your team. Word of mouth is our only marketing strategy.'}
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleShare}
                style={{
                  background: '#fff',
                  color: 'var(--brand-primary)',
                  border: 'none',
                  padding: '16px 36px',
                  borderRadius: 100,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                {copied ? <CheckCircle2 size={18} color="#16a34a" /> : <Copy size={18} />}
                <span>{copied ? (t.copiedShareLink || 'Link Copied to Clipboard!') : (t.shareBtn || 'Share HandleMyFile')}</span>
              </button>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};
