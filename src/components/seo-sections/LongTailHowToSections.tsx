import React from 'react';
import type { SectionProps } from './types';
import { Target, Sparkles, SlidersHorizontal } from 'lucide-react';

// 1. crop-pdf-margins (Timeline Layout)
export const LtCropMarginsHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, position: 'relative', zIndex: 1, alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 400px', position: 'sticky', top: 120 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Target size={14} /> {section.badgeText || 'Quick Guide'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.8 }}>Master this tool in three simple steps. Process your files instantly and securely without ever uploading them.</p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 40, position: 'relative' }}>
        <div className="hidden-mobile" style={{ position: 'absolute', top: 32, bottom: 32, left: 32, width: 2, background: 'repeating-linear-gradient(to bottom, var(--border-color) 0, var(--border-color) 10px, transparent 10px, transparent 20px)', zIndex: 0 }}></div>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 32, position: 'relative', zIndex: 1, alignItems: 'flex-start' }} className="hover-lift">
            <div style={{ width: 64, height: 64, borderRadius: 24, background: 'var(--bg-card)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)', flexShrink: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              {i + 1}
            </div>
            <div style={{ padding: 40, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 2. grayscale-pdf-for-printing (Grid layout with glassmorphism)
export const LtGrayscaleHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <SlidersHorizontal size={14} /> {section.badgeText || 'Quick Guide'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, width: '100%' }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ padding: 40, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }} className="hover-lift">
            <div style={{ width: 72, height: 72, borderRadius: 24, background: 'rgba(225, 29, 72, 0.05)', border: '1px solid rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900, color: 'var(--brand-primary)' }}>
              {i + 1}
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 3. remove-pdf-author-metadata (Horizontal connecting progress layout)
export const LtRemoveMetadataHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Sparkles size={14} /> {section.badgeText || 'Quick Guide'}
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 800, margin: '0 auto' }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ position: 'relative', padding: '32px 48px', background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 40, boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }} className="hover-lift">
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 10px 30px rgba(225, 29, 72, 0.2)' }}>
              {i + 1}
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 4. extract-high-res-images-pdf (Overlapping cards layout)
export const LtExtractImagesHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '40px 48px', background: 'var(--bg-app)', borderRadius: 32, border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }} className="hover-lift">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '2rem', fontWeight: 900, boxShadow: '0 10px 20px rgba(225, 29, 72, 0.3)', zIndex: 1 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, zIndex: 1 }}>
               <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
               <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
            </div>
            <div style={{ position: 'absolute', right: -40, top: -40, fontSize: '200px', fontWeight: 900, color: 'var(--text-main)', opacity: 0.03, zIndex: 0, pointerEvents: 'none' }}>
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 5. compare-pdf-files-visually (Side-by-side balanced layout)
export const LtComparePdfHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
        {section.steps?.map((step: any, i: number) => (
          <div key={i} style={{ position: 'relative', padding: 48, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }} className="hover-lift">
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, boxShadow: '0 10px 20px rgba(225, 29, 72, 0.3)' }}>
              {i + 1}
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
