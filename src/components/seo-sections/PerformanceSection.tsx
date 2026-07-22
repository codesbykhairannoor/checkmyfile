import React from 'react';
import { Zap } from 'lucide-react';
import type { SectionProps } from './types';

/* Shared Performance section (merge-pdf / compress-pdf).
   Design: "Feature highlight strip" — icon + label pairs in a dark horizontal band */
export const PerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section performance" style={{ padding: '72px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Top text */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 48, flexWrap: 'wrap' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 20px rgba(245,158,11,0.35)' }}>
          <Zap size={28} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 680 }}>{section.content}</p>
        </div>
      </div>
      {/* Feature strip */}
      <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        {[
          { icon: '⚡', label: 'Instant Processing',        sub: 'Files processed in under 1 second using WebAssembly',   bg: 'var(--bg-card)' },
          { icon: '📡', label: 'Zero Network Round-Trip',   sub: 'No upload means no bandwidth waste and no server lag',   bg: 'var(--bg-main)' },
          { icon: '🔒', label: '100% Browser-Isolated',     sub: 'Files stay in your device RAM. Never cached, never logged', bg: 'var(--bg-card)' },
          { icon: '♾️',  label: 'No File Size Limits',       sub: 'Only your device memory limits what you can process',    bg: 'var(--bg-main)' },
        ].map(({ icon, label, sub, bg }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 28px', background: bg, borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
