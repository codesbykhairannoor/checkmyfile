/**
 * SECTION COMPONENT REGISTRY
 * ─────────────────────────────────────────────────────────
 * HOW TO ADD A NEW TOOL LAYOUT:
 *   1. Create `src/components/seo-sections/MyNewSection.tsx`
 *   2. Add entry here: 'my_new_type': MyNewSection
 *   3. Done. SeoRichSections.tsx needs ZERO changes.
 * ─────────────────────────────────────────────────────────
 */
import React from 'react';
import type { SectionProps } from './types';

import { HeroFeaturesSection }    from './HeroFeaturesSection';
import { HowToStepsSection }      from './HowToStepsSection';
import { GeoTargetingSection }    from './GeoTargetingSection';
import { PrivacySecuritySection } from './PrivacySecuritySection';
import { PerformanceSection }     from './PerformanceSection';
import { SplitHeroSection }       from './SplitHeroSection';
import { SplitHowToSection }      from './SplitHowToSection';
import { SplitGeoSection }        from './SplitGeoSection';
import { SplitPrivacySection }    from './SplitPrivacySection';
import { SplitPerformanceSection } from './SplitPerformanceSection';

type SectionComponent = React.FC<SectionProps>;

export const SECTION_REGISTRY: Record<string, SectionComponent> = {
  // ── Merge PDF & Compress PDF (shared layouts, different copy) ──
  hero_features:    HeroFeaturesSection,
  how_to_steps:     HowToStepsSection,
  geo_targeting:    GeoTargetingSection,
  privacy_security: PrivacySecuritySection,
  performance:      PerformanceSection,

  // ── Split PDF (totally distinct layouts) ──
  split_hero_features:    SplitHeroSection,
  split_how_to_steps:     SplitHowToSection,
  split_geo_targeting:    SplitGeoSection,
  split_privacy_security: SplitPrivacySection,
  split_performance:      SplitPerformanceSection,

  // ── Future tools: add one line here ──
  // rotate_hero_features: RotateHeroSection,
  // ocr_hero_features:    OcrHeroSection,
};

/** Normalise prefixes from older JSON files (merge_ / comp_) so they
 *  resolve to the shared layout keys without modifying the JSON. */
export const resolveType = (rawType: string): string =>
  rawType.replace(/^(merge_|comp_)/, '');
