import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_CATALOG } from '../src/catalog/toolsCatalog';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languages';
import { STATIC_SLUGS, type StaticPageId } from '../src/i18n/staticSlugs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://handlemyfile.com';
const STATIC_PAGE_KEYS: StaticPageId[] = [
  'about',
  'privacy',
  'terms',
  'pricing',
  'security',
  'use-cases',
  'compare',
  'languages'
];

interface SitemapUrlEntry {
  url: string;
  changefreq: string;
  priority: string;
  lastmod: string;
  links: { lang: string; url: string }[];
  defaultUrl: string;
}

const buildUrlEntryXml = (item: SitemapUrlEntry): string => {
  let xml = `  <url>\n`;
  xml += `    <loc>${item.url}</loc>\n`;
  xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
  xml += `    <priority>${item.priority}</priority>\n`;

  for (const link of item.links) {
    xml += `    <xhtml:link rel="alternate" hreflang="${link.lang}" href="${link.url}" />\n`;
  }
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${item.defaultUrl}" />\n`;
  xml += `  </url>\n`;
  return xml;
};

const wrapUrlset = (entriesXml: string): string => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  xml += entriesXml;
  xml += `</urlset>\n`;
  return xml;
};

export const generateMultilingualSitemaps = () => {
  console.log('🚀 Generating comprehensive 30-language sitemap architecture...');

  const todayIso = new Date().toISOString().split('T')[0];
  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapFiles: { filename: string; urlCount: number }[] = [];
  const allUrlsForMaster: SitemapUrlEntry[] = [];

  // ==========================================
  // 1. GENERATE sitemap-main.xml (Home + Static)
  // ==========================================
  const mainEntries: SitemapUrlEntry[] = [];

  // Homepages
  const homeLinks = SUPPORTED_LANGUAGES.map((l) => ({
    lang: l.code,
    url: l.code === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${l.code}`,
  }));
  const defaultHomeUrl = `${BASE_URL}/`;

  for (const lang of SUPPORTED_LANGUAGES) {
    const loc = lang.code === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${lang.code}`;
    const entry: SitemapUrlEntry = {
      url: loc,
      lastmod: todayIso,
      changefreq: 'daily',
      priority: '1.0',
      links: homeLinks,
      defaultUrl: defaultHomeUrl,
    };
    mainEntries.push(entry);
    allUrlsForMaster.push(entry);
  }

  // Static Pages
  for (const pageKey of STATIC_PAGE_KEYS) {
    const enSlug = STATIC_SLUGS['en']?.[pageKey] || pageKey;
    const defaultStaticUrl = `${BASE_URL}/${enSlug}`;

    const staticLinks = SUPPORTED_LANGUAGES.map((l) => {
      const localSlug = STATIC_SLUGS[l.code]?.[pageKey] || STATIC_SLUGS['en']?.[pageKey] || pageKey;
      return {
        lang: l.code,
        url: l.code === 'en' ? `${BASE_URL}/${localSlug}` : `${BASE_URL}/${l.code}/${localSlug}`,
      };
    });

    for (const lang of SUPPORTED_LANGUAGES) {
      const localSlug = STATIC_SLUGS[lang.code]?.[pageKey] || STATIC_SLUGS['en']?.[pageKey] || pageKey;
      const loc = lang.code === 'en' ? `${BASE_URL}/${localSlug}` : `${BASE_URL}/${lang.code}/${localSlug}`;

      const entry: SitemapUrlEntry = {
        url: loc,
        lastmod: todayIso,
        changefreq: 'monthly',
        priority: '0.8',
        links: staticLinks,
        defaultUrl: defaultStaticUrl,
      };
      mainEntries.push(entry);
      allUrlsForMaster.push(entry);
    }
  }

  const mainXml = wrapUrlset(mainEntries.map(buildUrlEntryXml).join(''));
  fs.writeFileSync(path.join(publicDir, 'sitemap-main.xml'), mainXml, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap-main.xml'), mainXml, 'utf8');
  }
  sitemapFiles.push({ filename: 'sitemap-main.xml', urlCount: mainEntries.length });

  // ==========================================
  // 2. GENERATE sitemap-[lang].xml FOR EACH OF THE 30 LANGUAGES
  // ==========================================
  for (const lang of SUPPORTED_LANGUAGES) {
    const langEntries: SitemapUrlEntry[] = [];

    for (const tool of TOOLS_CATALOG) {
      const enSlug = tool.slugs['en'] || tool.id;
      const defaultToolUrl = `${BASE_URL}/${enSlug}`;

      const toolLinks = SUPPORTED_LANGUAGES.map((l) => {
        const lSlug = tool.slugs[l.code] || tool.id;
        return {
          lang: l.code,
          url: l.code === 'en' ? `${BASE_URL}/${lSlug}` : `${BASE_URL}/${l.code}/${lSlug}`,
        };
      });

      const slug = tool.slugs[lang.code] || tool.id;
      const loc = lang.code === 'en' ? `${BASE_URL}/${slug}` : `${BASE_URL}/${lang.code}/${slug}`;

      const entry: SitemapUrlEntry = {
        url: loc,
        lastmod: todayIso,
        changefreq: 'weekly',
        priority: '0.9',
        links: toolLinks,
        defaultUrl: defaultToolUrl,
      };

      langEntries.push(entry);
      allUrlsForMaster.push(entry);
    }

    const langSitemapFilename = `sitemap-${lang.code}.xml`;
    const langXml = wrapUrlset(langEntries.map(buildUrlEntryXml).join(''));

    fs.writeFileSync(path.join(publicDir, langSitemapFilename), langXml, 'utf8');
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, langSitemapFilename), langXml, 'utf8');
    }
    sitemapFiles.push({ filename: langSitemapFilename, urlCount: langEntries.length });
  }

  // ==========================================
  // 3. GENERATE sitemap-index.xml (Master Index)
  // ==========================================
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const item of sitemapFiles) {
    indexXml += `  <sitemap>\n`;
    indexXml += `    <loc>${BASE_URL}/${item.filename}</loc>\n`;
    indexXml += `    <lastmod>${todayIso}</lastmod>\n`;
    indexXml += `  </sitemap>\n`;
  }
  indexXml += `</sitemapindex>\n`;

  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), indexXml, 'utf8');
  }

  // ==========================================
  // 4. GENERATE sitemap.xml
  // (Both standard urlset and alias to sitemap-index.xml)
  // ==========================================
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), indexXml, 'utf8');
  }

  // Also write comprehensive single file sitemap-all.xml for engines that prefer 1 huge file
  const allMasterXml = wrapUrlset(allUrlsForMaster.map(buildUrlEntryXml).join(''));
  fs.writeFileSync(path.join(publicDir, 'sitemap-all.xml'), allMasterXml, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap-all.xml'), allMasterXml, 'utf8');
  }

  // ==========================================
  // 5. GENERATE RSS 2.0 (feed.xml) & Atom 1.0 (atom.xml)
  // (Google crawls RSS/Atom feeds in near-realtime for new sites!)
  // ==========================================
  const nowRfc822 = new Date().toUTCString();
  const nowIso = new Date().toISOString();

  let rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  rssXml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
  rssXml += `  <channel>\n`;
  rssXml += `    <title>HandleMyFile - Free Private Online PDF &amp; Document Tools</title>\n`;
  rssXml += `    <link>${BASE_URL}</link>\n`;
  rssXml += `    <description>100% private, client-side WebAssembly document utility suite for PDF, Word, Excel, Images, and OCR across 30 languages.</description>\n`;
  rssXml += `    <language>en-US</language>\n`;
  rssXml += `    <lastBuildDate>${nowRfc822}</lastBuildDate>\n`;
  rssXml += `    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />\n`;

  // Include top tools in RSS feed
  for (const tool of TOOLS_CATALOG) {
    const enSlug = tool.slugs['en'] || tool.id;
    const itemUrl = `${BASE_URL}/${enSlug}`;
    rssXml += `    <item>\n`;
    rssXml += `      <title>${tool.title || tool.id} - HandleMyFile</title>\n`;
    rssXml += `      <link>${itemUrl}</link>\n`;
    rssXml += `      <guid isPermaLink="true">${itemUrl}</guid>\n`;
    rssXml += `      <pubDate>${nowRfc822}</pubDate>\n`;
    rssXml += `      <description>${tool.description || `Free client-side ${tool.id} tool with zero server uploads.`}</description>\n`;
    rssXml += `    </item>\n`;
  }
  rssXml += `  </channel>\n`;
  rssXml += `</rss>\n`;

  fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssXml, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'feed.xml'), rssXml, 'utf8');
  }

  // Atom feed
  let atomXml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  atomXml += `<feed xmlns="http://www.w3.org/2005/Atom">\n`;
  atomXml += `  <title>HandleMyFile Latest Tools</title>\n`;
  atomXml += `  <link href="${BASE_URL}/atom.xml" rel="self" />\n`;
  atomXml += `  <link href="${BASE_URL}" />\n`;
  atomXml += `  <updated>${nowIso}</updated>\n`;
  atomXml += `  <id>${BASE_URL}/</id>\n`;

  for (const tool of TOOLS_CATALOG) {
    const enSlug = tool.slugs['en'] || tool.id;
    const itemUrl = `${BASE_URL}/${enSlug}`;
    atomXml += `  <entry>\n`;
    atomXml += `    <title>${tool.title || tool.id}</title>\n`;
    atomXml += `    <link href="${itemUrl}" />\n`;
    atomXml += `    <id>${itemUrl}</id>\n`;
    atomXml += `    <updated>${nowIso}</updated>\n`;
    atomXml += `    <summary>${tool.description || `Free private ${tool.id} utility.`}</summary>\n`;
    atomXml += `  </entry>\n`;
  }
  atomXml += `</feed>\n`;

  fs.writeFileSync(path.join(publicDir, 'atom.xml'), atomXml, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'atom.xml'), atomXml, 'utf8');
  }

  // ==========================================
  // 6. GENERATE OPTIMIZED robots.txt
  // ==========================================
  const robotsTxt = `User-agent: *
Allow: /

# Fast discovery sitemaps
Sitemap: ${BASE_URL}/sitemap-index.xml
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-all.xml
Sitemap: ${BASE_URL}/sitemap-main.xml
Sitemap: ${BASE_URL}/feed.xml
Sitemap: ${BASE_URL}/atom.xml

# Explicitly welcome AI Answer Engines for Generative Engine Optimization (GEO/AEO)
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: YandexBot
Allow: /

LLMS: ${BASE_URL}/llms.txt
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  }

  console.log(`✅ Successfully generated:
  - sitemap-index.xml (${sitemapFiles.length} sitemaps indexed)
  - 30 individual language sitemaps (sitemap-en.xml, sitemap-id.xml, etc.)
  - sitemap-main.xml (${mainEntries.length} home + static URLs)
  - sitemap-all.xml (${allUrlsForMaster.length} total URLs)
  - feed.xml (RSS 2.0 real-time crawler feed)
  - atom.xml (Atom 1.0 real-time crawler feed)
  - robots.txt (optimized for Google, Bing, Yandex, and AI Answer engines)`);
};

generateMultilingualSitemaps();
