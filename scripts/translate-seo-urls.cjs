const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const seoTools = [
  'crop-pdf-margins',
  'grayscale-pdf-for-printing',
  'remove-pdf-author-metadata',
  'extract-high-res-images-pdf',
  'compare-pdf-files-visually'
];

const LANG_CODES = [
  'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms',
];

const toSlug = (text) => text.toLowerCase().replace(/[^a-z0-9----가-힣]+/g, '-').replace(/^-|-$/g, '');

// Process in chunks to avoid overwhelming the API, but still fast
const chunkArray = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));

async function translateUrlsAndTitles() {
  const catalogPath = path.join(__dirname, '../src/catalog/pdfTools.ts');
  let catalogContent = fs.readFileSync(catalogPath, 'utf8');

  for (const tool of seoTools) {
    console.log(`Processing tool: ${tool}...`);
    const regex = new RegExp(`id:\\s*'${tool}'[\\s\\S]*?en:\\s*{[\\s\\S]*?title:\\s*'([^']+)'[\\s\\S]*?h1:\\s*'([^']+)'[\\s\\S]*?description:\\s*'([^']+)'`, 'i');
    const match = catalogContent.match(regex);
    if (!match) continue;

    const [_, enTitle, enH1, enDesc] = match;
    const seoBlockStartRegex = new RegExp(`(id:\\s*'${tool}'[\\s\\S]*?seo:\\s*{)(\\s*en:\\s*{)`, 'i');
    const slugsBlockRegex = new RegExp(`(slugs:\\s*generateSlugsForId\\('${tool}',\\s*{)([^}]+)(})`, 'i');
    
    let seoReplacements = '';
    let slugReplacements = '';

    const langChunks = chunkArray(LANG_CODES, 10);
    
    for (const chunk of langChunks) {
      const promises = chunk.map(async (lang) => {
        try {
          const res = await translate([tool.replace(/-/g, ' '), enTitle, enH1, enDesc], { to: lang, forceTo: true });
          return {
            lang,
            slug: toSlug(res[0].text),
            title: res[1].text.replace(/'/g, "\\'"),
            h1: res[2].text.replace(/'/g, "\\'"),
            desc: res[3].text.replace(/'/g, "\\'")
          };
        } catch (e) {
          console.error(`Failed ${lang}:`, e.message);
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      for (const res of results) {
        if (res) {
          seoReplacements += `\n        ${res.lang}: {\n          title: '${res.title}',\n          h1: '${res.h1}',\n          description: '${res.desc}',\n          faqs: defaultFaqs('${enH1}', '${res.lang}'),\n        },`;
          slugReplacements += ` ${res.lang}: '${res.slug}',`;
        }
      }
    }

    catalogContent = catalogContent.replace(seoBlockStartRegex, `$1${seoReplacements}$2`);
    catalogContent = catalogContent.replace(slugsBlockRegex, `$1$2${slugReplacements}$3`);
  }

  fs.writeFileSync(catalogPath, catalogContent, 'utf8');
  console.log('Finished super fast translations!');
}

translateUrlsAndTitles().catch(console.error);
