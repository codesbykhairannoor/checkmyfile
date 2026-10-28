import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_CATALOG } from '../src/catalog/toolsCatalog';
import { STATIC_SLUGS, type StaticPageId } from '../src/i18n/staticSlugs';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languages';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAP_PATH = path.join(__dirname, '404-redirect-map.json');
const rawMap: Record<string, string> = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

// Helper to normalize string for comparison (remove dashes, diacritics, lowercase)
const norm = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
};

const cleanMap: Record<string, string> = {};
let repairedCount = 0;
let prunedCount = 0;
let keptCount = 0;

for (const [sourceUrl, origTarget] of Object.entries(rawMap)) {
  const match = sourceUrl.match(/^\/([a-z]{2})\/(.+)$/);
  
  // If not matching /lang/slug pattern
  if (!match) {
    if (origTarget !== '/' && !/^\/[a-z]{2}\/?$/.test(origTarget)) {
      cleanMap[sourceUrl] = origTarget;
      keptCount++;
    } else {
      prunedCount++;
    }
    continue;
  }

  const [, lang, rawSlug] = match;
  const slug = rawSlug.trim();

  // If slug is empty or just dashes/symbols (e.g. "-", "-csv")
  if (!slug || /^[-_~]+$/.test(slug)) {
    prunedCount++;
    continue;
  }

  // 1. If original target was already a specific tool/page (not home), keep it!
  if (origTarget !== '/' && origTarget !== `/${lang}` && origTarget !== `/${lang}/`) {
    cleanMap[sourceUrl] = origTarget;
    keptCount++;
    continue;
  }

  // 2. Otherwise, origTarget was a SOFT-404 pointing to / or /lang!
  // Try to intelligently match slug to a real tool or static page
  const normSlug = norm(slug);
  let matchedTarget: string | null = null;

  // Check static pages first (about, privacy, terms, pricing, security, use-cases, compare, languages)
  const staticKeys: StaticPageId[] = ['about', 'privacy', 'terms', 'pricing', 'security', 'use-cases', 'compare', 'languages'];
  for (const sk of staticKeys) {
    const localizedSlug = STATIC_SLUGS[lang]?.[sk] || STATIC_SLUGS['en']?.[sk] || sk;
    if (normSlug === norm(sk) || normSlug === norm(localizedSlug)) {
      matchedTarget = lang === 'en' ? `/${localizedSlug}` : `/${lang}/${localizedSlug}`;
      break;
    }
  }

  // Check tools catalog
  if (!matchedTarget) {
    // Check direct ID or slug match
    for (const tool of TOOLS_CATALOG) {
      const toolSlug = tool.slugs[lang] || tool.id;
      const enSlug = tool.slugs['en'] || tool.id;

      // Special handling for pdf-to-word aliases
      if (normSlug.includes('word') && (normSlug.includes('pdf') || normSlug.includes('docx'))) {
        const p2w = TOOLS_CATALOG.find(t => t.id === 'pdf-to-word-without-losing-formatting');
        if (p2w) {
          const targetSlug = p2w.slugs[lang] || p2w.id;
          matchedTarget = lang === 'en' ? `/${targetSlug}` : `/${lang}/${targetSlug}`;
          break;
        }
      }

      if (
        normSlug === norm(tool.id) ||
        normSlug === norm(toolSlug) ||
        normSlug === norm(enSlug) ||
        (normSlug.length > 5 && (norm(toolSlug).includes(normSlug) || normSlug.includes(norm(toolSlug))))
      ) {
        matchedTarget = lang === 'en' ? `/${toolSlug}` : `/${lang}/${toolSlug}`;
        break;
      }
    }
  }

  // If we found a legitimate target tool, redirect to it!
  if (matchedTarget) {
    cleanMap[sourceUrl] = matchedTarget;
    repairedCount++;
    console.log(`✅ Repaired Soft 404: ${sourceUrl} -> ${matchedTarget}`);
  } else {
    // If no reasonable match exists, prune it so it yields a true 404!
    prunedCount++;
    console.log(`❌ Pruned Soft 404 (Will return clean 404): ${sourceUrl}`);
  }
}

fs.writeFileSync(MAP_PATH, JSON.stringify(cleanMap, null, 2), 'utf8');

console.log('\n=============================================');
console.log(`Total Original: ${Object.keys(rawMap).length}`);
console.log(`Legitimate Redirects Kept: ${keptCount}`);
console.log(`Soft 404s Repaired to Specific Tools: ${repairedCount}`);
console.log(`Corrupt/Useless Slugs Pruned to True 404: ${prunedCount}`);
console.log(`Total Clean Redirects Remaining: ${Object.keys(cleanMap).length}`);
console.log('=============================================\n');
