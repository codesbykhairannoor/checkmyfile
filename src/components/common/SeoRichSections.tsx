/**
 * SeoRichSections — Orchestrator
 * ────────────────────────────────────────────────────────────
 * This file is intentionally thin. It handles:
 *   • Eager-loading SEO JSON from memory (zero network round-trips)
 *   • Deterministic seed-based layout/order randomisation
 *   • Delegating rendering to the Section Registry
 *   • FAQ section + Schema.org JSON-LD
 *
 * To add a new tool layout → see src/components/seo-sections/registry.ts
 * ────────────────────────────────────────────────────────────
 */
import React, { useState, useRef } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import '../seo-sections/seo-sections.css';
import { SECTION_REGISTRY, resolveType } from '../seo-sections/registry';
import type { SeoSectionData } from '../seo-sections/types';

// ── Types ──────────────────────────────────────────────────
interface SeoJson {
  title: string;
  h1: string;
  description: string;
  badges?: string[];
  stats?: string[];
  buttonText?: string;
  sections: SeoSectionData[];
  faqs: { q: string; a: string }[];
  faqTitle?: string;
  supportCenter?: string;
}

// ── Eager loader — all JSON bundled at build time ──────────
const seoModules = import.meta.glob(
  '../../locales/seo/**/*.json',
  { eager: true }
) as Record<string, any>;

export const useSeoData = (toolId: string, lang: string) => {
  const exactPath    = `../../locales/seo/${toolId}/${lang}.json`;
  const fallbackPath = `../../locales/seo/${toolId}/en.json`;
  const module       = seoModules[exactPath] ?? seoModules[fallbackPath];
  return { data: module ? (module.default ?? module) as SeoJson : null, loading: false };
};

// ── Helpers ────────────────────────────────────────────────
const AccordionFaqItem: React.FC<{ faq: { q: string, a: string }, isOpen: boolean, onToggle: () => void }> = ({ faq, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div 
      className="glass-panel" 
      style={{ 
        marginBottom: 16, 
        borderRadius: 24, 
        overflow: 'hidden',
        border: isOpen ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
        transition: 'all 0.3s ease',
        background: isOpen ? 'var(--bg-app)' : 'var(--bg-card)',
        boxShadow: isOpen ? '0 10px 30px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <button 
        onClick={onToggle}
        style={{ 
          width: '100%', 
          padding: '24px 32px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text-main)'
        }}
      >
        <span style={{ fontSize: '1.15rem', fontWeight: 700, paddingRight: 24, lineHeight: 1.4 }}>{faq.q}</span>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: 32, 
          height: 32, 
          borderRadius: '50%', 
          background: isOpen ? 'var(--brand-gradient)' : 'rgba(128,128,128,0.1)',
          color: isOpen ? '#fff' : 'var(--text-muted)',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0
        }}>
          <ChevronDown size={20} />
        </div>
      </button>
      <div 
        style={{ 
          height: isOpen ? (contentRef.current?.scrollHeight || 'auto') : 0, 
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
        }}
      >
        <div ref={contentRef} style={{ padding: '0 32px 32px 32px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
          {faq.a}
        </div>
      </div>
    </div>
  );
};

// ── Component ──────────────────────────────────────────────
interface SeoRichSectionsProps { data: SeoJson | null; }

export const SeoRichSections: React.FC<SeoRichSectionsProps> = ({ data }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!data) return null;
  const { sections, faqs } = data;

  // We no longer shuffle sections, ensuring deterministic order and alternating backgrounds!
  let ordered = [...sections];

  // Neutralize hallucinated geo-targeting claims for older un-translated JSONs
  ordered = ordered.map(s => {
    if (s.type.includes('geo_targeting')) {
      // If the JSON provides 'supportCenter', it means we have run the translation script
      // to properly clean up and translate the hallucinated geo strings. So we use the JSON directly!
      if (data.supportCenter) {
         return s;
      }
      return {
        ...s,
        title: "100% Secure Local Processing",
        content: "All operations are performed directly on your local device. We use advanced WebAssembly technology to process your documents without ever uploading them to external servers, ensuring complete privacy."
      };
    }
    return s;
  });

  return (
    <article className="seo-rich-sections-container" style={{ width: '100%', paddingTop: 60, display: 'flex', flexDirection: 'column' }}>

      {/* ── Dynamic Sections ── */}
      {ordered.map((section, index) => {
        const type     = resolveType(section.type);
        const Section  = SECTION_REGISTRY[type];
        if (!Section) return null;

        const flipLayout  = index % 2 !== 0;

        return <Section key={`${type}-${index}`} section={section} flipLayout={flipLayout} badges={data.badges} stats={data.stats} buttonText={data.buttonText} />;
      })}

      {/* ── FAQ + Schema.org JSON-LD ── */}
      {faqs?.length > 0 && (
        <section className="seo-section faqs" style={{ marginTop: 80, padding: '60px 24px', background: 'var(--bg-app)', borderRadius: 32, marginBottom: 80, border: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--brand-gradient)', color: '#fff', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
              <MessageCircleQuestion size={18} /> {data.supportCenter || 'Support Center'}
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: 16 }}>
              {data.faqTitle || 'Frequently Asked Questions'}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 880, margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <AccordionFaqItem 
                key={i} 
                faq={faq} 
                isOpen={activeFaq === i} 
                onToggle={() => setActiveFaq(activeFaq === i ? null : i)} 
              />
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
          })}} />
        </section>
      )}
    </article>
  );
};
