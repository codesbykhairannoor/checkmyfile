/**
 * redact-pdf — "Classified" Sections
 * Theme: Noir Black + Red, classified document aesthetic
 * Every section is UNIQUE to this tool only.
 */
import React from 'react';
import type { SectionProps } from '../types';
import { EyeOff } from 'lucide-react';

export const RedactHeroSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section redact-hero" style={{ padding: '80px 24px', margin: '40px 0', background: '#09090b', borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(239,68,68,0.04) 40px)', backgroundSize: '100% 40px' }} />
    <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 4, color: '#f87171', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.12em', marginBottom: 28 }}>
        ███ CLASSIFIED — HANDLE WITH CARE ███
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 360px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: '#fff', lineHeight: 1.15 }}>{section.title}</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{section.content}</p>
        </div>
        {/* Redacted document mockup */}
        <div style={{ flex: '1 1 280px', padding: 24, background: '#fff', borderRadius: 12, color: '#000', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          <div style={{ marginBottom: 8, color: '#555', fontSize: '0.75rem' }}>DOCUMENT — BEFORE REDACTION:</div>
          {['John Smith — SSN: ████████', 'Account: ██████████', 'Address: ██████████████', 'Salary: $███,███/year', 'Medical: ████████████'].map((line, i) => (
            <div key={i} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: i < 2 ? '#ef4444' : '#22c55e', fontSize: '0.7rem' }}>{i < 2 ? '✗' : '✓'}</span>
              <span style={{ color: i < 2 ? '#ef4444' : '#166534' }}>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const RedactHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section redact-howto" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 60, color: 'var(--text-main)', textAlign: 'center' }}>{section.title}</h2>
    <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#09090b', border: '2px dashed #ef4444', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', fontFamily: 'monospace' }}>{i + 1}</div>
            {i < (section.steps?.length ?? 0) - 1 && <div style={{ width: 2, height: 40, background: 'rgba(239,68,68,0.2)', marginTop: 4, borderLeft: '2px dashed rgba(239,68,68,0.3)' }} />}
          </div>
          <div style={{ paddingTop: 8 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>{step.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const RedactGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section redact-geo" style={{ padding: '60px 24px', margin: '40px 0', background: '#09090b', borderRadius: 24 }}>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
      <div style={{ flex: '1 1 400px' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', background: '#ef4444', color: 'white', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: 20, borderRadius: 4 }}>LOCAL PROCESSING ONLY</div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 16, color: '#fff', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 240px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#22c55e', background: '#000', padding: 24, borderRadius: 16, border: '1px solid rgba(34,197,94,0.2)' }}>
        {['$ init_redaction_engine', '> loading WASM runtime...', '> network_requests: NONE', '> server_contact: BLOCKED', '> processing: LOCAL ONLY', '> status: ██████████ OK'].map((l, i) => (
          <div key={i} style={{ marginBottom: 6, opacity: i === 5 ? 1 : 0.7 }}>{l}</div>
        ))}
      </div>
    </div>
  </section>
);

export const RedactPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section redact-privacy" style={{ padding: '80px 24px', margin: '60px 0' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <EyeOff size={52} color="#ef4444" style={{ marginBottom: 20 }} />
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 320px', padding: 32, background: 'rgba(239,68,68,0.04)', border: '2px solid rgba(239,68,68,0.15)', borderRadius: 24 }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ef4444', marginBottom: 20, letterSpacing: '0.08em' }}>WHAT GETS PERMANENTLY REMOVED:</div>
        {['Text content under redaction boxes', 'Image data in redacted regions', 'Hidden text layers', 'Metadata from redacted areas', 'Embedded object references'].map(item => (
          <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }}>▬</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const RedactPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section redact-performance" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)' }}>
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 560 }}>{section.content}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {[
          { emoji: '🗑️', title: 'Paper Shredder', items: ['Physical destruction', 'Cannot be undone', 'Not searchable after', 'Inconvenient to share'], bad: true },
          { emoji: '⬛', title: 'Digital Redaction (Our Tool)', items: ['Permanent data removal', 'PDF remains shareable', 'Instant & reversible before save', '100% offline & private'], bad: false },
        ].map(({ emoji, title, items, bad }) => (
          <div key={title} style={{ padding: 28, background: bad ? 'var(--bg-main)' : 'rgba(239,68,68,0.05)', borderRadius: 20, border: `2px solid ${bad ? 'var(--border-color)' : 'rgba(239,68,68,0.25)'}` }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{emoji}</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: bad ? 'var(--text-muted)' : 'var(--text-main)', marginBottom: 16 }}>{title}</div>
            {items.map(item => <div key={item} style={{ fontSize: '0.85rem', color: bad ? 'var(--text-muted)' : 'var(--text-main)', marginBottom: 8, display: 'flex', gap: 6 }}><span style={{ color: bad ? '#6b7280' : '#ef4444' }}>{bad ? '–' : '✓'}</span>{item}</div>)}
          </div>
        ))}
      </div>
    </div>
  </section>
);
