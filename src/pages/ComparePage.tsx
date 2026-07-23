import React from 'react';
import { getUiTranslations } from '../i18n/translations';
import { SeoHead } from '../components/seo/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Check, X, ShieldCheck, Zap, CloudOff, ArrowRight, Award } from 'lucide-react';

interface Props {
  currentLang: string;
}

export const ComparePage: React.FC<Props> = ({ currentLang }) => {
  const t = getUiTranslations(currentLang);

  return (
    <>
      <SeoHead
        title={`${t.footerCompare || 'Compare'} - HandleMyFile`}
        description={t.pageCompareHeroSub || 'See why HandleMyFile is the superior alternative to cloud PDF tools.'}
        currentLang={currentLang}
        slug="compare"
      />
      
      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        <Breadcrumbs currentLang={currentLang} items={[{ label: t.footerCompare || 'Compare' }]} />
        
        {/* Section 1: Hero */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24 }}>
              <Award size={16} /> {t.pageCompareBadge || 'The Smart Alternative'}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {t.pageCompareHero || 'HandleMyFile vs The Rest'}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
              {t.pageCompareHeroSub || 'Tired of waiting for files to upload? Frustrated by 5MB file limits? Discover why professionals are switching to client-side document tools.'}
            </p>
          </div>
        </section>

        {/* Section 2: Feature Matrix */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 48, textAlign: 'center' }}>{t.pageCompareSec2Title || 'Feature Comparison'}</h2>
            
            <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '24px 32px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', fontWeight: 800 }}>
                <div style={{ color: 'var(--text-muted)' }}>Feature</div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Typical Cloud API</div>
                <div style={{ textAlign: 'center', color: 'var(--brand-primary)' }}>HandleMyFile</div>
              </div>
              
              {[
                ['File Upload Required', <Check size={20} color="var(--text-muted)" />, <X size={20} color="var(--brand-primary)" />],
                ['Data Privacy Guarantee', <X size={20} color="var(--text-muted)" />, <Check size={20} color="var(--brand-primary)" />],
                ['Max File Size Limit', 'Typically 5MB - 15MB', 'Unlimited (RAM constrained)'],
                ['Offline Capability', <X size={20} color="var(--text-muted)" />, <Check size={20} color="var(--brand-primary)" />],
                ['Cost', 'Free Tier + $20/mo', '100% Free Forever'],
                ['Account Registration', 'Required for large files', 'Never Required'],
                ['Processing Speed', 'Dependent on Internet Speed', 'Instant (Local CPU)']
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '24px 32px', borderBottom: i === 6 ? 'none' : '1px solid var(--border-color)', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row[0]}</div>
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{row[1]}</div>
                  <div style={{ textAlign: 'center', color: 'var(--text-main)', fontWeight: 700 }}>{row[2]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Speed Kills */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <Zap size={48} className="text-brand-primary" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pageCompareSec3Title || 'Stop Waiting on Progress Bars'}</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {t.pageCompareSec3Desc || 'With cloud tools, if you want to merge three 50MB PDFs, you have to upload 150MB of data. Then wait for their server to process it. Then download the 150MB result. HandleMyFile processes the 150MB instantly on your local disk.'}
            </p>
          </div>
        </section>

        {/* Section 4: Privacy is not a Premium Feature */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap-reverse' }}>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: 60, background: 'var(--brand-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={64} color="var(--brand-primary)" />
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pageCompareSec4Title || 'Privacy is Not a Premium Feature'}</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pageCompareSec4Desc || 'Competitors ask you to pay $20 a month for "Secure Processing". We believe you shouldn\'t have to pay a ransom to keep your documents private. Our offline architecture guarantees privacy by default, for free.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: The File Size Trap */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pageCompareSec5Title || 'Escape the File Size Trap'}</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pageCompareSec5Desc || 'Have you ever tried to compress a PDF, only to be told the file is "Too large for the free tier"? We hate artificial limits. HandleMyFile uses your device\'s RAM, meaning you can process 1GB+ files if your computer can handle it.'}
              </p>
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <CloudOff size={120} color="var(--border-color)" strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Section 6: Switch Today */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--brand-gradient)', color: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <ArrowRight size={48} style={{ margin: '0 auto 24px', opacity: 0.9 }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 24 }}>{t.pageCompareSec6Title || 'Make the Switch Today'}</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.8, marginBottom: 40 }}>
              {t.pageCompareSec6Desc || 'Stop compromising on speed, privacy, and cost. Join thousands of professionals who have already switched to the fastest offline document toolkit on the web.'}
            </p>
          </div>
        </section>

      </main>
    </>
  );
};
