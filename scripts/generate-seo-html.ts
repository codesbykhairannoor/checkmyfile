import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languages';
import { TOOLS_CATALOG, getLocalizedSeo } from '../src/catalog/toolsCatalog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://handlemyfile.com';
const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('dist/ directory not found. Please run vite build first.');
  process.exit(1);
}

const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found. Please run vite build first.');
  process.exit(1);
}

const baseHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
const LANGS = SUPPORTED_LANGUAGES.map(l => l.code);
let generatedCount = 0;

// Helper to write file safely
const writeFileSafe = (filePath: string, content: string) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  generatedCount++;
};

// Generate HTML
const generateHtml = (lang: string, urlPath: string, seoTitle: string, seoDesc: string, toolId?: string) => {
  let html = baseHtmlContent;

  // Replace lang
  html = html.replace(/<html lang="[^"]*">/i, `<html lang="${lang}">`);

  // Remove existing title/meta to avoid duplicates
  html = html.replace(/<title>.*?<\/title>/gi, '');
  html = html.replace(/<meta name="description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<link rel="canonical"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:title"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n?\s*/g, '');
  
  // Inject new tags
  const titleTag = `<title>${seoTitle}</title>`;
  const metaDesc = `<meta name="description" content="${seoDesc.replace(/"/g, '&quot;')}" />`;
  const canonical = `<link rel="canonical" href="${DOMAIN}${urlPath}" />`;
  const ogTitle = `<meta property="og:title" content="${seoTitle.replace(/"/g, '&quot;')}" />`;
  const ogDesc = `<meta property="og:description" content="${seoDesc.replace(/"/g, '&quot;')}" />`;

  // Dynamic hreflangs
  let dynamicHreflangs = `<!-- SSG Hreflang Tags -->\n`;
  for (const l of LANGS) {
    let targetPath = `/${l}`;
    if (toolId) {
      const toolDef = TOOLS_CATALOG.find(t => t.id === toolId);
      if (toolDef) {
        const localSlug = toolDef.slugs[l] || toolId;
        targetPath = `/${l}/${localSlug}`;
      }
    } else {
      // It's a static page (about, privacy) or home
      const segments = urlPath.split('/').filter(Boolean);
      if (segments.length > 1) {
         // e.g. /en/about
         targetPath = `/${l}/${segments[1]}`;
      }
    }
    // ensure trailing slash is not added if not root, wait, we don't use trailing slash in app
    dynamicHreflangs += `    <link rel="alternate" hreflang="${l}" href="${DOMAIN}${targetPath}" />\n`;
  }
  
  // x-default
  let xDefaultPath = `/en`;
  if (toolId) {
    const toolDef = TOOLS_CATALOG.find(t => t.id === toolId);
    if (toolDef) {
      const localSlug = toolDef.slugs['en'] || toolId;
      xDefaultPath = `/en/${localSlug}`;
    }
  } else {
    const segments = urlPath.split('/').filter(Boolean);
    if (segments.length > 1) {
       xDefaultPath = `/en/${segments[1]}`;
    }
  }
  dynamicHreflangs += `    <link rel="alternate" hreflang="x-default" href="${DOMAIN}${xDefaultPath}" />\n`;

  const headInjection = `
    ${titleTag}
    ${metaDesc}
    ${canonical}
    ${ogTitle}
    ${ogDesc}
    ${dynamicHreflangs}
  `;

  html = html.replace(/(<\/head>)/i, `${headInjection}$1`);
  return html;
};

const run = async () => {
  for (const lang of LANGS) {
    // 1. Home Page (/lang)
    const homeHtml = generateHtml(
      lang,
      `/${lang}`,
      'HandleMyFile - All Document Tools in One Place',
      'Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly.'
    );
    writeFileSafe(path.join(distDir, lang, 'index.html'), homeHtml);

    // 2. Static Pages
    const staticPages = ['about', 'privacy', 'terms', 'pricing', 'security', 'use-cases', 'compare', 'languages'];
    for (const page of staticPages) {
      const pageHtml = generateHtml(
        lang,
        `/${lang}/${page}`,
        `HandleMyFile - ${page.toUpperCase()}`,
        `Read more about HandleMyFile ${page}.`
      );
      writeFileSafe(path.join(distDir, lang, page, 'index.html'), pageHtml);
    }

    // 3. Tool Pages
    for (const tool of TOOLS_CATALOG) {
      const localSlug = tool.slugs[lang] || tool.id;
      const seoData = getLocalizedSeo(tool, lang);
      
      const toolHtml = generateHtml(
        lang,
        `/${lang}/${localSlug}`,
        seoData.title,
        seoData.description,
        tool.id
      );
      writeFileSafe(path.join(distDir, lang, localSlug, 'index.html'), toolHtml);
    }
  }

  // Generate a root index.html that redirects or acts as x-default
  const rootHtml = generateHtml(
    'en',
    `/`,
    'HandleMyFile - All Document Tools in One Place',
    'Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly.'
  );
  writeFileSafe(path.join(distDir, 'index.html'), rootHtml);

  console.log(`Successfully generated ${generatedCount} static HTML files!`);
};

run().catch(console.error);
