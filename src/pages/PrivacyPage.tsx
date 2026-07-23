import React from 'react';
import { getUiTranslations } from '../i18n/translations';
import { SeoHead } from '../components/seo/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ShieldAlert, Lock, Database, EyeOff, Cpu } from 'lucide-react';

interface Props {
  currentLang: string;
}

export const PrivacyPage: React.FC<Props> = ({ currentLang }) => {
  const t = getUiTranslations(currentLang);

  return (
    <>
      <SeoHead
        title={`${t.footerPrivacy || 'Privacy Policy'} - HandleMyFile`}
        description={t.pagePrivacySub || 'The Secure Vault'}
        currentLang={currentLang}
        slug="privacy"
      />
      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        <Breadcrumbs currentLang={currentLang} items={[{ label: t.footerPrivacy || 'Privacy Policy' }]} />
        
        {/* Section 1: Hero Vault */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'var(--brand-glow)', filter: 'blur(150px)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-app)', border: '2px solid var(--brand-primary)', color: 'var(--brand-primary)', marginBottom: 40, boxShadow: '0 0 40px var(--brand-glow)' }}>
              <ShieldAlert size={50} />
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              {t.pagePrivacyHero || 'The Secure Vault'}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>
              {t.pagePrivacySub || 'Your files never leave your device. Our 100% offline Wasm architecture guarantees absolute data privacy and security.'}
            </p>
          </div>
        </section>

        {/* Section 2: Data Handling Matrix */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 800, fontSize: '0.9rem', marginBottom: 24 }}>01 &mdash; THE MATRIX</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', lineHeight: 1.2 }}>{t.pagePrivacySec1Title || 'Data Handling Matrix'}</h2>
            <div style={{ background: 'var(--bg-card)', padding: 48, borderRadius: 32, border: '1px solid var(--border-color)', borderLeft: '4px solid var(--brand-primary)' }}>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pagePrivacySec1Desc || 'We do not collect IP addresses. We do not store your files. We do not require email registrations. Every single bit of your document data remains exclusively on your physical device at all times.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Zero Data Collection */}
        <section style={{ width: '100%', padding: '80px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
              <div className="hover-lift" style={{ padding: 40, background: 'var(--bg-app)', borderRadius: 24, border: '1px solid var(--border-color)', borderTop: '4px solid var(--brand-primary)' }}>
                <Lock size={32} className="text-brand-primary" style={{ marginBottom: 20 }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 16 }}>Zero Data Collection</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>We do not collect, store, or transmit your documents. HandleMyFile does not even have a database for user files. Processing occurs entirely within your browser's memory.</p>
              </div>
              <div className="hover-lift" style={{ padding: 40, background: 'var(--bg-app)', borderRadius: 24, border: '1px solid var(--border-color)', borderTop: '4px solid var(--brand-primary)' }}>
                <Database size={32} className="text-brand-primary" style={{ marginBottom: 20 }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 16 }}>No Cloud Uploads</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Traditional tools force you to upload sensitive PDFs to foreign servers. We utilize WebAssembly to bring the server to you. Your network tab will prove no files are sent.</p>
              </div>
              <div className="hover-lift" style={{ padding: 40, background: 'var(--bg-app)', borderRadius: 24, border: '1px solid var(--border-color)', borderTop: '4px solid var(--brand-primary)' }}>
                <EyeOff size={32} className="text-brand-primary" style={{ marginBottom: 20 }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 16 }}>Anonymous Usage</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>We do not require accounts, logins, or email registrations. You remain completely anonymous while using the HandleMyFile platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: How Client-Side Works */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 800, fontSize: '0.9rem', marginBottom: 24 }}>02 &mdash; ARCHITECTURE</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', lineHeight: 1.2 }}>{t.pagePrivacySec2Title || 'How Client-Side Works'}</h2>
            <div style={{ position: 'relative', background: 'var(--brand-gradient)', color: '#fff', padding: 48, borderRadius: 32, boxShadow: '0 20px 40px var(--brand-glow)' }}>
              <Cpu size={64} style={{ margin: '0 auto 24px' }} />
              <p style={{ fontSize: '1.15rem', lineHeight: 1.8, maxWidth: 700, margin: '0 auto', fontWeight: 500 }}>
                {t.pagePrivacySec2Desc || 'When you select a file on HandleMyFile, it is loaded directly into your browser\'s RAM. The WebAssembly engine processes the file locally and prompts a download directly from memory. The file never travels across the internet.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Third-Party Integrations */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 800, fontSize: '0.9rem', marginBottom: 24 }}>03 &mdash; INDEPENDENCE</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', lineHeight: 1.2 }}>{t.pagePrivacySec3Title || 'Third-Party Integrations'}</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, borderLeft: '4px solid var(--brand-primary)', paddingLeft: 32, fontStyle: 'italic' }}>
              {t.pagePrivacySec3Desc || 'We are fiercely independent. We do not embed hidden analytics trackers, advertising networks, or third-party cookies that could compromise your privacy. What happens on HandleMyFile stays on HandleMyFile.'}
            </p>
          </div>
        </section>

        {/* Section 6: Global Compliance */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ background: 'var(--brand-glow)', color: 'var(--brand-primary)', padding: '12px 24px', borderRadius: 100, fontWeight: 900, fontSize: '1.2rem', border: '2px solid var(--brand-primary)' }}>GDPR</div>
              <div style={{ background: 'var(--brand-glow)', color: 'var(--brand-primary)', padding: '12px 24px', borderRadius: 100, fontWeight: 900, fontSize: '1.2rem', border: '2px solid var(--brand-primary)' }}>CCPA</div>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{t.pagePrivacySec4Title || 'Global Compliance'}</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>
              {t.pagePrivacySec4Desc || 'Because our architecture mathematically prevents us from accessing your files, HandleMyFile inherently exceeds the privacy requirements of GDPR, CCPA, and other global data protection regulations.'}
            </p>
          </div>
        </section>

      </main>
    </>
  );
};
