import React from 'react';
import type { SectionProps } from '../types';

export const CropMarginsHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section hero-features" style={{ padding: '60px 24px', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', alignItems: 'center', gap: 48, background: 'var(--bg-card)', borderRadius: 24, marginBottom: 40 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
    </div>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
      </svg>
    </div>
  </section>
);

export const CropMarginsHowToSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section how-to" style={{ padding: '60px 24px', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', alignItems: 'center', gap: 48, marginBottom: 40 }}>
    <div style={{ flex: 1, order: flipLayout ? 2 : 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
    </div>
    <div style={{ flex: 1, order: flipLayout ? 1 : 2, background: 'rgba(0,0,0,0.03)', padding: 32, borderRadius: 24 }}>
       <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: 16, fontSize: '1.1rem' }}>✅ {section.title} Step 1</li>
       </ul>
    </div>
  </section>
);

export const CropMarginsGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section geo" style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
  </section>
);

export const CropMarginsPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section privacy" style={{ padding: '60px 24px', display: 'flex', alignItems: 'center', gap: 48, marginBottom: 40 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
    </div>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </div>
  </section>
);

export const CropMarginsPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section performance" style={{ padding: '60px 24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-app))', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
  </section>
);
