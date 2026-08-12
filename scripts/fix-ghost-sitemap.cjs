/**
 * fix-ghost-sitemap.cjs
 * Scans dist/ and regenerates public/sitemap.xml with ONLY URLs that have
 * a real index.html file. Eliminates all 177 ghost (404) URLs.
 */

const fs   = require('fs');
const path = require('path');

const BASE_URL  = 'https://handlemyfile.com';
const DIST_DIR  = path.join(__dirname, '..', 'dist');
const SITEMAP   = path.join(__dirname, '..', 'public', 'sitemap.xml');

if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ dist/ folder not found. Run npm run build first.');
  process.exit(1);
}

// ── 1. Walk dist/ and collect every folder that has index.html ───────────────
function collectRealUrls(dir, baseDir) {
  const results = [];

  const indexHtml = path.join(dir, 'index.html');
  if (fs.existsSync(indexHtml)) {
    const rel  = path.relative(baseDir, dir).replace(/\\/g, '/');
    const url  = rel === '' ? BASE_URL + '/' : BASE_URL + '/' + rel + '/';
    results.push(url.replace(/\/\/$/, '/'));        // normalise trailing slash
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      results.push(...collectRealUrls(path.join(dir, entry.name), baseDir));
    }
  }

  return results;
}

console.log('🔍  Scanning dist/ for real HTML files…');
const realUrls = collectRealUrls(DIST_DIR, DIST_DIR);
console.log(`✅  Found ${realUrls.length} real URLs with HTML files.`);

// ── 2. Load old sitemap to keep hreflang / priority metadata where possible ──
let oldMeta = {};   // url → { changefreq, priority, links, defaultUrl }

if (fs.existsSync(SITEMAP)) {
  const xml = fs.readFileSync(SITEMAP, 'utf8');

  // Parse each <url> block
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of urlBlocks) {
    const locMatch  = block.match(/<loc>(.*?)<\/loc>/);
    const cfMatch   = block.match(/<changefreq>(.*?)<\/changefreq>/);
    const priMatch  = block.match(/<priority>(.*?)<\/priority>/);
    const linksArr  = [...block.matchAll(/<xhtml:link[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/g)]
                        .map(m => ({ lang: m[1], url: m[2] }))
                        .filter(l => l.lang !== 'x-default');
    const defMatch  = block.match(/hreflang="x-default"\s+href="([^"]+)"/);

    if (locMatch) {
      const loc = locMatch[1].replace(/\/$/, '') + '/';      // normalise
      oldMeta[loc] = {
        changefreq : cfMatch  ? cfMatch[1]  : 'monthly',
        priority   : priMatch ? priMatch[1] : '0.8',
        links      : linksArr,
        defaultUrl : defMatch ? defMatch[1] : loc,
      };
    }
  }
  console.log(`📖  Loaded metadata for ${Object.keys(oldMeta).length} existing URLs.`);
}

// ── 3. Build new sitemap XML ─────────────────────────────────────────────────
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

const sortedUrls = [...realUrls].sort();          // deterministic order

for (const url of sortedUrls) {
  const normUrl = url.endsWith('/') ? url : url + '/';
  const meta    = oldMeta[normUrl] || {};

  const changefreq = meta.changefreq || (url === BASE_URL + '/' ? 'daily' : 'monthly');
  const priority   = meta.priority   || (url === BASE_URL + '/' ? '1.0'   : '0.8');
  const links      = meta.links      || [];
  const defaultUrl = meta.defaultUrl || normUrl;

  xml += `  <url>\n`;
  xml += `    <loc>${normUrl}</loc>\n`;
  xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += `    <priority>${priority}</priority>\n`;

  for (const link of links) {
    xml += `    <xhtml:link rel="alternate" hreflang="${link.lang}" href="${link.url}" />\n`;
  }
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>`;

fs.writeFileSync(SITEMAP, xml, 'utf8');

console.log(`\n🎉  Sitemap regenerated!`);
console.log(`    Total URLs  : ${sortedUrls.length}`);
console.log(`    Ghost URLs  : 0 (all cleaned up)`);
console.log(`    Saved to    : public/sitemap.xml`);
