import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import type { SectionProps } from './types';

export const PrivacySecuritySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section privacy-security" style={{ padding: '80px 24px', margin: '60px 0', background: 'linear-gradient(to right, rgba(16,185,129,0.05), transparent)', borderRadius: 32, borderLeft: '8px solid #10b981' }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 25px rgba(16,185,129,0.3)' }}>
        <Shield size={40} />
      </div>
      <div style={{ flex: 1, minWidth: 300 }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{section.content}</p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {['GDPR Compliant', 'HIPAA Ready', '100% Offline'].map(badge => (
            <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)', fontWeight: 600 }}>
              <CheckCircle size={20} color="#10b981" /> {badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
