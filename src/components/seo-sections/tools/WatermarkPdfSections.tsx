// @ts-nocheck
import React from 'react';
import { Stamp, Image as ImageIcon, Type, Layers, ShieldCheck, MapPin, FastForward, CheckCircle2, Droplets } from 'lucide-react';
import type { SectionProps } from '../types';

export const WatermarkHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-app)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    {/* Diagonal Watermark background */}
    <div style={{ position: 'absolute', top: '-20%', left: '-10%', right: '-10%', bottom: '-20%', display: 'flex', flexWrap: 'wrap', gap: 40, opacity: 0.03, pointerEvents: 'none', transform: 'rotate(-15deg)' }}>
       {Array.from({ length: 50 }).map((_, i) => (
         <span key={i} style={{ fontSize: '3rem', fontWeight: 900, whiteSpace: 'nowrap', color: 'var(--text-main)' }}>CONFIDENTIAL</span>
       ))}
    </div>
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '12px 24px', background: 'var(--brand-gradient)', borderRadius: 100, color: 'white', fontWeight: 800, fontSize: '0.9rem', marginBottom: 40, gap: 12, alignItems: 'center', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.3)' }}>
          <Stamp size={18} /> Instant Local Stamping
        </div>
        
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 40 }}>{section.content}</p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ position: 'relative', width: 340, height: 420 }}>
            {/* The Document */}
            <div style={{ position: 'absolute', top: 40, left: 40, right: 40, bottom: 40, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ height: 20, width: '70%', background: 'var(--bg-app)', borderRadius: 4 }} />
                <div style={{ height: 12, width: '100%', background: 'var(--bg-app)', borderRadius: 4 }} />
                <div style={{ height: 12, width: '90%', background: 'var(--bg-app)', borderRadius: 4 }} />
                <div style={{ height: 12, width: '80%', background: 'var(--bg-app)', borderRadius: 4 }} />
                <div style={{ height: 120, width: '100%', background: 'var(--bg-app)', borderRadius: 4, marginTop: 24 }} />
            </div>
            
            {/* Watermark Overlay Animation */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', animation: 'stampDown 3s infinite' }}>
               <div style={{ padding: '16px 32px', border: '8px solid rgba(225, 29, 72, 0.5)', color: 'rgba(225, 29, 72, 0.5)', fontSize: '2.5rem', fontWeight: 900, transform: 'rotate(-30deg)', borderRadius: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Draft
               </div>
            </div>
            <style>{`@keyframes stampDown { 0% { transform: scale(3); opacity: 0; } 10% { transform: scale(1); opacity: 1; } 80% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }`}</style>
         </div>
      </div>
    </div>
  </section>
);

export const WatermarkHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 48, background: 'var(--bg-app)', borderRadius: 32, border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="hover-lift">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-card)', border: '2px dashed var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--brand-primary)' }}>
            {i === 0 ? <Layers size={32} /> : i === 1 ? <Type size={32} /> : <Stamp size={32} />}
          </div>
          <div style={{ flex: 1 }}>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const WatermarkGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--brand-gradient)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', opacity: 0.9, lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', position: 'relative' }} className="hover-lift">
            <ImageIcon size={48} color="white" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>Logo Support</h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.7 }}>Upload your company PNG and we will stamp it transparently on every page.</p>
         </div>
      </div>
    </div>
  </section>
);

export const WatermarkPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', padding: 32, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', marginBottom: 40 }}>
        <ShieldCheck size={80} color="var(--brand-primary)" />
      </div>
      <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const WatermarkPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 280, height: 280, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <Droplets size={120} color="var(--brand-primary)" opacity={0.1} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 100, height: 100, background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
              <FastForward size={48} />
            </div>
         </div>
       </div>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40 }}>{section.content}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {(badges || ['Adjust Opacity', 'Rotate Text', 'Page Selection']).map((item, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
                <CheckCircle2 color="var(--brand-primary)" size={20} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item}</span>
             </div>
          ))}
        </div>
       </div>
    </div>
  </section>
);
