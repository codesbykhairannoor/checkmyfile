import React from 'react';
import { getUiTranslations } from '../i18n/translations';
import { SeoHead } from '../components/seo/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Scale, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  currentLang: string;
}

export const TosPage: React.FC<Props> = ({ currentLang }) => {
  const t = getUiTranslations(currentLang);

  return (
    <>
      <SeoHead
        title={`${t.footerTos || 'Terms of Service'} - HandleMyFile`}
        description={t.pageTosSub || 'The Sleek Ledger'}
        currentLang={currentLang}
        slug="terms"
      />
      
      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        <Breadcrumbs currentLang={currentLang} items={[{ label: t.footerTos || 'Terms of Service' }]} />
        
        {/* Section 1: Hero Ledger */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <Scale size={64} className="text-brand-primary" style={{ margin: '0 auto 32px' }} />
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {t.pageTosHero || 'Terms of Service'}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
              {t.pageTosSub || 'Clear, transparent, and fair. Read the terms that govern the usage of the HandleMyFile platform.'}
            </p>
            <div style={{ marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle2 size={16} /> Last Updated: October 2024
            </div>
          </div>
        </section>

        {/* Section 2: Agreement & Accessibility */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'var(--brand-gradient)', color: '#fff', fontWeight: 900, fontSize: '1.5rem' }}>1</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>Agreement to Terms</h2>
            </div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: 64 }}>
              By accessing and using HandleMyFile, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service. Our platform is provided completely free of charge for both personal and commercial use.
            </p>
          </div>
        </section>

        {/* Section 3: Local Processing Guarantee */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'var(--brand-gradient)', color: '#fff', fontWeight: 900, fontSize: '1.5rem' }}>2</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>Local Processing Guarantee</h2>
            </div>
            <div style={{ paddingLeft: 64 }}>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
                HandleMyFile provides document manipulation tools that execute strictly within your local browser environment via WebAssembly. We guarantee that:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <ShieldCheck color="var(--brand-primary)" size={24} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.6 }}>Your files are never uploaded to our servers or any third-party infrastructure.</span>
                </li>
                <li style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <ShieldCheck color="var(--brand-primary)" size={24} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.6 }}>We do not retain copies of your data, metadata, or processed documents.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Acceptable Use Policy */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'var(--brand-gradient)', color: '#fff', fontWeight: 900, fontSize: '1.5rem' }}>3</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{t.pageTosSec1Title || 'Acceptable Use Policy'}</h2>
            </div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: 64 }}>
              {t.pageTosSec1Desc || 'You agree to use HandleMyFile only for lawful purposes. You must not use our tools to forge, manipulate, or falsify legal documents, government IDs, or any materials for fraudulent activities.'}
            </p>
          </div>
        </section>

        {/* Section 5: Intellectual Property */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'var(--brand-gradient)', color: '#fff', fontWeight: 900, fontSize: '1.5rem' }}>4</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{t.pageTosSec2Title || 'Intellectual Property'}</h2>
            </div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: 64 }}>
              {t.pageTosSec2Desc || 'You retain 100% ownership and all intellectual property rights to the documents you process using HandleMyFile. We claim zero rights, licenses, or ownership over your content.'}
            </p>
          </div>
        </section>

        {/* Section 6: Limitations & Modifications */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'var(--brand-gradient)', color: '#fff', fontWeight: 900, fontSize: '1.5rem' }}>5</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>Disclaimers & Liability</h2>
            </div>
            <div style={{ paddingLeft: 64, display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>{t.pageTosSec3Title || 'Service Modifications'}</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {t.pageTosSec3Desc || 'We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice. As an entirely client-side platform, we cannot guarantee compatibility with all browser versions.'}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>{t.pageTosSec4Title || 'Limitation of Liability'}</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {t.pageTosSec4Desc || 'Under no circumstances shall HandleMyFile, its creators, or contributors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools.'}
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};
