// @ts-nocheck
import React from 'react';
import { FileImage, Image as ImageIcon, Download, Search, LayoutGrid, Monitor, ShieldCheck, Zap } from 'lucide-react';
import type { SectionProps } from '../types';

export const PdfToImageHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--brand-gradient)', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Abstract gallery frames */}
    <div style={{ position: 'absolute', top: -50, right: -50, width: 400, height: 400, background: 'rgba(255,255,255,0.05)', borderRadius: 40, transform: 'rotate(15deg)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: 40, transform: 'rotate(-15deg)', pointerEvents: 'none' }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center', backdropFilter: 'blur(10px)' }}>
          <ImageIcon size={16} /> HD Rasterization
        </div>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', opacity: 0.9, lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         {/* Animated Gallery Wall */}
         <div style={{ position: 'relative', width: 400, height: 400 }}>
            {/* Center PDF Doc */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 140, height: 180, background: 'white', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', zIndex: 10 }}>
               <FileImage size={64} color="var(--brand-primary)" />
            </div>
            
            {/* Orbiting Images */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, animation: 'spinOrbit 15s linear infinite' }}>
               <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', width: 80, height: 80, background: 'rgba(255,255,255,0.9)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                  <ImageIcon size={32} color="#3b82f6" />
               </div>
               <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 80, height: 80, background: 'rgba(255,255,255,0.9)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                  <ImageIcon size={32} color="#10b981" />
               </div>
               <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 80, height: 80, background: 'rgba(255,255,255,0.9)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                  <ImageIcon size={32} color="#f59e0b" />
               </div>
               <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', width: 80, height: 80, background: 'rgba(255,255,255,0.9)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                  <ImageIcon size={32} color="#8b5cf6" />
               </div>
            </div>
            <style>{`@keyframes spinOrbit { 100% { transform: rotate(360deg); } }`}</style>
         </div>
      </div>
    </div>
  </section>
);

export const PdfToImageHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 40, padding: 48, background: 'var(--bg-card)', borderRadius: 32, borderLeft: '8px solid var(--brand-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="hover-lift">
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {i === 0 ? <FileImage size={40} color="var(--brand-primary)" /> : i === 1 ? <LayoutGrid size={40} color="var(--brand-primary)" /> : <Download size={40} color="var(--brand-primary)" />}
          </div>
          <div>
             <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{step.title}</h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.2rem' }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const PdfToImageGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center' }}>
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ position: 'relative', width: 300, height: 300 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 200, height: 150, background: '#3b82f6', borderRadius: 16, transform: 'rotate(-10deg)', opacity: 0.8 }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 220, height: 160, background: '#10b981', borderRadius: 16, transform: 'rotate(15deg)', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 240, height: 180, background: 'white', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Monitor size={64} color="var(--brand-primary)" />
            </div>
         </div>
      </div>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const PdfToImagePrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: '#09090b', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', color: 'white' }}>
      <div style={{ width: 120, height: 120, margin: '0 auto 40px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <ShieldCheck size={56} color="var(--brand-primary)" />
      </div>
      
      <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#a1a1aa', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const PdfToImagePerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40 }}>{section.content}</p>
        
        <div style={{ display: 'flex', gap: 16 }}>
          {(badges || ['DPI Control', 'ZIP Export', 'WebWorker Async']).map((item, i) => (
             <div key={i} style={{ padding: '12px 24px', background: 'var(--bg-card)', borderRadius: 100, border: '1px solid var(--border-color)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                {item}
             </div>
          ))}
        </div>
       </div>
       <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 300, height: 300, borderRadius: '50%', background: 'var(--bg-card)', border: '10px solid var(--brand-primary)', borderBottomColor: 'transparent', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
             <div style={{ transform: 'rotate(-45deg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Zap size={48} color="var(--brand-primary)" style={{ marginBottom: 12 }} />
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>0.1s</span>
             </div>
          </div>
       </div>
    </div>
  </section>
);
