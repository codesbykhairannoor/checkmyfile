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
        backgroundColor: 'var(--bg-app)',
        borderTop: '1px solid var(--border-color)',
        padding: '96px 24px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Header with Academic Badge */}
        <header style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            backgroundColor: 'rgba(225, 29, 72, 0.08)',
            border: '1px solid rgba(225, 29, 72, 0.2)',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--brand-primary)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <BookOpen size={15} color="var(--brand-primary)" />
            <span>{t.researchBadge}</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            color: 'var(--text-main)',
            margin: '0 0 16px 0',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em'
          }}>
            {t.researchHomeTitle}
          </h2>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.75,
            color: 'var(--text-muted)',
            maxWidth: '860px',
            margin: '0 auto',
            fontWeight: 500
          }}>
            {t.researchHomeSub}
          </p>
        </header>

        {/* 3 Citation / Architecture Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '24px'
        }}>
          {/* Card 1: Local-First Computing */}
          <article 
            className="glass-panel"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '36px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--brand-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(225, 29, 72, 0.1)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(225, 29, 72, 0.25)'
              }}>
                <ShieldCheck size={24} color="var(--brand-primary)" />
              </div>

              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0 0 12px 0',
                fontFamily: 'var(--font-display)',
                lineHeight: 1.3
              }}>
                {t.homeCard1Title}
              </h3>

              <p style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: 'var(--text-muted)',
                margin: '0 0 24px 0'
              }}>
                {t.homeCard1Desc}
              </p>
            </div>

            <footer style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px',
              marginTop: '12px'
            }}>
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                margin: 0,
              }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Academic Reference:
                </strong>
                <cite style={{ fontStyle: 'normal', color: 'var(--text-muted)' }}>{t.homeCard1Cite}</cite>
              </p>
            </footer>
          </article>

          {/* Card 2: WebAssembly */}
          <article 
            className="glass-panel"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '36px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(139, 92, 246, 0.25)'
              }}>
                <Cpu size={24} color="#8b5cf6" />
              </div>

              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0 0 12px 0',
                fontFamily: 'var(--font-display)',
                lineHeight: 1.3
              }}>
                {t.homeCard2Title}
              </h3>

              <p style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: 'var(--text-muted)',
                margin: '0 0 24px 0'
              }}>
                {t.homeCard2Desc}
              </p>
            </div>

            <footer style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px',
              marginTop: '12px'
            }}>
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                margin: 0,
              }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Scientific Paper:
                </strong>
                <cite style={{ fontStyle: 'normal', color: 'var(--text-muted)' }}>{t.homeCard2Cite}</cite>
              </p>
            </footer>
          </article>

          {/* Card 3: ISO Standard */}
          <article 
            className="glass-panel"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '36px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}>
                <FileCheck size={24} color="#10b981" />
              </div>

              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0 0 12px 0',
                fontFamily: 'var(--font-display)',
                lineHeight: 1.3
              }}>
                {t.homeCard3Title}
              </h3>

              <p style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: 'var(--text-muted)',
                margin: '0 0 24px 0'
              }}>
                {t.homeCard3Desc}
              </p>
            </div>

            <footer style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px',
              marginTop: '12px'
            }}>
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                margin: 0,
              }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Industry Standard:
                </strong>
                <cite style={{ fontStyle: 'normal', color: 'var(--text-muted)' }}>{t.homeCard3Cite}</cite>
              </p>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
};
