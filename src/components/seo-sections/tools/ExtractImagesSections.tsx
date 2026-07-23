// @ts-nocheck
import React from 'react';
import { Image, CheckCircle2, Shield, Zap, MapPin } from 'lucide-react';
import type { SectionProps } from '../types';

export const ExtractImagesHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '60px 0', background: 'radial-gradient(circle at center, rgba(225,29,72,0.1) 0%, transparent 70%) 0%, transparent 70%)', borderRadius: 40 }}>
    <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'var(--brand-gradient)', color: 'white', marginBottom: 32, boxShadow: '0 10px 30px rgba(225, 29, 72, 0.4)' }}>
        <Image size={40} />
      </div>
      <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const ExtractImagesHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '80px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: 64, color: 'var(--text-main)' }}>{section.title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ position: 'relative', padding: 32, background: 'var(--bg-app)', borderRadius: 24, border: '1px solid var(--border-color)', transition: 'transform 0.3s' }} className="hover-lift">
            <div style={{ position: 'absolute', top: -20, left: 32, width: 48, height: 48, borderRadius: 16, background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, boxShadow: '0 8px 20px rgba(225, 29, 72, 0.4)' }}>
              {i + 1}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16, marginTop: 16, color: 'var(--text-main)' }}>{step.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ExtractImagesGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '80px 24px' }}>
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: 24, padding: 40, background: 'var(--brand-gradient)', borderRadius: 24, borderLeft: '4px solid var(--brand-primary)' }}>
      <MapPin size={32} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: 4 }} />
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ExtractImagesPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '80px 24px', background: 'var(--bg-card)' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
      <Shield size={64} color="var(--brand-primary)" style={{ margin: '0 auto 24px' }} />
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const ExtractImagesPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '80px 24px' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 300 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>{section.content}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {(badges || ['Zero server latency', 'No upload bandwidth', 'Instant processing']).map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-main)' }}>
              <CheckCircle2 color="var(--brand-primary)" size={20} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(225,29,72,0.1) 0%, transparent 70%) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, margin: '0 auto' }}>
        <Zap size={100} color="var(--brand-primary)" style={{ filter: 'drop-shadow(0 0 20px rgba(225, 29, 72, 0.4))' }} />
      </div>
    </div>
  </section>
);
