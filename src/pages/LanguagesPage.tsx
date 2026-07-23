import React from 'react';
import { getUiTranslations } from '../i18n/translations';
import { SeoHead } from '../components/seo/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Globe, Globe2, Languages, MapPin, CheckCircle2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';

interface Props {
  currentLang: string;
}

export const LanguagesPage: React.FC<Props> = ({ currentLang }) => {
  const t = getUiTranslations(currentLang);

  return (
    <>
      <SeoHead
        title={`${t.footerLanguages || 'Supported Languages'} - HandleMyFile`}
        description={t.pageLangHeroSub || 'HandleMyFile is available in 30 languages. View our global directory.'}
        currentLang={currentLang}
        slug="languages"
      />
      
      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        <Breadcrumbs currentLang={currentLang} items={[{ label: t.footerLanguages || 'Supported Languages' }]} />
        
        {/* Section 1: Hero */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24 }}>
              <Globe size={16} /> {t.pageLangBadge || 'Global Platform'}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {t.pageLangHero || 'Available Worldwide'}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
              {t.pageLangHeroSub || 'Document utilities should be accessible to everyone, regardless of what language you speak. We currently support 30 localized versions of HandleMyFile.'}
            </p>
          </div>
        </section>

        {/* Section 2: Massive Language Grid */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 48, textAlign: 'center' }}>{t.pageLangSec2Title || 'Select Your Region'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {SUPPORTED_LANGUAGES.map(lang => (
                <a 
                  key={lang.code}
                  href={`/${lang.code}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 16,
                    textDecoration: 'none',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px var(--brand-glow)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                  }}
                >
                  <MapPin size={18} color="var(--brand-primary)" />
                  {lang.nativeName}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Universal Design */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap-reverse' }}>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: 60, background: 'var(--brand-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Languages size={64} color="var(--brand-primary)" />
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pageLangSec3Title || 'Universal Interface'}</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pageLangSec3Desc || 'Every tool, button, error message, and guide on HandleMyFile has been localized. We maintain a strict translation matrix to ensure your experience feels native and intuitive.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Fast Loading Globally */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pageLangSec4Title || 'Zero Latency, Anywhere'}</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pageLangSec4Desc || 'Because HandleMyFile relies on WebAssembly processing instead of cloud servers, it doesn\'t matter if you are in New York or Jakarta. You will experience the exact same instant document processing speeds without network latency.'}
              </p>
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <Globe2 size={120} color="var(--border-color)" strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Section 5: Accuracy & Community */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <CheckCircle2 size={48} className="text-brand-primary" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pageLangSec5Title || 'Community Driven'}</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {t.pageLangSec5Desc || 'Notice a translation that feels slightly off? We rely on our global user base to help refine and perfect our localizations. Contact us to suggest improvements for your native language.'}
            </p>
          </div>
        </section>

        {/* Section 6: Try it Now */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--brand-gradient)', color: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 24 }}>{t.pageLangSec6Title || 'Ready to Process?'}</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.8, marginBottom: 40 }}>
              {t.pageLangSec6Desc || 'Choose a tool below to get started securely and for free.'}
            </p>
          </div>
        </section>

      </main>
    </>
  );
};
