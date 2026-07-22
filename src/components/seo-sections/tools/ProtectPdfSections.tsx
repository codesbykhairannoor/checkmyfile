/**
 * protect-pdf — "Vault" Sections
 * Theme: Dark Green + Gold, AES-256 lock aesthetic
 * Every section is UNIQUE to this tool only.
 */
import React from 'react';
import type { SectionProps } from '../types';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export const ProtectHeroSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section protect-hero" style={{ padding: '80px 24px', margin: '40px 0', background: 'linear-gradient(135deg, #052e16 0%, #14532d 60%, #166534 100%)', borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
    {/* Gold ring decorations */}
    <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '2px solid rgba(234,179,8,0.2)' }} />
    <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(234,179,8,0.35)' }} />
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 360px' }}>
        <div style={{ display: 'inline-flex', padding: '8px 18px', background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.4)', borderRadius: 100, color: '#fde047', fontWeight: 700, fontSize: '0.85rem', marginBottom: 24, gap: 8, alignItems: 'center', backdropFilter: 'blur(4px)' }}>
          🔐 AES-256 Encryption
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: '#fff', lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        {[
          { level: 'AES-128', w: 60, active: false },
          { level: 'AES-192', w: 75, active: false },
          { level: 'AES-256', w: 100, active: true },
        ].map(({ level, w, active }) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: active ? '#fde047' : 'rgba(255,255,255,0.4)', minWidth: 68 }}>{level}</span>
            <div style={{ height: 8, width: 160, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${w}%`, background: active ? 'linear-gradient(90deg, #eab308, #fde047)' : 'rgba(255,255,255,0.2)', borderRadius: 100 }} />
            </div>
            {active && <span style={{ fontSize: '0.75rem', color: '#fde047', fontWeight: 700 }}>✓ USED</span>}
          </div>
        ))}
        <div style={{ marginTop: 8, padding: '10px 20px', background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.5)', borderRadius: 12, color: '#fde047', fontSize: '0.85rem', fontWeight: 700 }}>
          Military-Grade Strength
        </div>
      </div>
    </div>
  </section>
);

export const ProtectHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section protect-howto" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 48, color: 'var(--text-main)', textAlign: 'center' }}>{section.title}</h2>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: `2px solid ${i === 1 ? 'rgba(16,185,129,0.4)' : 'var(--border-color)'}`, position: 'relative', transition: 'transform 0.2s' }}>
          <div style={{ position: 'absolute', top: -14, left: 28, width: 28, height: 28, borderRadius: '50%', background: '#166534', border: '2px solid #4ade80', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>{i + 1}</div>
          {/* Security level fill bar */}
          <div style={{ height: 4, background: 'var(--bg-main)', borderRadius: 100, marginBottom: 24, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(i + 1) * 33}%`, background: 'linear-gradient(90deg, #166534, #4ade80)', borderRadius: 100 }} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-main)' }}>{step.title}</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const ProtectGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section protect-geo" style={{ padding: '0', margin: '60px 0', background: '#052e16', borderRadius: 32, overflow: 'hidden' }}>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div style={{ flex: '2 1 400px', padding: '56px 48px' }}>
        <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 100, color: '#4ade80', fontSize: '0.8rem', fontWeight: 700, marginBottom: 20 }}>
          🛡 Secure Processing Zone
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 16, color: '#fff', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 200px', background: 'rgba(74,222,128,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12, borderLeft: '1px solid rgba(74,222,128,0.15)' }}>
        <ShieldCheck size={64} color="#4ade80" />
        <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center' }}>Zero Data<br/>Exposure</div>
      </div>
    </div>
  </section>
);

export const ProtectPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section protect-privacy" style={{ padding: '80px 24px', margin: '60px 0', textAlign: 'center' }}>
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #166534, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 0 60px rgba(74,222,128,0.3)' }}>
        <ShieldCheck size={52} color="white" />
      </div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['GDPR', 'HIPAA', 'CCPA', 'SOC 2 Ready', '100% Offline'].map(b => (
          <div key={b} style={{ padding: '10px 20px', background: 'rgba(22,101,52,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#16a34a', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', display: 'flex', gap: 6, alignItems: 'center' }}>
            <CheckCircle size={14} /> {b}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ProtectPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section protect-performance" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)' }}>
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 320px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {/* Tachometer blocks */}
      <div style={{ flex: '1 1 280px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { v: '<1s', l: 'Encrypt Time', color: '#4ade80' },
          { v: '256', l: 'Bit Key Length', color: '#eab308' },
          { v: '0', l: 'Server Calls', color: '#10b981' },
          { v: '100%', l: 'Local Compute', color: '#6366f1' },
        ].map(({ v, l, color }) => (
          <div key={l} style={{ padding: '20px 16px', background: 'var(--bg-main)', borderRadius: 16, border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color, marginBottom: 4 }}>{v}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
