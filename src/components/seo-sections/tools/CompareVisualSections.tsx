import React from 'react';
import type { SectionProps } from '../types';

export const CompareVisualHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section hero-features" style={{ padding: '60px 24px', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', alignItems: 'center', gap: 48, background: '#fce7f3', borderRadius: 24, marginBottom: 40 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16, color: '#be185d' }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: '#9d174d', lineHeight: 1.8 }}>{section.content}</p>
    </div>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V4" />
        <path d="M5 20V4" />
        <path d="M19 20V4" />
      </svg>
    </div>
  </section>
);

export const CompareVisualHowToSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section how-to" style={{ padding: '60px 24px', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', alignItems: 'center', gap: 48, marginBottom: 40 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
    </div>
  </section>
);

export const CompareVisualGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section geo" style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
  </section>
);

export const CompareVisualPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section privacy" style={{ padding: '60px 24px', display: 'flex', alignItems: 'center', gap: 48, marginBottom: 40 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
    </div>
  </section>
);

export const CompareVisualPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section performance" style={{ padding: '60px 24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-app))', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
  </section>
);
