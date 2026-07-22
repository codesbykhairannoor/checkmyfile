import React from 'react';
import { Zap, Clock } from 'lucide-react';
import type { SectionProps } from './types';

const STATS = [
  { value: '90%', label: 'Faster Processing', color: '#f59e0b' },
  { value: '0ms', label: 'Upload Latency', color: '#10b981', isSmall: true },
];

export const PerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section performance" style={{ padding: '80px 24px', margin: '40px 0', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)' }}>
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'inline-flex', padding: 16, background: 'rgba(245,158,11,0.1)', borderRadius: '50%', marginBottom: 24 }}>
        <Zap size={48} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.4))' }} />
      </div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
        {STATS.map(({ value, label, color, isSmall }) => (
          <div key={label} style={{ padding: 24, background: 'var(--bg-main)', borderRadius: 20, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color, marginBottom: 8 }}>
              {isSmall ? <>{value[0]}<span style={{ fontSize: '1.5rem' }}>{value.slice(1)}</span></> : value}
            </div>
            <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
        <div style={{ padding: 24, background: 'var(--bg-main)', borderRadius: 20, border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3b82f6', marginBottom: 8 }}><Clock size={40} style={{ margin: '0 auto' }} /></div>
          <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>No Queue Times</div>
        </div>
      </div>
    </div>
  </section>
);
