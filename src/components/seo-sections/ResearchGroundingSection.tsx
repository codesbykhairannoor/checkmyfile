import React from 'react';
import { RESEARCH_TRANSLATIONS } from '../../i18n/researchTranslations';
import { ShieldCheck, BookOpen, Cpu, FileCheck } from 'lucide-react';

interface ResearchGroundingSectionProps {
  lang: string;
}

export const ResearchGroundingSection: React.FC<ResearchGroundingSectionProps> = ({ lang }) => {
  const t = RESEARCH_TRANSLATIONS[lang] || RESEARCH_TRANSLATIONS['en'];

  return (
    <section 
      id="research-foundations"
      aria-label="Academic Foundations & Standards"
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '80px 24px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with Academic Badge */}
        <header style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '16px'
          }}>
            <BookOpen size={16} color="#2563eb" />
            <span>{t.researchBadge}</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#0f172a',
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em'
          }}>
            {t.researchHomeTitle}
          </h2>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.75,
            color: '#475569',
            maxWidth: '860px',
            margin: '0 auto'
          }}>
            {t.researchHomeSub}
          </p>
        </header>

        {/* 3 Citation / Architecture Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {/* Card 1: Local-First Computing */}
          <article style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#eff6ff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid #bfdbfe'
              }}>
                <ShieldCheck size={22} color="#2563eb" />
              </div>

              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 12px 0'
              }}>
                {t.homeCard1Title}
              </h3>

              <p style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: '#334155',
                margin: '0 0 20px 0'
              }}>
                {t.homeCard1Desc}
              </p>
            </div>

            <footer style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '14px',
              marginTop: '12px'
            }}>
              <p style={{
                fontSize: '0.82rem',
                color: '#64748b',
                lineHeight: 1.5,
                margin: 0,
                fontStyle: 'italic'
              }}>
                <strong style={{ fontStyle: 'normal', color: '#475569' }}>Academic Reference:</strong><br />
                <cite>{t.homeCard1Cite}</cite>
              </p>
            </footer>
          </article>

          {/* Card 2: WebAssembly */}
          <article style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#f5f3ff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid #ddd6fe'
              }}>
                <Cpu size={22} color="#7c3aed" />
              </div>

              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 12px 0'
              }}>
                {t.homeCard2Title}
              </h3>

              <p style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: '#334155',
                margin: '0 0 20px 0'
              }}>
                {t.homeCard2Desc}
              </p>
            </div>

            <footer style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '14px',
              marginTop: '12px'
            }}>
              <p style={{
                fontSize: '0.82rem',
                color: '#64748b',
                lineHeight: 1.5,
                margin: 0,
                fontStyle: 'italic'
              }}>
                <strong style={{ fontStyle: 'normal', color: '#475569' }}>Scientific Paper:</strong><br />
                <cite>{t.homeCard2Cite}</cite>
              </p>
            </footer>
          </article>

          {/* Card 3: ISO Standard */}
          <article style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#ecfdf5',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid #a7f3d0'
              }}>
                <FileCheck size={22} color="#059669" />
              </div>

              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 12px 0'
              }}>
                {t.homeCard3Title}
              </h3>

              <p style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: '#334155',
                margin: '0 0 20px 0'
              }}>
                {t.homeCard3Desc}
              </p>
            </div>

            <footer style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '14px',
              marginTop: '12px'
            }}>
              <p style={{
                fontSize: '0.82rem',
                color: '#64748b',
                lineHeight: 1.5,
                margin: 0,
                fontStyle: 'italic'
              }}>
                <strong style={{ fontStyle: 'normal', color: '#475569' }}>Industry Standard:</strong><br />
                <cite>{t.homeCard3Cite}</cite>
              </p>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
};
