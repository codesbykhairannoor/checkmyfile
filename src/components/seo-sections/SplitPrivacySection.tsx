import React from 'react';
import { Lock } from 'lucide-react';
import type { SectionProps } from './types';

export const SplitPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section split-privacy" style={{ padding: '80px 24px', margin: '60px 0', background: '#111827', borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'rgba(59,130,246,0.2)', filter: 'blur(100px)', borderRadius: '50%' }} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <Lock size={64} color="#60a5fa" style={{ marginBottom: 32 }} />
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'white' }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: '#9ca3af', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['No External API Calls', 'Memory-Only Execution'].map(b => (
          <div key={b} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: 100, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, color: 'white' }}>{b}</div>
        ))}
      </div>
    </div>
  </section>
);
