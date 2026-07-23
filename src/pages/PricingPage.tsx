import React from 'react';
import { getUiTranslations } from '../i18n/translations';
import { SeoHead } from '../components/seo/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Check, X, ShieldCheck, Zap, ServerOff, Coffee } from 'lucide-react';

interface Props {
  currentLang: string;
}

export const PricingPage: React.FC<Props> = ({ currentLang }) => {
  const t = getUiTranslations(currentLang);

  return (
    <>
      <SeoHead
        title={`${t.footerPricing || 'Pricing'} - HandleMyFile`}
        description={t.pagePricingHeroSub || '100% Free Forever. No subscriptions, no hidden fees.'}
        currentLang={currentLang}
        slug="pricing"
      />
      
      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        <Breadcrumbs currentLang={currentLang} items={[{ label: t.footerPricing || 'Pricing' }]} />
        
        {/* Section 1: Hero */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24 }}>
              <Zap size={16} /> {t.pagePricingBadge || 'Radically Free'}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {t.pagePricingHero || 'Zero Subscriptions. Zero Limits.'}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
              {t.pagePricingHeroSub || 'Enterprise-grade document tools usually cost $20/month. We believe privacy and utility should be a fundamental human right. HandleMyFile is completely free.'}
            </p>
          </div>
        </section>

        {/* Section 2: Pricing Table */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              {/* Competitor */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 48, border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 16 }}>{t.pagePricingComp || 'Traditional Cloud Tools'}</h3>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 32 }}>$20<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)' }}><X size={20} /> Data uploaded to their servers</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)' }}><X size={20} /> File size limits on free tier</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)' }}><X size={20} /> Requires email registration</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)' }}><X size={20} /> Slow network processing</li>
                </ul>
              </div>
              
              {/* HandleMyFile */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 48, border: '2px solid var(--brand-primary)', position: 'relative', boxShadow: '0 20px 40px var(--brand-glow)' }}>
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--brand-gradient)', color: '#fff', padding: '4px 16px', borderRadius: 100, fontWeight: 800, fontSize: '0.85rem' }}>RECOMMENDED</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)', marginBottom: 16 }}>HandleMyFile</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 32, lineHeight: 1 }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/forever</span></div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 500 }}><Check size={20} color="var(--brand-primary)" /> 100% Client-side processing</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 500 }}><Check size={20} color="var(--brand-primary)" /> Unlimited file sizes & usage</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 500 }}><Check size={20} color="var(--brand-primary)" /> No accounts or logins needed</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 500 }}><Check size={20} color="var(--brand-primary)" /> Instant WebAssembly speed</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why Free */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <ServerOff size={48} className="text-brand-primary" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pagePricingSec3Title || 'How is this possible?'}</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {t.pagePricingSec3Desc || 'Traditional tools have expensive server bills because they process your files on their cloud. We ported C++ and Rust engines to run inside your browser. Your computer does the heavy lifting, meaning our server costs are near zero. We pass those savings directly to you.'}
            </p>
          </div>
        </section>

        {/* Section 4: Transparent & Sustainable */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pagePricingSec4Title || 'Sustainable & Transparent'}</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pagePricingSec4Desc || 'To keep HandleMyFile 100% free forever, we rely on non-intrusive advertisements and standard web analytics. However, your privacy is our top priority. We never scan, extract, or sell the contents of your files. What happens in the editor, stays in the editor.'}
              </p>
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: 60, background: 'var(--brand-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Enterprise Compliant</span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: 'var(--brand-primary)' }}></div>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Zero-Data Retention</span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: 'var(--brand-primary)' }}></div>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>GDPR & CCPA Friendly</span>
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pagePricingSec5Title || 'Free for Business Use'}</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pagePricingSec5Desc || 'Yes, you can use HandleMyFile for your company. In fact, our local processing architecture makes us the only platform safe enough for strict corporate environments, legal teams, and healthcare professionals.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Support Us */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--brand-gradient)', color: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Coffee size={48} style={{ margin: '0 auto 24px', opacity: 0.9 }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 24 }}>{t.pagePricingSec6Title || 'Support the Project'}</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.8, marginBottom: 40 }}>
              {t.pagePricingSec6Desc || 'We don\'t charge a subscription, but keeping the domain and development alive takes time. If HandleMyFile saved your day, consider sharing it with your team. Word of mouth is our only marketing strategy.'}
            </p>
            <button style={{ background: '#fff', color: 'var(--brand-primary)', border: 'none', padding: '16px 32px', borderRadius: 100, fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              {t.shareBtn || 'Share HandleMyFile'}
            </button>
          </div>
        </section>

      </main>
    </>
  );
};
