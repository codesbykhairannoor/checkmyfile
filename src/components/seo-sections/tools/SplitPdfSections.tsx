// @ts-nocheck
import React from 'react';
import { Scissors, CheckCircle2, Shield, Zap, MapPin, FileText, ChevronRight } from 'lucide-react';
import type { SectionProps } from '../types';

export const SplitHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    {/* Floating Objects - Split Theme */}
    <div className="floating-object hidden-mobile" style={{ position: 'absolute', top: '10%', right: '5%', width: 64, height: 64, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.8)', zIndex: 20, transform: 'rotate(15deg)', animation: 'float 6s ease-in-out infinite' }}>
      ✂️
    </div>
    <div className="floating-object hidden-mobile" style={{ position: 'absolute', bottom: '15%', left: '8%', width: 80, height: 80, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid rgba(255,255,255,0.8)', zIndex: 20, transform: 'rotate(-10deg)', animation: 'float 8s ease-in-out infinite' }}>
      📄
    </div>

    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 64, position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'var(--brand-gradient)', color: 'white', marginBottom: 32 }}>
          <Scissors size={32} />
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', position: 'relative', height: 400 }}>
        {/* Fractured Graphic representing a split PDF */}
        <div style={{ width: 200, height: 260, background: 'var(--bg-app)', border: '2px solid var(--border-color)', borderRadius: 16, position: 'absolute', left: '10%', top: '20%', transform: 'rotate(-10deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }} className="hover-lift">
           <FileText size={64} color="var(--text-muted)" opacity={0.3} />
        </div>
        <div style={{ width: 200, height: 260, background: 'var(--brand-gradient)', borderRadius: 16, position: 'absolute', right: '10%', top: '10%', transform: 'rotate(5deg)', boxShadow: '0 20px 50px rgba(225, 29, 72, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }} className="hover-lift">
           <FileText size={64} color="white" />
        </div>
        {/* Scissor cutting line */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'repeating-linear-gradient(to bottom, var(--border-color) 0, var(--border-color) 10px, transparent 10px, transparent 20px)', zIndex: 5 }}></div>
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', borderRadius: '50%', padding: 12, border: '1px solid var(--border-color)', zIndex: 6 }}>
          <Scissors size={32} color="var(--brand-primary)" />
        </div>
      </div>
    </div>
  </section>
);

export const SplitHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <CheckCircle2 size={14} /> {section.badgeText || 'Quick Guide'}
      </div>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 80, maxWidth: 600 }}>{section.title}</h2>
      
      {/* Horizontal Timeline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, position: 'relative', flexWrap: 'wrap' }}>
        <div className="hidden-mobile" style={{ position: 'absolute', top: 40, left: 100, right: 100, height: 2, background: 'repeating-linear-gradient(to right, var(--border-color) 0, var(--border-color) 10px, transparent 10px, transparent 20px)', zIndex: 0 }}></div>
        
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ flex: '1 1 250px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24 }} className="hover-lift">
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-card)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
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

export const SplitGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: '1 1 600px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
          <MapPin size={14} /> {section.badgeText || 'Local Processing'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05, maxWidth: 600 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, maxWidth: 600 }}>{section.content}</p>
      </div>
      {/* Massive Faded Icon bleeding off right side */}
      <div className="hidden-mobile" style={{ position: 'absolute', right: '-10%', top: '50%', transform: 'translateY(-50%)', opacity: 0.05, pointerEvents: 'none' }}>
        <MapPin size={400} color="var(--text-main)" />
      </div>
    </div>
  </section>
);

export const SplitPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'flex-start' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 40, borderRadius: 32, background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }} className="hover-lift">
            <Shield size={64} color="var(--brand-primary)" style={{ marginBottom: 32 }} />
            <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>Offline Splitting</h3>
            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>Files never touch external servers. Pages are extracted directly within your browser memory.</p>
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

export const SplitPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
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
