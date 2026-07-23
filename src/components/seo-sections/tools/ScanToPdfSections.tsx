// @ts-nocheck
import React from 'react';
import { Camera, Scan, Smartphone, Crop, MapPin, Shield, Zap, CheckCircle2, Focus } from 'lucide-react';
import type { SectionProps } from '../types';

export const ScanHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(225, 29, 72, 0.1)', borderRadius: 100, color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <Camera size={16} /> Mobile Scanner Engine
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
         <div style={{ width: 280, height: 420, background: '#1e293b', border: '12px solid #0f172a', borderRadius: 40, padding: 16, position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            {/* Phone Screen Graphic */}
            <div style={{ width: '100%', height: '100%', background: 'var(--bg-app)', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
               {/* Document */}
               <div style={{ position: 'absolute', top: 40, left: 30, right: 30, bottom: 80, background: 'var(--bg-card)', transform: 'rotate(-3deg)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                     <div style={{ height: 6, background: 'var(--border-color)', width: '80%', borderRadius: 4 }} />
                     <div style={{ height: 6, background: 'var(--border-color)', width: '100%', borderRadius: 4 }} />
                     <div style={{ height: 6, background: 'var(--border-color)', width: '60%', borderRadius: 4 }} />
                  </div>
               </div>
               
               {/* Crop Borders overlay */}
               <div style={{ position: 'absolute', top: 30, left: 20, right: 20, bottom: 70, border: '2px solid var(--brand-primary)', zIndex: 10 }}>
                  <div style={{ position: 'absolute', top: -4, left: -4, width: 12, height: 12, background: 'var(--brand-primary)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: 'var(--brand-primary)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: -4, left: -4, width: 12, height: 12, background: 'var(--brand-primary)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: -4, right: -4, width: 12, height: 12, background: 'var(--brand-primary)', borderRadius: '50%' }} />
               </div>
               
               {/* Camera button */}
               <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: 48, height: 48, borderRadius: '50%', border: '4px solid white', background: 'var(--brand-primary)' }} className="hover-lift" />
            </div>
         </div>
      </div>
    </div>
  </section>
);

export const ScanHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 40, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }} className="hover-lift">
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, flexShrink: 0 }}>
            0{i + 1}
          </div>
          <div style={{ flex: 1 }}>
             <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
               {step.title}
             </h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const ScanGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'var(--bg-app)', border: '1px solid var(--border-color)', position: 'relative' }} className="hover-lift">
            <Focus size={48} color="var(--brand-primary)" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>Auto-Deskew & Crop</h3>
            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>Take a photo from any angle. Our browser engine automatically straightens and crops the document.</p>
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

export const ScanPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
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

export const ScanPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
          <Zap size={14} /> {section.badgeText || 'Lightning Fast'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, marginBottom: 40 }}>{section.content}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {(badges || ['High-res image support', 'Instant PDF generation', 'Device camera integration']).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
              <CheckCircle2 color="var(--brand-primary)" size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 280, height: 280, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <Camera size={100} color="var(--brand-primary)" opacity={0.2} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
              <Zap size={32} />
            </div>
         </div>
      </div>
    </div>
  </section>
);
