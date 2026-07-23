// @ts-nocheck
import React from 'react';
import { Crop, CheckCircle2, Shield, Zap, MapPin, Target, FileText } from 'lucide-react';
import type { SectionProps } from '../types';

export const CropHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      {/* Viewfinder Graphic */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48, position: 'relative' }}>
        <div style={{ width: 140, height: 140, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           {/* Top Left Bracket */}
           <div style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 32, borderTop: '4px solid var(--brand-primary)', borderLeft: '4px solid var(--brand-primary)', borderTopLeftRadius: 16 }}></div>
           {/* Top Right Bracket */}
           <div style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, borderTop: '4px solid var(--brand-primary)', borderRight: '4px solid var(--brand-primary)', borderTopRightRadius: 16 }}></div>
           {/* Bottom Left Bracket */}
           <div style={{ position: 'absolute', bottom: 0, left: 0, width: 32, height: 32, borderBottom: '4px solid var(--brand-primary)', borderLeft: '4px solid var(--brand-primary)', borderBottomLeftRadius: 16 }}></div>
           {/* Bottom Right Bracket */}
           <div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderBottom: '4px solid var(--brand-primary)', borderRight: '4px solid var(--brand-primary)', borderBottomRightRadius: 16 }}></div>
           
           <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.4)' }} className="hover-lift">
             <Crop size={40} />
           </div>
        </div>
      </div>
      
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const CropHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, position: 'relative', zIndex: 1 }}>
      {/* 2-Column Split: Sticky Left, Scrolling Right */}
      <div style={{ flex: '1 1 400px' }}>
        <div style={{ position: 'sticky', top: 120 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Target size={14} /> {section.badgeText || 'Quick Guide'}
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>{section.title}</h2>
          <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8 }}>Master the crop tool in three simple steps. Trim margins, focus content, and export instantly without ever uploading your file.</p>
        </div>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ padding: 40, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 24 }} className="hover-lift">
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-app)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)' }}>
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

export const CropGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
        <MapPin size={14} /> {section.badgeText || 'Local Processing'}
      </div>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto 64px' }}>{section.content}</p>
      
      {/* Target Crosshair Graphic */}
      <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
         <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'var(--border-color)' }}></div>
         <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--border-color)' }}></div>
         <div style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid var(--brand-primary)', margin: 'auto', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }} className="hover-lift">
            <MapPin size={40} color="var(--brand-primary)" />
         </div>
      </div>
    </div>
  </section>
);

export const CropPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }} className="hover-lift">
            <Shield size={64} color="var(--brand-primary)" style={{ marginBottom: 32 }} />
            <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>Crop Without Uploads</h3>
            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>Extract visual data or trim sensitive margins off a document completely within your browser's private memory.</p>
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

export const CropPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 64 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
          <Zap size={14} /> {section.badgeText || 'Lightning Fast'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, marginBottom: 40 }}>{section.content}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {(badges || ['Zero server latency', 'No upload bandwidth', 'Instant processing']).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
              <CheckCircle2 color="var(--brand-primary)" size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 280, height: 360, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <FileText size={64} color="var(--text-muted)" opacity={0.3} />
            {/* Glowing (Solid color) dashed bounding box animation */}
            <div style={{ position: 'absolute', top: 40, bottom: 40, left: 40, right: 40, border: '4px dashed var(--brand-primary)', borderRadius: 8, opacity: 0.8, transition: 'all 0.5s ease' }} className="hover-lift"></div>
            
            <div style={{ position: 'absolute', bottom: 20, right: 20, width: 64, height: 64, background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
              <Zap size={24} />
            </div>
         </div>
      </div>
    </div>
  </section>
);
