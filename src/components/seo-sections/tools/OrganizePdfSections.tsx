// @ts-nocheck
import React from 'react';
import { LayoutList, CheckCircle2, Shield, Zap, MapPin, ArrowRightLeft, MoveHorizontal, FileText } from 'lucide-react';
import type { SectionProps } from '../types';

export const OrganizeHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    {/* Floating Objects - Structure Theme */}
    <div className="floating-object hidden-mobile" style={{ position: 'absolute', top: '10%', right: '10%', opacity: 0.1, animation: 'float 6s ease-in-out infinite' }}>
      <ArrowRightLeft size={80} color="var(--brand-primary)" />
    </div>

    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: 64, position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px', position: 'relative', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Kanban / Drag-and-Drop Graphic */}
        <div style={{ position: 'relative', width: 300, height: 200, display: 'flex', gap: 16 }}>
           <div style={{ width: 100, height: 140, background: 'var(--bg-app)', border: '2px dashed var(--border-color)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <FileText size={32} color="var(--text-muted)" opacity={0.3} />
           </div>
           {/* The active dragged card */}
           <div style={{ width: 120, height: 160, background: 'var(--brand-gradient)', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 60px rgba(225, 29, 72, 0.3)', transform: 'translateY(-30px) rotate(5deg)', zIndex: 10 }} className="hover-lift">
             <FileText size={48} color="white" />
             <div style={{ marginTop: 12, display: 'flex', gap: 4 }}>
                <MoveHorizontal size={24} color="white" />
             </div>
           </div>
           <div style={{ width: 100, height: 140, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <FileText size={32} color="var(--text-muted)" opacity={0.5} />
           </div>
        </div>
      </div>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'var(--brand-gradient)', color: 'white', marginBottom: 32 }}>
          <LayoutList size={32} />
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const OrganizeHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <CheckCircle2 size={14} /> {section.badgeText || 'Quick Guide'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      </div>
      
      {/* Horizontal Stepper Inside a Massive Card */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', padding: '64px 40px', boxShadow: '0 30px 60px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: 40, position: 'relative' }}>
        <div className="hidden-mobile" style={{ position: 'absolute', top: 96, left: 100, right: 100, height: 4, background: 'var(--bg-app)', zIndex: 0, borderRadius: 2 }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {section.steps?.map((step: any, i: number) => (
            <div key={i} style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }} className="hover-lift">
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, border: '8px solid var(--bg-card)', boxShadow: '0 0 0 2px var(--brand-primary)' }}>
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
    </div>
  </section>
);

export const OrganizeGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
          <MapPin size={14} /> {section.badgeText || 'Local Processing'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', position: 'relative', height: 300, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
         {/* Abstract Geo Graphic */}
         <div style={{ width: 240, height: 240, borderRadius: '50%', background: 'var(--bg-app)', border: '4px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 0 }} className="hover-lift">
            <MapPin size={80} color="var(--brand-primary)" opacity={0.2} />
         </div>
         <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 100, boxShadow: '0 20px 40px rgba(225, 29, 72, 0.3)', zIndex: 2 }} className="hover-lift">
            <MapPin size={48} />
         </div>
      </div>
    </div>
  </section>
);

export const OrganizePrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Massive Full-Width Vault Card */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 40, padding: '80px 48px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 32px', borderRadius: 24, background: 'var(--bg-app)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <Shield size={40} color="var(--brand-primary)" />
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const OrganizePerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
          <Zap size={14} /> {section.badgeText || 'Lightning Fast'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, marginBottom: 40 }}>{section.content}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(badges || ['Zero server latency', 'No upload bandwidth', 'Instant processing']).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)' }} className="hover-lift">
              <CheckCircle2 color="var(--brand-primary)" size={24} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 280, height: 280, borderRadius: 32, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }} className="hover-lift">
            <LayoutList size={120} color="var(--brand-primary)" opacity={0.2} />
            <div style={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.3)' }}>
              <Zap size={32} />
            </div>
         </div>
      </div>
    </div>
  </section>
);
