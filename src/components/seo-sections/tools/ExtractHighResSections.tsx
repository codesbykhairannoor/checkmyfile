import React from 'react';
import type { SectionProps } from '../types';

export const ExtractHighResHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section hero-features" style={{ padding: '60px 24px', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', alignItems: 'center', gap: 48, background: '#fef3c7', borderRadius: 24, marginBottom: 40 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16, color: '#92400e' }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: '#b45309', lineHeight: 1.8 }}>{section.content}</p>
    </div>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  </section>
);

export const ExtractHighResHowToSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section how-to" style={{ padding: '60px 24px', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', alignItems: 'center', gap: 48, marginBottom: 40 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
    </div>
  </section>
);

export const ExtractHighResGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section geo" style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
  </section>
);

export const ExtractHighResPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section privacy" style={{ padding: '60px 24px', display: 'flex', alignItems: 'center', gap: 48, marginBottom: 40 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
    </div>
  </section>
);

export const ExtractHighResPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section performance" style={{ padding: '60px 24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-app))', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
  </section>
);
