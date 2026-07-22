/* Group D — Transformer: Orange/Amber */
import React from 'react';
import type { SectionProps } from './types';
import { Wand2, ArrowLeftRight, Gauge, Cpu } from 'lucide-react';

export const TransformerHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section transformer-hero" style={{ padding: '80px 24px', margin: '40px 0', background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, transparent 60%)', borderRadius: 32, border: '1px solid rgba(245,158,11,0.15)' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(245,158,11,0.1)', borderRadius: 100, color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <Wand2 size={16} /> Instant Transform
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 360px', display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 140, height: 180, background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8, padding: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          {[80, 60, 100, 40].map((w, i) => <div key={i} style={{ height: 8, background: 'rgba(245,158,11,0.2)', borderRadius: 4, width: `${w}%` }} />)}
        </div>
        <ArrowLeftRight size={32} color="#f59e0b" />
        <div style={{ width: 140, height: 180, background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(234,88,12,0.1))', borderRadius: 20, border: '2px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: 8, padding: 16, boxShadow: '0 10px 30px rgba(245,158,11,0.2)' }}>
          {[80, 60, 100, 40].map((w, i) => <div key={i} style={{ height: 8, background: 'rgba(245,158,11,0.5)', borderRadius: 4, width: `${w}%` }} />)}
        </div>
      </div>
    </div>
  </section>
);

export const TransformerHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section transformer-how-to" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: 60, color: 'var(--text-main)' }}>{section.title}</h2>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
      {section.steps?.map((step, i) => (
        <React.Fragment key={i}>
          <div style={{ flex: '1 1 200px', textAlign: 'center', padding: '0 16px' }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(245,158,11,0.1)', border: '2px solid #f59e0b', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontWeight: 900, fontSize: '1.5rem' }}>{i + 1}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>{step.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
          </div>
          {i < (section.steps?.length ?? 0) - 1 && (
            <div style={{ alignSelf: 'flex-start', paddingTop: 20, color: 'rgba(245,158,11,0.4)', fontSize: '1.5rem', flexShrink: 0 }}>→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  </section>
);

export const TransformerGeoSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section transformer-geo" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 400px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[{ pct: 0, label: 'Upload to Cloud' }, { pct: 100, label: 'Local Processing' }].map(({ pct, label }) => (
          <div key={label} style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{label}</span>
              <span style={{ fontWeight: 800, color: pct ? '#f59e0b' : 'var(--text-muted)' }}>{pct}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg-main)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct ? '#f59e0b' : 'var(--border-color)', borderRadius: 100, transition: 'width 1s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const TransformerPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section transformer-privacy" style={{ padding: '80px 24px', margin: '60px 0', background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(234,88,12,0.05))', borderRadius: 32, border: '2px solid rgba(245,158,11,0.2)' }}>
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Cpu size={56} color="#f59e0b" style={{ marginBottom: 24 }} />
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 20, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>{section.content}</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {['WASM Runtime', 'Memory-Safe', 'Zero Traces'].map(b => (
          <div key={b} style={{ padding: '10px 20px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', border: '1px solid rgba(245,158,11,0.3)' }}>{b}</div>
        ))}
      </div>
    </div>
  </section>
);

export const TransformerPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section transformer-performance" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <Gauge size={48} color="#f59e0b" style={{ marginBottom: 20 }} />
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 20, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[{ v: '90%', l: 'Size Reduction', c: '#f59e0b' }, { v: '<1s', l: 'Processing', c: '#ea580c' }, { v: '0', l: 'Server Calls', c: '#10b981' }, { v: '∞', l: 'File Limit', c: '#6366f1' }].map(({ v, l, c }) => (
          <div key={l} style={{ padding: 20, background: 'var(--bg-main)', borderRadius: 16, border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: c, marginBottom: 4 }}>{v}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
