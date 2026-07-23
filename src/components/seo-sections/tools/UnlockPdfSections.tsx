// @ts-nocheck
import React from 'react';
import { KeyRound, Unlock, LockOpen, FileSearch, ShieldCheck, ShieldOff, Zap } from 'lucide-react';
import type { SectionProps } from '../types';

export const UnlockHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    {/* Primary glow background */}
    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', maxWidth: 800, maxHeight: 800, background: 'radial-gradient(circle, rgba(225, 29, 72, 0.15) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', padding: '12px 24px', background: 'var(--bg-card)', borderRadius: 100, color: 'var(--brand-primary)', fontWeight: 800, fontSize: '0.9rem', marginBottom: 40, gap: 12, alignItems: 'center', border: '1px solid var(--brand-primary)', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.15)' }}>
        <KeyRound size={18} /> Decryption Engine
      </div>
      
      <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: 900 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto 80px' }}>{section.content}</p>
      
      {/* Breaking Chains / Opening Lock Graphic */}
      <div style={{ width: '100%', maxWidth: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
         <div style={{ position: 'absolute', left: 0, width: '45%', height: 4, background: 'linear-gradient(90deg, transparent, var(--border-color))' }} />
         <div style={{ position: 'absolute', right: 0, width: '45%', height: 4, background: 'linear-gradient(-90deg, transparent, var(--border-color))' }} />
         
         <div style={{ width: 160, height: 160, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, boxShadow: '0 20px 50px rgba(225, 29, 72, 0.2)' }} className="hover-lift">
            <Unlock size={80} color="var(--brand-primary)" style={{ transform: 'translateY(-10px)' }} />
            <div style={{ position: 'absolute', bottom: -20, padding: '8px 16px', background: 'var(--brand-primary)', color: 'white', borderRadius: 100, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em' }}>UNLOCKED</div>
         </div>
      </div>
    </div>
  </section>
);

export const UnlockHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ flex: '1 1 300px', maxWidth: 400, padding: 48, background: 'var(--bg-app)', borderRadius: 40, borderTop: '4px solid var(--brand-primary)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="hover-lift">
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {i === 0 ? <FileSearch size={32} /> : i === 1 ? <KeyRound size={32} /> : <LockOpen size={32} />}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{step.title}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const UnlockGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--brand-gradient)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
       <div style={{ width: 100, height: 100, margin: '0 auto 40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <ShieldOff size={48} color="white" />
       </div>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', opacity: 0.9, lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const UnlockPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'var(--bg-card)', border: '1px solid var(--border-color)', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }} className="hover-lift">
            <ShieldCheck size={64} color="var(--brand-primary)" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>Key Isolation</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>The password you type is only used locally to decrypt the file stream. It is never logged.</p>
         </div>
      </div>
    </div>
  </section>
);

export const UnlockPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 800, margin: '0 auto 60px' }}>{section.content}</p>
       
       <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          {(badges || ['Instant Verification', 'Hardware Accelerated', 'WebCrypto API']).map((item, i) => (
             <div key={i} style={{ padding: '20px 40px', background: 'var(--bg-app)', borderRadius: 100, border: '2px dashed var(--border-color)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Zap color="var(--brand-primary)" /> {item}
             </div>
          ))}
       </div>
    </div>
  </section>
);
