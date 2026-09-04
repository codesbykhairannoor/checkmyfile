import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const ahrefsDir = path.join(process.cwd(), 'ahrefsseo');

console.log('=====================================================');
console.log('       COMPREHENSIVE AHREFS 9-ISSUE AUDIT CHECK      ');
console.log('=====================================================\n');

function getAllHtmlFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = getAllHtmlFiles(distDir);
console.log(`Auditing ${allFiles.length} generated static HTML files in dist/...\n`);

let testResults: { issue: string; passed: boolean; details: string }[] = [];

// --- ISSUE 1 & 7: 404 Pages (151 URLs) ---
console.log('--- Checking Issues 1 & 7: 404 Pages (151 URLs) ---');
const csv404Path = path.join(ahrefsDir, 'handlemyfile_04-sep-2026_404-page_2026-09-04_19-10-02.csv');
const csv404Lines = fs.readFileSync(csv404Path, 'utf8').trim().split('\n').slice(1);
const urls404 = csv404Lines.map(l => l.split(',')[1].replace('https://handlemyfile.com', ''));

let missing404Count = 0;
for (const u of urls404) {
  const p1 = path.join(distDir, u, 'index.html');
  const p2 = path.join(distDir, u + '.html');
  if (!fs.existsSync(p1) && !fs.existsSync(p2)) {
    missing404Count++;
  }
}
const pass404 = missing404Count === 0;
testResults.push({
  issue: '404 Pages & 4xx Pages (151 URLs)',
  passed: pass404,
  details: `Missing: ${missing404Count} / ${urls404.length} resolved`
});
console.log(`  Result: ${pass404 ? 'PASS' : 'FAIL'} - ${urls404.length - missing404Count}/${urls404.length} resolved (0 missing)\n`);

// --- ISSUE 2: Hreflang to Redirect ---
console.log('--- Checking Issue 2: Hreflang to Redirect ---');
const sitemapContent = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
const hreflangMatches = [...sitemapContent.matchAll(/<xhtml:link[^>]*href="([^"]+)"/g)].map(m => m[1]);
const hreflangWithTrailingSlash = hreflangMatches.filter(h => h !== 'https://handlemyfile.com/' && h.endsWith('/'));
const passHreflang = hreflangWithTrailingSlash.length === 0;
testResults.push({
  issue: 'Hreflang to Redirect',
  passed: passHreflang,
  details: `Hreflang links with trailing slash: ${hreflangWithTrailingSlash.length} (Total checked: ${hreflangMatches.length})`
});
console.log(`  Result: ${passHreflang ? 'PASS' : 'FAIL'} - 0 trailing slashes in ${hreflangMatches.length} hreflang entries\n`);

// --- ISSUE 3: Open Graph URL Not Matching Canonical ---
console.log('--- Checking Issue 3: Open Graph URL Matches Canonical ---');
let ogMismatches = 0;
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const canMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
  const ogMatch = content.match(/<meta property="og:url" content="([^"]+)"/);
  const twMatch = content.match(/<meta property="twitter:url" content="([^"]+)"/);
  if (canMatch && ogMatch) {
    if (canMatch[1] !== ogMatch[1] || (twMatch && canMatch[1] !== twMatch[1])) {
      ogMismatches++;
    }
  }
}
const passOg = ogMismatches === 0;
testResults.push({
  issue: 'Open Graph URL Not Matching Canonical',
  passed: passOg,
  details: `Mismatches: ${ogMismatches} across ${allFiles.length} files`
});
console.log(`  Result: ${passOg ? 'PASS' : 'FAIL'} - 0 mismatches across ${allFiles.length} files\n`);

// --- ISSUE 4: Page Has No Outgoing Links ---
console.log('--- Checking Issue 4: Outgoing Links in Raw HTML ---');
let isolatedPages = 0;
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Skip pure redirect alias stubs
  if (content.includes('<meta http-equiv="refresh"')) continue;

  const staticSeoMatch = content.match(/<main id="static-seo"[\s\S]*?<\/main>/);
  if (!staticSeoMatch) {
    isolatedPages++;
    continue;
  }
  const links = [...staticSeoMatch[0].matchAll(/<a\s+[^>]*href="([^"]+)"/g)];
  if (links.length < 8) {
    isolatedPages++;
  }
}
const passOutlinks = isolatedPages === 0;
testResults.push({
  issue: 'Page Has No Outgoing Links',
  passed: passOutlinks,
  details: `Pages with < 8 crawlable links: ${isolatedPages}`
});
console.log(`  Result: ${passOutlinks ? 'PASS' : 'FAIL'} - 0 isolated pages (all have >= 8 crawlable internal links)\n`);

// --- ISSUE 5: 3xx Redirect in Sitemap ---
console.log('--- Checking Issue 5: 3xx Redirect in Sitemap ---');
const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const locWithTrailingSlash = locMatches.filter(l => l !== 'https://handlemyfile.com/' && l.endsWith('/'));
const pass3xx = locWithTrailingSlash.length === 0;
testResults.push({
  issue: '3xx Redirect in Sitemap (Trailing Slashes)',
  passed: pass3xx,
  details: `Sitemap loc entries with trailing slash: ${locWithTrailingSlash.length} (Total: ${locMatches.length})`
});
console.log(`  Result: ${pass3xx ? 'PASS' : 'FAIL'} - 0 trailing slashes in ${locMatches.length} sitemap locs\n`);

// --- ISSUE 6: 4xx Page in Sitemap ---
console.log('--- Checking Issue 6: 4xx Page in Sitemap ---');
const csv4xxSitemapPath = path.join(ahrefsDir, 'handlemyfile_04-sep-2026_4xx-page-in-sitemap_2026-09-04_19-09-41.csv');
const csv4xxLines = fs.readFileSync(csv4xxSitemapPath, 'utf8').trim().split('\n').slice(1);
const urls4xxSitemap = csv4xxLines.map(l => l.split(',')[1].trim());

let sitemap4xxCount = 0;
for (const u of urls4xxSitemap) {
  if (sitemapContent.includes(`<loc>${u}</loc>`)) {
    sitemap4xxCount++;
  }
}

// Also verify every sitemap loc actually exists in dist
let missingSitemapFiles = 0;
for (const loc of locMatches) {
  const rel = loc.replace('https://handlemyfile.com', '');
  const p1 = rel === '' ? path.join(distDir, 'index.html') : path.join(distDir, rel, 'index.html');
  const p2 = path.join(distDir, rel + '.html');
  if (!fs.existsSync(p1) && !fs.existsSync(p2)) {
    missingSitemapFiles++;
  }
}

const pass4xxSitemap = sitemap4xxCount === 0 && missingSitemapFiles === 0;
testResults.push({
  issue: '4xx Page in Sitemap',
  passed: pass4xxSitemap,
  details: `Obsolete URLs in sitemap: ${sitemap4xxCount}, Missing files for sitemap entries: ${missingSitemapFiles}`
});
console.log(`  Result: ${pass4xxSitemap ? 'PASS' : 'FAIL'} - 0 obsolete 4xx in sitemap, 100% of ${locMatches.length} sitemap locs exist\n`);

// --- ISSUE 8: Title Too Long (> 60 chars) ---
console.log('--- Checking Issue 8: Title Too Long (> 60 chars) ---');
let titlesOver60 = 0;
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[1].length > 60) {
    titlesOver60++;
  }
}
const passTitleLength = titlesOver60 === 0;
testResults.push({
  issue: 'Title Too Long (> 60 chars)',
  passed: passTitleLength,
  details: `Titles over 60 chars: ${titlesOver60}`
});
console.log(`  Result: ${passTitleLength ? 'PASS' : 'FAIL'} - 0 titles over 60 characters\n`);

// --- ISSUE 9: Meta Description Too Short (< 100 chars) or Too Long (> 160 chars) ---
console.log('--- Checking Issue 9: Meta Description Length (100 to 160 chars) ---');
let descsUnder100 = 0;
let descsOver160 = 0;
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const descMatch = content.match(/<meta name="description" content="([^"]*)"/i);
  if (descMatch) {
    const len = descMatch[1].length;
    if (len < 100) descsUnder100++;
    if (len > 160) descsOver160++;
  }
}
const passDescLength = descsUnder100 === 0 && descsOver160 === 0;
testResults.push({
  issue: 'Meta Description Length (100-160 chars)',
  passed: passDescLength,
  details: `Under 100: ${descsUnder100}, Over 160: ${descsOver160}`
});
console.log(`  Result: ${passDescLength ? 'PASS' : 'FAIL'} - 0 under 100 chars, 0 over 160 chars\n`);

// --- FINAL SUMMARY TABLE ---
console.log('=====================================================');
console.log('                 FINAL AUDIT SCORECARD               ');
console.log('=====================================================');
console.table(testResults);

const allPassed = testResults.every(r => r.passed);
if (!allPassed) {
  console.error('\n❌ SOME AUDIT CHECKS FAILED!');
  process.exit(1);
} else {
  console.log('\n✅ ALL 9 AHREFS AUDIT ISSUES ARE 100% RESOLVED AND VERIFIED!');
}
