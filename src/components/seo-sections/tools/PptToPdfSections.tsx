// @ts-nocheck
import React from 'react';
import type { SectionProps } from '../types';
import { Presentation, Shield, FastForward, PlayCircle } from 'lucide-react';

export const PptToPdfHeroSection: React.FC<SectionProps> = ({ section, flipLayout, badges, stats, buttonText }) => (
  <section className="seo-section ppt-hero" style={{ padding: '80px 24px', margin: '40px 0', background: 'radial-gradient(circle at center, rgba(225,29,72,0.1) 0%, transparent 70%) 0%, #0f172a 100%)', borderRadius: 32 }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 350px' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, marginBottom: 24, color: '#fff', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32 }}>{section.content}</p>
        <div style={{ display: 'inline-flex', padding: '12px 24px', background: 'var(--brand-primary)', color: '#fff', borderRadius: 100, fontWeight: 700, gap: 8, alignItems: 'center' }}>
          <Presentation size={20} /> Convert Slides
        </div>
      </div>
      <div style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 280, height: 200, background: '#fff', borderRadius: 16, border: '4px solid var(--brand-primary)', padding: 16, boxShadow: '0 20px 40px rgba(225, 29, 72, 0.2)' }}>
          <div style={{ height: 32, background: '#e2e8f0', borderRadius: 8, marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, height: 80, background: '#f1f5f9', borderRadius: 8 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
               <div style={{ height: 16, background: '#e2e8f0', borderRadius: 4 }} />
               <div style={{ height: 16, background: '#e2e8f0', borderRadius: 4 }} />
               <div style={{ height: 16, background: '#e2e8f0', borderRadius: 4, width: '60%' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: -20, right: -20, width: 64, height: 64, background: 'var(--brand-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(225, 29, 72, 0.3)' }}>
            <PlayCircle color="#fff" size={32} />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const PptToPdfHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section ppt-howto" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 60, color: 'var(--text-main)' }}>{section.title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {section.steps?.map((step, i) => (
          <div key={i} style={{ flex: '1 1 250px', background: 'var(--bg-main)', padding: 32, borderRadius: 24, borderTop: '4px solid var(--brand-primary)', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
             <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)', marginBottom: 16 }}>0{i + 1}.</div>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
             <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const PptToPdfGeoSection: React.FC<SectionProps> = ({ section, flipLayout, badges, stats, buttonText }) => (
  <section className="seo-section ppt-geo" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--brand-gradient)', borderRadius: 32 }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 400px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 350px', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
         {(badges || ['Board Meetings', 'Pitch Decks', 'Unreleased Products']).map(b => (
            <div key={b} style={{ padding: '12px 20px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: 100, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
               <Shield size={16} color="var(--brand-primary)" /> {b}
            </div>
         ))}
      </div>
    </div>
  </section>
);

export const PptToPdfPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section ppt-privacy" style={{ padding: '80px 24px', margin: '60px 0' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', background: 'var(--bg-card)', border: '2px solid var(--brand-primary)', borderRadius: 32, padding: 60, textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const PptToPdfPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section ppt-performance" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <FastForward size={48} color="var(--brand-primary)" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--bg-main)', padding: 24, borderRadius: 20, textAlign: 'center', border: '1px solid var(--border-color)' }}>
           <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-primary)' }}>100%</div>
           <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Local</div>
        </div>
        <div style={{ background: 'var(--bg-main)', padding: 24, borderRadius: 20, textAlign: 'center', border: '1px solid var(--border-color)' }}>
           <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-primary)' }}>0s</div>
           <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Upload Wait</div>
        </div>
      </div>
    </div>
  </section>
);
