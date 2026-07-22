/**
 * SECTION COMPONENT REGISTRY
 * ─────────────────────────────────────────────────────────
 * HOW TO ADD A NEW TOOL LAYOUT:
 *   1. Create (or reuse) a group file in src/components/seo-sections/
 *   2. Add entry here: 'my_tool_section_type': MyComponent
 *   3. Done. SeoRichSections.tsx needs ZERO changes.
 *
 * GROUP THEMES:
 *   A (combiner_*)  — Blue/Indigo   — merge, word-to-pdf, excel-to-pdf, etc.
 *   B (split_*)     — Purple/Pink   — split, extract-images, pdf-to-image, etc.
 *   C (security_*)  — Green/Teal    — protect, unlock, redact, sign, etc.
 *   D (transform_*) — Orange/Amber  — compress, rotate, resize, watermark, etc.
 *   E (organizer_*) — Cyan/Blue     — page-numbers, ocr, organize, scan, etc.
 * ─────────────────────────────────────────────────────────
 */
import React from 'react';
import type { SectionProps } from './types';

// ── Existing shared sections (merge/compress use these via prefix strip) ──
import { HeroFeaturesSection }    from './HeroFeaturesSection';
import { HowToStepsSection }      from './HowToStepsSection';
import { GeoTargetingSection }    from './GeoTargetingSection';
import { PrivacySecuritySection } from './PrivacySecuritySection';
import { PerformanceSection }     from './PerformanceSection';

// ── Group B — Extractor (Purple/Pink) ──
import { SplitHeroSection }        from './SplitHeroSection';
import { SplitHowToSection }       from './SplitHowToSection';
import { SplitGeoSection }         from './SplitGeoSection';
import { SplitPrivacySection }     from './SplitPrivacySection';
import { SplitPerformanceSection } from './SplitPerformanceSection';

// ── Group A — Combiner (Blue/Indigo) ──
import {
  CombinerHeroSection, CombinerHowToSection, CombinerGeoSection,
  CombinerPrivacySection, CombinerPerformanceSection,
} from './GroupACombiner';

// ── Group C — Security (Green/Teal) ──
import {
  SecurityHeroSection, SecurityHowToSection, SecurityGeoSection,
  SecurityPrivacySection, SecurityPerformanceSection,
} from './GroupCSecurity';

// ── Group D — Transformer (Orange/Amber) ──
import {
  TransformerHeroSection, TransformerHowToSection, TransformerGeoSection,
  TransformerPrivacySection, TransformerPerformanceSection,
} from './GroupDTransformer';

// ── Group E — Organizer (Cyan/Blue) ──
import {
  OrganizerHeroSection, OrganizerHowToSection, OrganizerGeoSection,
  OrganizerPrivacySection, OrganizerPerformanceSection,
} from './GroupEOrganizer';

type SectionComponent = React.FC<SectionProps>;

export const SECTION_REGISTRY: Record<string, SectionComponent> = {
  // ── Legacy shared (merge_ / comp_ prefixes are stripped before lookup) ──
  hero_features:    HeroFeaturesSection,
  how_to_steps:     HowToStepsSection,
  geo_targeting:    GeoTargetingSection,
  privacy_security: PrivacySecuritySection,
  performance:      PerformanceSection,

  // ── Group B — Extractor: split-pdf, extract-images, pdf-to-image, crop-pdf ──
  split_hero_features:    SplitHeroSection,
  split_how_to_steps:     SplitHowToSection,
  split_geo_targeting:    SplitGeoSection,
  split_privacy_security: SplitPrivacySection,
  split_performance:      SplitPerformanceSection,

  // ── Group A — Combiner: word-to-pdf, excel-to-pdf, image-to-pdf, txt-to-pdf ──
  combiner_hero_features:    CombinerHeroSection,
  combiner_how_to_steps:     CombinerHowToSection,
  combiner_geo_targeting:    CombinerGeoSection,
  combiner_privacy_security: CombinerPrivacySection,
  combiner_performance:      CombinerPerformanceSection,

  // ── Group C — Security: protect-pdf, unlock-pdf, redact-pdf, sign-pdf ──
  security_hero_features:    SecurityHeroSection,
  security_how_to_steps:     SecurityHowToSection,
  security_geo_targeting:    SecurityGeoSection,
  security_privacy_security: SecurityPrivacySection,
  security_performance:      SecurityPerformanceSection,

  // ── Group D — Transformer: rotate-pdf, resize-pdf, watermark-pdf, grayscale-pdf, reverse-pdf ──
  transform_hero_features:    TransformerHeroSection,
  transform_how_to_steps:     TransformerHowToSection,
  transform_geo_targeting:    TransformerGeoSection,
  transform_privacy_security: TransformerPrivacySection,
  transform_performance:      TransformerPerformanceSection,

  // ── Group E — Organizer: page-numbers, ocr-pdf, organize-pdf, scan-to-pdf, compare-pdf ──
  organizer_hero_features:    OrganizerHeroSection,
  organizer_how_to_steps:     OrganizerHowToSection,
  organizer_geo_targeting:    OrganizerGeoSection,
  organizer_privacy_security: OrganizerPrivacySection,
  organizer_performance:      OrganizerPerformanceSection,
};

/** Normalise older JSON prefixes (merge_ / comp_) → bare keys for shared layouts */
export const resolveType = (rawType: string): string =>
  rawType.replace(/^(merge_|comp_)/, '');
