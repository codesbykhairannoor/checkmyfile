const translate = require('google-translate-api-x');
const fs = require('fs');
const path = require('path');

const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'ru', 'ar', 'hi',
  'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da',
  'el', 'fi', 'he', 'hu', 'id', 'no', 'ro', 'sk', 'uk', 'ms'
];

const STATIC_PAGES = [
  { id: 'about', text: 'about' },
  { id: 'privacy', text: 'privacy' },
  { id: 'terms', text: 'terms' },
  { id: 'pricing', text: 'pricing' },
  { id: 'security', text: 'security' },
  { id: 'use-cases', text: 'use cases' },
  { id: 'compare', text: 'compare' },
  { id: 'languages', text: 'languages' },
];

const langMap = { 'zh': 'zh-CN', 'he': 'iw' };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function toKebabCase(str) {
  return str
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7A3\u0E00-\u0E7F\u0900-\u097F]/gi, ' ') // Keep alphanumeric and non-latin alphabets
    .trim()
    .replace(/\s+/g, '-');
}

async function main() {
  const result = {};

  for (const lang of SUPPORTED_LANGUAGES) {
    const translateCode = langMap[lang] || lang;
    console.log(`Processing ${lang}...`);
    
    result[lang] = {};
    
    for (const page of STATIC_PAGES) {
      if (lang === 'en') {
        result[lang][page.id] = page.id;
        continue;
      }
      
      try {
        const res = await translate(page.text, { to: translateCode });
        const translated = res.text;
        result[lang][page.id] = toKebabCase(translated) || page.id; // fallback to english id if empty
      } catch (e) {
        console.error(`Error translating ${page.text} to ${lang}:`, e.message);
        result[lang][page.id] = page.id;
      }
      await sleep(200);
    }
  }

  // Generate TS file content
  let tsContent = `// This file is auto-generated. Do not edit manually.
export type StaticPageId = 'about' | 'privacy' | 'terms' | 'pricing' | 'security' | 'use-cases' | 'compare' | 'languages';

export const STATIC_SLUGS: Record<string, Record<StaticPageId, string>> = ${JSON.stringify(result, null, 2)};

export function getStaticPageIdFromSlug(slug: string, lang: string = 'en'): StaticPageId | null {
  const langSlugs = STATIC_SLUGS[lang] || STATIC_SLUGS['en'];
  for (const [id, localSlug] of Object.entries(langSlugs)) {
    if (localSlug === slug) return id as StaticPageId;
  }
  
  // Fallback check in English
  for (const [id, localSlug] of Object.entries(STATIC_SLUGS['en'])) {
    if (localSlug === slug) return id as StaticPageId;
  }
  
  return null;
}

export function getLocalizedStaticSlug(pageId: StaticPageId, lang: string = 'en'): string {
  const langSlugs = STATIC_SLUGS[lang] || STATIC_SLUGS['en'];
  return langSlugs[pageId] || STATIC_SLUGS['en'][pageId];
}
`;

  fs.writeFileSync(path.join(__dirname, '..', 'src', 'i18n', 'staticSlugs.ts'), tsContent);
  console.log('Successfully generated src/i18n/staticSlugs.ts');
}

main().catch(console.error);
