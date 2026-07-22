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
  <section className="seo-section organizer-performance" style={{ padding: '80px 24px', margin: '40px 0', textAlign: 'center' }}>
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 56 }}>{section.content}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {[{ n: '1s', sub: 'Avg. Process Time' }, { n: '0', sub: 'Data Sent to Server' }, { n: '100%', sub: 'Browser-Native' }].map(({ n, sub }) => (
          <div key={sub}>
            <div style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#06b6d4', lineHeight: 1 }}>{n}</div>
            <div style={{ marginTop: 8, color: 'var(--text-muted)', fontWeight: 600 }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
