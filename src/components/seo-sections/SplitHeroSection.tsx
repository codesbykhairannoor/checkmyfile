import React from 'react';
import { Scissors } from 'lucide-react';
import type { SectionProps } from './types';

export const SplitHeroSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section split-hero" style={{ padding: '100px 24px', margin: '60px 0', background: 'radial-gradient(circle at center, rgba(168,85,247,0.1) 0%, transparent 70%)', borderRadius: 40 }}>
    <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: 'white', marginBottom: 32, boxShadow: '0 10px 30px rgba(168,85,247,0.4)' }}>
        <Scissors size={40} />
      </div>
      <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);
