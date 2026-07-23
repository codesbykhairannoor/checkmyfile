// @ts-nocheck
import React from 'react';
import type { SectionProps } from '../types';
import { FileText, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const WordToPdfHeroSection: React.FC<SectionProps> = ({ section, flipLayout, badges, stats, buttonText }) => (
  <section className="seo-section word-hero" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--brand-gradient)', borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(225,29,72,0.1) 0%, transparent 70%) 0%, transparent 70%)' }} />
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px' }}>
        <div style={{ display: 'inline-flex', padding: '8px 18px', background: 'rgba(255,255,255,0.1)', borderRadius: 100, color: '#fff', fontWeight: 700, fontSize: '0.85rem', marginBottom: 24, gap: 8, alignItems: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <FileText size={16} /> Document Conversion
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, marginBottom: 24, color: '#fff', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 300px', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 120, height: 160, background: '#fff', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ height: 12, width: '40%', background: 'var(--brand-primary)', borderRadius: 4 }} />
          {(badges || [1,2,3,4]).map(i => <div key={i} style={{ height: 6, width: '100%', background: '#e5e7eb', borderRadius: 4 }} />)}
          <div style={{ height: 6, width: '60%', background: '#e5e7eb', borderRadius: 4 }} />
        </div>
        <ArrowRight size={32} color="#fff" style={{ opacity: 0.8 }} />
        <div style={{ width: 120, height: 160, background: '#f8fafc', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid var(--brand-primary)' }}>
           <div style={{ height: 16, width: 32, background: 'var(--brand-primary)', borderRadius: 4, marginBottom: 4 }} />
           {(badges || [1,2,3,4]).map(i => <div key={i} style={{ height: 6, width: '100%', background: '#cbd5e1', borderRadius: 4 }} />)}
           <div style={{ height: 6, width: '60%', background: '#cbd5e1', borderRadius: 4 }} />
        </div>
      </div>
    </div>
  </section>
);

export const WordToPdfHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section word-howto" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, textAlign: 'center', marginBottom: 60, color: 'var(--text-main)' }}>{section.title}</h2>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
      {section.steps?.map((step, i) => (
        <div key={i} style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -20, left: 32, width: 48, height: 48, borderRadius: 12, background: 'var(--brand-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, boxShadow: '0 10px 20px rgba(225, 29, 72, 0.3)' }}>
            0{i + 1}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 16, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const WordToPdfGeoSection: React.FC<SectionProps> = ({ section, flipLayout, badges, stats, buttonText }) => (
  <section className="seo-section word-geo" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-main)' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 400px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 350px', background: 'var(--brand-gradient)', padding: 40, borderRadius: 32, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--brand-primary)' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Local Processing</div>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--brand-primary)' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Zero Cloud Uploads</div>
         </div>
      </div>
    </div>
  </section>
);

export const WordToPdfPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section word-privacy" style={{ padding: '80px 24px', margin: '60px 0', background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', textAlign: 'center' }}>
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <ShieldCheck size={56} color="var(--brand-primary)" style={{ margin: '0 auto 24px' }} />
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ padding: '12px 24px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem' }}>Strictly Confidential</div>
        <div style={{ padding: '12px 24px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem' }}>WebAssembly Core</div>
      </div>
    </div>
  </section>
);

export const WordToPdfPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section word-performance" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <Zap size={48} color="var(--brand-primary)" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {(badges || [{ label: 'Conversion Speed', val: '< 2s', color: 'var(--brand-primary)' }, { label: 'Server Bottlenecks', val: 'None', color: 'var(--brand-primary)' }]).map(stat => (
           <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24, background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{stat.label}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: stat.color }}>{stat.val}</span>
           </div>
        ))}
      </div>
    </div>
  </section>
);
