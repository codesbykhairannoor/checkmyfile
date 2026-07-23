import React from 'react';
import { getUiTranslations } from '../i18n/translations';
import { SeoHead } from '../components/seo/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Briefcase, Scale, GraduationCap, Building2, Users, Lightbulb } from 'lucide-react';

interface Props {
  currentLang: string;
}

export const UseCasesPage: React.FC<Props> = ({ currentLang }) => {
  const t = getUiTranslations(currentLang);

  return (
    <>
      <SeoHead
        title={`${t.footerUseCases || 'Use Cases'} - HandleMyFile`}
        description={t.pageUseCasesHeroSub || 'See how professionals use our offline document tools.'}
        currentLang={currentLang}
        slug="use-cases"
      />
      
      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        <Breadcrumbs currentLang={currentLang} items={[{ label: t.footerUseCases || 'Use Cases' }]} />
        
        {/* Section 1: Hero */}
        <section style={{ width: '100%', padding: '120px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--brand-glow)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24 }}>
              <Briefcase size={16} /> {t.pageUseCasesBadge || 'Industry Solutions'}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 24, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {t.pageUseCasesHero || 'Built for Every Profession'}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
              {t.pageUseCasesHeroSub || 'From strict legal environments to creative agencies, discover why professionals trust our client-side processing architecture.'}
            </p>
          </div>
        </section>

        {/* Section 2: Legal & Law Firms */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 12, background: 'var(--brand-glow)', borderRadius: 16, color: 'var(--brand-primary)' }}>
                  <Scale size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{t.pageUseCasesSec2Title || 'Legal & Law Firms'}</h2>
              </div>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pageUseCasesSec2Desc || 'Attorneys handle highly confidential NDAs, contracts, and court filings. Uploading these documents to random cloud APIs is a major liability. With HandleMyFile, legal teams can redact, merge, and split PDF case files entirely offline, ensuring absolute client confidentiality.'}
              </p>
            </div>
            <div style={{ flex: '1 1 400px', padding: 40, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Popular Tools for Legal:</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ padding: '12px 16px', background: 'var(--bg-app)', borderRadius: 8, fontWeight: 500 }}>Combine Exhibits (Merge PDF)</li>
                <li style={{ padding: '12px 16px', background: 'var(--bg-app)', borderRadius: 8, fontWeight: 500 }}>Blackout Text (Redact PDF)</li>
                <li style={{ padding: '12px 16px', background: 'var(--bg-app)', borderRadius: 8, fontWeight: 500 }}>Add Passwords (Protect PDF)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Human Resources */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap-reverse' }}>
            <div style={{ flex: '1 1 400px', padding: 40, background: 'var(--bg-app)', borderRadius: 24, border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Popular Tools for HR:</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, fontWeight: 500 }}>Extract Resume Pages (Split PDF)</li>
                <li style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, fontWeight: 500 }}>Compress Offer Letters</li>
                <li style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, fontWeight: 500 }}>Excel to PDF (Salary tables)</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 12, background: 'var(--brand-glow)', borderRadius: 16, color: 'var(--brand-primary)' }}>
                  <Users size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{t.pageUseCasesSec3Title || 'Human Resources (HR)'}</h2>
              </div>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pageUseCasesSec3Desc || 'HR departments deal with PII (Personally Identifiable Information) on a daily basis. Scanning IDs, handling payroll spreadsheets, and managing offer letters requires strict GDPR/CCPA compliance. HandleMyFile lets HR professionals manage these files without violating internal IT security policies.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Students & Education */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-app)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 12, background: 'var(--brand-glow)', borderRadius: 16, color: 'var(--brand-primary)' }}>
                  <GraduationCap size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{t.pageUseCasesSec4Title || 'Students & Education'}</h2>
              </div>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pageUseCasesSec4Desc || 'Students shouldn\'t have to pay $20/month just to merge their group project assignments or compress a presentation to fit the university portal\'s 5MB upload limit. HandleMyFile provides unlimited access to premium tools for free, with zero file size limits.'}
              </p>
            </div>
            <div style={{ flex: '1 1 400px', padding: 40, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Popular Tools for Students:</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ padding: '12px 16px', background: 'var(--bg-app)', borderRadius: 8, fontWeight: 500 }}>Merge Assignments</li>
                <li style={{ padding: '12px 16px', background: 'var(--bg-app)', borderRadius: 8, fontWeight: 500 }}>Compress Presentations (PPTX to PDF)</li>
                <li style={{ padding: '12px 16px', background: 'var(--bg-app)', borderRadius: 8, fontWeight: 500 }}>Image to PDF (Scanner apps)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Real Estate */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap-reverse' }}>
            <div style={{ flex: '1 1 400px', padding: 40, background: 'var(--bg-app)', borderRadius: 24, border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Popular Tools for Real Estate:</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, fontWeight: 500 }}>Sign Leases (Sign PDF)</li>
                <li style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, fontWeight: 500 }}>Watermark Property Photos</li>
                <li style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, fontWeight: 500 }}>Compress High-Res Brochures</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 12, background: 'var(--brand-glow)', borderRadius: 16, color: 'var(--brand-primary)' }}>
                  <Building2 size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{t.pageUseCasesSec5Title || 'Real Estate & Agents'}</h2>
              </div>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {t.pageUseCasesSec5Desc || 'Real estate agents handle massive property brochures packed with high-resolution images that are too large to email to clients. They also need to quickly watermark property plans and sign lease agreements. HandleMyFile handles 100MB+ files instantly.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Try it Out */}
        <section style={{ width: '100%', padding: '100px 24px', background: 'var(--brand-gradient)', color: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Lightbulb size={48} style={{ margin: '0 auto 24px', opacity: 0.9 }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 24 }}>{t.pageUseCasesSec6Title || 'Find Your Own Use Case'}</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.8, marginBottom: 40 }}>
              {t.pageUseCasesSec6Desc || 'No matter your industry, if you work with documents, HandleMyFile is the safest and fastest way to get the job done. Try our full suite of 20+ tools today.'}
            </p>
            <button style={{ background: '#fff', color: 'var(--brand-primary)', border: 'none', padding: '16px 32px', borderRadius: 100, fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              {t.allTools || 'View All Tools'}
            </button>
          </div>
        </section>

      </main>
    </>
  );
};
