// @ts-nocheck
import React from 'react';
import { Presentation, Projector, Layers, FileOutput, ShieldCheck, Maximize, Clock, FileLock2 } from 'lucide-react';
import type { SectionProps } from '../types';

export const PptToPdfHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: '#d97706', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Projector Light Beam Background */}
    <div style={{ position: 'absolute', top: '50%', right: '-10%', transform: 'translateY(-50%)', width: '60vw', height: '100vw', background: 'radial-gradient(circle at 100% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)', clipPath: 'polygon(100% 40%, 100% 60%, 0% 100%, 0% 0%)', opacity: 0.3, zIndex: 0, pointerEvents: 'none' }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '12px 24px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: 100, fontWeight: 800, fontSize: '0.9rem', marginBottom: 24, gap: 12, alignItems: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
          <Projector size={18} /> Boardroom Ready
        </div>
        
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.04em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', opacity: 0.9, lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center', perspective: 1000 }}>
         {/* Presentation Screen Graphic */}
         <div style={{ width: '100%', maxWidth: 460, background: 'var(--bg-card)', borderRadius: 16, borderTop: '20px solid #1e293b', borderBottom: '20px solid #1e293b', borderLeft: '4px solid #1e293b', borderRight: '4px solid #1e293b', position: 'relative', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', transform: 'rotateY(-15deg)', transformStyle: 'preserve-3d' }}>
            {/* Projector stand */}
            <div style={{ position: 'absolute', bottom: -50, width: 80, height: 30, background: '#1e293b', borderRadius: '0 0 16px 16px' }} />
            
            {/* The Slide Content */}
            <div style={{ width: '90%', height: '80%', background: 'white', display: 'flex', flexDirection: 'column', padding: 24, position: 'relative', overflow: 'hidden' }}>
               <h3 style={{ color: '#d97706', fontSize: '2rem', fontWeight: 900, margin: '0 0 16px 0' }}>Q3 Strategy</h3>
               <div style={{ height: 16, width: '100%', background: '#f1f5f9', borderRadius: 4, marginBottom: 8 }} />
               <div style={{ height: 16, width: '80%', background: '#f1f5f9', borderRadius: 4, marginBottom: 24 }} />
               
               {/* Animated chart bars */}
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 60, flex: 1 }}>
                  <div style={{ width: 40, background: '#cbd5e1', height: '40%', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: 40, background: '#94a3b8', height: '70%', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: 40, background: '#d97706', height: '100%', borderRadius: '4px 4px 0 0', animation: 'growBar 2s ease-out infinite alternate' }} />
               </div>
               <style>{`@keyframes growBar { 0% { height: 20%; } 100% { height: 100%; } }`}</style>
            </div>
            
            {/* PDF Stamp overlay */}
            <div style={{ position: 'absolute', bottom: -10, right: -20, background: 'var(--brand-primary)', color: 'white', padding: '12px 24px', borderRadius: 100, fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(225,29,72,0.4)', transform: 'translateZ(30px) rotate(-10deg)', border: '4px solid white', display: 'flex', alignItems: 'center', gap: 8 }}>
               <FileOutput size={20} /> .PDF
            </div>
         </div>
      </div>
    </div>
  </section>
);

export const PptToPdfHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-card)', border: '4px solid #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(217, 119, 6, 0.15)' }}>
            {i === 0 ? <Presentation size={40} color="#d97706" /> : i === 1 ? <Layers size={40} color="#d97706" /> : <FileOutput size={40} color="#d97706" />}
          </div>
          <div>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const PptToPdfGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 500px' }}>
         <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
         <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
       </div>
       <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: 48, background: 'var(--bg-app)', borderRadius: 32, borderTop: '8px solid #d97706', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', width: '100%' }}>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 24 }}>Why Local Conversion?</h3>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0, padding: 0, listStyle: 'none' }}>
                <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck color="#d97706" size={24} /> Stop data scraping</li>
                <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck color="#d97706" size={24} /> No NDA violations</li>
                <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck color="#d97706" size={24} /> Bypass cloud queues</li>
             </ul>
          </div>
       </div>
    </div>
  </section>
);

export const PptToPdfPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: '#09090b', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
       <div style={{ width: 120, height: 120, margin: '0 auto 40px', background: 'rgba(217, 119, 6, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
          <FileLock2 size={56} color="#d97706" />
       </div>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#a1a1aa', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const PptToPdfPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--brand-gradient)', position: 'relative', color: 'white' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: 32, borderRadius: 24, textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Maximize size={40} style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Vector PDF</div>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: 32, borderRadius: 24, textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Clock size={40} style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Zero Delay</div>
             </div>
          </div>
       </div>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', opacity: 0.9, lineHeight: 1.7 }}>{section.content}</p>
       </div>
    </div>
  </section>
);
