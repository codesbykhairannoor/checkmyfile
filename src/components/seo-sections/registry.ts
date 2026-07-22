/**
 * SECTION COMPONENT REGISTRY
 * ─────────────────────────────────────────────────────────
 * ARCHITECTURE: Per-tool unique sections (NO shared group templates)
 *
 * Each tool has its own unique prefix + 5 section components:
 *   hero_features | how_to_steps | geo_targeting | privacy_security | performance
 *
 * To add a new tool:
 *   1. Create src/components/seo-sections/tools/MyToolSections.tsx
 *   2. Add 5 entries here with your_tool_* prefix
 *   3. Use your_tool_* in the JSON section type field
 *   4. Done — SeoRichSections.tsx needs ZERO changes.
 *
 * SHARED (legacy merge/compress only — strip prefix before lookup):
 *   hero_features | how_to_steps | geo_targeting | privacy_security | performance
 *
 * PER-TOOL (each totally unique):
 *   protect_*   unlock_*   redact_*   sign_*   metadata_*
 *   split_*     combiner_* transform_* organizer_*
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

// ── Security — PER-TOOL unique (each totally different design) ──
import { ProtectHeroSection, ProtectHowToSection, ProtectGeoSection, ProtectPrivacySection, ProtectPerformanceSection } from './tools/ProtectPdfSections';
import { UnlockHeroSection, UnlockHowToSection, UnlockGeoSection, UnlockPrivacySection, UnlockPerformanceSection } from './tools/UnlockPdfSections';
import { RedactHeroSection, RedactHowToSection, RedactGeoSection, RedactPrivacySection, RedactPerformanceSection } from './tools/RedactPdfSections';
import { SignHeroSection, SignHowToSection, SignGeoSection, SignPrivacySection, SignPerformanceSection } from './tools/SignPdfSections';
import { MetadataHeroSection, MetadataHowToSection, MetadataGeoSection, MetadataPrivacySection, MetadataPerformanceSection } from './tools/RemoveMetadataSections';

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

  // ── Security — protect-pdf (Dark Green + Gold, Vault) ──
  protect_hero_features:    ProtectHeroSection,
  protect_how_to_steps:     ProtectHowToSection,
  protect_geo_targeting:    ProtectGeoSection,
  protect_privacy_security: ProtectPrivacySection,
  protect_performance:      ProtectPerformanceSection,

  // ── Security — unlock-pdf (Amber, Key/Open) ──
  unlock_hero_features:    UnlockHeroSection,
  unlock_how_to_steps:     UnlockHowToSection,
  unlock_geo_targeting:    UnlockGeoSection,
  unlock_privacy_security: UnlockPrivacySection,
  unlock_performance:      UnlockPerformanceSection,

  // ── Security — redact-pdf (Noir Black + Red, Classified) ──
  redact_hero_features:    RedactHeroSection,
  redact_how_to_steps:     RedactHowToSection,
  redact_geo_targeting:    RedactGeoSection,
  redact_privacy_security: RedactPrivacySection,
  redact_performance:      RedactPerformanceSection,

  // ── Security — sign-pdf (Deep Blue + Purple, Signature) ──
  sign_hero_features:    SignHeroSection,
  sign_how_to_steps:     SignHowToSection,
  sign_geo_targeting:    SignGeoSection,
  sign_privacy_security: SignPrivacySection,
  sign_performance:      SignPerformanceSection,

  // ── Security — remove-pdf-metadata (Slate + Cyan, Cleanse) ──
  metadata_hero_features:    MetadataHeroSection,
  metadata_how_to_steps:     MetadataHowToSection,
  metadata_geo_targeting:    MetadataGeoSection,
  metadata_privacy_security: MetadataPrivacySection,
  metadata_performance:      MetadataPerformanceSection,

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
