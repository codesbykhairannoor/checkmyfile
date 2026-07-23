// @ts-nocheck
import React from 'react';
import { PenTool, MousePointer2, FileSignature, Fingerprint, Shield, Zap, Edit3, Briefcase } from 'lucide-react';
import type { SectionProps } from '../types';

export const SignHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: '#0f172a', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Abstract ink splatters */}
    <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'var(--brand-primary)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }} />
    <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: '#3b82f6', filter: 'blur(80px)', opacity: 0.1, borderRadius: '50%' }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 100, color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <PenTool size={16} /> Draw, Type, or Upload
        </div>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 24, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#94a3b8', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 460, background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
               <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PenTool size={20} color="var(--brand-primary)" /></div>
               <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit3 size={20} color="var(--text-muted)" /></div>
            </div>
            
            <div style={{ height: 200, width: '100%', border: '2px dashed #cbd5e1', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
               <span style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 600, opacity: 0.5 }}>Sign Here</span>
               
               {/* Animated SVG Signature Path */}
               <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%' }} viewBox="0 0 200 100">
                  <path d="M 20 80 Q 50 20 80 80 T 120 40 T 160 80 T 180 60" fill="transparent" stroke="var(--brand-primary)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                     style={{ strokeDasharray: 500, strokeDashoffset: 500, animation: 'signDraw 3s ease-in-out infinite alternate' }} />
               </svg>
               <style>{`@keyframes signDraw { 0% { stroke-dashoffset: 500; } 100% { stroke-dashoffset: 0; } }`}</style>
               
               {/* Mouse cursor animating */}
               <div style={{ position: 'absolute', zIndex: 10, animation: 'mouseMove 3s ease-in-out infinite alternate' }}>
                  <MousePointer2 size={24} color="#0f172a" fill="white" />
               </div>
               <style>{`@keyframes mouseMove { 0% { top: 75%; left: 10%; } 20% { top: 25%; left: 30%; } 40% { top: 75%; left: 50%; } 60% { top: 40%; left: 70%; } 80% { top: 75%; left: 90%; } 100% { top: 60%; left: 100%; } }`}</style>
            </div>
         </div>
      </div>
    </div>
  </section>
);

export const SignHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 40, background: 'var(--bg-card)', borderRadius: 40, boxShadow: '0 20px 40px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-app)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {i === 0 ? <PenTool size={32} color="var(--brand-primary)" /> : i === 1 ? <FileSignature size={32} color="var(--brand-primary)" /> : <Shield size={32} color="var(--brand-primary)" />}
          </div>
          <div>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{step.title}</h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const SignGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--brand-gradient)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ padding: 48, borderRadius: 32, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }} className="hover-lift">
            <Briefcase size={64} color="white" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>B2B Ready</h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.7 }}>Sign NDAs, contracts, and proposals with high-resolution vector strokes.</p>
         </div>
      </div>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', opacity: 0.9, lineHeight: 1.7 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const SignPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 40 }}>
         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(225, 29, 72, 0.1)', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
         <div style={{ width: '100%', height: '100%', background: 'var(--bg-app)', border: '2px solid var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <Fingerprint size={56} color="var(--brand-primary)" />
         </div>
      </div>
      <style>{`@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }`}</style>
      
      <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, maxWidth: 800 }}>{section.content}</p>
    </div>
  </section>
);

export const SignPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40 }}>{section.content}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(badges || ['Vector quality', 'Zero latency', 'No watermark added', 'Custom fonts']).map((item, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
                <Zap color="var(--brand-primary)" size={20} />
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item}</span>
             </div>
          ))}
        </div>
       </div>
       <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          {/* Decorative speed dial */}
          <div style={{ width: 300, height: 300, borderRadius: '50%', border: '20px solid var(--bg-card)', borderTopColor: 'var(--brand-primary)', borderRightColor: 'var(--brand-primary)', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
             <div style={{ transform: 'rotate(45deg)', fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)' }}>1s</div>
          </div>
       </div>
    </div>
  </section>
);
