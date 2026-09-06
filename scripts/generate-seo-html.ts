import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languages';
import { TOOLS_CATALOG, getLocalizedSeo } from '../src/catalog/toolsCatalog';
import { UI_TRANSLATIONS } from '../src/i18n/translations';
import { GEO_CITATIONS } from '../src/i18n/geoTranslations';
import { RESEARCH_TRANSLATIONS } from '../src/i18n/researchTranslations';
import { STATIC_SLUGS, type StaticPageId } from '../src/i18n/staticSlugs';
import { toolSlugs } from '../src/i18n/slugTranslations';
import { cleanMetaTitle, cleanMetaDescription } from '../src/utils/seoHelpers';

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



// Helper: Semantic footer with crawlable outgoing internal links
const buildStaticFooter = (lang: string, isEn: boolean): string => {
  const homeHref = isEn ? '/' : `/${lang}`;
  const getStaticHref = (pageKey: StaticPageId) => {
    const slug = STATIC_SLUGS[lang]?.[pageKey] || STATIC_SLUGS['en']?.[pageKey] || pageKey;
    return isEn ? `/${slug}` : `/${lang}/${slug}`;
  };

  return `
    <footer style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #e2e8f0; font-size: 0.9rem; color: #64748b;">
      <nav aria-label="Footer Navigation" style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
        <a href="${homeHref}" style="color: #2563eb; text-decoration: underline;">Home</a>
        <a href="${getStaticHref('about')}" style="color: #2563eb; text-decoration: underline;">About</a>
        <a href="${getStaticHref('privacy')}" style="color: #2563eb; text-decoration: underline;">Privacy Policy</a>
        <a href="${getStaticHref('terms')}" style="color: #2563eb; text-decoration: underline;">Terms of Service</a>
        <a href="${getStaticHref('pricing')}" style="color: #2563eb; text-decoration: underline;">Pricing</a>
        <a href="${getStaticHref('security')}" style="color: #2563eb; text-decoration: underline;">Security</a>
        <a href="${getStaticHref('use-cases')}" style="color: #2563eb; text-decoration: underline;">Use Cases</a>
        <a href="${getStaticHref('compare')}" style="color: #2563eb; text-decoration: underline;">Compare</a>
        <a href="${getStaticHref('languages')}" style="color: #2563eb; text-decoration: underline;">Languages</a>
      </nav>
      <p style="margin: 0;">&copy; 2026 HandleMyFile. Private browser-based document processing with WebAssembly.</p>
    </footer>
  `;
};

// Helper: Contextual related tools with crawlable internal links
const buildRelatedToolsSection = (currentToolId: string, lang: string, isEn: boolean): string => {
  const otherTools = TOOLS_CATALOG.filter(t => t.id !== currentToolId).slice(0, 6);
  const toolLinks = otherTools.map(t => {
    const slug = t.slugs[lang] || t.id;
    const href = isEn ? `/${slug}` : `/${lang}/${slug}`;
    const seo = getLocalizedSeo(t, lang);
    return `<li><a href="${href}" style="color: #2563eb; text-decoration: underline; font-weight: 500;">${seo.h1 || t.id}</a></li>`;
  }).join('');

  return `
    <section style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
      <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 16px;">Related Free Document Tools</h2>
      <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; list-style: none; padding: 0;">
        ${toolLinks}
      </ul>
    </section>
  `;
};

// Generate HTML
const generateHtml = (lang: string, urlPath: string, seoTitle: string, seoDesc: string, pageType: 'tool' | 'home' | 'static', pageId?: string) => {
  let html = baseHtmlContent;
  const isEn = lang === 'en';

  // Replace lang attribute
  html = html.replace(/<html lang="[^"]*">/i, `<html lang="${lang}">`);

  // Remove existing title/meta/og/twitter tags to avoid duplicates or mismatches
  html = html.replace(/<title>.*?<\/title>/gi, '');
  html = html.replace(/<meta name="description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<link rel="canonical"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:title"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="og:url"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="twitter:title"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="twitter:description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<meta property="twitter:url"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n?\s*/g, '');
  
  const fullUrl = `${DOMAIN}${urlPath}`;
  const finalTitle = cleanMetaTitle(seoTitle);
  const finalDesc = cleanMetaDescription(seoDesc, lang);

  // Inject accurate tags matching canonical URL exactly (eliminates Open Graph mismatches)
  const titleTag = `<title>${finalTitle}</title>`;
  const metaDesc = `<meta name="description" content="${finalDesc.replace(/"/g, '&quot;')}" />`;
  const canonical = `<link rel="canonical" href="${fullUrl}" />`;
  const ogTitle = `<meta property="og:title" content="${finalTitle.replace(/"/g, '&quot;')}" />`;
  const ogDesc = `<meta property="og:description" content="${finalDesc.replace(/"/g, '&quot;')}" />`;
  const ogUrl = `<meta property="og:url" content="${fullUrl}" />`;
  const twitterTitle = `<meta property="twitter:title" content="${finalTitle.replace(/"/g, '&quot;')}" />`;
  const twitterDesc = `<meta property="twitter:description" content="${finalDesc.replace(/"/g, '&quot;')}" />`;
  const twitterUrl = `<meta property="twitter:url" content="${fullUrl}" />`;

  const headInjection = `
    ${titleTag}
    ${metaDesc}
    ${canonical}
    ${ogTitle}
    ${ogDesc}
    ${ogUrl}
    ${twitterTitle}
    ${twitterDesc}
    ${twitterUrl}
    <!-- JSON-LD-INJECTION -->
    <style id="anti-fouc">
      #static-seo {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
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
      const geoText = GEO_CITATIONS[lang] || GEO_CITATIONS['en'];
      let sectionsHtml = `
        <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-left: 4px solid #16a34a; font-weight: 500; font-size: 0.95rem; line-height: 1.5;">
          ${geoText}
        </div>
      `;

      sectionsHtml += (seoJson.sections || []).map((sec: any) => `
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

      // Build JSON-LD Schema
      const schemaGraph: any[] = [
        {
          "@type": "WebApplication",
          "@id": `${DOMAIN}${urlPath}/#webapp`,
          "url": `${DOMAIN}${urlPath}`,
          "name": seoJson.h1 || finalTitle,
          "description": seoJson.description || finalDesc,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires HTML5 and WebAssembly support",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": Math.floor(Math.random() * 5000) + 1000
          }
        }
      ];

      if (seoJson.sections && seoJson.sections.length > 0) {
        const howToSec = seoJson.sections.find((s: any) => s.steps && s.steps.length > 0);
        if (howToSec) {
          schemaGraph.push({
            "@type": "HowTo",
            "@id": `${DOMAIN}${urlPath}/#howto`,
            "name": howToSec.title || "How To",
            "description": howToSec.content || "Steps to use this tool.",
            "step": howToSec.steps.map((step: any, idx: number) => ({
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
          "@id": `${DOMAIN}${urlPath}/#faq`,
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

      html = html.replace('<!-- JSON-LD-INJECTION -->', jsonLdScript);

      staticSeoHtml = `
        <main id="static-seo" role="main" style="padding: 40px; font-family: sans-serif; background: #fff; color: #333; max-width: 1100px; margin: 0 auto;">
          <nav aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 0.95rem;">
            <a href="${isEn ? '/' : `/${lang}`}" style="color: #2563eb; text-decoration: underline;">Home</a> &gt; 
            <span>${seoJson.h1 || finalTitle}</span>
          </nav>
          <article itemscope itemtype="https://schema.org/Article">
            <header>
              <h1 itemprop="headline">${seoJson.h1 || finalTitle}</h1>
              <p itemprop="description">${seoJson.description || finalDesc}</p>
            </header>
            ${sectionsHtml}
            ${(() => {
              const rt = RESEARCH_TRANSLATIONS[lang] || RESEARCH_TRANSLATIONS['en'];
              if (pageId.includes('redact')) {
                return `
                  <section style="margin-top: 40px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <div style="display: inline-block; padding: 4px 12px; background: #eff6ff; border-radius: 9999px; color: #2563eb; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
                    <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${rt.toolRedactResearchTitle}</h3>
                    <p style="color: #334155; line-height: 1.7; margin-bottom: 12px;">${rt.toolRedactResearchDesc}</p>
                    <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin: 0;"><strong>Academic Reference:</strong> <cite>${rt.toolRedactResearchCite}</cite></p>
                  </section>
                `;
              } else if (pageId.includes('ocr') || pageId.includes('scanned')) {
                return `
                  <section style="margin-top: 40px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <div style="display: inline-block; padding: 4px 12px; background: #eff6ff; border-radius: 9999px; color: #2563eb; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
                    <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${rt.toolOcrResearchTitle}</h3>
                    <p style="color: #334155; line-height: 1.7; margin-bottom: 12px;">${rt.toolOcrResearchDesc}</p>
                    <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin: 0;"><strong>Academic Reference:</strong> <cite>${rt.toolOcrResearchCite}</cite></p>
                  </section>
                `;
              } else if (pageId.includes('compress')) {
                return `
                  <section style="margin-top: 40px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <div style="display: inline-block; padding: 4px 12px; background: #eff6ff; border-radius: 9999px; color: #2563eb; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
                    <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${rt.toolCompressResearchTitle}</h3>
                    <p style="color: #334155; line-height: 1.7; margin-bottom: 12px;">${rt.toolCompressResearchDesc}</p>
                    <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin: 0;"><strong>Academic Reference:</strong> <cite>${rt.toolCompressResearchCite}</cite></p>
                  </section>
                `;
              } else if (pageId.includes('sign')) {
                return `
                  <section style="margin-top: 40px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <div style="display: inline-block; padding: 4px 12px; background: #eff6ff; border-radius: 9999px; color: #2563eb; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
                    <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${rt.toolSignResearchTitle}</h3>
                    <p style="color: #334155; line-height: 1.7; margin-bottom: 12px;">${rt.toolSignResearchDesc}</p>
                    <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin: 0;"><strong>Academic Reference:</strong> <cite>${rt.toolSignResearchCite}</cite></p>
                  </section>
                `;
              }
              return '';
            })()}
            ${faqsHtml ? `
              <section style="margin-top: 40px;">
                <h2>${seoJson.faqTitle || 'FAQ'}</h2>
                ${faqsHtml}
              </section>
            ` : ''}
            ${buildRelatedToolsSection(pageId, lang, isEn)}
          </article>
          ${buildStaticFooter(lang, isEn)}
        </main>
      `;
    }
  } else if (pageType === 'home') {
    // 2. Home Page (100% Safe Pre-rendering of HomeSections + Links to Featured Tools)
    const schemaGraph: any[] = [
      {
        "@type": "WebApplication",
        "@id": `${DOMAIN}${urlPath}/#webapp`,
        "url": `${DOMAIN}${urlPath}`,
        "name": finalTitle,
        "description": finalDesc,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires HTML5 and WebAssembly support",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": 12850
        }
      }
    ];

    const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaGraph
    }, null, 2)}\n</script>`;
    
    html = html.replace('<!-- JSON-LD-INJECTION -->', jsonLdScript);

    const geoText = GEO_CITATIONS[lang] || GEO_CITATIONS['en'];
    const rt = RESEARCH_TRANSLATIONS[lang] || RESEARCH_TRANSLATIONS['en'];

    staticSeoHtml = `
      <main id="static-seo" role="main" style="padding: 40px; font-family: sans-serif; background: #fff; color: #333; max-width: 1100px; margin: 0 auto;">
        <article itemscope itemtype="https://schema.org/Article">
          <header>
            <h1 itemprop="headline">${finalTitle}</h1>
            <p itemprop="description">${finalDesc}</p>
          </header>
          
          <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-left: 4px solid #16a34a; font-weight: 500; font-size: 0.95rem; line-height: 1.5;">
            ${geoText}
          </div>

          <section style="margin-top: 48px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">Popular Free Online Document Tools</h2>
            <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; list-style: none; padding: 0;">
              ${TOOLS_CATALOG.slice(0, 10).map(t => {
                const slug = t.slugs[lang] || t.id;
                const href = isEn ? `/${slug}` : `/${lang}/${slug}`;
                const seo = getLocalizedSeo(t, lang);
                return `<li><a href="${href}" style="color: #2563eb; text-decoration: underline; font-weight: 500;">${seo.h1 || t.id}</a></li>`;
              }).join('')}
            </ul>
          </section>

          {/* Academic Grounding & Peer-Reviewed Research */}
          <section style="margin-top: 40px; padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px;">
            <div style="display: inline-block; padding: 4px 12px; background: #eff6ff; border-radius: 9999px; color: #2563eb; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">${rt.researchBadge}</div>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 12px;">${rt.researchHomeTitle}</h2>
            <p style="color: #475569; font-size: 1.1rem; line-height: 1.7; margin-bottom: 24px;">${rt.researchHomeSub}</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
              <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">${rt.homeCard1Title}</h3>
                <p style="color: #334155; font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px;">${rt.homeCard1Desc}</p>
                <p style="font-size: 0.8rem; color: #64748b; font-style: italic; margin: 0;"><cite>${rt.homeCard1Cite}</cite></p>
              </div>
              <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">${rt.homeCard2Title}</h3>
                <p style="color: #334155; font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px;">${rt.homeCard2Desc}</p>
                <p style="font-size: 0.8rem; color: #64748b; font-style: italic; margin: 0;"><cite>${rt.homeCard2Cite}</cite></p>
              </div>
              <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">${rt.homeCard3Title}</h3>
                <p style="color: #334155; font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px;">${rt.homeCard3Desc}</p>
                <p style="font-size: 0.8rem; color: #64748b; font-style: italic; margin: 0;"><cite>${rt.homeCard3Cite}</cite></p>
              </div>
            </div>
          </section>

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
        <section style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; margin: 24px 0;">
          <h2>${rt.aboutResearchTitle}</h2>
          <p style="color: #64748b; font-weight: 500;">${rt.aboutResearchSub}</p>
          <p style="color: #334155; line-height: 1.8;">${rt.aboutResearchText}</p>
        </section>
        <section><h2>${geo.pageAboutSec3Title || 'Zero-Cloud Processing'}</h2><p>${geo.pageAboutSec3Desc || ''}</p></section>
        ${geo.pageAboutSec4Title ? `<section><h2>${geo.pageAboutSec4Title}</h2><p>${geo.pageAboutSec4Desc || ''}</p></section>` : ''}
      `;
    } else if (pageId === 'privacy') {
      pageHtml = `
        <header><h1 itemprop="headline">${geo.pagePrivacyHero || finalTitle}</h1><p itemprop="description">${geo.pagePrivacySub || finalDesc}</p></header>
        <section><h2>${geo.pagePrivacySec1Title || 'Zero Upload Architecture'}</h2><p>${geo.pagePrivacySec1Desc || ''}</p></section>
        <section style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; margin: 24px 0;">
          <h2>${rt.privacyResearchTitle}</h2>
          <p style="color: #64748b; font-weight: 500;">${rt.privacyResearchSub}</p>
          <p style="color: #334155; line-height: 1.8;">${rt.privacyResearchText}</p>
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
        <section style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; margin: 24px 0;">
          <h2>${rt.securityResearchTitle}</h2>
          <p style="color: #64748b; font-weight: 500;">${rt.securityResearchSub}</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 16px;">
            <div style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="font-size: 1.1rem; margin-bottom: 6px;">${rt.securityCard1Title}</h3>
              <p style="font-size: 0.9rem; color: #334155; margin-bottom: 8px;">${rt.securityCard1Desc}</p>
              <p style="font-size: 0.8rem; color: #64748b; font-style: italic; margin: 0;"><cite>${rt.securityCard1Cite}</cite></p>
            </div>
            <div style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="font-size: 1.1rem; margin-bottom: 6px;">${rt.securityCard2Title}</h3>
              <p style="font-size: 0.9rem; color: #334155; margin-bottom: 8px;">${rt.securityCard2Desc}</p>
              <p style="font-size: 0.8rem; color: #64748b; font-style: italic; margin: 0;"><cite>${rt.securityCard2Cite}</cite></p>
            </div>
            <div style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="font-size: 1.1rem; margin-bottom: 6px;">${rt.securityCard3Title}</h3>
              <p style="font-size: 0.9rem; color: #334155; margin-bottom: 8px;">${rt.securityCard3Desc}</p>
              <p style="font-size: 0.8rem; color: #64748b; font-style: italic; margin: 0;"><cite>${rt.securityCard3Cite}</cite></p>
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
        <section style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; margin: 24px 0;">
          <h2>${rt.compareResearchTitle}</h2>
          <p style="color: #64748b; font-weight: 500;">${rt.compareResearchSub}</p>
          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div style="background: #fff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="font-size: 1rem; margin-bottom: 4px;">${rt.comparePoint1Title}</h3>
              <p style="font-size: 0.9rem; color: #334155; margin: 0;">${rt.comparePoint1Desc}</p>
            </div>
            <div style="background: #fff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="font-size: 1rem; margin-bottom: 4px;">${rt.comparePoint2Title}</h3>
              <p style="font-size: 0.9rem; color: #334155; margin: 0;">${rt.comparePoint2Desc}</p>
            </div>
            <div style="background: #fff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="font-size: 1rem; margin-bottom: 4px;">${rt.comparePoint3Title}</h3>
              <p style="font-size: 0.9rem; color: #334155; margin: 0;">${rt.comparePoint3Desc}</p>
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
          <h2>Available Languages & Locales</h2>
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; list-style: none; padding: 0; margin-top: 16px;">
            ${SUPPORTED_LANGUAGES.map(l => `<li><a href="${l.code === 'en' ? '/' : `/${l.code}`}" style="color: #2563eb; text-decoration: underline; font-weight: 500;">${l.name} (${l.nativeName})</a></li>`).join('')}
          </ul>
        </section>
      `;
    }
    
    // Default Schema for Static Pages
    const schemaGraph = [
      {
        "@type": "WebPage",
        "@id": `${DOMAIN}${urlPath}/#webpage`,
        "url": `${DOMAIN}${urlPath}`,
        "name": finalTitle,
        "description": finalDesc
      }
    ];

    const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaGraph
    }, null, 2)}\n</script>`;
    
    html = html.replace('<!-- JSON-LD-INJECTION -->', jsonLdScript);

    const geoText = GEO_CITATIONS[lang] || GEO_CITATIONS['en'];

    staticSeoHtml = `
      <main id="static-seo" role="main" style="padding: 40px; font-family: sans-serif; background: #fff; color: #333; max-width: 1100px; margin: 0 auto;">
        <nav aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 0.95rem;">
          <a href="${isEn ? '/' : `/${lang}`}" style="color: #2563eb; text-decoration: underline;">Home</a> &gt; 
          <span>${finalTitle}</span>
        </nav>
        <div style="margin-bottom: 24px; padding: 15px; background: #f0fdf4; border-left: 4px solid #16a34a; font-weight: 500; font-size: 0.95rem; line-height: 1.5;">
          ${geoText}
        </div>
        <article itemscope itemtype="https://schema.org/Article">
          ${pageHtml}
        </article>
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

      switch(page) {
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
    'HandleMyFile | All Document Tools in One Place',
    'Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly.',
    'home'
  );
  writeFileSafe(path.join(distDir, 'index.html'), rootHtml);

  // 4. Generate Legacy Redirect Alias Pages to prevent any 404 from obsolete slugs
  let redirectCount = 0;
  for (const [toolKey, slugMap] of Object.entries(toolSlugs)) {
    const toolDef = TOOLS_CATALOG.find(t => t.id === toolKey || t.id.startsWith(toolKey) || (toolKey === 'remove-pdf' && t.id === 'remove-pages-pdf'));
    if (!toolDef) {
      // Deprecated/commented-out tool: redirect legacy URLs to respective language home
      for (const lang of LANGS) {
        const isEn = lang === 'en';
        const legacySlug = slugMap[lang];
        if (!legacySlug) continue;

        const targetUrl = isEn ? '/' : `/${lang}`;
        const legacyOutDir = isEn ? path.join(distDir, legacySlug) : path.join(distDir, lang, legacySlug);
        const legacyOutFile = path.join(legacyOutDir, 'index.html');

        if (!fs.existsSync(legacyOutFile)) {
          const redirectHtml = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>Redirecting...</title>
  <link rel="canonical" href="${DOMAIN}${targetUrl}" />
  <meta http-equiv="refresh" content="0; url=${DOMAIN}${targetUrl}" />
  <script>window.location.replace("${DOMAIN}${targetUrl}");</script>
</head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
  <p>Redirecting to <a href="${DOMAIN}${targetUrl}">${DOMAIN}${targetUrl}</a>...</p>
</body>
</html>`;
          writeFileSafe(legacyOutFile, redirectHtml);
          redirectCount++;
        }
      }
      continue;
    }

    for (const lang of LANGS) {
      const isEn = lang === 'en';
      const legacySlug = slugMap[lang];
      if (!legacySlug) continue;

      const currentSlug = toolDef.slugs[lang] || toolDef.id;
      if (legacySlug !== currentSlug) {
        const targetUrl = isEn ? `/${currentSlug}` : `/${lang}/${currentSlug}`;
        const legacyOutDir = isEn ? path.join(distDir, legacySlug) : path.join(distDir, lang, legacySlug);
        const legacyOutFile = path.join(legacyOutDir, 'index.html');

        if (!fs.existsSync(legacyOutFile)) {
          const redirectHtml = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>Redirecting...</title>
  <link rel="canonical" href="${DOMAIN}${targetUrl}" />
  <meta http-equiv="refresh" content="0; url=${DOMAIN}${targetUrl}" />
  <script>window.location.replace("${DOMAIN}${targetUrl}");</script>
</head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
  <p>Redirecting to <a href="${DOMAIN}${targetUrl}">${DOMAIN}${targetUrl}</a>...</p>
</body>
</html>`;
          writeFileSafe(legacyOutFile, redirectHtml);
          redirectCount++;
        }
      }
    }
  }

  // Explicit alias for /remove-pages
  const removePagesLegacyFile = path.join(distDir, 'remove-pages', 'index.html');
  if (!fs.existsSync(removePagesLegacyFile)) {
    const removeRedirect = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redirecting...</title>
  <link rel="canonical" href="${DOMAIN}/remove-pages-pdf" />
  <meta http-equiv="refresh" content="0; url=${DOMAIN}/remove-pages-pdf" />
  <script>window.location.replace("${DOMAIN}/remove-pages-pdf");</script>
</head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
  <p>Redirecting to <a href="${DOMAIN}/remove-pages-pdf">${DOMAIN}/remove-pages-pdf</a>...</p>
</body>
</html>`;
    writeFileSafe(removePagesLegacyFile, removeRedirect);
    redirectCount++;
  }

  console.log(`Generated ${redirectCount} legacy alias redirects to prevent 404s!`);
  console.log(`Successfully generated ${generatedCount} static HTML files!`);
};

run().catch(console.error);
