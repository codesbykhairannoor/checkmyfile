import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languages';
import { TOOLS_CATALOG, getLocalizedSeo } from '../src/catalog/toolsCatalog';
import { UI_TRANSLATIONS } from '../src/i18n/translations';

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

  // --- WHITE HAT SSG STATIC HTML INJECTION ---
  const geo = UI_TRANSLATIONS[lang as keyof typeof UI_TRANSLATIONS] || UI_TRANSLATIONS['en'];
  
  let staticSeoHtml = '';

  if (toolId) {
    // 1. Tool Pages (100% Safe Pre-rendering of SeoRichSections)
    const exactPath = path.join(__dirname, '..', 'src', 'locales', 'seo', toolId, `${lang}.json`);
    const fallbackPath = path.join(__dirname, '..', 'src', 'locales', 'seo', toolId, `en.json`);
    
    let seoJson = null;
    if (fs.existsSync(exactPath)) {
      seoJson = JSON.parse(fs.readFileSync(exactPath, 'utf8'));
    } else if (fs.existsSync(fallbackPath)) {
      seoJson = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }

    if (seoJson) {
      const sectionsHtml = (seoJson.sections || []).map((sec: any) => `
        <section style="margin-top: 40px;">
          <h2>${sec.title || ''}</h2>
          ${sec.content ? `<p>${sec.content}</p>` : ''}
          ${sec.steps ? `
            <ul>
              ${sec.steps.map((step: any) => `<li><h3>${step.title}</h3><p>${step.description}</p></li>`).join('')}
            </ul>
          ` : ''}
        </section>
      `).join('');

      const faqsHtml = (seoJson.faqs || []).map((faq: any) => `
        <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
          <h3 itemprop="name">${faq.q}</h3>
          <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <p itemprop="text">${faq.a}</p>
          </div>
        </div>
      `).join('');

      staticSeoHtml = `
        <main id="static-seo" role="main" style="padding: 40px; font-family: sans-serif; background: #fff; color: #333;">
          <article itemscope itemtype="https://schema.org/Article">
            <header>
              <h1 itemprop="headline">${seoJson.h1 || seoTitle}</h1>
              <p itemprop="description">${seoJson.description || seoDesc}</p>
            </header>
            ${sectionsHtml}
            ${faqsHtml ? `
              <section style="margin-top: 40px;">
                <h2>${seoJson.faqTitle || 'FAQ'}</h2>
                ${faqsHtml}
              </section>
            ` : ''}
          </article>
        </main>
      `;
    }
  } else if (geo && geo.homeGeoDefTitle) {
    // 2. Home Page (100% Safe Pre-rendering of HomeSections)
    staticSeoHtml = `
      <main id="static-seo" role="main" style="padding: 40px; font-family: sans-serif; background: #fff; color: #333;">
        <article itemscope itemtype="https://schema.org/Article">
          <header>
            <h1 itemprop="headline">${seoTitle}</h1>
            <p itemprop="description">${seoDesc}</p>
          </header>
          
          <section style="margin-top: 40px;">
            <h2>${geo.homeGeoDefTitle}</h2>
            <p>${geo.homeGeoDefDesc}</p>
          </section>

          <section style="margin-top: 40px;">
            <h2>${geo.homeGeoTrustTitle}</h2>
            <p>${geo.homeGeoTrustDesc}</p>
          </section>

          <section style="margin-top: 40px;">
            <h2>${geo.homeGeoTakeawaysTitle}</h2>
            <ul>
              <li>${geo.homeGeoTakeawaysItem1}</li>
              <li>${geo.homeGeoTakeawaysItem2}</li>
              <li>${geo.homeGeoTakeawaysItem3}</li>
            </ul>
          </section>

          <section style="margin-top: 40px;">
            <h2>${geo.homeGeoFaqTitle}</h2>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">${geo.homeGeoFaq1Q}</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">${geo.homeGeoFaq1A}</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">${geo.homeGeoFaq2Q}</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">${geo.homeGeoFaq2A}</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">${geo.homeGeoFaq3Q}</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">${geo.homeGeoFaq3A}</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">${geo.homeGeoFaq4Q}</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">${geo.homeGeoFaq4A}</p>
              </div>
            </div>
          </section>
        </article>
      </main>
    `;
  }

  if (staticSeoHtml) {
    html = html.replace(/<div id="root"><\/div>/, `<div id="root">${staticSeoHtml}</div>`);
  }

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
