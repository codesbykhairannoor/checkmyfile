import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../src/i18n/languages';
import { TOOLS_CATALOG, getLocalizedSeo } from '../src/catalog/toolsCatalog';
import { UI_TRANSLATIONS } from '../src/i18n/translations';
import { authTranslations } from '../src/i18n/authTranslations';
import { GEO_CITATIONS } from '../src/i18n/geoTranslations';
import { RESEARCH_TRANSLATIONS } from '../src/i18n/researchTranslations';
import { STATIC_SLUGS, type StaticPageId } from '../src/i18n/staticSlugs';
import { toolSlugs, toolNames } from '../src/i18n/slugTranslations';
import { cleanMetaTitle, cleanMetaDescription } from '../src/utils/seoHelpers';
import { STATIC_CHROME_I18N } from './staticChromeI18n';

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

// Helper: 100% Reciprocal Hreflang Tags for all 30 languages + x-default
const buildHreflangTags = (pageType: 'tool' | 'home' | 'static', pageId?: string): string => {
  const tags: string[] = [];

  if (pageType === 'tool' && pageId) {
    const toolDef = TOOLS_CATALOG.find(t => t.id === pageId);
    if (toolDef) {
      for (const l of SUPPORTED_LANGUAGES) {
        const isLEn = l.code === 'en';
        const slug = toolDef.slugs[l.code] || toolDef.id;
        const targetUrl = isLEn ? `${DOMAIN}/${slug}` : `${DOMAIN}/${l.code}/${slug}`;
        tags.push(`<link rel="alternate" hreflang="${l.code}" href="${targetUrl}" />`);
      }
      const enSlug = toolDef.slugs['en'] || toolDef.id;
      tags.push(`<link rel="alternate" hreflang="x-default" href="${DOMAIN}/${enSlug}" />`);
    }
  } else if (pageType === 'static' && pageId) {
    for (const l of SUPPORTED_LANGUAGES) {
      const isLEn = l.code === 'en';
      const slug = STATIC_SLUGS[l.code]?.[pageId as StaticPageId] || STATIC_SLUGS['en']?.[pageId as StaticPageId] || pageId;
      const targetUrl = isLEn ? `${DOMAIN}/${slug}` : `${DOMAIN}/${l.code}/${slug}`;
      tags.push(`<link rel="alternate" hreflang="${l.code}" href="${targetUrl}" />`);
    }
    const enSlug = STATIC_SLUGS['en']?.[pageId as StaticPageId] || pageId;
    tags.push(`<link rel="alternate" hreflang="x-default" href="${DOMAIN}/${enSlug}" />`);
  } else {
    // Home page
    for (const l of SUPPORTED_LANGUAGES) {
      const isLEn = l.code === 'en';
      const targetUrl = isLEn ? `${DOMAIN}/` : `${DOMAIN}/${l.code}`;
      tags.push(`<link rel="alternate" hreflang="${l.code}" href="${targetUrl}" />`);
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${DOMAIN}/" />`);
  }

  return tags.join('\n    ');
};

// Helper: Semantic Header Navigation with localized labels and crawlable outgoing internal links
const buildHeaderNavigation = (lang: string, isEn: boolean): string => {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  const authT = authTranslations[lang] || authTranslations['en'] || {};
  const chrome = STATIC_CHROME_I18N[lang] || STATIC_CHROME_I18N['en'];
  const homeHref = isEn ? '/' : `/${lang}`;
  const getStaticHref = (pageKey: StaticPageId) => {
    const slug = STATIC_SLUGS[lang]?.[pageKey] || STATIC_SLUGS['en']?.[pageKey] || pageKey;
    return isEn ? `/${slug}` : `/${lang}/${slug}`;
  };

  const mergeSlug = isEn ? '/merge-pdf' : `/${lang}/${toolSlugs['merge-pdf']?.[lang] || 'merge-pdf'}`;
  const compressSlug = isEn ? '/compress-pdf' : `/${lang}/${toolSlugs['compress-pdf']?.[lang] || 'compress-pdf'}`;
  const wordSlug = isEn ? '/pdf-to-word' : `/${lang}/${toolSlugs['pdf-to-word']?.[lang] || 'pdf-to-word'}`;

  return `
    <header style="position: sticky; top: 0; z-index: 50; background: var(--seo-bg, #080a0f); border-bottom: 1px solid var(--seo-border, rgba(255,255,255,0.08)); padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="${homeHref}" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--seo-text, #f8fafc); flex-shrink: 0;">
          <img src="/logo.png" alt="HandleMyFile Logo" style="height: 38px; width: auto; object-fit: contain;" />
          <span style="font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em;">HandleMy<span style="background: linear-gradient(135deg, #e11d48, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">File</span></span>
        </a>
      </div>
      <nav aria-label="Main Quick Navigation" style="display: flex; align-items: center; gap: 8px;">
        <a href="${mergeSlug}" style="color: var(--seo-text, #f8fafc); text-decoration: none; padding: 7px 14px; border-radius: 8px; font-size: 1.02rem; font-weight: 700; letter-spacing: -0.01em;">${toolNames['merge-pdf']?.[lang] || 'Merge PDF'}</a>
        <a href="${compressSlug}" style="color: var(--seo-text, #f8fafc); text-decoration: none; padding: 7px 14px; border-radius: 8px; font-size: 1.02rem; font-weight: 700; letter-spacing: -0.01em;">${toolNames['compress-pdf']?.[lang] || 'Compress PDF'}</a>
        <a href="${wordSlug}" style="color: var(--seo-text, #f8fafc); text-decoration: none; padding: 7px 14px; border-radius: 8px; font-size: 1.02rem; font-weight: 700; letter-spacing: -0.01em;">${toolNames['pdf-to-word']?.[lang] || 'PDF to Word'}</a>
      </nav>
      <div style="display: flex; align-items: center; gap: 14px; font-size: 0.98rem; font-weight: 600;">
        <a href="${getStaticHref('pricing')}" style="color: var(--seo-text, #f8fafc); text-decoration: none; font-weight: 700;">${t.footerPricing || 'Pricing'}</a>
        <a href="${getStaticHref('languages')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none;">${chrome.langsCount}</a>
        <a href="${homeHref}" onclick="if(window.__openAuthModal){window.__openAuthModal();return false;}" style="background: #e11d48; color: #ffffff; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.96rem; display: inline-flex; align-items: center; gap: 6px;">
          <span>${authT.nav_signin || 'Sign In'}</span>
        </a>
      </div>
    </header>
  `;
};

// Helper: Semantic localized footer with crawlable outgoing internal links
const buildStaticFooter = (lang: string, isEn: boolean): string => {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  const chrome = STATIC_CHROME_I18N[lang] || STATIC_CHROME_I18N['en'];
  const homeHref = isEn ? '/' : `/${lang}`;
  const getStaticHref = (pageKey: StaticPageId) => {
    const slug = STATIC_SLUGS[lang]?.[pageKey] || STATIC_SLUGS['en']?.[pageKey] || pageKey;
    return isEn ? `/${slug}` : `/${lang}/${slug}`;
  };

  return `
    <footer style="margin-top: 60px; padding: 48px 24px 32px; border-top: 1px solid var(--seo-border, rgba(255,255,255,0.08)); font-size: 0.9rem; color: var(--seo-muted, #94a3b8); background: var(--seo-bg, #080a0f);">
      <nav aria-label="Footer Navigation" style="display: flex; flex-wrap: wrap; gap: 18px; margin-bottom: 20px; justify-content: center;">
        <a href="${homeHref}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${chrome.home}</a>
        <a href="${getStaticHref('about')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${t.footerAbout || 'About'}</a>
        <a href="${getStaticHref('privacy')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${t.footerPrivacy || 'Privacy Policy'}</a>
        <a href="${getStaticHref('terms')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${t.footerTos || 'Terms of Service'}</a>
        <a href="${getStaticHref('pricing')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${t.footerPricing || 'Pricing'}</a>
        <a href="${getStaticHref('security')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${t.footerSecurity || 'Security'}</a>
        <a href="${getStaticHref('use-cases')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${t.footerUseCases || 'Use Cases'}</a>
        <a href="${getStaticHref('compare')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${t.footerCompare || 'Compare'}</a>
        <a href="${getStaticHref('languages')}" style="color: var(--seo-muted, #94a3b8); text-decoration: none; font-weight: 500;">${t.footerLanguages || 'Languages'}</a>
      </nav>
      <p style="margin: 0; text-align: center; font-size: 0.85rem; color: var(--seo-muted, #94a3b8);">${chrome.footerCopy}</p>
    </footer>
  `;
};

// Helper: Complete Categorized Tools Directory (Localized + Eliminates ALL Orphan Pages)
const buildAllToolsDirectory = (lang: string, isEn: boolean, currentToolId?: string): string => {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  const chrome = STATIC_CHROME_I18N[lang] || STATIC_CHROME_I18N['en'];
  const categories = [
    {
      name: t.pdfTools || 'PDF Organize & Edit',
      ids: [
        'merge-pdf', 'split-pdf', 'edit-pdf', 'sign-pdf', 'rotate-pdf', 'crop-pdf',
        'page-numbers', 'watermark-pdf', 'grayscale-pdf', 'reverse-pdf',
        'remove-pdf', 'resize-pdf', 'organize-pdf', 'redact-pdf',
        'protect-pdf', 'unlock-pdf', 'remove-pdf-metadata', 'edit-pdf-metadata',
        'scan-to-pdf', 'compare-pdf', 'repair-pdf'
      ]
    },
    {
      name: t.compressTools || 'PDF Compression & Optimization',
      ids: ['compress-pdf']
    },
    {
      name: t.officeTools || 'Convert Office & Data to/from PDF',
      ids: [
        'excel-to-pdf', 'ppt-to-pdf', 'txt-to-pdf',
        'pdf-to-word', 'pdf-to-ppt',
        'csv-to-excel', 'excel-to-csv'
      ]
    },
    {
      name: t.imageTools || 'Convert Images to/from PDF',
      ids: [
        'image-to-pdf', 'pdf-to-image', 'extract-images-pdf'
      ]
    },
    {
      name: t.ocrTools || 'OCR & Text Extraction',
      ids: ['ocr-pdf']
    }
  ];

  const listedIds = new Set(categories.flatMap(c => c.ids));
  const otherTools = TOOLS_CATALOG.filter(tItem => !listedIds.has(tItem.id));
  if (otherTools.length > 0) {
    categories.push({
      name: chrome.moreTools,
      ids: otherTools.map(tItem => tItem.id)
    });
  }

  const categoryBlocks = categories.map(cat => {
    const toolsInCat = cat.ids
      .map(id => TOOLS_CATALOG.find(tItem => tItem.id === id))
      .filter((tItem): tItem is typeof TOOLS_CATALOG[0] => Boolean(tItem));

    if (toolsInCat.length === 0) return '';

    const toolLinks = toolsInCat.map(tItem => {
      const slug = tItem.slugs[lang] || tItem.id;
      const href = isEn ? `/${slug}` : `/${lang}/${slug}`;
      const seo = getLocalizedSeo(tItem, lang);
      const isCurrent = tItem.id === currentToolId;
      return `
        <li style="margin-bottom: 6px;">
          <a href="${href}" style="color: ${isCurrent ? 'var(--seo-primary, #e11d48)' : 'var(--seo-text, #f8fafc)'}; font-weight: ${isCurrent ? '700' : '500'}; text-decoration: none; display: block; padding: 4px 0; font-size: 0.9rem;">
            ${seo.h1 || tItem.id}
          </a>
        </li>
      `;
    }).join('');

    return `
      <div style="background: var(--seo-card, #111520); padding: 24px; border-radius: 14px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
        <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--seo-text, #f8fafc); margin-top: 0; margin-bottom: 14px; border-bottom: 1px solid var(--seo-border, rgba(255,255,255,0.08)); padding-bottom: 8px;">
          ${cat.name}
        </h3>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem;">
          ${toolLinks}
        </ul>
      </div>
    `;
  }).join('');

  return `
    <section style="margin-top: 56px; padding-top: 36px; border-top: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
      <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 24px; text-align: center;">
        ${chrome.directoryTitle}
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
        ${categoryBlocks}
      </div>
    </section>
  `;
};

// Helper: Global Localized Editions Switcher (30 Languages Hub)
const buildLanguageSwitcher = (lang: string, pageType: 'tool' | 'home' | 'static', pageId?: string): string => {
  const chrome = STATIC_CHROME_I18N[lang] || STATIC_CHROME_I18N['en'];
  const links = SUPPORTED_LANGUAGES.map(l => {
    const isLEn = l.code === 'en';
    let href = isLEn ? '/' : `/${l.code}`;

    if (pageType === 'tool' && pageId) {
      const toolDef = TOOLS_CATALOG.find(t => t.id === pageId);
      if (toolDef) {
        const slug = toolDef.slugs[l.code] || toolDef.id;
        href = isLEn ? `/${slug}` : `/${l.code}/${slug}`;
      }
    } else if (pageType === 'static' && pageId) {
      const slug = STATIC_SLUGS[l.code]?.[pageId as StaticPageId] || STATIC_SLUGS['en']?.[pageId as StaticPageId] || pageId;
      href = isLEn ? `/${slug}` : `/${l.code}/${slug}`;
    }

    const isCurrent = l.code === lang;
    return `
      <a href="${href}" style="padding: 6px 10px; border-radius: 8px; background: ${isCurrent ? 'var(--seo-primary, #e11d48)' : 'var(--seo-card, #111520)'}; color: ${isCurrent ? '#ffffff' : 'var(--seo-text, #f8fafc)'}; border: 1px solid ${isCurrent ? 'transparent' : 'var(--seo-border, rgba(255,255,255,0.08))'}; text-decoration: none; font-size: 0.82rem; font-weight: 600;">
        ${l.nativeName}
      </a>
    `;
  }).join('');

  return `
    <nav aria-label="International Language Hubs" style="margin-top: 48px; padding: 24px; background: var(--seo-card, #111520); border-radius: 16px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
      <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--seo-text, #f8fafc); margin-top: 0; margin-bottom: 16px;">${chrome.langHubTitle}</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${links}
      </div>
    </nav>
  `;
};

// Generate HTML
const generateHtml = (lang: string, urlPath: string, seoTitle: string, seoDesc: string, pageType: 'tool' | 'home' | 'static', pageId?: string) => {
  let html = baseHtmlContent;
  const isEn = lang === 'en';
  const langInfo = getLanguageByCode(lang);
  const chrome = STATIC_CHROME_I18N[lang] || STATIC_CHROME_I18N['en'];
  const dirAttr = langInfo.dir === 'rtl' ? ' dir="rtl"' : '';

  // Replace lang attribute, RTL dir if needed, and preserve no-js class
  html = html.replace(/<html\b[^>]*>/i, `<html lang="${lang}"${dirAttr} class="no-js">`);

  // Remove existing title/meta/og/twitter/JSON-LD tags to avoid duplicates or mismatches
  html = html.replace(/<title>.*?<\/title>/gi, '');
  html = html.replace(/<meta name="title"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta name="description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta name="keywords"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta name="llm-context"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<link rel="canonical"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:title"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:url"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:locale"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:image[^"]*"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="twitter:title"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="twitter:description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="twitter:url"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta (property|name)="twitter:[^"]*"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n?\s*/g, '');
  html = html.replace(/<link rel="alternate" type="text\/markdown"[^>]*>\n?\s*/g, '');
  html = html.replace(/<link rel="service-doc"[^>]*>\n?\s*/g, '');
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?\s*/gi, '');

  const fullUrl = `${DOMAIN}${urlPath}`;
  const finalTitle = cleanMetaTitle(seoTitle);
  const finalDesc = cleanMetaDescription(seoDesc, lang);
  const escapedTitle = finalTitle.replace(/"/g, '&quot;');
  const escapedDesc = finalDesc.replace(/"/g, '&quot;');

  // Inject accurate tags matching canonical URL exactly (eliminates Open Graph & JSON-LD duplicates)
  const titleTag = `<title>${finalTitle}</title>`;
  const metaTitle = `<meta name="title" content="${escapedTitle}" />`;
  const metaDesc = `<meta name="description" content="${escapedDesc}" />`;
  const geoMeta = `<meta name="geo.region" content="${langInfo.geoRegion}" />\n    <meta name="geo.placename" content="${langInfo.geoPlacename}" />`;
  const llmMeta = `<meta name="llm-context" content="${isEn ? '/llms.txt' : `/llms-${lang}.txt`}" />`;
  const canonical = `<link rel="canonical" href="${fullUrl}" />`;
  const ogTitle = `<meta property="og:title" content="${escapedTitle}" />`;
  const ogDesc = `<meta property="og:description" content="${escapedDesc}" />`;
  const ogUrl = `<meta property="og:url" content="${fullUrl}" />`;
  const ogLocale = `<meta property="og:locale" content="${langInfo.localeCode}" />`;
  const ogImages = `<meta property="og:image" content="${DOMAIN}/og-image.png" />\n    <meta property="og:image:secure_url" content="${DOMAIN}/og-image.png" />\n    <meta property="og:image:type" content="image/png" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="${escapedTitle}" />`;
  const twitterCard = `<meta name="twitter:card" content="summary_large_image" />`;
  const twitterTitle = `<meta name="twitter:title" content="${escapedTitle}" />`;
  const twitterDesc = `<meta name="twitter:description" content="${escapedDesc}" />`;
  const twitterUrl = `<meta name="twitter:url" content="${fullUrl}" />`;
  const twitterImage = `<meta name="twitter:image" content="${DOMAIN}/og-image.png" />\n    <meta name="twitter:image:alt" content="${escapedTitle}" />`;
  const hreflangTags = buildHreflangTags(pageType, pageId);

  const headInjection = `
    ${titleTag}
    ${metaTitle}
    ${metaDesc}
    ${geoMeta}
    ${llmMeta}
    ${canonical}
    ${ogTitle}
    ${ogDesc}
    ${ogUrl}
    ${ogLocale}
    ${ogImages}
    ${twitterCard}
    ${twitterTitle}
    ${twitterDesc}
    ${twitterUrl}
    ${twitterImage}
    ${hreflangTags}
    <link rel="alternate" type="text/markdown" href="${DOMAIN}/llms.txt" title="LLM Knowledge Base" />
    <link rel="alternate" type="text/markdown" href="${DOMAIN}/llms-full.txt" title="LLM Architecture Guide" />
    <link rel="service-doc" href="${DOMAIN}/.well-known/agents.json" />
    <!-- JSON-LD-INJECTION -->
    <style id="static-seo-styles">
      :root {
        --seo-bg: #080a0f;
        --seo-card: #111520;
        --seo-card-hover: #161b29;
        --seo-border: rgba(255, 255, 255, 0.08);
        --seo-text: #f8fafc;
        --seo-muted: #94a3b8;
        --seo-primary: #e11d48;
      }
      html.light-theme,
      body.light-theme {
        --seo-bg: #f4f6fb;
        --seo-card: #ffffff;
        --seo-card-hover: #f8fafc;
        --seo-border: rgba(15, 23, 42, 0.08);
        --seo-text: #0f172a;
        --seo-muted: #475569;
        --seo-primary: #e11d48;
      }
      html, body {
        margin: 0;
        padding: 0;
        background-color: var(--seo-bg, #080a0f);
        color: var(--seo-text, #f8fafc);
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      #static-seo {
        display: block;
        width: 100%;
        background-color: var(--seo-bg, #080a0f);
        color: var(--seo-text, #f8fafc);
        box-sizing: border-box;
      }
      #static-seo h1 {
        font-size: clamp(1.8rem, 4vw, 3.5rem);
        line-height: 1.2;
        font-weight: 800;
        color: var(--seo-text, #f8fafc);
      }
      #static-seo h2 {
        font-size: clamp(2.2rem, 5vw, 3.5rem) !important;
        font-weight: 800;
        line-height: 1.25;
        color: var(--seo-text, #f8fafc);
      }
      #static-seo h3 {
        font-size: clamp(1.25rem, 3vw, 1.5rem) !important;
        font-weight: 700;
        line-height: 1.35;
        color: var(--seo-text, #f8fafc);
      }
      #static-seo p {
        font-size: clamp(1.05rem, 2vw, 1.25rem) !important;
        line-height: 1.75 !important;
        color: var(--seo-muted, #94a3b8);
      }
      #static-seo a {
        color: inherit;
        text-decoration: none;
        transition: color 0.15s ease;
      }
      #static-seo a:hover {
        color: var(--seo-primary, #e11d48);
      }
    </style>
  `;

  html = html.replace(/(<\/head>)/i, `${headInjection}$1`);

  // --- WHITE HAT SSG STATIC HTML INJECTION WITH RICH CRAWLABLE OUTLINKS ---
  const geo = UI_TRANSLATIONS[lang as keyof typeof UI_TRANSLATIONS] || UI_TRANSLATIONS['en'];
  let staticSeoHtml = '';

  if (pageType === 'tool' && pageId) {
    // 1. Tool Pages (100% Safe Pre-rendering of SeoRichSections + Internal Links)
    const exactPath = path.join(__dirname, '..', 'src', 'locales', 'seo', pageId, `${lang}.json`);
    const fallbackPath = path.join(__dirname, '..', 'src', 'locales', 'seo', pageId, `en.json`);

    let seoJson = null;
    if (fs.existsSync(exactPath)) {
      seoJson = JSON.parse(fs.readFileSync(exactPath, 'utf8'));
    } else if (fs.existsSync(fallbackPath)) {
      seoJson = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }

    if (seoJson) {
      const seoH1 = seoJson.h1 || seoJson.heroTitle || finalTitle;
      const seoSummary = seoJson.description || seoJson.heroDescription || finalDesc;
      const geoText = GEO_CITATIONS[lang] || GEO_CITATIONS['en'];
      let sectionsHtml = `
        <div style="margin: 32px 0; padding: 20px 24px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-left: 4px solid #10b981; border-radius: 12px; font-weight: 500; font-size: 0.95rem; line-height: 1.6; color: var(--seo-muted, #94a3b8);">
          <strong style="color: var(--seo-text, #f8fafc); display: block; margin-bottom: 4px;">${chrome.isoHeader}</strong>
          ${geoText}
        </div>
      `;

      sectionsHtml += (seoJson.sections || []).map((sec: any) => `
        <section style="margin-top: 56px;">
          <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 20px;">${sec.title || ''}</h2>
          ${sec.content ? `<p style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--seo-muted, #94a3b8); line-height: 1.75; margin-bottom: 24px;">${sec.content}</p>` : ''}
          ${sec.steps ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-top: 24px;">
              ${sec.steps.map((step: any, sIdx: number) => `
                <div style="background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 14px; padding: 24px;">
                  <div style="display: inline-block; padding: 2px 10px; background: rgba(225,29,72,0.12); color: var(--seo-primary, #e11d48); border-radius: 6px; font-size: 0.82rem; font-weight: 700; margin-bottom: 12px;">${chrome.step} ${sIdx + 1}</div>
                  <h3 style="font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 700; color: var(--seo-text, #f8fafc); margin: 0 0 10px;">${step.title}</h3>
                  <p style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--seo-muted, #94a3b8); line-height: 1.7; margin: 0;">${step.description}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </section>
      `).join('');

      const faqsHtml = (seoJson.faqs || []).map((faq: any) => `
        <div style="background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 12px; padding: 20px 24px; margin-bottom: 14px;">
          <h3 style="font-size: clamp(1.15rem, 2.5vw, 1.35rem); font-weight: 700; color: var(--seo-text, #f8fafc); margin: 0 0 10px;">${faq.q}</h3>
          <p style="font-size: 1rem; color: var(--seo-muted, #94a3b8); line-height: 1.7; margin: 0;">${faq.a}</p>
        </div>
      `).join('');

      // Single unified JSON-LD Schema (@graph)
      const schemaGraph: any[] = [
        {
          "@type": "WebApplication",
          "@id": `${fullUrl}/#webapp`,
          "url": fullUrl,
          "name": seoH1,
          "description": seoSummary,
          "applicationCategory": "UtilitiesApplication",
          "applicationSubCategory": "PDF & Document Conversion Utility",
          "operatingSystem": "All (Web Browser, Chrome, Firefox, Safari, Edge)",
          "browserRequirements": "Requires HTML5 and WebAssembly support",
          "isAccessibleForFree": true,
          "softwareVersion": "2.0.0",
          "creator": {
            "@type": "Organization",
            "name": "HandleMyFile",
            "url": DOMAIN
          },
          "publisher": {
            "@type": "Organization",
            "name": "HandleMyFile",
            "url": DOMAIN
          },
          "about": [
            "https://www.wikidata.org/wiki/Q28853",
            "https://www.wikidata.org/wiki/Q42332",
            "https://www.wikidata.org/wiki/Q7246237"
          ],
          "sameAs": [
            "https://github.com/codesbykhairannoor"
          ],
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free Starter plan included (no credit card required); optional PRO upgrade available",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${fullUrl}/#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": chrome.home,
              "item": isEn ? `${DOMAIN}/` : `${DOMAIN}/${lang}`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": seoH1,
              "item": fullUrl
            }
          ]
        }
      ];

      if (seoJson.sections && seoJson.sections.length > 0) {
        const howToSec = seoJson.sections.find((s: any) => s.steps && s.steps.length > 0);
        if (howToSec) {
          schemaGraph.push({
            "@type": "HowTo",
            "@id": `${fullUrl}/#howto`,
            "name": howToSec.title || seoH1,
            "description": howToSec.content || seoSummary,
            "step": howToSec.steps.map((step: any) => ({
              "@type": "HowToStep",
              "name": step.title,
              "text": step.description
            }))
          });
        }
      }

      if (seoJson.faqs && seoJson.faqs.length > 0) {
        schemaGraph.push({
          "@type": "FAQPage",
          "@id": `${fullUrl}/#faq`,
          "mainEntity": seoJson.faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        });
      }

      const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": schemaGraph
      }, null, 2)}\n</script>`;
      const seoDataScript = `<script id="__SEO_DATA__" type="application/json">${JSON.stringify(seoJson).replace(/</g, '\\u003c')}</script>`;

      html = html.replace('<!-- JSON-LD-INJECTION -->', `${jsonLdScript}\n    ${seoDataScript}`);

      staticSeoHtml = `
        <main id="static-seo" role="main" style="width: 100%; min-height: 100vh; background-color: var(--seo-bg, #080a0f); color: var(--seo-text, #f8fafc); box-sizing: border-box; overflow-x: hidden;">
          ${buildHeaderNavigation(lang, isEn)}
          <div style="max-width: 1200px; margin: 0 auto; padding: 40px 24px 60px;">
            <nav aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 0.9rem; color: var(--seo-muted, #94a3b8);">
              <a href="${isEn ? '/' : `/${lang}`}" style="color: var(--seo-primary, #e11d48); text-decoration: none; font-weight: 600;">${chrome.home}</a> &gt; 
              <span>${seoH1}</span>
            </nav>
            <article itemscope itemtype="https://schema.org/Article">
              <header style="text-align: center; max-width: 860px; margin: 0 auto 36px;">
                <h1 itemprop="headline" style="font-size: clamp(1.8rem, 4vw, 3.5rem); font-weight: 900; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 16px; color: var(--seo-text, #f8fafc);">
                  ${seoH1}
                </h1>
                <p itemprop="description" style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--seo-muted, #94a3b8); line-height: 1.7; margin: 0;">
                  ${seoSummary}
                </p>
              </header>

              <!-- Simulated Tool Dropzone Box -->
              <div style="max-width: 680px; margin: 32px auto 48px; padding: 48px 24px; background: var(--seo-card, #111520); border: 2px dashed var(--seo-border, rgba(255,255,255,0.12)); border-radius: 18px; text-align: center;">
                <div style="width: 56px; height: 56px; margin: 0 auto 16px; background: rgba(225, 29, 72, 0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--seo-primary, #e11d48);">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                </div>
                <p style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; color: var(--seo-text, #f8fafc);">${chrome.dropTitle}</p>
                <p style="font-size: 0.9rem; color: var(--seo-muted, #94a3b8); margin-bottom: 20px;">${chrome.dropSub}</p>
                <div style="display: inline-block; padding: 12px 28px; background: var(--seo-primary, #e11d48); color: #fff; font-weight: 700; border-radius: 10px; font-size: 0.95rem;">${seoJson.buttonText || chrome.dropBtn}</div>
              </div>

              ${sectionsHtml}
              ${(() => {
          const rt = RESEARCH_TRANSLATIONS[lang] || RESEARCH_TRANSLATIONS['en'];
          if (pageId.includes('redact')) {
            return `
                    <section style="margin-top: 56px; padding: 28px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px;">
                      <div style="display: inline-block; padding: 4px 12px; background: rgba(37,99,235,0.12); border-radius: 9999px; color: #60a5fa; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
                      <h3 style="font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 10px;">${rt.toolRedactResearchTitle}</h3>
                      <p style="color: var(--seo-muted, #94a3b8); line-height: 1.7; margin-bottom: 12px;">${rt.toolRedactResearchDesc}</p>
                      <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin: 0;"><strong style="color: var(--seo-text, #f8fafc);">${chrome.academicRef}:</strong> <cite>${rt.toolRedactResearchCite}</cite></p>
                    </section>
                  `;
          } else if (pageId.includes('ocr') || pageId.includes('scanned')) {
            return `
                    <section style="margin-top: 56px; padding: 28px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px;">
                      <div style="display: inline-block; padding: 4px 12px; background: rgba(37,99,235,0.12); border-radius: 9999px; color: #60a5fa; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
                      <h3 style="font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 10px;">${rt.toolOcrResearchTitle}</h3>
                      <p style="color: var(--seo-muted, #94a3b8); line-height: 1.7; margin-bottom: 12px;">${rt.toolOcrResearchDesc}</p>
                      <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin: 0;"><strong style="color: var(--seo-text, #f8fafc);">${chrome.academicRef}:</strong> <cite>${rt.toolOcrResearchCite}</cite></p>
                    </section>
                  `;
          } else if (pageId.includes('compress')) {
            return `
                    <section style="margin-top: 56px; padding: 28px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px;">
                      <div style="display: inline-block; padding: 4px 12px; background: rgba(37,99,235,0.12); border-radius: 9999px; color: #60a5fa; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
                      <h3 style="font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 10px;">${rt.toolCompressResearchTitle}</h3>
                      <p style="color: var(--seo-muted, #94a3b8); line-height: 1.7; margin-bottom: 12px;">${rt.toolCompressResearchDesc}</p>
                      <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin: 0;"><strong style="color: var(--seo-text, #f8fafc);">${chrome.academicRef}:</strong> <cite>${rt.toolCompressResearchCite}</cite></p>
                    </section>
                  `;
          } else if (pageId.includes('sign')) {
            return `
                    <section style="margin-top: 56px; padding: 28px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px;">
                      <div style="display: inline-block; padding: 4px 12px; background: rgba(37,99,235,0.12); border-radius: 9999px; color: #60a5fa; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
                      <h3 style="font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 10px;">${rt.toolSignResearchTitle}</h3>
                      <p style="color: var(--seo-muted, #94a3b8); line-height: 1.7; margin-bottom: 12px;">${rt.toolSignResearchDesc}</p>
                      <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin: 0;"><strong style="color: var(--seo-text, #f8fafc);">${chrome.academicRef}:</strong> <cite>${rt.toolSignResearchCite}</cite></p>
                    </section>
                  `;
          }
          return '';
        })()}
              ${faqsHtml ? `
                <section style="margin-top: 56px;">
                  <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 24px;">${seoJson.faqTitle || geo.homeGeoFaqTitle || chrome.commonFaqBadge}</h2>
                  ${faqsHtml}
                </section>
              ` : ''}
              ${buildAllToolsDirectory(lang, isEn, pageId)}
              ${buildLanguageSwitcher(lang, 'tool', pageId)}
            </article>
          </div>
          ${buildStaticFooter(lang, isEn)}
        </main>
      `;
    }
  } else if (pageType === 'home') {
    // 2. Home Page (100% Safe Pre-rendering of HomeSections + Localized FAQ Schema + Links to All Tools)
    const homeFaqItems = [
      { q: geo.homeGeoFaq1Q, a: geo.homeGeoFaq1A },
      { q: geo.homeGeoFaq2Q, a: geo.homeGeoFaq2A },
      { q: geo.homeGeoFaq3Q, a: geo.homeGeoFaq3A },
      { q: geo.homeGeoFaq4Q, a: geo.homeGeoFaq4A },
    ].filter(item => item.q && item.a);

    const schemaGraph: any[] = [
      {
        "@type": "WebApplication",
        "@id": `${fullUrl}/#webapp`,
        "url": fullUrl,
        "name": finalTitle,
        "description": finalDesc,
        "applicationCategory": "UtilitiesApplication",
        "applicationSubCategory": "PDF & Document Conversion Utility",
        "operatingSystem": "All (Web Browser, Chrome, Firefox, Safari, Edge)",
        "browserRequirements": "Requires HTML5 and WebAssembly support",
        "isAccessibleForFree": true,
        "softwareVersion": "2.0.0",
        "creator": {
          "@type": "Organization",
          "name": "HandleMyFile",
          "url": DOMAIN
        },
        "publisher": {
          "@type": "Organization",
          "name": "HandleMyFile",
          "url": DOMAIN
        },
        "about": [
          "https://www.wikidata.org/wiki/Q28853",
          "https://www.wikidata.org/wiki/Q42332",
          "https://www.wikidata.org/wiki/Q7246237"
        ],
        "sameAs": [
          "https://github.com/codesbykhairannoor"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free Starter plan included (no credit card required); optional PRO upgrade available",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Organization",
        "@id": `${DOMAIN}/#organization`,
        "name": "HandleMyFile",
        "url": DOMAIN,
        "logo": `${DOMAIN}/logo.png`,
        "sameAs": ["https://github.com/codesbykhairannoor"]
      }
    ];

    if (homeFaqItems.length > 0) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${fullUrl}/#faq`,
        "mainEntity": homeFaqItems.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      });
    }

    const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaGraph
    }, null, 2)}\n</script>`;

    html = html.replace('<!-- JSON-LD-INJECTION -->', jsonLdScript);

    const geoText = GEO_CITATIONS[lang] || GEO_CITATIONS['en'];
    const rt = RESEARCH_TRANSLATIONS[lang] || RESEARCH_TRANSLATIONS['en'];

    staticSeoHtml = `
      <main id="static-seo" role="main" style="width: 100%; min-height: 100vh; background-color: var(--seo-bg, #080a0f); color: var(--seo-text, #f8fafc); box-sizing: border-box; overflow-x: hidden;">
        ${buildHeaderNavigation(lang, isEn)}
        <div style="max-width: 1440px; margin: 0 auto; padding: 48px 24px 60px;">
          <article itemscope itemtype="https://schema.org/Article">
            <header style="text-align: center; max-width: 960px; margin: 0 auto 40px;">
              <h1 itemprop="headline" style="font-size: clamp(2.5rem, 5.2vw, 4.5rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.15; color: var(--seo-text, #f8fafc); margin: 0 auto 20px;">
                ${geo.homeHeroTitle || finalTitle}
              </h1>
              <p itemprop="description" style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--seo-muted, #94a3b8); line-height: 1.6; max-width: 780px; margin: 0 auto 32px; font-weight: 500;">
                ${geo.homeHeroSubtitle || finalDesc}
              </p>

              <!-- Simulated Search Box -->
              <div style="max-width: 600px; margin: 0 auto 32px; padding: 14px 20px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 9999px; display: flex; align-items: center; gap: 12px; color: var(--seo-muted, #94a3b8); font-size: 0.95rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span>${geo.searchPlaceholder || chrome.searchHint}</span>
              </div>

              <!-- ISO & Privacy Trust Banner -->
              <div style="padding: 16px 20px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-left: 4px solid #10b981; border-radius: 12px; text-align: left; font-size: 0.95rem; line-height: 1.6; color: var(--seo-muted, #94a3b8);">
                <strong style="color: var(--seo-text, #f8fafc); display: block; margin-bottom: 4px;">${chrome.isoHeader}</strong>
                ${geoText}
              </div>
            </header>

            <!-- Featured Tools Grid -->
            <section style="margin-top: 56px;">
              <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); text-align: center; margin-bottom: 32px;">
                ${chrome.popularTools}
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                ${TOOLS_CATALOG.slice(0, 20).map(tItem => {
      const slug = tItem.slugs[lang] || tItem.id;
      const href = isEn ? `/${slug}` : `/${lang}/${slug}`;
      const seo = getLocalizedSeo(tItem, lang);
      return `
                    <a href="${href}" style="display: block; padding: 22px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 14px; text-decoration: none;">
                      <div style="font-size: 0.75rem; font-weight: 700; color: var(--seo-primary, #e11d48); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">${tItem.category}</div>
                      <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--seo-text, #f8fafc); margin: 0 0 8px;">${seo.h1 || tItem.id}</h3>
                      <p style="font-size: 0.88rem; color: var(--seo-muted, #94a3b8); line-height: 1.5; margin: 0;">${seo.description.slice(0, 110)}</p>
                    </a>
                  `;
    }).join('')}
              </div>
            </section>

            <!-- Academic Grounding & Peer-Reviewed Research -->
            <section style="margin-top: 60px; padding: 48px 32px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 28px;">
              <div style="display: inline-block; padding: 4px 14px; background: rgba(225,29,72,0.1); border: 1px solid rgba(225,29,72,0.25); border-radius: 9999px; color: var(--seo-primary, #e11d48); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 16px;">${rt.researchBadge}</div>
              <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 900; color: var(--seo-text, #f8fafc); margin-bottom: 14px; line-height: 1.15;">${rt.researchHomeTitle}</h2>
              <p style="color: var(--seo-muted, #94a3b8); font-size: clamp(1.05rem, 2vw, 1.25rem); line-height: 1.7; margin-bottom: 36px; max-width: 860px;">${rt.researchHomeSub}</p>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                <div style="background: var(--seo-bg, #080a0f); padding: 28px 24px; border-radius: 18px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
                  <h3 style="font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 10px; line-height: 1.3;">${rt.homeCard1Title}</h3>
                  <p style="color: var(--seo-muted, #94a3b8); font-size: 0.96rem; line-height: 1.65; margin-bottom: 16px;">${rt.homeCard1Desc}</p>
                  <p style="font-size: 0.82rem; color: #64748b; margin: 0;"><strong style="color: var(--seo-text, #f8fafc); display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${chrome.academicRef}:</strong><cite>${rt.homeCard1Cite}</cite></p>
                </div>
                <div style="background: var(--seo-bg, #080a0f); padding: 28px 24px; border-radius: 18px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
                  <h3 style="font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 10px; line-height: 1.3;">${rt.homeCard2Title}</h3>
                  <p style="color: var(--seo-muted, #94a3b8); font-size: 0.96rem; line-height: 1.65; margin-bottom: 16px;">${rt.homeCard2Desc}</p>
                  <p style="font-size: 0.82rem; color: #64748b; margin: 0;"><strong style="color: var(--seo-text, #f8fafc); display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${chrome.scientificPaper}:</strong><cite>${rt.homeCard2Cite}</cite></p>
                </div>
                <div style="background: var(--seo-bg, #080a0f); padding: 28px 24px; border-radius: 18px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
                  <h3 style="font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin-bottom: 10px; line-height: 1.3;">${rt.homeCard3Title}</h3>
                  <p style="color: var(--seo-muted, #94a3b8); font-size: 0.96rem; line-height: 1.65; margin-bottom: 16px;">${rt.homeCard3Desc}</p>
                  <p style="font-size: 0.82rem; color: #64748b; margin: 0;"><strong style="color: var(--seo-text, #f8fafc); display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${chrome.industryStd}:</strong><cite>${rt.homeCard3Cite}</cite></p>
                </div>
              </div>
            </section>

            <!-- GEO Bento Grid: Definition & Trust -->
            <section style="margin-top: 60px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); gap: 24px;">
              <div style="background: var(--seo-card, #111520); padding: 36px 30px; border-radius: 24px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
                <div style="display: inline-block; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--seo-primary, #e11d48); margin-bottom: 12px;">${chrome.archBadge}</div>
                <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 900; color: var(--seo-text, #f8fafc); margin-bottom: 16px; line-height: 1.2;">${geo.homeGeoDefTitle}</h2>
                <p style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--seo-muted, #94a3b8); line-height: 1.75; margin: 0;">${geo.homeGeoDefDesc}</p>
              </div>

              <div style="background: var(--seo-card, #111520); padding: 36px 30px; border-radius: 24px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
                <div style="display: inline-block; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #10b981; margin-bottom: 12px;">${chrome.privacyBadge}</div>
                <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 900; color: var(--seo-text, #f8fafc); margin-bottom: 16px; line-height: 1.2;">${geo.homeGeoTrustTitle}</h2>
                <p style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--seo-muted, #94a3b8); line-height: 1.75; margin: 0;">${geo.homeGeoTrustDesc}</p>
              </div>
            </section>

            <!-- GEO 2-Column: Key Takeaways & FAQ -->
            <section style="margin-top: 60px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); gap: 36px; align-items: start;">
              <div>
                <div style="display: inline-block; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--seo-primary, #e11d48); margin-bottom: 12px;">${chrome.execSummaryBadge}</div>
                <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 900; color: var(--seo-text, #f8fafc); margin-bottom: 24px; line-height: 1.15;">${geo.homeGeoTakeawaysTitle}</h2>
                <div style="display: flex; flexDirection: column; gap: 14px;">
                  <div style="background: var(--seo-card, #111520); padding: 18px 20px; border-radius: 16px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); font-size: 1.05rem; font-weight: 600; color: var(--seo-text, #f8fafc); line-height: 1.5;">✓ ${geo.homeGeoTakeawaysItem1}</div>
                  <div style="background: var(--seo-card, #111520); padding: 18px 20px; border-radius: 16px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); font-size: 1.05rem; font-weight: 600; color: var(--seo-text, #f8fafc); line-height: 1.5;">✓ ${geo.homeGeoTakeawaysItem2}</div>
                  <div style="background: var(--seo-card, #111520); padding: 18px 20px; border-radius: 16px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); font-size: 1.05rem; font-weight: 600; color: var(--seo-text, #f8fafc); line-height: 1.5;">✓ ${geo.homeGeoTakeawaysItem3}</div>
                </div>
              </div>

              <div>
                <div style="display: inline-block; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #8b5cf6; margin-bottom: 12px;">${chrome.commonFaqBadge}</div>
                <h2 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 900; color: var(--seo-text, #f8fafc); margin-bottom: 24px; line-height: 1.15;">${geo.homeGeoFaqTitle}</h2>
                ${homeFaqItems.map(faq => `
                  <div style="background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px; padding: 20px 24px; margin-bottom: 14px;">
                    <h3 style="font-size: clamp(1.15rem, 2.5vw, 1.3rem); font-weight: 800; color: var(--seo-text, #f8fafc); margin: 0 0 10px; line-height: 1.4;">${faq.q}</h3>
                    <p style="font-size: 1rem; color: var(--seo-muted, #94a3b8); line-height: 1.7; margin: 0;">${faq.a}</p>
                  </div>
                `).join('')}
              </div>
            </section>

            ${buildAllToolsDirectory(lang, isEn)}
            ${buildLanguageSwitcher(lang, 'home')}
          </article>
        </div>
        ${buildStaticFooter(lang, isEn)}
      </main>
    `;
  } else if (pageType === 'static' && pageId) {
    // 3. Static Pages Content Injection with Breadcrumb and Footer
    const rt = RESEARCH_TRANSLATIONS[lang] || RESEARCH_TRANSLATIONS['en'];
    let pageHtml = '';
    if (pageId === 'about') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pageAboutHero || finalTitle}</h1><p itemprop="description">${geo.pageAboutSub || finalDesc}</p></header>
        <section><h2>${geo.pageAboutSec1Title || 'The Origin Story'}</h2><p>${geo.pageAboutSec1Desc || ''}</p></section>
        <section><h2>${geo.pageAboutSec2Title || 'Our Philosophy'}</h2><p>${geo.pageAboutSec2Desc || ''}</p></section>
        <section style="padding: 24px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px; margin: 24px 0;">
          <h2>${rt.aboutResearchTitle}</h2>
          <p style="color: var(--seo-muted, #94a3b8); font-weight: 500;">${rt.aboutResearchSub}</p>
          <p style="color: var(--seo-text, #f8fafc); line-height: 1.8;">${rt.aboutResearchText}</p>
        </section>
        <section><h2>${geo.pageAboutSec3Title || 'Zero-Cloud Processing'}</h2><p>${geo.pageAboutSec3Desc || ''}</p></section>
        ${geo.pageAboutSec4Title ? `<section><h2>${geo.pageAboutSec4Title}</h2><p>${geo.pageAboutSec4Desc || ''}</p></section>` : ''}
      `;
    } else if (pageId === 'privacy') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pagePrivacyHero || finalTitle}</h1><p itemprop="description">${geo.pagePrivacySub || finalDesc}</p></header>
        <section><h2>${geo.pagePrivacySec1Title || 'Zero Upload Architecture'}</h2><p>${geo.pagePrivacySec1Desc || ''}</p></section>
        <section style="padding: 24px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px; margin: 24px 0;">
          <h2>${rt.privacyResearchTitle}</h2>
          <p style="color: var(--seo-muted, #94a3b8); font-weight: 500;">${rt.privacyResearchSub}</p>
          <p style="color: var(--seo-text, #f8fafc); line-height: 1.8;">${rt.privacyResearchText}</p>
        </section>
        <section><h2>${geo.pagePrivacySec2Title || 'Local Processing Guarantee'}</h2><p>${geo.pagePrivacySec2Desc || ''}</p></section>
        <section><h2>${geo.pagePrivacySec3Title || 'Analytics & Cookies'}</h2><p>${geo.pagePrivacySec3Desc || ''}</p></section>
        ${geo.pagePrivacySec4Title ? `<section><h2>${geo.pagePrivacySec4Title}</h2><p>${geo.pagePrivacySec4Desc || ''}</p></section>` : ''}
      `;
    } else if (pageId === 'terms') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pageTosHero || finalTitle}</h1><p itemprop="description">${geo.pageTosSub || finalDesc}</p></header>
        <section><h2>${geo.pageTosSec1Title || 'Agreement to Terms'}</h2><p>${geo.pageTosSec1Desc || ''}</p></section>
        <section><h2>${geo.pageTosSec2Title || 'Permitted Use'}</h2><p>${geo.pageTosSec2Desc || ''}</p></section>
        <section><h2>${geo.pageTosSec3Title || 'Disclaimer of Warranties'}</h2><p>${geo.pageTosSec3Desc || ''}</p></section>
        ${geo.pageTosSec4Title ? `<section><h2>${geo.pageTosSec4Title}</h2><p>${geo.pageTosSec4Desc || ''}</p></section>` : ''}
      `;
    } else if (pageId === 'security') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pageSecurityHero || finalTitle}</h1><p itemprop="description">${geo.pageSecurityHeroSub || finalDesc}</p></header>
        <section><h2>${geo.pageSecuritySec2Title || 'WebAssembly Revolution'}</h2><p>${geo.pageSecuritySec2Desc || ''}</p></section>
        <section style="padding: 24px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px; margin: 24px 0;">
          <h2>${rt.securityResearchTitle}</h2>
          <p style="color: var(--seo-muted, #94a3b8); font-weight: 500;">${rt.securityResearchSub}</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 16px;">
            <div style="background: var(--seo-card-inner, rgba(255,255,255,0.03)); padding: 16px; border-radius: 8px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
              <h3 style="font-size: 1.1rem; margin-bottom: 6px;">${rt.securityCard1Title}</h3>
              <p style="font-size: 0.9rem; color: var(--seo-text, #f8fafc); margin-bottom: 8px;">${rt.securityCard1Desc}</p>
              <p style="font-size: 0.8rem; color: var(--seo-muted, #94a3b8); font-style: italic; margin: 0;"><cite>${rt.securityCard1Cite}</cite></p>
            </div>
            <div style="background: var(--seo-card-inner, rgba(255,255,255,0.03)); padding: 16px; border-radius: 8px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
              <h3 style="font-size: 1.1rem; margin-bottom: 6px;">${rt.securityCard2Title}</h3>
              <p style="font-size: 0.9rem; color: var(--seo-text, #f8fafc); margin-bottom: 8px;">${rt.securityCard2Desc}</p>
              <p style="font-size: 0.8rem; color: var(--seo-muted, #94a3b8); font-style: italic; margin: 0;"><cite>${rt.securityCard2Cite}</cite></p>
            </div>
            <div style="background: var(--seo-card-inner, rgba(255,255,255,0.03)); padding: 16px; border-radius: 8px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
              <h3 style="font-size: 1.1rem; margin-bottom: 6px;">${rt.securityCard3Title}</h3>
              <p style="font-size: 0.9rem; color: var(--seo-text, #f8fafc); margin-bottom: 8px;">${rt.securityCard3Desc}</p>
              <p style="font-size: 0.8rem; color: var(--seo-muted, #94a3b8); font-style: italic; margin: 0;"><cite>${rt.securityCard3Cite}</cite></p>
            </div>
          </div>
        </section>
        <section><h2>${geo.pageSecuritySec3Title || 'Your Documents Are Blind To Us'}</h2><p>${geo.pageSecuritySec3Desc || ''}</p></section>
        <section><h2>${geo.pageSecuritySec4Title || 'Compliance by Default'}</h2><p>${geo.pageSecuritySec4Desc || ''}</p></section>
        <section><h2>${geo.pageSecuritySec5Title || 'Verify It'}</h2><p>${geo.pageSecuritySec5Desc || ''}</p></section>
        ${geo.pageSecuritySec6Title ? `<section><h2>${geo.pageSecuritySec6Title}</h2><p>${geo.pageSecuritySec6Desc || ''}</p></section>` : ''}
      `;
    } else if (pageId === 'pricing') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pagePricingHero || finalTitle}</h1><p itemprop="description">${geo.pagePricingHeroSub || finalDesc}</p></header>
        <section><h2>${geo.pagePricingSec3Title || 'How is this possible?'}</h2><p>${geo.pagePricingSec3Desc || ''}</p></section>
        <section><h2>${geo.pagePricingSec4Title || 'Sustainable & Transparent'}</h2><p>${geo.pagePricingSec4Desc || ''}</p></section>
        <section><h2>${geo.pagePricingSec5Title || 'Free for Business Use'}</h2><p>${geo.pagePricingSec5Desc || ''}</p></section>
        ${geo.pagePricingSec6Title ? `<section><h2>${geo.pagePricingSec6Title}</h2><p>${geo.pagePricingSec6Desc || ''}</p></section>` : ''}
      `;
    } else if (pageId === 'use-cases') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pageUseCasesHero || finalTitle}</h1><p itemprop="description">${geo.pageUseCasesHeroSub || finalDesc}</p></header>
        <section><h2>${geo.pageUseCasesSec2Title || 'Legal Teams'}</h2><p>${geo.pageUseCasesSec2Desc || ''}</p></section>
        <section><h2>${geo.pageUseCasesSec3Title || 'HR Professionals'}</h2><p>${geo.pageUseCasesSec3Desc || ''}</p></section>
        <section><h2>${geo.pageUseCasesSec4Title || 'Students'}</h2><p>${geo.pageUseCasesSec4Desc || ''}</p></section>
        <section><h2>${geo.pageUseCasesSec5Title || 'Real Estate'}</h2><p>${geo.pageUseCasesSec5Desc || ''}</p></section>
        <section><h2>${geo.pageUseCasesSec6Title || 'Find Your Own'}</h2><p>${geo.pageUseCasesSec6Desc || ''}</p></section>
      `;
    } else if (pageId === 'compare') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pageCompareHero || finalTitle}</h1><p itemprop="description">${geo.pageCompareHeroSub || finalDesc}</p></header>
        <section style="padding: 24px; background: var(--seo-card, #111520); border: 1px solid var(--seo-border, rgba(255,255,255,0.08)); border-radius: 16px; margin: 24px 0;">
          <h2>${rt.compareResearchTitle}</h2>
          <p style="color: var(--seo-muted, #94a3b8); font-weight: 500;">${rt.compareResearchSub}</p>
          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div style="background: var(--seo-card-inner, rgba(255,255,255,0.03)); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
              <h3 style="font-size: 1rem; margin-bottom: 4px;">${rt.comparePoint1Title}</h3>
              <p style="font-size: 0.9rem; color: var(--seo-text, #f8fafc); margin: 0;">${rt.comparePoint1Desc}</p>
            </div>
            <div style="background: var(--seo-card-inner, rgba(255,255,255,0.03)); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
              <h3 style="font-size: 1rem; margin-bottom: 4px;">${rt.comparePoint2Title}</h3>
              <p style="font-size: 0.9rem; color: var(--seo-text, #f8fafc); margin: 0;">${rt.comparePoint2Desc}</p>
            </div>
            <div style="background: var(--seo-card-inner, rgba(255,255,255,0.03)); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--seo-border, rgba(255,255,255,0.08));">
              <h3 style="font-size: 1rem; margin-bottom: 4px;">${rt.comparePoint3Title}</h3>
              <p style="font-size: 0.9rem; color: var(--seo-text, #f8fafc); margin: 0;">${rt.comparePoint3Desc}</p>
            </div>
          </div>
        </section>
        <section><h2>${geo.pageCompareSec3Title || 'Network Speed vs Disk Speed'}</h2><p>${geo.pageCompareSec3Desc || ''}</p></section>
        <section><h2>${geo.pageCompareSec5Title || 'Upload Limits vs Unlimited Processing'}</h2><p>${geo.pageCompareSec5Desc || ''}</p></section>
      `;
    } else if (pageId === 'languages') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pageLangHero || finalTitle}</h1><p itemprop="description">${geo.pageLangHeroSub || finalDesc}</p></header>
        <section><h2>${geo.pageLangSec3Title || 'Native Feel'}</h2><p>${geo.pageLangSec3Desc || ''}</p></section>
        <section><h2>${geo.pageLangSec4Title || 'Global Performance'}</h2><p>${geo.pageLangSec4Desc || ''}</p></section>
        ${geo.pageLangSec5Title ? `<section><h2>${geo.pageLangSec5Title}</h2><p>${geo.pageLangSec5Desc || ''}</p></section>` : ''}
        <section style="margin-top: 32px;">
          <h2>${geo.footerLanguages || chrome.langHubTitle}</h2>
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; list-style: none; padding: 0; margin-top: 16px;">
            ${SUPPORTED_LANGUAGES.map(l => `<li><a href="${l.code === 'en' ? '/' : `/${l.code}`}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${l.nativeName}</a></li>`).join('')}
          </ul>
        </section>
      `;
    }

    // Unified Schema for Static Pages
    const schemaGraph: any[] = [
      {
        "@type": "WebPage",
        "@id": `${fullUrl}/#webpage`,
        "url": fullUrl,
        "name": finalTitle,
        "description": finalDesc
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${fullUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": chrome.home,
            "item": isEn ? `${DOMAIN}/` : `${DOMAIN}/${lang}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": finalTitle,
            "item": fullUrl
          }
        ]
      }
    ];

    const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaGraph
    }, null, 2)}\n</script>`;

    html = html.replace('<!-- JSON-LD-INJECTION -->', jsonLdScript);

    const geoText = GEO_CITATIONS[lang] || GEO_CITATIONS['en'];

    staticSeoHtml = `
      <main id="static-seo" role="main" style="width: 100%; min-height: 100vh; background-color: var(--seo-bg, #080a0f); color: var(--seo-text, #f8fafc); box-sizing: border-box; overflow-x: hidden;">
        ${buildHeaderNavigation(lang, isEn)}
        <div style="max-width: 1100px; margin: 0 auto; padding: 32px 24px 60px;">
          <nav aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 0.9rem; color: var(--seo-muted, #94a3b8);">
            <a href="${isEn ? '/' : `/${lang}`}" style="color: #3b82f6; text-decoration: none;">${chrome.home}</a> &gt; 
            <span>${finalTitle}</span>
          </nav>
          <div style="margin-bottom: 28px; padding: 16px 20px; background: rgba(34, 197, 94, 0.08); border-left: 4px solid #22c55e; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: var(--seo-text, #f8fafc);">
            ${geoText}
          </div>
          <article itemscope itemtype="https://schema.org/Article" style="line-height: 1.8; color: var(--seo-text, #f8fafc);">
            ${pageHtml}
          </article>
          ${buildAllToolsDirectory(lang, isEn)}
          ${buildLanguageSwitcher(lang, 'static', pageId)}
        </div>
        ${buildStaticFooter(lang, isEn)}
      </main>
    `;
  }

  if (staticSeoHtml) {
    html = html.replace(/<div id="root"><\/div>/, `<div id="root">${staticSeoHtml}</div>`);
  }

  // Clean up any unused JSON-LD injection placeholders
  html = html.replace(/<!-- JSON-LD-INJECTION -->/g, '');

  return html;
};

const run = async () => {
  for (const lang of LANGS) {
    const isEn = lang === 'en';
    const homeTrans = UI_TRANSLATIONS[lang] ?? UI_TRANSLATIONS['en'];
    const homeTitle = `HandleMyFile | ${homeTrans.homeHeroTitle || 'All Document Tools in One Place'}`;
    // English home → dist/index.html (already generated at bottom), skip here
    if (!isEn) {
      const homeSubtitle = homeTrans.homeHeroSubtitle || 'Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly.';
      const homeHtml = generateHtml(
        lang,
        `/${lang}`,
        homeTitle,
        homeSubtitle,
        'home'
      );
      writeFileSafe(path.join(distDir, lang, 'index.html'), homeHtml);
    }

    // 2. Static Pages
    const staticPages: StaticPageId[] = ['about', 'privacy', 'terms', 'pricing', 'security', 'use-cases', 'compare', 'languages'];
    for (const page of staticPages) {
      let pageTitle = `${page.toUpperCase()} | HandleMyFile`;
      let pageDesc = `Read more about HandleMyFile ${page}.`;
      const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];

      switch (page) {
        case 'about': pageTitle = `${t.footerAbout || 'About Us'} - HandleMyFile`; pageDesc = t.pageAboutSub || 'Democratizing Document Tools'; break;
        case 'privacy': pageTitle = `${t.footerPrivacy || 'Privacy Policy'} - HandleMyFile`; pageDesc = t.pagePrivacySub || 'Data Handling Matrix'; break;
        case 'terms': pageTitle = `${t.footerTos || 'Terms of Service'} - HandleMyFile`; pageDesc = t.pageTosSub || 'The Sleek Ledger'; break;
        case 'pricing': pageTitle = `${t.footerPricing || 'Pricing'} - HandleMyFile`; pageDesc = t.pagePricingHeroSub || 'Enterprise-grade document tools'; break;
        case 'security': pageTitle = `${t.footerSecurity || 'Security & Trust'} - HandleMyFile`; pageDesc = t.pageSecurityHeroSub || 'Bank-grade security'; break;
        case 'use-cases': pageTitle = `${t.footerUseCases || 'Use Cases'} - HandleMyFile`; pageDesc = t.pageUseCasesHeroSub || 'See how professionals use our offline document tools.'; break;
        case 'compare': pageTitle = `${t.footerCompare || 'Compare'} - HandleMyFile`; pageDesc = t.pageCompareHeroSub || 'Tired of waiting for files to upload?'; break;
        case 'languages': pageTitle = `${t.footerLanguages || 'Supported Languages'} - HandleMyFile`; pageDesc = t.pageLangHeroSub || 'Document utilities should be accessible'; break;
      }

      const localSlug = STATIC_SLUGS[lang]?.[page] || STATIC_SLUGS['en']?.[page] || page;

      // English: no /en/ prefix — serve at root /about, /pricing, etc.
      const urlPath = isEn ? `/${localSlug}` : `/${lang}/${localSlug}`;
      const outPath = isEn
        ? path.join(distDir, localSlug, 'index.html')
        : path.join(distDir, lang, localSlug, 'index.html');

      const pageHtml = generateHtml(lang, urlPath, pageTitle, pageDesc, 'static', page);
      writeFileSafe(outPath, pageHtml);
    }

    // 3. Tool Pages
    for (const tool of TOOLS_CATALOG) {
      const localSlug = tool.slugs[lang] || tool.id;
      const seoData = getLocalizedSeo(tool, lang);

      // English: no /en/ prefix — serve at root /compress-pdf, /merge-pdf, etc.
      const urlPath = isEn ? `/${localSlug}` : `/${lang}/${localSlug}`;
      const outPath = isEn
        ? path.join(distDir, localSlug, 'index.html')
        : path.join(distDir, lang, localSlug, 'index.html');

      const toolHtml = generateHtml(lang, urlPath, `${seoData.title} | HandleMyFile`, seoData.description, 'tool', tool.id);
      writeFileSafe(outPath, toolHtml);
    }
  }

  // Generate a root index.html that acts as English homepage and x-default
  const rootHtml = generateHtml(
    'en',
    `/`,
    'HandleMyFile | Every Document Tool. 100% Private.',
    'Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly.',
    'home'
  );
  writeFileSafe(path.join(distDir, 'index.html'), rootHtml);

  // 4. Generate Legacy Redirect Alias Pages to prevent any 404 from obsolete slugs & GSC historical URLs
  let redirectCount = 0;

  // Helper to safely write a redirect file (marked noindex, follow to preserve crawl budget)
  const createRedirectFile = (urlPath: string, targetUrl: string, langCode: string = 'en') => {
    const cleanPath = urlPath.replace(/^\//, '').replace(/\/$/, '');
    if (!cleanPath) return;
    const targetFile = path.join(distDir, cleanPath, 'index.html');
    if (!fs.existsSync(targetFile)) {
      const redirectHtml = `<!DOCTYPE html>
<html lang="${langCode}">
<head>
  <meta charset="UTF-8">
  <title>Redirecting...</title>
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="${DOMAIN}${targetUrl}" />
  <meta http-equiv="refresh" content="0; url=${DOMAIN}${targetUrl}" />
  <script>window.location.replace("${DOMAIN}${targetUrl}");</script>
</head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
  <p>Redirecting to <a href="${DOMAIN}${targetUrl}">${DOMAIN}${targetUrl}</a>...</p>
</body>
</html>`;
      writeFileSafe(targetFile, redirectHtml);
      redirectCount++;
    }
  };

  // A. Generate redirects for all GSC 404 URLs + retired pSEO clone URLs
  for (const mapFile of ['404-redirect-map.json', 'removed-pseo-redirects.json']) {
    const mapPath = path.join(__dirname, mapFile);
    if (fs.existsSync(mapPath)) {
      const urlMap: Record<string, string> = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
      for (const [sourceUrl, targetUrl] of Object.entries(urlMap)) {
        const langMatch = sourceUrl.match(/^\/([a-z]{2})\//);
        const lang = langMatch ? langMatch[1] : 'en';
        createRedirectFile(sourceUrl, targetUrl, lang);
      }
    }
  }

  // B. Generate English static slugs redirects under foreign language prefixes (e.g. /id/security -> /id/keamanan)
  const staticPageKeys: StaticPageId[] = ['about', 'privacy', 'terms', 'pricing', 'security', 'use-cases', 'compare', 'languages'];
  for (const lang of LANGS) {
    if (lang === 'en') continue;
    for (const pageKey of staticPageKeys) {
      const localSlug = STATIC_SLUGS[lang]?.[pageKey] || STATIC_SLUGS['en']?.[pageKey] || pageKey;
      const targetUrl = `/${lang}/${localSlug}`;
      createRedirectFile(`/${lang}/${pageKey}`, targetUrl, lang);
    }
  }

  // C. Generate English tool IDs redirects under foreign language prefixes (e.g. /id/merge-pdf -> /id/gabungkan-pdf)
  for (const lang of LANGS) {
    if (lang === 'en') continue;
    for (const tool of TOOLS_CATALOG) {
      const localSlug = tool.slugs[lang] || tool.id;
      const targetUrl = `/${lang}/${localSlug}`;
      createRedirectFile(`/${lang}/${tool.id}`, targetUrl, lang);
    }
  }

  // D. Generate /en/* redirects to root /* (e.g. /en/edit-pdf -> /edit-pdf)
  for (const tool of TOOLS_CATALOG) {
    const enSlug = tool.slugs['en'] || tool.id;
    createRedirectFile(`/en/${enSlug}`, `/${enSlug}`, 'en');
    createRedirectFile(`/en/${tool.id}`, `/${enSlug}`, 'en');
  }
  for (const pageKey of staticPageKeys) {
    const enSlug = STATIC_SLUGS['en']?.[pageKey] || pageKey;
    createRedirectFile(`/en/${enSlug}`, `/${enSlug}`, 'en');
    createRedirectFile(`/en/${pageKey}`, `/${enSlug}`, 'en');
  }

  // E. Obsolete toolSlugs mapping from history
  for (const [toolKey, slugMap] of Object.entries(toolSlugs)) {
    const toolDef = TOOLS_CATALOG.find(t => t.id === toolKey) || TOOLS_CATALOG.find(t => toolKey === 'remove-pdf' && t.id === 'remove-pages-pdf') || TOOLS_CATALOG.find(t => t.id.startsWith(toolKey));
    for (const lang of LANGS) {
      const isEn = lang === 'en';
      const legacySlug = slugMap[lang];
      if (!legacySlug) continue;

      if (!toolDef) {
        const targetUrl = isEn ? '/' : `/${lang}`;
        createRedirectFile(isEn ? `/${legacySlug}` : `/${lang}/${legacySlug}`, targetUrl, lang);
      } else {
        const currentSlug = toolDef.slugs[lang] || toolDef.id;
        if (legacySlug !== currentSlug) {
          const targetUrl = isEn ? `/${currentSlug}` : `/${lang}/${currentSlug}`;
          createRedirectFile(isEn ? `/${legacySlug}` : `/${lang}/${legacySlug}`, targetUrl, lang);
        }
      }
    }
  }

  // Explicit alias for /remove-pages
  createRedirectFile('/remove-pages', '/remove-pages-pdf', 'en');

  console.log(`Generated ${redirectCount} legacy alias redirects to prevent 404s!`);
  console.log(`Successfully generated ${generatedCount} static HTML files!`);
};

run().catch(console.error);
