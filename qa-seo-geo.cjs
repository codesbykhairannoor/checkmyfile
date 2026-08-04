const puppeteer = require('puppeteer');
const http = require('http');

async function checkURL(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

(async () => {
  console.log("🚀 Starting QA Engineer SEO & GEO Testing Script...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Check static files
  console.log("--- Phase 1: Static Files Validation ---");
  const robotsExists = await checkURL('http://localhost:4173/robots.txt');
  assert(robotsExists, 'robots.txt is accessible');

  const llmsExists = await checkURL('http://localhost:4173/llms.txt');
  assert(llmsExists, 'llms.txt is accessible');

  const sitemapExists = await checkURL('http://localhost:4173/sitemap.xml');
  assert(sitemapExists, 'sitemap.xml is accessible');

  console.log("\n--- Phase 2: Dynamic DOM & JavaScript Injection (Puppeteer) ---");
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Go to the Indonesian Merge PDF page to test multilingual routing
  await page.goto('http://localhost:4173/id/gabung-pdf', { waitUntil: 'networkidle0' });

  // 1. Check Cloaking
  const aiManifesto = await page.$('#ai-manifesto');
  assert(aiManifesto === null, 'Cloaking vulnerability (ai-manifesto display:none) is removed');

  // 2. Check Hreflang Tags
  const hreflangs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(el => el.getAttribute('hreflang'));
  });
  
  const hasXDefault = hreflangs.includes('x-default');
  assert(hasXDefault, 'hreflang="x-default" is present');
  
  const has30Langs = hreflangs.length === 31; // 30 languages + x-default
  assert(has30Langs, `Found exactly 30 language hreflang tags + x-default (Total: ${hreflangs.length})`);

  // 3. Check Canonical
  const canonical = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.href);
  assert(canonical === 'https://handlemyfile.com/id/gabung-pdf', `Self-referencing canonical is correct: ${canonical}`);

  // 4. Check Favicon
  const favicon = await page.evaluate(() => document.querySelector('link[rel="icon"]')?.href);
  assert(favicon && favicon.includes('favicon.png'), `Favicon points to compressed PNG: ${favicon}`);

  // 5. Check JSON-LD Schemas
  const jsonLds = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[data-seo="jsonld"]')).map(el => JSON.parse(el.textContent));
  });

  const hasSoftwareSchema = jsonLds.some(schema => schema['@type'] === 'SoftwareApplication');
  const hasBreadcrumbSchema = jsonLds.some(schema => schema['@type'] === 'BreadcrumbList');
  const hasFaqSchema = jsonLds.some(schema => schema['@type'] === 'FAQPage');

  assert(hasSoftwareSchema, 'SoftwareApplication schema is injected');
  assert(hasBreadcrumbSchema, 'BreadcrumbList schema is injected');
  assert(hasFaqSchema, 'FAQPage schema is injected');
  
  if (hasSoftwareSchema) {
    const softwareSchema = jsonLds.find(s => s['@type'] === 'SoftwareApplication');
    const hasSameAs = softwareSchema.sameAs && softwareSchema.sameAs.length > 0;
    assert(hasSameAs, 'SoftwareApplication schema contains sameAs entity linking');
  }

  // Check language switching behavior (Title should be localized)
  const title = await page.title();
  assert(title.includes('PDF'), `Page title is properly localized: ${title}`);

  console.log("\n--- Phase 3: Homepage GEO & Organization Schema ---");
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  
  const homeJsonLds = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[data-seo="jsonld"]')).map(el => JSON.parse(el.textContent));
  });

  const hasOrgSchema = homeJsonLds.some(schema => schema['@type'] === 'Organization');
  assert(hasOrgSchema, 'Organization schema is present on the homepage for GEO trust signals');

  const hasHomeFaqSchema = homeJsonLds.some(schema => schema['@type'] === 'FAQPage');
  assert(hasHomeFaqSchema, 'FAQPage schema is present on the homepage');

  await browser.close();

  console.log(`\n📊 Final Results: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) {
    console.error("⚠️ QA Testing Failed.");
    process.exit(1);
  } else {
    console.log("🎉 All Tests Passed! The site is SUPER SEO & GEO ready.");
    process.exit(0);
  }
})();
