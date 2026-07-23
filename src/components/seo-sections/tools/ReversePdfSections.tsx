// @ts-nocheck
import React from 'react';
import { ArrowDownUp, RefreshCcw, MapPin, Shield, Zap, CheckCircle2, History } from 'lucide-react';
import type { SectionProps } from '../types';

export const ReverseHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
         <div style={{ position: 'relative', width: 280, height: 340 }}>
            {/* Background Stack (Original Order) */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: 180, height: 240, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, color: 'var(--text-muted)', opacity: 0.5 }}>1</div>
            <div style={{ position: 'absolute', top: 20, right: 20, width: 180, height: 240, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, color: 'var(--text-muted)', opacity: 0.7 }}>2</div>
            <div style={{ position: 'absolute', top: 40, right: 40, width: 180, height: 240, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, color: 'var(--text-muted)' }}>3</div>
            
            {/* Arrow */}
            <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
               <div style={{ width: 64, height: 64, background: 'var(--bg-card)', border: '2px solid var(--brand-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <RefreshCcw size={32} />
               </div>
            </div>
            
            {/* Foreground Stack (Reversed Order) */}
            <div style={{ position: 'absolute', bottom: 40, left: 0, width: 180, height: 240, background: 'var(--brand-gradient)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, opacity: 0.4, zIndex: 3 }}>3</div>
            <div style={{ position: 'absolute', bottom: 20, left: 20, width: 180, height: 240, background: 'var(--brand-gradient)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, opacity: 0.7, zIndex: 4 }}>2</div>
            <div style={{ position: 'absolute', bottom: 0, left: 40, width: 180, height: 240, background: 'var(--brand-gradient)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, zIndex: 5, boxShadow: '0 20px 40px rgba(225, 29, 72, 0.4)' }} className="hover-lift">1</div>
         </div>
      </div>
      
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(225, 29, 72, 0.1)', borderRadius: 100, color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <ArrowDownUp size={16} /> Reverse Page Order
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ReverseHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 40, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }} className="hover-lift">
          <div style={{ flex: 1 }}>
             <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
               <span style={{ color: 'var(--brand-primary)', marginRight: 16 }}>{i + 1}.</span>{step.title}
             </h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
          </div>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-app)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
             <ArrowDownUp size={24} />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const ReverseGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
          <MapPin size={14} /> {section.badgeText || 'Local Processing'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 200, height: 200, borderRadius: '50%', background: 'var(--bg-app)', border: '4px solid var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} className="hover-lift">
            <History size={80} color="var(--brand-primary)" />
            <div style={{ position: 'absolute', bottom: -20, right: -20, background: 'var(--text-main)', color: 'white', padding: '12px 24px', borderRadius: 100, fontWeight: 800, fontSize: '1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>Fix Scans</div>
         </div>
      </div>
    </div>
  </section>
);

export const ReversePrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 40, padding: '80px 48px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 32px', borderRadius: 24, background: 'var(--bg-app)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={40} color="var(--brand-primary)" />
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ReversePerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
          <Zap size={14} /> {section.badgeText || 'Lightning Fast'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, opacity: 0.8, marginBottom: 40 }}>{section.content}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {(badges || ['Zero server latency', 'Instant sequence flip', 'Format retention']).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'var(--bg-app)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
              <CheckCircle2 color="var(--brand-primary)" size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 280, height: 280, background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <ArrowDownUp size={100} color="var(--text-muted)" opacity={0.2} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
              <Zap size={32} />
            </div>
         </div>
      </div>
    </div>
  </section>
);
