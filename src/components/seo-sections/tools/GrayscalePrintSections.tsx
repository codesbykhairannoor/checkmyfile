import React from 'react';
import type { SectionProps } from '../types';

export const GrayscalePrintHeroSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section hero-features" style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)', borderRadius: 32, marginBottom: 40, border: '1px solid #cbd5e1' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#334155', color: '#fff', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg> Professional Print Ready
      </div>
      <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, marginBottom: 24, color: '#0f172a', lineHeight: 1.1 }}>{section.title}</h2>
      <p style={{ fontSize: '1.35rem', color: '#475569', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
    </div>
  </section>
);

export const GrayscalePrintHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section how-to" style={{ padding: '60px 24px', marginBottom: 40 }}>
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
       <div style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#94a3b8', marginBottom: 16 }}>1</div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Upload your colored PDF document securely to our local tool.</p>
       </div>
       <div style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#94a3b8', marginBottom: 16 }}>2</div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Wait a few seconds for the client-side engine to strip the colors.</p>
       </div>
       <div style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#94a3b8', marginBottom: 16 }}>3</div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Download the exact same PDF in pure grayscale, ready for printing.</p>
       </div>
    </div>
  </section>
);

export const GrayscalePrintGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section geo" style={{ padding: '60px 24px', background: '#1e293b', color: 'white', borderRadius: 24, marginBottom: 40, display: 'flex', gap: 48, alignItems: 'center' }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: 800 }}>{section.content}</p>
    </div>
  </section>
);

export const GrayscalePrintPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section privacy" style={{ padding: '60px 24px', textAlign: 'center', marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
  </section>
);

export const GrayscalePrintPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section performance" style={{ padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
  </section>
);
