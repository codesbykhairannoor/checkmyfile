import React from 'react';
import { SeoHead } from '../components/seo/SeoHead';
import { tosTranslations } from '../i18n/tosTranslations';
import {
  Scale,
  ShieldCheck,
  Zap,
  Sparkles,
  Cpu,
  Layers,
  Lock,
  AlertTriangle,
  HelpCircle,
  Shield,
  CreditCard,
  Mail,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface Props {
  currentLang: string;
}

export const TosPage: React.FC<Props> = ({ currentLang }) => {
  const tos = tosTranslations[currentLang] || tosTranslations['en'] || {};

  const sections = [
    {
      id: 1,
      num: '1',
      icon: Scale,
      title: tos.s1_title,
      paragraphs: [tos.s1_desc1, tos.s1_desc2],
    },
    {
      id: 2,
      num: '2',
      icon: ShieldCheck,
      title: tos.s2_title,
      paragraphs: [tos.s2_desc1, tos.s2_desc2],
      badge: tos.tos_notice_badge,
    },
    {
      id: 3,
      num: '3',
      icon: Zap,
      title: tos.s3_title,
      paragraphs: [tos.s3_desc1],
      bullets: [tos.s3_bullet1, tos.s3_bullet2],
    },
    {
      id: 4,
      num: '4',
      icon: Sparkles,
      title: tos.s4_title,
      highlight: true,
      paragraphs: [tos.s4_desc1, tos.s4_desc2],
    },
    {
      id: 5,
      num: '5',
      icon: Cpu,
      title: tos.s5_title,
      highlight: true,
      paragraphs: [tos.s5_desc1],
      callout: tos.s5_desc2,
      subParagraph: tos.s5_desc3,
    },
    {
      id: 6,
      num: '6',
      icon: Layers,
      title: tos.s6_title,
      paragraphs: [tos.s6_desc1, tos.s6_desc2],
    },
    {
      id: 7,
      num: '7',
      icon: Lock,
      title: tos.s7_title,
      paragraphs: [tos.s7_desc1, tos.s7_desc2],
    },
    {
      id: 8,
      num: '8',
      icon: AlertTriangle,
      title: tos.s8_title,
      paragraphs: [tos.s8_desc1],
    },
    {
      id: 9,
      num: '9',
      icon: HelpCircle,
      title: tos.s9_title,
      paragraphs: [tos.s9_desc1],
    },
    {
      id: 10,
      num: '10',
      icon: Shield,
      title: tos.s10_title,
      paragraphs: [tos.s10_desc1],
    },
    {
      id: 11,
      num: '11',
      icon: CreditCard,
      title: tos.s11_title,
      paragraphs: [tos.s11_desc1],
    },
    {
      id: 12,
      num: '12',
      icon: Mail,
      title: tos.s12_title,
      paragraphs: [tos.s12_desc1],
    },
  ];

  return (
    <>
      <SeoHead
        title={`${tos.tos_title || 'Terms of Service'} - HandleMyFile`}
        description={tos.tos_intro || 'HandleMyFile Terms of Service, Lifetime Pass definition, and service continuity agreements.'}
        currentLang={currentLang}
        slug="terms"
      />

      <main style={{ width: '100%', flex: 1, background: 'var(--bg-app)' }}>
        {/* HERO SECTION */}
        <section
          style={{
            width: '100%',
            padding: '100px 24px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 100,
                background: 'rgba(225, 29, 72, 0.08)',
                color: 'var(--brand-primary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                marginBottom: 20,
                border: '1px solid rgba(225, 29, 72, 0.2)',
              }}
            >
              <FileText size={15} />
              <span>{tos.tos_badge || 'TERMS OF SERVICE & LEGAL AGREEMENT'}</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                color: 'var(--text-main)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: 20,
              }}
            >
              {tos.tos_title || 'Terms of Service & Founder License'}
            </h1>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                marginBottom: 28,
              }}
            >
              <CheckCircle2 size={16} color="#22c55e" />
              <span>{tos.tos_last_updated || 'Effective Date: November 2026 • Version 2.5'}</span>
            </div>

            <div
              style={{
                padding: '20px 24px',
                borderRadius: 16,
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                lineHeight: 1.7,
                textAlign: 'left',
                borderLeft: '4px solid var(--brand-primary)',
              }}
            >
              {tos.tos_intro}
            </div>
          </div>
        </section>

        {/* LEGAL SECTIONS GRID */}
        <section style={{ width: '100%', padding: '80px 24px', background: 'var(--bg-app)' }}>
          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            {sections.map((sec) => {
              const IconComp = sec.icon;
              return (
                <div
                  key={sec.id}
                  id={`section-${sec.id}`}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 20,
                    padding: '32px 28px',
                    border: sec.highlight ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                    boxShadow: sec.highlight ? '0 8px 30px rgba(225, 29, 72, 0.08)' : 'none',
                    position: 'relative',
                  }}
                >
                  {sec.highlight && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -12,
                        right: 24,
                        background: 'var(--brand-primary)',
                        color: '#ffffff',
                        padding: '3px 12px',
                        borderRadius: 100,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                      }}
                    >
                      KEY LIFETIME CLAUSE
                    </div>
                  )}

                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      marginBottom: 20,
                      paddingBottom: 16,
                      borderBottom: '1px solid var(--border-color)',
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: sec.highlight ? 'rgba(225, 29, 72, 0.12)' : 'var(--bg-app)',
                        color: sec.highlight ? 'var(--brand-primary)' : 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={20} />
                    </div>
                    <h2
                      style={{
                        fontSize: 'clamp(1.25rem, 3vw, 1.55rem)',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {sec.title}
                    </h2>
                  </div>

                  {/* Body Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        style={{
                          fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
                          color: 'var(--text-muted)',
                          lineHeight: 1.75,
                          margin: 0,
                        }}
                      >
                        {p}
                      </p>
                    ))}

                    {/* Bullets if any */}
                    {sec.bullets && (
                      <ul
                        style={{
                          margin: '6px 0 0',
                          paddingLeft: 20,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                        }}
                      >
                        {sec.bullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            style={{
                              fontSize: '0.95rem',
                              color: 'var(--text-main)',
                              lineHeight: 1.6,
                            }}
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Callout box if any (Section 5 Client-Side Safeguard) */}
                    {sec.callout && (
                      <div
                        style={{
                          margin: '12px 0',
                          padding: '16px 20px',
                          borderRadius: 12,
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          color: 'var(--text-main)',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          lineHeight: 1.6,
                        }}
                      >
                        🛡️ {sec.callout}
                      </div>
                    )}

                    {/* Sub-paragraph if any */}
                    {sec.subParagraph && (
                      <p
                        style={{
                          fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
                          color: 'var(--text-muted)',
                          lineHeight: 1.75,
                          margin: 0,
                        }}
                      >
                        {sec.subParagraph}
                      </p>
                    )}

                    {/* Badge if any */}
                    {sec.badge && (
                      <div
                        style={{
                          marginTop: 8,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 16px',
                          borderRadius: 10,
                          background: 'rgba(34, 197, 94, 0.08)',
                          border: '1px solid rgba(34, 197, 94, 0.25)',
                          color: '#15803d',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                        }}
                      >
                        <ShieldCheck size={18} />
                        <span>{sec.badge}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
};
