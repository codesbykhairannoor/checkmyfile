// @ts-nocheck
import React from 'react';
import { Search, ImagePlus, Archive, Fingerprint, Eye, Zap, Layers, Image as ImageIcon } from 'lucide-react';
import type { SectionProps } from '../types';

export const ExtractImagesHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    {/* Grid pattern */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3, pointerEvents: 'none' }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', padding: '12px 24px', background: 'var(--bg-card)', borderRadius: 100, color: 'var(--text-main)', fontWeight: 800, fontSize: '0.9rem', marginBottom: 40, gap: 12, alignItems: 'center', border: '2px solid var(--text-main)', boxShadow: '4px 4px 0 var(--text-main)' }}>
        <Search size={18} /> Deep PDF Scanning
      </div>
      
      <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: 900 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto 80px' }}>{section.content}</p>
      
      {/* Magnifying Glass Graphic */}
      <div style={{ position: 'relative', width: 300, height: 300 }}>
         {/* Underlying PDF mock */}
         <div style={{ position: 'absolute', top: 0, left: 40, right: 40, bottom: 20, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ height: 12, width: '80%', background: 'var(--bg-app)', borderRadius: 4 }} />
            <div style={{ height: 100, width: '100%', background: 'var(--brand-primary)', opacity: 0.1, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ImageIcon size={40} color="var(--brand-primary)" opacity={0.5} />
            </div>
            <div style={{ height: 12, width: '60%', background: 'var(--bg-app)', borderRadius: 4 }} />
         </div>
         
         {/* Magnifying Glass Overlay */}
         <div style={{ position: 'absolute', top: '40%', left: '40%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '8px solid var(--text-main)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', animation: 'scanGlass 4s ease-in-out infinite alternate', zIndex: 10 }}>
            {/* The handle */}
            <div style={{ position: 'absolute', bottom: -50, right: -50, width: 24, height: 80, background: 'var(--text-main)', transform: 'rotate(-45deg)', borderRadius: 12 }} />
            
            {/* Found image popping out */}
            <div style={{ width: 100, height: 100, background: 'var(--brand-primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transform: 'scale(1.2)', boxShadow: '0 10px 20px rgba(225, 29, 72, 0.3)' }}>
               <ImageIcon size={48} />
            </div>
         </div>
         <style>{`@keyframes scanGlass { 0% { top: 20%; left: 20%; } 100% { top: 50%; left: 50%; } }`}</style>
      </div>
    </div>
  </section>
);

export const ExtractImagesHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--brand-gradient)', position: 'relative', color: 'white' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ padding: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: 24 }} className="hover-lift">
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'white', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {i === 0 ? <Layers size={32} /> : i === 1 ? <Search size={32} /> : <Archive size={32} />}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{step.title}</h3>
          <p style={{ opacity: 0.9, lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const ExtractImagesGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
       <div style={{ width: 100, height: 100, margin: '0 auto 40px', background: 'var(--bg-card)', border: '4px solid var(--text-main)', borderRadius: 24, transform: 'rotate(10deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '8px 8px 0 var(--text-main)' }}>
          <div style={{ transform: 'rotate(-10deg)' }}>
             <ImagePlus size={48} color="var(--text-main)" />
          </div>
       </div>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const ExtractImagesPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: '#09090b', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center' }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ position: 'relative', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px dashed #3f3f46', borderRadius: '50%', animation: 'spinVault 20s linear infinite' }} />
            <Eye size={80} color="var(--brand-primary)" />
            <div style={{ position: 'absolute', top: 30, right: 30, background: 'var(--brand-primary)', color: 'white', padding: '4px 12px', borderRadius: 100, fontWeight: 800, fontSize: '0.8rem' }}>OFFLINE</div>
         </div>
      </div>
      <div style={{ flex: '1 1 500px', color: 'white' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#a1a1aa', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ExtractImagesPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
       </div>
       <div style={{ flex: '1 1 400px' }}>
          <div style={{ padding: 40, background: 'var(--bg-app)', borderRadius: 32, border: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16 }}>
             {(badges || ['Original Resolution', 'Direct Data Copy', 'Batch ZIP']).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg-card)', borderRadius: 16 }}>
                   <Zap color="var(--brand-primary)" size={24} />
                   <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{item}</span>
                </div>
             ))}
          </div>
       </div>
    </div>
  </section>
);
