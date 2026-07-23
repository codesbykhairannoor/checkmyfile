// @ts-nocheck
import React from 'react';
import { Maximize, MapPin, Shield, Zap, MoveDiagonal, Scaling, CheckCircle2 } from 'lucide-react';
import type { SectionProps } from '../types';

export const ResizeHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48, position: 'relative' }}>
         <div style={{ width: 140, height: 180, position: 'relative' }}>
            {/* Background Original Page */}
            <div style={{ position: 'absolute', top: 20, left: 20, right: 20, bottom: 20, background: 'var(--bg-app)', border: '2px dashed var(--border-color)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Scaling size={32} color="var(--text-muted)" opacity={0.3} />
            </div>
            {/* Foreground Resized Page */}
            <div style={{ position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, background: 'var(--brand-gradient)', color: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(225, 29, 72, 0.4)', zIndex: 2 }} className="hover-lift">
               <Maximize size={48} />
               
               {/* Drag Handles */}
               <div style={{ position: 'absolute', top: -6, left: -6, width: 12, height: 12, background: 'white', border: '2px solid var(--brand-primary)', borderRadius: '50%' }} />
               <div style={{ position: 'absolute', top: -6, right: -6, width: 12, height: 12, background: 'white', border: '2px solid var(--brand-primary)', borderRadius: '50%' }} />
               <div style={{ position: 'absolute', bottom: -6, left: -6, width: 12, height: 12, background: 'white', border: '2px solid var(--brand-primary)', borderRadius: '50%' }} />
               <div style={{ position: 'absolute', bottom: -6, right: -6, width: 12, height: 12, background: 'white', border: '2px solid var(--brand-primary)', borderRadius: '50%' }} />
            </div>
         </div>
      </div>
      
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const ResizeHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 40, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }} className="hover-lift">
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 10px 20px rgba(225, 29, 72, 0.3)' }}>
              {i + 1}
            </div>
            <div>
               <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                 {step.title}
               </h3>
               <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ResizeGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
          <MapPin size={14} /> {section.badgeText || 'Local Processing'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         {/* Diagonal Expand Graphic */}
         <div style={{ position: 'relative', width: 240, height: 240, background: 'var(--bg-app)', border: '2px solid var(--border-color)', borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-lift">
            <MoveDiagonal size={64} color="var(--brand-primary)" />
            <div style={{ position: 'absolute', top: -20, right: -20, background: 'var(--brand-gradient)', color: 'white', padding: '8px 16px', borderRadius: 20, fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(225, 29, 72, 0.3)' }}>A4</div>
            <div style={{ position: 'absolute', bottom: -20, left: -20, background: 'var(--text-main)', color: 'white', padding: '8px 16px', borderRadius: 20, fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>Letter</div>
         </div>
      </div>
    </div>
  </section>
);

export const ResizePrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 40, padding: '80px 48px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 32px', borderRadius: 24, background: 'var(--bg-app)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={40} color="var(--brand-primary)" />
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ResizePerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 280, height: 360, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <Scaling size={100} color="var(--text-muted)" opacity={0.2} />
            <div style={{ position: 'absolute', bottom: 30, right: 30, width: 80, height: 80, background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
              <Zap size={32} />
            </div>
         </div>
      </div>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
          <Zap size={14} /> {section.badgeText || 'Lightning Fast'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, marginBottom: 40 }}>{section.content}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {(badges || ['Zero server latency', 'Instant batch resize', 'Vector retention']).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
              <CheckCircle2 color="var(--brand-primary)" size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
