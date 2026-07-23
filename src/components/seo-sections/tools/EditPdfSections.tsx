// @ts-nocheck
import React from 'react';
import { Type, ImageIcon, MousePointerSquareDashed, PenTool, MapPin, Shield, Zap, CheckCircle2, TextCursorInput } from 'lucide-react';
import type { SectionProps } from '../types';

export const EditHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(225, 29, 72, 0.1)', borderRadius: 100, color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <PenTool size={16} /> Advanced Offline Editor
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
         <div style={{ width: 340, height: 260, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 24, padding: 24, position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            {/* Fake Text */}
            <div style={{ height: 12, background: 'var(--border-color)', borderRadius: 6, width: '100%', marginBottom: 12 }} />
            <div style={{ height: 12, background: 'var(--border-color)', borderRadius: 6, width: '90%', marginBottom: 12 }} />
            <div style={{ height: 12, background: 'var(--border-color)', borderRadius: 6, width: '80%', marginBottom: 32 }} />
            
            {/* Added Text Box */}
            <div style={{ border: '2px solid var(--brand-primary)', borderRadius: 8, padding: 12, background: 'rgba(225, 29, 72, 0.05)', display: 'inline-block' }} className="hover-lift">
               <span style={{ color: 'var(--brand-primary)', fontWeight: 800, fontSize: '1.2rem' }}>John Doe<span style={{ animation: 'blink 1s step-end infinite' }}>|</span></span>
            </div>
            
            {/* Floating Toolbar */}
            <div style={{ position: 'absolute', top: -20, right: -20, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 12, display: 'flex', gap: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
               <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Type size={20} /></div>
               <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-app)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={20} /></div>
               <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-app)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PenTool size={20} /></div>
            </div>
         </div>
      </div>
    </div>
  </section>
);

export const EditHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ padding: 40, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }} className="hover-lift">
          <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '10rem', fontWeight: 900, color: 'var(--bg-app)', opacity: 0.5, lineHeight: 1, zIndex: 0 }}>
            {i + 1}
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
               {step.title}
             </h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const EditGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'var(--bg-app)', border: '1px solid var(--border-color)', position: 'relative' }} className="hover-lift">
            <TextCursorInput size={48} color="var(--brand-primary)" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>Annotate Securely</h3>
            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>Type, draw, and place images onto your sensitive PDF documents without ever uploading them.</p>
         </div>
      </div>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
          <MapPin size={14} /> {section.badgeText || 'Local Processing'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const EditPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ width: 100, height: 100, margin: '0 auto 32px', borderRadius: 32, background: 'var(--bg-card)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} className="hover-lift">
        <Shield size={48} color="var(--brand-primary)" />
      </div>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const EditPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
          <Zap size={14} /> {section.badgeText || 'Lightning Fast'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, marginBottom: 40 }}>{section.content}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {(badges || ['Zero server latency', 'Instant text rendering', 'Canvas hardware accel']).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
              <CheckCircle2 color="var(--brand-primary)" size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 280, height: 280, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <MousePointerSquareDashed size={100} color="var(--brand-primary)" opacity={0.2} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
              <Zap size={32} />
            </div>
         </div>
      </div>
    </div>
  </section>
);
