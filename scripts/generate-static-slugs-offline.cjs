const { Project, SyntaxKind } = require('ts-morph');
const { slugify } = require('transliteration');
const fs = require('fs');
const path = require('path');

const TRANSLATIONS_FILE = path.join(__dirname, '..', 'src', 'i18n', 'translations.ts');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'i18n', 'staticSlugs.ts');

const PAGE_KEYS = {
  'about': 'footerAbout',
  'privacy': 'footerPrivacy',
  'terms': 'footerTos',
  'pricing': 'footerPricing',
  'security': 'footerSecurity',
  'use-cases': 'footerUseCases',
  'compare': 'footerCompare',
  'languages': 'footerLanguages',
};

// Fallback english words in case UI_TRANSLATIONS is missing something
const FALLBACKS = {
  'about': 'about',
  'privacy': 'privacy',
  'terms': 'terms',
  'pricing': 'pricing',
  'security': 'security',
  'use-cases': 'use-cases',
  'compare': 'compare',
  'languages': 'languages',
};

function strictSlugify(text, fallback) {
  if (!text) return fallback;
  // Use transliteration to handle non-latin (chinese, arabic, cyrillic, etc) -> latin
  let slug = slugify(text);
  // Strip anything that is NOT a-z, 0-9, or hyphen
  slug = slug.replace(/[^a-z0-9\-]/g, '');
  // Remove double hyphens and trim
  slug = slug.replace(/\-+/g, '-').replace(/^\-|\-$/g, '');
  
  return slug || fallback;
}

function main() {
  console.log('Loading translations.ts...');
  const project = new Project();
  project.addSourceFileAtPath(TRANSLATIONS_FILE);
  const sourceFile = project.getSourceFileOrThrow(TRANSLATIONS_FILE);

  const uiTranslationsDecl = sourceFile.getVariableDeclaration('UI_TRANSLATIONS');
  const uiTranslationsObj = uiTranslationsDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  const result = {};

  const langs = uiTranslationsObj.getProperties()
    .filter(p => p.isKind(SyntaxKind.PropertyAssignment))
    .map(p => p.getName());

  for (const lang of langs) {
    result[lang] = {};
    if (lang === 'en') {
      result[lang] = FALLBACKS;
      continue;
    }

    const langProp = uiTranslationsObj.getPropertyOrThrow(lang);
    const langObj = langProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (!langObj) continue;

    for (const [pageId, key] of Object.entries(PAGE_KEYS)) {

      const prop = langObj.getProperty(key);
      let text = FALLBACKS[pageId];
      if (prop && prop.getInitializer()) {
        text = prop.getInitializer().getText().replace(/^["']|["']$/g, '');
      }

      result[lang][pageId] = strictSlugify(text, FALLBACKS[pageId]);
    }
  }

  // Write TS file
  const tsContent = `// This file is auto-generated. Do not edit manually.
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

  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log('Successfully generated staticSlugs.ts with strict A-Z transliterated slugs!');
}

main();
