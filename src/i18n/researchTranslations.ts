import enResearch from './locales/research/en.json';

// Research & Academic Grounding Translations (code-split per language)
export interface ResearchTranslations {
  researchBadge: string;
  researchHomeTitle: string;
  researchHomeSub: string;
  homeCard1Title: string;
  homeCard1Cite: string;
  homeCard1Desc: string;
  homeCard2Title: string;
  homeCard2Cite: string;
  homeCard2Desc: string;
  homeCard3Title: string;
  homeCard3Cite: string;
  homeCard3Desc: string;
  aboutResearchTitle: string;
  aboutResearchSub: string;
  aboutResearchText: string;
  securityResearchTitle: string;
  securityResearchSub: string;
  securityCard1Title: string;
  securityCard1Cite: string;
  securityCard1Desc: string;
  securityCard2Title: string;
  securityCard2Cite: string;
  securityCard2Desc: string;
  securityCard3Title: string;
  securityCard3Cite: string;
  securityCard3Desc: string;
  privacyResearchTitle: string;
  privacyResearchSub: string;
  privacyResearchText: string;
  compareResearchTitle: string;
  compareResearchSub: string;
  comparePoint1Title: string;
  comparePoint1Desc: string;
  comparePoint2Title: string;
  comparePoint2Desc: string;
  comparePoint3Title: string;
  comparePoint3Desc: string;
  toolRedactResearchTitle: string;
  toolRedactResearchCite: string;
  toolRedactResearchDesc: string;
  toolOcrResearchTitle: string;
  toolOcrResearchCite: string;
  toolOcrResearchDesc: string;
  toolCompressResearchTitle: string;
  toolCompressResearchCite: string;
  toolCompressResearchDesc: string;
  toolSignResearchTitle: string;
  toolSignResearchCite: string;
  toolSignResearchDesc: string;
}

export const RESEARCH_TRANSLATIONS: Record<string, ResearchTranslations> = {
  en: enResearch as ResearchTranslations,
};

const researchModules = typeof import.meta.glob === 'function'
  ? import.meta.glob<{ default: ResearchTranslations }>('./locales/research/*.json')
  : {};

export const loadResearchLocale = async (langCode: string): Promise<void> => {
  if (!langCode || RESEARCH_TRANSLATIONS[langCode]) return;
  const loader = researchModules[`./locales/research/${langCode}.json`];
  if (loader) {
    try {
      const mod = await loader();
      RESEARCH_TRANSLATIONS[langCode] = mod.default || (mod as unknown as ResearchTranslations);
    } catch {
      // Fallback to en
    }
  }
};
