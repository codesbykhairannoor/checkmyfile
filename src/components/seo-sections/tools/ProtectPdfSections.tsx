// @ts-nocheck
import React from 'react';
import { Lock, KeyRound, ShieldAlert, Cpu, EyeOff, FolderLock, Hexagon, Fingerprint } from 'lucide-react';
import type { SectionProps } from '../types';

export const ProtectHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--brand-primary)', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Abstract encryption nodes */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px', zIndex: 0 }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
            {/* Vault Graphic */}
            <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', padding: 20, boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3)', border: '4px solid rgba(255,255,255,0.1)' }}>
               <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', animation: 'spinVault 20s linear infinite' }}>
                  <Hexagon size={280} color="rgba(255,255,255,0.1)" strokeWidth={1} />
                  {/* Lock Dial */}
                  <div style={{ position: 'absolute', top: 20, width: 20, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 10 }} />
                  <div style={{ position: 'absolute', bottom: 20, width: 20, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 10 }} />
                  <div style={{ position: 'absolute', left: 20, width: 40, height: 20, background: 'rgba(255,255,255,0.2)', borderRadius: 10 }} />
                  <div style={{ position: 'absolute', right: 20, width: 40, height: 20, background: 'rgba(255,255,255,0.2)', borderRadius: 10 }} />
               </div>
               <style>{`@keyframes spinVault { 100% { transform: rotate(360deg); } }`}</style>
               
               {/* Center Lock static */}
               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 140, height: 140, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} className="hover-lift">
                  <Lock size={64} color="var(--brand-primary)" />
               </div>
            </div>
         </div>
      </div>
      
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 24px', background: 'rgba(0,0,0,0.2)', borderRadius: 100, fontWeight: 800, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ShieldAlert size={18} /> AES-256 Encryption
        </div>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.04em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', opacity: 0.9, lineHeight: 1.8 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ProtectHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
      {/* Connecting line */}
      <div style={{ position: 'absolute', left: 40, top: 40, bottom: 40, width: 4, background: 'var(--bg-app)' }} className="hidden-mobile" />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 32, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-app)', border: '4px solid var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(225, 29, 72, 0.1)' }}>
              {i === 0 ? <FolderLock size={32} color="var(--brand-primary)" /> : i === 1 ? <KeyRound size={32} color="var(--brand-primary)" /> : <Lock size={32} color="var(--brand-primary)" />}
            </div>
            <div style={{ padding: '24px 32px', background: 'var(--bg-app)', borderRadius: 24, flex: 1, border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{step.title}</h3>
               <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ProtectGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
       <div style={{ width: 100, height: 100, margin: '0 auto 40px', background: 'var(--brand-gradient)', borderRadius: 24, transform: 'rotate(15deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(225, 29, 72, 0.3)' }}>
          <div style={{ transform: 'rotate(-15deg)' }}>
             <Cpu size={48} color="white" />
          </div>
       </div>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05, maxWidth: 900, margin: '0 auto 32px' }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const ProtectPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: '#09090b', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#a1a1aa', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '1px dashed #3f3f46', borderRadius: '50%', animation: 'spinVault 15s linear infinite reverse' }} />
            <div style={{ position: 'absolute', top: 20, left: 20, right: 20, bottom: 20, border: '2px solid #52525b', borderRadius: '50%' }} />
            <EyeOff size={80} color="#71717a" />
         </div>
      </div>
    </div>
  </section>
);

export const ProtectPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 400px' }}>
          <div style={{ padding: 48, background: 'var(--bg-app)', borderRadius: 32, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 24 }}>
             {(badges || ['Browser-native API', 'No Upload Delay', 'Instant Encryption']).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                   <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>{i+1}</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{item}</div>
                </div>
             ))}
          </div>
       </div>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
       </div>
    </div>
  </section>
);
