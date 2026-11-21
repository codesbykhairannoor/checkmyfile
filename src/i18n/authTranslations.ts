import enAuth from './locales/auth/en.json';

// Multilingual Auth & PRO Limits Translations (code-split per language)
export const authTranslations: Record<string, Record<string, string>> = {
  en: enAuth as Record<string, string>,
};

const isNodeRuntime = typeof process !== 'undefined' && Boolean(process.versions?.node);
const authModules = !isNodeRuntime
  ? import.meta.glob<{ default: Record<string, string> }>('./locales/auth/*.json')
  : {};

export const loadAuthLocale = async (langCode: string): Promise<void> => {
  if (!langCode || authTranslations[langCode]) return;
  const loader = authModules[`./locales/auth/${langCode}.json`];
  if (loader) {
    try {
      const mod = await loader();
      authTranslations[langCode] = mod.default || (mod as unknown as Record<string, string>);
    } catch {
      // Fallback to en
    }
  }
};
