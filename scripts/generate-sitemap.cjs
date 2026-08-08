const fs = require('fs');
const path = require('path');

// Constants
const BASE_URL = 'https://handlemyfile.com';
const LANGUAGES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

function generateSitemap() {
  console.log('Generating Sitemap with Hreflang Matrix...');
  
  // Read slug translations to get the localized slugs
  const slugFilePath = path.join(__dirname, '../src/i18n/slugTranslations.ts');
  const slugContent = fs.readFileSync(slugFilePath, 'utf8');
  
  // Extract toolSlugs
  const matchSlugs = slugContent.match(/export const toolSlugs: Record<string, Record<string, string>> = (\{[\s\S]*?\});\n/);
  if (!matchSlugs) throw new Error("Could not parse toolSlugs");
  const toolSlugs = eval('(' + matchSlugs[1] + ')');

  const tools = Object.keys(toolSlugs); // 32 tools
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // Helper to generate hreflang block
  const generateHreflangBlock = (getPathFn) => {
    let block = '';
    // Bidirectional links for all 30 languages
    for (const lang of LANGUAGES) {
      block += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${getPathFn(lang)}" />\n`;
    }
    // x-default points to english
    block += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${getPathFn('en')}" />\n`;
    return block;
  };

  // 1. Homepages (Root & Language specific)
  for (const lang of LANGUAGES) {
    const loc = lang === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${lang}/`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += generateHreflangBlock((l) => (l === 'en' ? '/' : `/${l}/`));
    xml += `  </url>\n`;
  }

  // 2. Tool Pages
  for (const tool of tools) {
    for (const lang of LANGUAGES) {
      const slug = toolSlugs[tool][lang] || tool;
      const loc = lang === 'en' ? `${BASE_URL}/${slug}` : `${BASE_URL}/${lang}/${slug}`;
      
      xml += `  <url>\n`;
      xml += `    <loc>${loc}</loc>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      
      xml += generateHreflangBlock((l) => {
        const lSlug = toolSlugs[tool][l] || tool;
        return l === 'en' ? `/${lSlug}` : `/${l}/${lSlug}`;
      });
      
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>\n`;

  // Write to public folder
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Generated sitemap.xml with size: ${(xml.length / 1024 / 1024).toFixed(2)} MB`);
}

generateSitemap();
