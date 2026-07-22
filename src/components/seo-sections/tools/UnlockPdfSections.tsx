/**
 * unlock-pdf — "Key" Sections
 * Theme: Warm Amber + Orange, unlock/open aesthetic
 * Every section is UNIQUE to this tool only.
 */
import React from 'react';
import type { SectionProps } from '../types';
import { KeyRound, Unlock } from 'lucide-react';

export const UnlockHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section unlock-hero" style={{ padding: '80px 24px', margin: '40px 0', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <div style={{ display: 'inline-flex', padding: '8px 18px', background: 'rgba(245,158,11,0.1)', borderRadius: 100, color: '#d97706', fontWeight: 700, fontSize: '0.85rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <KeyRound size={14} /> Browser-Local Decryption
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {/* Before / After card pair */}
      <div style={{ flex: '1 1 300px', display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ padding: 24, background: 'rgba(239,68,68,0.06)', border: '2px solid rgba(239,68,68,0.25)', borderRadius: 20, textAlign: 'center', minWidth: 130 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>LOCKED</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Password Protected</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: 2 }} />
          <KeyRound size={20} color="#f59e0b" />
          <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg, #d97706, #f59e0b)', borderRadius: 2 }} />
        </div>
        <div style={{ padding: 24, background: 'rgba(245,158,11,0.08)', border: '2px solid rgba(245,158,11,0.4)', borderRadius: 20, textAlign: 'center', minWidth: 130, boxShadow: '0 8px 24px rgba(245,158,11,0.15)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📄</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>UNLOCKED</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Freely Editable</div>
        </div>
      </div>
    </div>
  </section>
);

export const UnlockHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section unlock-howto" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 60, color: 'var(--text-main)', textAlign: 'center' }}>{section.title}</h2>
    {/* Horizontal flowing steps */}
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
      {section.steps?.map((step, i) => (
        <React.Fragment key={i}>
          <div style={{ textAlign: 'center', padding: '0 20px 32px', flex: '1 1 180px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(245,158,11,0.3)', color: 'white', fontWeight: 900, fontSize: '1.4rem' }}>
              {i === 0 ? '📎' : i === 1 ? '🔑' : '💾'}
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>{step.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
          </div>
          {i < (section.steps?.length ?? 0) - 1 && (
            <div style={{ color: 'rgba(245,158,11,0.5)', fontSize: '1.5rem', marginBottom: 32, flexShrink: 0 }}>›</div>
          )}
        </React.Fragment>
      ))}
    </div>
  </section>
);

export const UnlockGeoSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section unlock-geo" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {/* Glassmorphism card */}
      <div style={{ flex: '1 1 280px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: 40, borderRadius: 28, background: 'rgba(245,158,11,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 20px 60px rgba(245,158,11,0.1)', textAlign: 'center', minWidth: 240 }}>
          <Unlock size={56} color="#f59e0b" style={{ marginBottom: 20 }} />
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>100% Local</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password never transmitted</div>
        </div>
      </div>
    </div>
  </section>
);

export const UnlockPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section unlock-privacy" style={{ padding: '80px 24px', margin: '60px 0', borderTop: '4px solid #f59e0b', background: 'linear-gradient(to bottom, rgba(245,158,11,0.04), transparent)', borderRadius: '0 0 32px 32px' }}>
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
      <div style={{ flex: '1 1 280px' }}>
        <KeyRound size={48} color="#f59e0b" style={{ marginBottom: 20 }} />
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['Password typed locally only', 'Decryption in browser memory', 'Original file unchanged', 'No server ever sees your key'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <span style={{ color: '#f59e0b', fontSize: '1rem' }}>→</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const UnlockPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section unlock-performance" style={{ padding: '80px 24px', margin: '40px 0', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 32 }}>
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ fontSize: '5rem', marginBottom: 8, lineHeight: 1 }}>⚡</div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      {/* Stopwatch visual */}
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '32px 48px', background: 'var(--bg-main)', borderRadius: 24, border: '2px solid rgba(245,158,11,0.3)', gap: 8 }}>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>{'< 1'}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>seconds to unlock</div>
        <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(245,158,11,0.08)', padding: '6px 14px', borderRadius: 100 }}>No upload. No queue. Just instant.</div>
      </div>
    </div>
  </section>
);
