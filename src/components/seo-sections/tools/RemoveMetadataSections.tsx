/**
 * remove-pdf-metadata — "Cleanse" Sections
 * Theme: Slate + Cyan, data cleansing/scrubbing aesthetic
 * Every section is UNIQUE to this tool only.
 */
import React from 'react';
import type { SectionProps } from '../types';
import { Tag, Eraser } from 'lucide-react';

const METADATA_TYPES = ['Author', 'Company', 'Creator Software', 'Last Modified By', 'GPS Location', 'Revision History', 'Custom Properties'];

export const MetadataHeroSection: React.FC<SectionProps> = ({ section, flipLayout }) => (
  <section className="seo-section metadata-hero" style={{ padding: '80px 24px', margin: '40px 0', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <div style={{ display: 'inline-flex', padding: '8px 18px', background: 'rgba(6,182,212,0.1)', borderRadius: 100, color: '#06b6d4', fontWeight: 700, fontSize: '0.85rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <Eraser size={14} /> Deep Metadata Scrubber
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 20, color: 'var(--text-main)', lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {/* Metadata tag strip animation visual */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' }}>
        {METADATA_TYPES.map((tag, i) => (
          <div key={tag} style={{
            padding: '6px 12px',
            background: i < 4 ? 'rgba(6,182,212,0.08)' : 'rgba(239,68,68,0.07)',
            border: `1px solid ${i < 4 ? 'rgba(6,182,212,0.25)' : 'rgba(239,68,68,0.2)'}`,
            borderRadius: 100,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: i < 4 ? '#0891b2' : '#dc2626',
            display: 'flex', alignItems: 'center', gap: 6,
            textDecoration: i >= 4 ? 'line-through' : 'none',
            opacity: i >= 4 ? 0.6 : 1,
          }}>
            <Tag size={10} /> {tag}
          </div>
        ))}
        <div style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, fontSize: '0.8rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 6 }}>
          ✓ All Stripped
        </div>
      </div>
    </div>
  </section>
);

export const MetadataHowToSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section metadata-howto" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)', textAlign: 'center' }}>{section.title}</h2>
    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 60, maxWidth: 600, margin: '0 auto 60px' }}>Before and after — see exactly what hidden metadata gets removed.</p>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
      {/* Before card */}
      <div style={{ padding: 28, background: 'rgba(239,68,68,0.04)', border: '2px solid rgba(239,68,68,0.15)', borderRadius: 24 }}>
        <div style={{ fontWeight: 800, color: '#dc2626', marginBottom: 20, fontSize: '0.9rem', letterSpacing: '0.06em' }}>❌ BEFORE — Metadata Exposed</div>
        {['Author: John Smith', 'Company: Acme Corp', 'Last Edit: 2024-11-12', 'GPS: 40.7128° N, 74.0060°'].map(item => (
          <div key={item} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8, display: 'flex', gap: 6 }}>
            <span style={{ color: '#ef4444' }}>⚠</span> {item}
          </div>
        ))}
      </div>
      {/* How to steps */}
      {section.steps?.map((step, i) => (
        <div key={i} style={{ padding: 28, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#06b6d4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: 16 }}>{i + 1}</div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>{step.title}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
        </div>
      ))}
      {/* After card */}
      <div style={{ padding: 28, background: 'rgba(6,182,212,0.05)', border: '2px solid rgba(6,182,212,0.2)', borderRadius: 24 }}>
        <div style={{ fontWeight: 800, color: '#0891b2', marginBottom: 20, fontSize: '0.9rem', letterSpacing: '0.06em' }}>✅ AFTER — Completely Clean</div>
        {['Author: (removed)', 'Company: (removed)', 'Last Edit: (removed)', 'GPS: (removed)'].map(item => (
          <div key={item} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8, display: 'flex', gap: 6 }}>
            <span style={{ color: '#06b6d4' }}>✓</span> {item}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const MetadataGeoSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section metadata-geo" style={{ padding: '80px 24px', margin: '40px 0', borderLeft: '6px solid #06b6d4', paddingLeft: 40, background: 'linear-gradient(to right, rgba(6,182,212,0.05), transparent)', borderRadius: '0 24px 24px 0' }}>
    <div style={{ maxWidth: 800 }}>
      <Eraser size={48} color="#06b6d4" style={{ marginBottom: 20 }} />
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
    </div>
  </section>
);

export const MetadataPrivacySection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section metadata-privacy" style={{ padding: '80px 24px', margin: '60px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['No metadata ever leaves your device', 'XMP, EXIF, and IPTC all stripped', 'Author & company names erased', 'GPS coordinates permanently removed', 'Editing history fully deleted'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4', flexShrink: 0 }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const MetadataPerformanceSection: React.FC<SectionProps> = ({ section }) => (
  <section className="seo-section metadata-performance" style={{ padding: '80px 24px', margin: '40px 0' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      <div style={{ flex: '1 1 360px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
      </div>
      {/* File size comparison */}
      <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: -4 }}>TYPICAL RESULTS:</div>
        {[
          { label: 'Before stripping', val: '2.4 MB', w: 85, color: '#64748b' },
          { label: 'After stripping', val: '2.1 MB', w: 70, color: '#06b6d4' },
        ].map(({ label, val, w, color }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{label}</span>
              <span style={{ color, fontWeight: 800 }}>{val}</span>
            </div>
            <div style={{ height: 10, background: 'var(--bg-card)', borderRadius: 100, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 100 }} />
            </div>
          </div>
        ))}
        <div style={{ padding: '12px 16px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, fontSize: '0.9rem', color: '#0891b2', fontWeight: 700, textAlign: 'center' }}>
          ~15% smaller, fully anonymous
        </div>
      </div>
    </div>
  </section>
);
