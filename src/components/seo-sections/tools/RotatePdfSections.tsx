// @ts-nocheck
import React from 'react';
import { RotateCw, CheckCircle2, Shield, Zap, MapPin, RefreshCcw, FileText } from 'lucide-react';
import type { SectionProps } from '../types';

export const RotateHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    {/* Floating Objects - Rotation Theme */}
    <div className="floating-object hidden-mobile" style={{ position: 'absolute', top: '15%', left: '8%', width: 64, height: 64, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.8)', zIndex: 20, transform: 'rotate(90deg)' }}>
      <FileText size={32} color="var(--brand-primary)" />
    </div>
    <div className="floating-object hidden-mobile" style={{ position: 'absolute', bottom: '15%', right: '8%', width: 80, height: 80, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid rgba(255,255,255,0.8)', zIndex: 20, transform: 'rotate(180deg)' }}>
      <FileText size={40} color="var(--text-main)" />
    </div>
    {/* Rotating arrows */}
    <div className="floating-object hidden-mobile" style={{ position: 'absolute', top: '25%', right: '15%', opacity: 0.5, animation: 'spin 12s linear infinite' }}>
      <RefreshCcw size={48} color="var(--brand-primary)" />
    </div>

    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'var(--brand-gradient)', color: 'white', marginBottom: 32 }}>
        <RotateCw size={32} />
      </div>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const RotateHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <CheckCircle2 size={14} /> {section.badgeText || 'Quick Guide'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      </div>
      
      {/* Zig-Zag Steps Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, position: 'relative' }}>
        {/* Connecting curved line background logic can be complex without SVGs, so we will use alternating alignments to create a zig-zag */}
        {section.steps?.map((step: any, i: number) => {
          const isEven = i % 2 !== 0;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isEven ? 'flex-end' : 'flex-start', width: '100%' }}>
              <div style={{ width: '100%', maxWidth: 500, position: 'relative', padding: 48, background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16 }} className="hover-lift">
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export const RotateGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, border: '1px solid rgba(225, 29, 72, 0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <MapPin size={14} /> {section.badgeText || 'Local Processing'}
      </div>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, maxWidth: 700, margin: '0 auto 64px' }}>{section.content}</p>
      
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
        <div style={{ width: 120, height: 120, borderRadius: 24, background: 'var(--bg-app)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-lift">
           <MapPin size={48} color="var(--brand-primary)" />
        </div>
      </div>
    </div>
  </section>
);

export const RotatePrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, border: '1px solid rgba(225, 29, 72, 0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Shield size={14} /> {section.badgeText || 'Security First'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 240, height: 240, borderRadius: 40, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1, transition: 'transform 0.5s ease' }} className="hover-lift">
            <Shield size={100} color="var(--brand-primary)" />
         </div>
      </div>
    </div>
  </section>
);

export const RotatePerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
        {/* Animated Dashed Border for Rotation Theme */}
        <div style={{ width: 260, height: 260, borderRadius: '50%', border: '4px dashed var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spin 15s linear infinite', position: 'absolute' }}></div>
        <div style={{ width: 220, height: 220, borderRadius: '50%', background: 'var(--bg-app)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', zIndex: 1, transition: 'transform 0.5s ease' }} className="hover-lift">
          <RotateCw size={100} color="var(--text-main)" />
        </div>
      </div>
      <div style={{ flex: '1 1 400px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, boxShadow: '0 10px 20px rgba(225, 29, 72, 0.2)' }}>
          <Zap size={14} /> {section.badgeText || 'Lightning Fast'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, marginBottom: 40 }}>{section.content}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(badges || ['Zero server latency', 'No upload bandwidth', 'Instant processing']).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px', background: 'var(--bg-app)', borderRadius: 24, border: '1px solid var(--border-color)', transition: 'transform 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }} className="hover-lift">
              <CheckCircle2 color="var(--brand-primary)" size={24} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
