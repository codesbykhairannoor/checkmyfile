import React from 'react';
import { Layers, Scissors, FileDown } from 'lucide-react';
import type { SectionProps } from './types';

const STEP_ICONS = [<Layers size={32} />, <Scissors size={32} />, <FileDown size={32} />];

export const SplitHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section split-how-to" style={{ padding: '60px 24px', margin: '40px 0' }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'left', marginBottom: 40, color: 'var(--text-main)', paddingBottom: 16, borderBottom: '2px solid var(--border-color)' }}>{section.title}</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 800 }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(168,85,247,0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {STEP_ICONS[i] ?? <Layers size={32} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
