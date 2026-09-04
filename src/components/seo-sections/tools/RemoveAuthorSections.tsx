import React from 'react';
import type { SectionProps } from '../types';

export const RemoveAuthorHeroSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section hero-features" style={{ padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, background: '#020617', color: 'white', borderRadius: 32, marginBottom: 40 }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16, color: '#38bdf8' }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', lineHeight: 1.8 }}>{section.content}</p>
    </div>
    <div style={{ background: '#0f172a', padding: 32, borderRadius: 24, border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
         <div style={{ padding: 16, background: '#1e293b', borderRadius: 12, textDecoration: 'line-through', color: '#ef4444' }}>Author: John Doe</div>
         <div style={{ padding: 16, background: '#1e293b', borderRadius: 12, textDecoration: 'line-through', color: '#ef4444' }}>Creation Date: 2022-01-01</div>
         <div style={{ padding: 16, background: '#1e293b', borderRadius: 12, textDecoration: 'line-through', color: '#ef4444' }}>Software: Acrobat Pro</div>
         <div style={{ padding: 16, background: '#047857', borderRadius: 12, color: '#10b981', fontWeight: 'bold' }}>✓ All Metadata Sanitized</div>
      </div>
    </div>
  </section>
);

export const RemoveAuthorHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section how-to" style={{ padding: '60px 24px', marginBottom: 40, borderLeft: '4px solid #38bdf8', marginLeft: 24 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
  </section>
);

export const RemoveAuthorGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section geo" style={{ padding: '60px 24px', textAlign: 'right', background: 'var(--bg-card)', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{section.content}</p>
  </section>
);

export const RemoveAuthorPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section privacy" style={{ padding: '60px 24px', display: 'flex', alignItems: 'center', gap: 48, marginBottom: 40, background: '#fef2f2', borderRadius: 24 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16, color: '#991b1b' }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: '#b91c1c' }}>{section.content}</p>
    </div>
  </section>
);

export const RemoveAuthorPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section performance" style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-app)', borderRadius: 24, marginBottom: 40 }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16 }}>{section.title}</h2>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
  </section>
);
