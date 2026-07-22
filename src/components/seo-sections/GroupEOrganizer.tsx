/* Group E — Organizer: Cyan/Blue */
import React from 'react';
import type { SectionProps } from './types';
import { LayoutGrid, ScanLine, FileSearch, SortAsc } from 'lucide-react';

export const OrganizerHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section organizer-hero" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(6,182,212,0.1)', borderRadius: 100, color: '#06b6d4', fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <SortAsc size={16} /> Smart Organizer
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 360px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, justifyContent: 'center' }}>
        {[LayoutGrid, FileSearch, ScanLine, SortAsc, LayoutGrid, FileSearch].map((Icon, i) => (
          <div key={i} style={{ aspectRatio: '1', background: i % 2 === 0 ? 'rgba(6,182,212,0.08)' : 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={28} color={i % 2 === 0 ? '#06b6d4' : 'var(--text-muted)'} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const OrganizerHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section organizer-how-to" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: 60, color: 'var(--text-main)' }}>{section.title}</h2>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ padding: 28, background: 'var(--bg-main)', borderRadius: 20, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '5rem', fontWeight: 900, color: 'rgba(6,182,212,0.06)', lineHeight: 1, userSelect: 'none' }}>{i + 1}</div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4', marginBottom: 16 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>{step.title}</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const OrganizerGeoSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section organizer-geo" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 400px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          {['Jakarta', 'New York', 'London', 'Tokyo', 'Berlin', 'Sydney'].map(city => (
            <div key={city} style={{ padding: '6px 14px', background: 'rgba(6,182,212,0.1)', color: '#06b6d4', borderRadius: 100, fontSize: '0.85rem', fontWeight: 700 }}>{city}</div>
          ))}
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 300px', padding: 32, background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1))', borderRadius: 24, border: '1px solid rgba(6,182,212,0.2)', textAlign: 'center' }}>
        <LayoutGrid size={64} color="#06b6d4" style={{ marginBottom: 20 }} />
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>30+</div>
        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Languages Supported</div>
      </div>
    </div>
  </section>
);

export const OrganizerPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section organizer-privacy" style={{ padding: '80px 24px', margin: '60px 0', borderLeft: '6px solid #06b6d4', paddingLeft: 40, background: 'linear-gradient(to right, rgba(6,182,212,0.05), transparent)', borderRadius: '0 24px 24px 0' }}>
    <div style={{ maxWidth: 800 }}>
      <ScanLine size={48} color="#06b6d4" style={{ marginBottom: 20 }} />
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 20, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
    </div>
  </section>
);

export const OrganizerPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section organizer-performance" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 280px' }}>
        <SortAsc size={48} color="#06b6d4" style={{ marginBottom: 20 }} />
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {/* Horizontal progress bar metrics */}
      <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          { label: 'Processing Speed',      pct: 98, color: '#06b6d4', value: '< 1s' },
          { label: 'Privacy Score',         pct: 100, color: '#10b981', value: '100%' },
          { label: 'Data Transmitted',      pct: 0,   color: '#ef4444', value: '0 bytes', inverted: true },
          { label: 'Browser Compatibility', pct: 95,  color: '#6366f1', value: '95%' },
        ].map(({ label, pct, color, value, inverted }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{label}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: inverted ? '#10b981' : color }}>{value}</span>
            </div>
            <div style={{ height: 10, background: 'var(--bg-main)', borderRadius: 100, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{
                height: '100%',
                width: `${inverted ? 100 : pct}%`,
                background: inverted ? 'linear-gradient(90deg, #10b981, #059669)' : `linear-gradient(90deg, ${color}, ${color}88)`,
                borderRadius: 100,
                /* Visual trick: for inverted show a tiny sliver of red on the right */
                ...(inverted ? { background: '#10b981' } : {}),
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

