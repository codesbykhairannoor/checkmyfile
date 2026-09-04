import React from 'react';
import { Shield, Zap, Globe2 } from 'lucide-react';
import type { SectionProps } from './types';

export const LtGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgba(225, 29, 72, 0.05)', color: 'var(--brand-primary)', borderRadius: 9999, fontWeight: 700, fontSize: '0.9rem', marginBottom: 32 }}>
        <Globe2 size={20} /> {section.badgeText || 'Local Processing'}
      </div>
      <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
      
      {section.subTitle && (
        <div style={{ marginTop: 64, padding: 48, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }} className="hover-lift">
           <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.subTitle}</h3>
           <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.subContent}</p>
        </div>
      )}
    </div>
  </section>
);

export const LtPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'var(--brand-primary)', color: 'white', boxShadow: '0 30px 60px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
            <Shield size={48} style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>{section.badgeText || '100% Secure'}</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>Your files never leave your device. We use advanced WebAssembly technology to process your documents without ever uploading them to external servers.</p>
         </div>
      </div>
    </div>
  </section>
);

export const LtPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', marginBottom: 40 }}>
        <Zap size={40} />
      </div>
      <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);
