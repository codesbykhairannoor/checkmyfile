// @ts-nocheck
import React from 'react';
import { Trash2, CheckCircle2, Shield, Zap, MapPin, XCircle, FileText } from 'lucide-react';
import type { SectionProps } from '../types';

export const RemoveHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    {/* Floating Objects - Deletion Theme */}
    <div className="floating-object hidden-mobile" style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.1, animation: 'float 6s ease-in-out infinite' }}>
      <XCircle size={80} color="var(--brand-primary)" />
    </div>
    <div className="floating-object hidden-mobile" style={{ position: 'absolute', bottom: '15%', right: '10%', opacity: 0.05, animation: 'float 8s ease-in-out infinite' }}>
      <Trash2 size={120} color="var(--text-main)" />
    </div>

    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 64, position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', marginBottom: 32 }}>
          <Trash2 size={32} />
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', position: 'relative', height: 400 }}>
        {/* Deletion Graphic: 3 Documents, middle one is red and crossed out */}
        <div style={{ width: 140, height: 200, background: 'var(--bg-app)', border: '2px solid var(--border-color)', borderRadius: 16, position: 'absolute', left: 40, top: 100, transform: 'rotate(-15deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }} className="hover-lift">
           <FileText size={40} color="var(--text-muted)" opacity={0.5} />
        </div>
        <div style={{ width: 160, height: 220, background: 'rgba(225, 29, 72, 0.05)', border: '2px dashed var(--brand-primary)', borderRadius: 16, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 20px 50px rgba(225, 29, 72, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }} className="hover-lift">
           <XCircle size={64} color="var(--brand-primary)" />
        </div>
        <div style={{ width: 140, height: 200, background: 'var(--bg-app)', border: '2px solid var(--border-color)', borderRadius: 16, position: 'absolute', right: 40, top: 60, transform: 'rotate(10deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }} className="hover-lift">
           <FileText size={40} color="var(--text-muted)" opacity={0.5} />
        </div>
      </div>
    </div>
  </section>
);

export const RemoveHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
          <CheckCircle2 size={14} /> {section.badgeText || 'Quick Guide'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      </div>
      
      {/* Masonry Grid Simulation (Staggered columns) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ width: '100%', maxWidth: 350, marginTop: i % 2 !== 0 ? 64 : 0, padding: 40, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 24 }} className="hover-lift">
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-app)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)' }}>
              {i + 1}
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
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

export const RemoveGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Massive Faded Icon on the LEFT */}
      <div className="hidden-mobile" style={{ position: 'absolute', left: '-5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.03, pointerEvents: 'none' }}>
        <Trash2 size={500} color="var(--text-main)" />
      </div>
      
      <div style={{ flex: '1 1 600px', maxWidth: 700, textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
          <MapPin size={14} /> {section.badgeText || 'Local Processing'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, display: 'inline-block' }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const RemovePrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 280, height: 280, borderRadius: '50%', background: 'var(--bg-card)', border: '8px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }} className="hover-lift">
            <Shield size={120} color="var(--brand-primary)" />
            <div style={{ position: 'absolute', top: -10, right: 20, width: 64, height: 64, background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '4px solid var(--bg-app)' }}>
               <CheckCircle2 size={32} />
            </div>
         </div>
      </div>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
          <Shield size={14} /> {section.badgeText || 'Security First'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const RemovePerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
        <Zap size={14} /> {section.badgeText || 'Lightning Fast'}
      </div>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, maxWidth: 800, margin: '0 auto 64px' }}>{section.content}</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
        {(badges || ['Zero server latency', 'No upload bandwidth', 'Instant processing']).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 40px', background: 'var(--bg-app)', borderRadius: 100, border: '1px solid var(--border-color)' }} className="hover-lift">
            <CheckCircle2 color="var(--brand-primary)" size={24} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
