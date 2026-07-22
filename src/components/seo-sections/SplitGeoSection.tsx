import React from 'react';
import { MapPin } from 'lucide-react';
import type { SectionProps } from './types';

export const SplitGeoSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section split-geo" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', alignItems: 'stretch', gap: 0, borderRadius: 32, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div style={{ flex: '1 1 50%', padding: '60px 40px', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 100, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 24, alignSelf: 'flex-start' }}>Local Processing Node</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 50%', minHeight: 300, background: 'linear-gradient(45deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <MapPin size={80} color="white" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
      </div>
    </div>
  </section>
);
