import React from 'react';
import { Globe, MapPin, ServerOff, Zap } from 'lucide-react';
import type { SectionProps } from './types';

export const GeoTargetingSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section geo-targeting" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap-reverse', alignItems: 'center', gap: 48 }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxWidth: 400, background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(59,130,246,0.05))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.1)' }}>
          <Globe size={160} color="rgba(16,185,129,0.2)" />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#10b981', color: 'white', padding: '16px 24px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(16,185,129,0.3)', fontWeight: 800, fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
            <MapPin size={24} /> Local Processing
          </div>
          <div style={{ position: 'absolute', top: '20%', right: '15%', width: 12, height: 12, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 20px #3b82f6' }} />
          <div style={{ position: 'absolute', bottom: '25%', left: '15%', width: 16, height: 16, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 20px #10b981' }} />
        </div>
      </div>
      <div style={{ flex: '1 1 400px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 100, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><ServerOff size={16} /> Zero Server Ping</div>
          <div style={{ padding: '8px 16px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: 100, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={16} /> Instant Access</div>
        </div>
      </div>
    </div>
  </section>
);
