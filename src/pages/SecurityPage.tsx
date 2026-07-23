import React from 'react';
import { getUiTranslations } from '../i18n/translations';
import { SeoHead } from '../components/seo/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ShieldCheck, Lock, Cpu, EyeOff, GlobeLock, CheckCircle2 } from 'lucide-react';

interface Props {
  currentLang: string;
}

export const SecurityPage: React.FC<Props> = ({ currentLang }) => {
  const t = getUiTranslations(currentLang);

  return (
    <>
      <SeoHead
        title={`${t.footerSecurity || 'Security & Trust'} - HandleMyFile`}
        description={t.pageSecurityHeroSub || 'Bank-grade security powered by local WebAssembly engines.'}
        currentLang={currentLang}
        slug="security"
      />
      
      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        <Breadcrumbs currentLang={currentLang} items={[{ label: t.footerSecurity || 'Security' }]} />
        
        {/* Section 1: Hero */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24 }}>
              <ShieldCheck size={16} /> {t.pageSecurityBadge || 'Trust Center'}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {t.pageSecurityHero || 'Mathematical Privacy. Zero Uploads.'}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
              {t.pageSecurityHeroSub || 'Most document tools promise they delete your files after 1 hour. We promise we never see your files in the first place.'}
            </p>
          </div>
        </section>

        {/* Section 2: Architecture Diagram (Visual) */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 48, textAlign: 'center' }}>{t.pageSecuritySec2Title || 'The WebAssembly Revolution'}</h2>
            
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Step 1 */}
              <div style={{ flex: '1 1 300px', background: 'var(--bg-card)', padding: 32, borderRadius: 24, border: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--brand-glow)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Lock size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>1. Local Selection</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>You select a file. The browser locks the file in local memory. No network request is initiated.</p>
              </div>
              
              {/* Step 2 */}
              <div style={{ flex: '1 1 300px', background: 'var(--bg-card)', padding: 32, borderRadius: 24, border: '2px solid var(--brand-primary)', position: 'relative', boxShadow: '0 10px 30px var(--brand-glow)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--brand-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Cpu size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>2. Wasm Engine</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Our C/C++ engine runs compiled WebAssembly directly on your CPU to process the document offline.</p>
              </div>

              {/* Step 3 */}
              <div style={{ flex: '1 1 300px', background: 'var(--bg-card)', padding: 32, borderRadius: 24, border: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--brand-glow)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <GlobeLock size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>3. Direct Save</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>The processed file is reconstructed in memory and saved directly to your hard drive.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Safe Analytics */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <EyeOff size={48} className="text-brand-primary" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pageSecuritySec3Title || 'Your Documents Are Blind To Us'}</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {t.pageSecuritySec3Desc || 'While we use standard analytics to improve our website experience, our scripts never touch your documents. We do not extract metadata, text contents, or images. The document processing sandbox is entirely self-contained within your browser tab.'}
            </p>
          </div>
        </section>

        {/* Section 4: Compliance List */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>{t.pageSecuritySec4Title || 'Compliance by Default'}</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
                {t.pageSecuritySec4Desc || 'Because HandleMyFile cannot access your files, using our tools automatically complies with the strictest data protection laws worldwide.'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 600 }}><CheckCircle2 size={20} color="var(--brand-primary)" /> HIPAA (Healthcare Data)</li>
                <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 600 }}><CheckCircle2 size={20} color="var(--brand-primary)" /> GDPR (European Privacy)</li>
                <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 600 }}><CheckCircle2 size={20} color="var(--brand-primary)" /> CCPA (California Privacy)</li>
                <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-main)', fontWeight: 600 }}><CheckCircle2 size={20} color="var(--brand-primary)" /> NDA Protected Files</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <GlobeLock size={120} color="var(--border-color)" strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Section 5: Verify Yourself */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, textAlign: 'center' }}>{t.pageSecuritySec5Title || 'Don\'t Trust Us. Verify It.'}</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8, textAlign: 'center', marginBottom: 48 }}>
              {t.pageSecuritySec5Desc || 'You don\'t have to take our word for it. You can prove our offline guarantee yourself in 3 simple steps:'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 24, background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
                <strong>Step 1:</strong> Load HandleMyFile.com in your browser.
              </div>
              <div style={{ padding: 24, background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
                <strong>Step 2:</strong> Turn off your Wi-Fi or unplug your ethernet cable.
              </div>
              <div style={{ padding: 24, background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
                <strong>Step 3:</strong> Process any PDF. It will work perfectly, proving no server upload is required.
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Mission */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--brand-gradient)', color: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Lock size={48} style={{ margin: '0 auto 24px', opacity: 0.9 }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 24 }}>{t.pageSecuritySec6Title || 'The Future is Local'}</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.8 }}>
              {t.pageSecuritySec6Desc || 'We envision a web where utility apps respect your hardware and your privacy. Welcome to the new era of client-side computing.'}
            </p>
          </div>
        </section>

      </main>
    </>
  );
};
