import React from 'react';
import type { SectionProps } from './types';

export const HowToStepsSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section how-to-steps" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: 60, color: 'var(--text-main)' }}>{section.title}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ textAlign: 'left', position: 'relative', paddingLeft: 40 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--text-main)', color: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>
            {i + 1}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);
