import enCatalog from './locales/catalog/en.json';

export type CatalogEntry = { title: string; h1: string; description: string };

export const catalogTranslations: Record<string, Record<string, CatalogEntry>> = {
  en: enCatalog as Record<string, CatalogEntry>,
};

const catalogModules = typeof import.meta.glob === 'function'
  ? import.meta.glob<{ default: Record<string, CatalogEntry> }>('./locales/catalog/*.json')
  : {};

export const loadCatalogLocale = async (langCode: string): Promise<void> => {
  if (!langCode || catalogTranslations[langCode]) return;
  const loader = catalogModules[`./locales/catalog/${langCode}.json`];
  if (loader) {
    try {
      const mod = await loader();
      catalogTranslations[langCode] = mod.default || (mod as unknown as Record<string, CatalogEntry>);
    } catch {
      // Fallback safely to English
    }
  }
};
