import React from 'react';
import { Monitor, ArrowRight } from 'lucide-react';
import type { SectionProps } from './types';

export const SplitPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section split-performance" style={{ padding: '60px 0', margin: '40px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ flex: '1 1 400px' }}>
        <Monitor size={48} color="#ec4899" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[{ label: 'Browser Speed', color: '#ec4899' }, { label: 'WASM Compilation', color: '#a855f7' }].map(({ label, color }) => (
          <div key={label} style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{label}</span>
            <ArrowRight size={24} color={color} />
          </div>
        ))}
      </div>
    </div>
  </section>
);
