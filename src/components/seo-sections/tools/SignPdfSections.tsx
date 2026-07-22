/**
 * sign-pdf — "Signature" Sections
 * Theme: Deep Blue + Ink Purple, handwriting/pen aesthetic
 * Every section is UNIQUE to this tool only.
 */
import React from 'react';
import type { SectionProps } from '../types';
import { PenLine } from 'lucide-react';

export const SignHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section sign-hero" style={{ padding: '80px 24px', margin: '40px 0', background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)', borderRadius: 32, border: '1px solid rgba(139,92,246,0.15)' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <div style={{ display: 'inline-flex', padding: '8px 18px', background: 'rgba(139,92,246,0.1)', borderRadius: 100, color: '#8b5cf6', fontWeight: 700, fontSize: '0.85rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <PenLine size={14} /> Draw, Type or Upload
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {/* Signature pad mockup */}
      <div style={{ flex: '1 1 300px' }}>
        <div style={{ background: 'var(--bg-card)', border: '2px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '32px 24px', position: 'relative', boxShadow: '0 12px 40px rgba(139,92,246,0.1)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 24, letterSpacing: '0.08em' }}>YOUR SIGNATURE</div>
          {/* Fake SVG signature stroke */}
          <svg viewBox="0 0 240 60" style={{ width: '100%', height: 60, display: 'block', marginBottom: 16 }}>
            <path d="M10,40 Q30,10 50,35 Q70,55 90,30 Q110,10 130,38 Q150,55 170,25 Q190,5 210,30" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          </svg>
          <div style={{ borderTop: '2px solid rgba(139,92,246,0.3)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sign here</span>
            <PenLine size={14} color="#8b5cf6" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const SignHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section sign-howto" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 60, color: 'var(--text-main)', textAlign: 'center' }}>{section.title}</h2>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.08)', position: 'relative' }}>
            <span style={{ fontSize: '1.8rem' }}>{i === 0 ? '✍️' : i === 1 ? '📌' : '⬇️'}</span>
            <div style={{ position: 'absolute', bottom: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>{i + 1}</div>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{step.title}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const SignGeoSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section sign-geo" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 0, borderRadius: 28, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div style={{ flex: '1 1 50%', padding: '56px 40px', background: 'var(--bg-card)' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 50%', background: 'linear-gradient(135deg, #4c1d95, #8b5cf6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, minHeight: 250, gap: 16 }}>
        <PenLine size={64} color="rgba(255,255,255,0.9)" />
        <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center', opacity: 0.9 }}>Signed Locally.<br/>Verified Anywhere.</div>
      </div>
    </div>
  </section>
);

export const SignPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section sign-privacy" style={{ padding: '80px 24px', margin: '60px 0' }}>
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {/* Trust gauge */}
      <div style={{ flex: '1 1 240px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 20px', borderRadius: '50%', background: 'conic-gradient(#8b5cf6 0% 100%, var(--bg-card) 100% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(139,92,246,0.3)' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#8b5cf6' }}>100%</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Trust Score</div>
          </div>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your signature never exposed to servers</div>
      </div>
    </div>
  </section>
);

export const SignPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section sign-performance" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      {/* Timeline */}
      <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, left: 20, right: 20, height: 2, background: 'linear-gradient(90deg, #4c1d95, #8b5cf6)', borderRadius: 2 }} />
        {[
          { t: '0s', label: 'Open PDF', icon: '📄' },
          { t: '5s', label: 'Create Signature', icon: '✍️' },
          { t: '15s', label: 'Place & Resize', icon: '📌' },
          { t: '30s', label: 'Download Signed', icon: '✅' },
        ].map(({ t, label, icon }) => (
          <div key={t} style={{ flex: 1, textAlign: 'center', paddingTop: 48, position: 'relative' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #4c1d95, #8b5cf6)', border: '3px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              <span style={{ fontSize: '1rem' }}>{icon}</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
