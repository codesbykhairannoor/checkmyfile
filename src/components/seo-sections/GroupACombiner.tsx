/* Group A — Combiner: Blue/Indigo */
import React from 'react';
import type { SectionProps } from './types';
import { FilePlus2, CheckCircle, Zap, Globe2, Lock } from 'lucide-react';

export const CombinerHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section combiner-hero" style={{ padding: '80px 24px', margin: '40px 0', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
      <div style={{ flex: '1 1 360px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(99,102,241,0.1)', borderRadius: 100, color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <FilePlus2 size={16} /> Powered by WebAssembly
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 360px', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{ width: n === 2 ? 130 : 110, height: n === 2 ? 170 : 150, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', transform: n === 1 ? 'rotate(-6deg)' : n === 3 ? 'rotate(6deg)' : 'none', boxShadow: n === 2 ? '0 20px 40px rgba(0,0,0,0.15)' : '0 8px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FilePlus2 size={32} color="rgba(99,102,241,0.3)" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const CombinerHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section combiner-how-to" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 60, color: 'var(--text-main)', textAlign: 'center' }}>{section.title}</h2>
    <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: i < (section.steps?.length ?? 0) - 1 ? 40 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>{i + 1}</div>
            {i < (section.steps?.length ?? 0) - 1 && <div style={{ width: 2, flex: 1, background: 'linear-gradient(to bottom, #6366f1, transparent)', marginTop: 8 }} />}
          </div>
          <div style={{ paddingBottom: 8 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>{step.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const CombinerGeoSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section combiner-geo" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: 40, background: 'linear-gradient(135deg, #6366f1, #3b82f6)', borderRadius: 32, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(99,102,241,0.3)' }}>
          <Globe2 size={100} style={{ opacity: 0.9 }} />
        </div>
      </div>
      <div style={{ flex: '1 1 400px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>{section.content}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['No Upload', 'Instant', 'Private'].map(t => (
            <div key={t} style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', display: 'flex', gap: 6, alignItems: 'center' }}>
              <CheckCircle size={14} /> {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const CombinerPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section combiner-privacy" style={{ padding: '80px 24px', margin: '60px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
      <div style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {[{ icon: <Lock size={28}/>, label: 'End-to-End Private', desc: 'Files never leave your device memory.' },
        { icon: <Zap size={28}/>, label: 'Zero Server Round-Trip', desc: 'Processing happens in-browser instantly.' },
        { icon: <CheckCircle size={28}/>, label: 'Compliance Ready', desc: 'Meets GDPR, HIPAA, and CCPA standards.' }
      ].map(({ icon, label, desc }) => (
        <div key={label} style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)' }}>
          <div style={{ color: '#6366f1', marginBottom: 16 }}>{icon}</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>{label}</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export const CombinerPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section combiner-performance" style={{ padding: '80px 24px', margin: '40px 0', textAlign: 'center' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 60, maxWidth: 600, margin: '0 auto 60px' }}>{section.content}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        {[{ n: '0ms', sub: 'Upload Time' }, { n: '100%', sub: 'Private' }, { n: '∞', sub: 'File Limit' }].map(({ n, sub }) => (
          <div key={sub} style={{ minWidth: 160 }}>
            <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, background: 'linear-gradient(135deg, #6366f1, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{n}</div>
            <div style={{ marginTop: 8, fontWeight: 600, color: 'var(--text-muted)', fontSize: '1rem' }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
