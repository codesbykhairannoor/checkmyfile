import fs from 'fs';
import path from 'path';
import { TOOLS_CATALOG } from '../src/catalog/toolsCatalog';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languages';

const BASE_URL = 'https://helpmyfile.com';
const STATIC_PAGES = ['', 'pricing', 'security', 'use-cases', 'compare', 'languages'];

const generateSitemap = () => {
  console.log('Generating sitemap.xml...');

  const urls = [];

  // 1. Static Pages
  for (const page of STATIC_PAGES) {
    const pageSlugs = {};
    for (const lang of SUPPORTED_LANGUAGES) {
      if (lang.code === 'en') {
        pageSlugs[lang.code] = page ? `/${page}` : '/';
      } else {
        pageSlugs[lang.code] = page ? `/${lang.code}/${page}` : `/${lang.code}`;
      }
    }

    for (const lang of SUPPORTED_LANGUAGES) {
      urls.push({
        url: `${BASE_URL}${pageSlugs[lang.code]}`,
        changefreq: 'weekly',
        priority: page === '' ? '1.0' : '0.8',
        links: SUPPORTED_LANGUAGES.map((l) => ({
          lang: l.code,
          url: `${BASE_URL}${pageSlugs[l.code]}`,
        })),
        defaultUrl: `${BASE_URL}${pageSlugs['en']}`,
      });
    }
  }

  // 2. Tool Pages
  for (const tool of TOOLS_CATALOG) {
    for (const lang of SUPPORTED_LANGUAGES) {
      const slug = tool.slugs[lang.code] || tool.id;
      const urlPath = lang.code === 'en' ? `/${slug}` : `/${lang.code}/${slug}`;

      urls.push({
        url: `${BASE_URL}${urlPath}`,
        changefreq: 'monthly',
        priority: '0.9',
        links: SUPPORTED_LANGUAGES.map((l) => {
          const lSlug = tool.slugs[l.code] || tool.id;
          return {
            lang: l.code,
            url: `${BASE_URL}${l.code === 'en' ? `/${lSlug}` : `/${l.code}/${lSlug}`}`,
          };
        }),
        defaultUrl: `${BASE_URL}/${tool.id}`,
      });
    }
  }

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const item of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.url}</loc>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;

    // Add hreflang links
    for (const link of item.links) {
      xml += `    <xhtml:link rel="alternate" hreflang="${link.lang}" href="${link.url}" />\n`;
    }
    // x-default is English
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${item.defaultUrl}" />\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log(`Generated sitemap.xml with ${urls.length} URLs!`);

  // Generate robots.txt
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
  console.log(`Generated robots.txt!`);
};

generateSitemap();
