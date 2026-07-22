/* Group C — Security: Green/Teal */
import React from 'react';
import type { SectionProps } from './types';
import { ShieldCheck, Terminal, Activity, Wifi, Eye } from 'lucide-react';

export const SecurityHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section security-hero" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(16,185,129,0.1)', borderRadius: 100, color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <ShieldCheck size={16} /> Bank-Grade Security
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 360px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 280, height: 280 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(16,185,129,0.2)' }} />
          <div style={{ position: 'absolute', inset: 30, borderRadius: '50%', border: '2px dashed rgba(16,185,129,0.3)' }} />
          <div style={{ position: 'absolute', inset: 60, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(16,185,129,0.2)' }}>
            <ShieldCheck size={80} color="#10b981" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const SecurityHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section security-how-to" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: 60, color: 'var(--text-main)' }}>{section.title}</h2>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ flex: '1 1 200px', textAlign: 'center', padding: '0 24px 40px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.2rem', fontWeight: 900 }}>{i + 1}</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-main)' }}>{step.title}</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const SecurityGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section security-geo" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
      <div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[{ icon: <Wifi size={20}/>, label: 'Offline Processing', color: '#10b981' },
          { icon: <Eye size={20}/>, label: 'Zero Visibility to Server', color: '#3b82f6' },
          { icon: <Activity size={20}/>, label: 'Real-time Local Execution', color: '#a855f7' }
        ].map(({ icon, label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
            <div style={{ color, flexShrink: 0 }}>{icon}</div>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const SecurityPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section security-privacy" style={{ padding: '60px 24px', margin: '60px 0', borderRadius: 24, background: '#0d1117', fontFamily: 'monospace', border: '1px solid rgba(16,185,129,0.3)' }}>
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Terminal size={20} color="#10b981" />
        <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>SECURITY LOG</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
        </div>
      </div>
      <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 16, color: '#fff' }}>{section.title}</h2>
      <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.8, marginBottom: 32 }}>{section.content}</p>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['> file_upload: BLOCKED', '> server_request: NONE', '> local_processing: ACTIVE', '> data_leak_risk: 0%'].map(line => (
          <div key={line} style={{ color: '#10b981', fontSize: '0.9rem' }}>{line}</div>
        ))}
      </div>
    </div>
  </section>
);

export const SecurityPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section security-performance" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 48 }}>{section.content}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        {[{ label: 'Cloud Tool', cols: ['Requires Upload', 'Server Queue', 'Privacy Risk', '30-60s Avg'] },
          { label: 'Our Tool', cols: ['Zero Upload', 'No Queue', 'Zero Risk', '<1s Avg'], highlight: true }
        ].map(({ label, cols, highlight }) => (
          <div key={label} style={{ padding: 24, background: highlight ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))' : 'var(--bg-main)', borderRadius: 20, border: `2px solid ${highlight ? '#10b981' : 'var(--border-color)'}` }}>
            <div style={{ fontWeight: 800, marginBottom: 16, color: highlight ? '#10b981' : 'var(--text-muted)' }}>{label}</div>
            {cols.map(c => <div key={c} style={{ fontSize: '0.9rem', color: highlight ? 'var(--text-main)' : 'var(--text-muted)', marginBottom: 8 }}>{c}</div>)}
          </div>
        ))}
      </div>
    </div>
  </section>
);
