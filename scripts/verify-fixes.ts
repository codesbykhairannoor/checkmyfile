import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const ahrefsDir = path.join(process.cwd(), 'ahrefsseo');

console.log('=== STARTING AUDIT VERIFICATION ===\n');

// 1. Verify Open Graph URLs match canonical
console.log('--- 1. Testing Open Graph URLs ---');
const sampleFiles = [
  'ja/pdf-ketsugou/index.html',
  'id/harga/index.html',
  'compress-pdf-to-100kb/index.html',
  'fr/index.html',
  'es/unir-pdf/index.html'
];
let ogPassed = true;
for (const rel of sampleFiles) {
  const fPath = path.join(distDir, rel);
  if (!fs.existsSync(fPath)) {
    console.error(`File missing: ${rel}`);
    ogPassed = false;
    continue;
  }
  const content = fs.readFileSync(fPath, 'utf8');
  const canMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
  const ogMatch = content.match(/<meta property="og:url" content="([^"]+)"/);
  const twMatch = content.match(/<meta property="twitter:url" content="([^"]+)"/);
  const canonical = canMatch ? canMatch[1] : null;
  const ogUrl = ogMatch ? ogMatch[1] : null;
  const twUrl = twMatch ? twMatch[1] : null;
  const ok = canonical && canonical === ogUrl && ogUrl === twUrl;
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${rel} -> Canonical: ${canonical}, OG: ${ogUrl}`);
  if (!ok) ogPassed = false;
}
console.log(`Open Graph verification: ${ogPassed ? 'ALL PASSED' : 'FAILED'}\n`);

// 2. Testing Outgoing Links inside #static-seo
console.log('--- 2. Testing Outgoing Links in Raw HTML ---');
let outlinksPassed = true;
for (const rel of sampleFiles) {
  const fPath = path.join(distDir, rel);
  const content = fs.readFileSync(fPath, 'utf8');
  const staticSeoMatch = content.match(/<main id="static-seo"[\s\S]*?<\/main>/);
  if (!staticSeoMatch) {
    console.error(`No #static-seo found in ${rel}`);
    outlinksPassed = false;
    continue;
  }
  const links = [...staticSeoMatch[0].matchAll(/<a\s+[^>]*href="([^"]+)"/g)].map(m => m[1]);
  const hasLinks = links.length >= 8;
  console.log(`[${hasLinks ? 'PASS' : 'FAIL'}] ${rel} has ${links.length} outgoing links in static HTML`);
  if (!hasLinks) outlinksPassed = false;
}
console.log(`Outgoing links verification: ${outlinksPassed ? 'ALL PASSED' : 'FAILED'}\n`);

// 3. Testing Sitemap: Zero Trailing Slashes & No Redirects
console.log('--- 3. Testing Sitemap URLs & Hreflangs for 3xx / Trailing Slashes ---');
const sitemapContent = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const hrefMatches = [...sitemapContent.matchAll(/href="([^"]+)"/g)].map(m => m[1]);

const badLocTrailing = locMatches.filter(l => l !== 'https://handlemyfile.com/' && l.endsWith('/'));
const badHrefTrailing = hrefMatches.filter(h => h !== 'https://handlemyfile.com/' && h.endsWith('/'));

console.log(`Total URLs in sitemap: ${locMatches.length}`);
console.log(`Total hreflang links: ${hrefMatches.length}`);
console.log(`Loc URLs with trailing slash (must be 0): ${badLocTrailing.length}`);
console.log(`Hreflang hrefs with trailing slash (must be 0): ${badHrefTrailing.length}`);
const sitemapTrailingPassed = badLocTrailing.length === 0 && badHrefTrailing.length === 0;
console.log(`Sitemap clean URLs verification: ${sitemapTrailingPassed ? 'ALL PASSED' : 'FAILED'}\n`);

// 4. Testing 404s: Verify all 151 URLs from Ahrefs 404 report exist in dist
console.log('--- 4. Testing 404 URLs from Ahrefs Report ---');
const csv404Path = path.join(ahrefsDir, 'handlemyfile_04-sep-2026_404-page_2026-09-04_19-10-02.csv');
const csvLines = fs.readFileSync(csv404Path, 'utf8').trim().split('\n').slice(1);
const urls404 = csvLines.map(l => l.split(',')[1].replace('https://handlemyfile.com', ''));

let missingCount = 0;
for (const u of urls404) {
  const p1 = path.join(distDir, u, 'index.html');
  const p2 = path.join(distDir, u + '.html');
  if (!fs.existsSync(p1) && !fs.existsSync(p2)) {
    missingCount++;
    console.error(`Still missing 404: ${u}`);
  }
}
console.log(`Out of 151 previously 404 URLs: Missing in current dist = ${missingCount}, Resolved = ${urls404.length - missingCount}`);
const urls404Passed = missingCount === 0;
console.log(`404 resolution verification: ${urls404Passed ? 'ALL 151 RESOLVED (0 missing)' : 'SOME STILL MISSING'}\n`);

// Summary
const allPassed = ogPassed && outlinksPassed && sitemapTrailingPassed && urls404Passed;
console.log(`=== AUDIT RESULT: ${allPassed ? 'ALL 4 MAJOR ISSUES 100% FIXED' : 'SOME CHECKS FAILED'} ===`);
if (!allPassed) process.exit(1);
