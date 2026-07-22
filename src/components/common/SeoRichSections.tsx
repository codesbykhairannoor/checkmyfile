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
import React from 'react';
import '../seo-sections/seo-sections.css';
import { SECTION_REGISTRY, resolveType } from '../seo-sections/registry';
import type { SeoSectionData } from '../seo-sections/types';

// ── Types ──────────────────────────────────────────────────
interface SeoJson {
  title: string;
  h1: string;
  description: string;
  sections: SeoSectionData[];
  faqs: { q: string; a: string }[];
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
const getHash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

// ── Component ──────────────────────────────────────────────
interface SeoRichSectionsProps { data: SeoJson | null; }

export const SeoRichSections: React.FC<SeoRichSectionsProps> = ({ data }) => {
  if (!data) return null;
  const { sections, faqs, title, description } = data;

  const seed = getHash((title ?? '') + (description ?? ''));

  // Deterministic section-order shuffle
  const ordered = [...sections];
  const swap = (a: number, b: number) => { [ordered[a], ordered[b]] = [ordered[b], ordered[a]]; };
  if ((seed % 10) > 4 && ordered.length > 3) swap(2, 3);
  if ((seed % 7)  > 3 && ordered.length > 4) swap(3, 4);

  return (
    <article className="seo-rich-sections-container" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', paddingTop: 60 }}>

      {/* ── Dynamic Sections ── */}
      {ordered.map((section, index) => {
        const type     = resolveType(section.type);
        const Section  = SECTION_REGISTRY[type];
        if (!Section) return null;

        const sectionHash = getHash(section.type);
        const flipLayout  = (seed + sectionHash + index) % 2 !== 0;

        return <Section key={`${type}-${index}`} section={section} flipLayout={flipLayout} />;
      })}

      {/* ── FAQ + Schema.org JSON-LD ── */}
      {faqs?.length > 0 && (
        <section className="seo-section faqs" style={{ marginTop: 80, padding: '40px 0', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: 40, color: 'var(--text-main)' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel" style={{ padding: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{faq.q}</h3>
                <p  style={{ fontSize: '1rem',   color: 'var(--text-muted)', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
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
