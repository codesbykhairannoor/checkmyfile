import fs from 'fs';
import path from 'path';
import { TOOLS_CATALOG } from '../src/catalog/toolsCatalog';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languages';

const distDir = path.join(process.cwd(), 'dist');
const ahrefsDir = path.join(process.cwd(), 'ahrefsseo');

console.log('=====================================================');
console.log('     ULTIMATE 360° AHREFS & SITEMAP AUDIT VERIFY    ');
console.log('=====================================================\n');

let allPassed = true;

// 1. Check duplicate URLs in sitemap.xml
console.log('--- 1. Testing Sitemap for Duplicate URLs ---');
const sitemapContent = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const locSet = new Set<string>();
const duplicateLocs: string[] = [];

for (const loc of locMatches) {
  if (locSet.has(loc)) {
    duplicateLocs.push(loc);
  } else {
    locSet.add(loc);
  }
}

console.log(`Total URLs in sitemap.xml: ${locMatches.length}`);
console.log(`Unique URLs: ${locSet.size}`);
console.log(`Duplicate URLs: ${duplicateLocs.length}`);
if (duplicateLocs.length > 0) {
  console.error('Duplicates found:', duplicateLocs);
  allPassed = false;
} else {
  console.log('[PASS] ZERO duplicate URLs in sitemap.xml!\n');
}

// 2. Check Slug Collisions across tools catalog
console.log('--- 2. Testing Slug Collisions in Catalog ---');
let catalogCollisions = 0;
for (const lang of SUPPORTED_LANGUAGES) {
  const code = lang.code;
  const slugMap: Record<string, string[]> = {};
  for (const tool of TOOLS_CATALOG) {
    const slug = tool.slugs[code] || tool.id;
    if (!slugMap[slug]) slugMap[slug] = [];
    slugMap[slug].push(tool.id);
  }
  for (const [slug, toolIds] of Object.entries(slugMap)) {
    if (toolIds.length > 1) {
      console.error(`Collision in ${code}: ${slug} -> ${toolIds.join(', ')}`);
      catalogCollisions++;
    }
  }
}
console.log(`Catalog collisions: ${catalogCollisions}`);
if (catalogCollisions > 0) {
  allPassed = false;
} else {
  console.log('[PASS] ZERO slug collisions across all 30 languages!\n');
}

// 3. Check all files in dist for Title & Meta Description Lengths
console.log('--- 3. Testing HTML Files: Titles & Meta Descriptions ---');
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
console.log(`Auditing ${allFiles.length} HTML files...`);

let titlesOver60 = 0;
let descsUnder100 = 0;
let descsOver160 = 0;
let ogMismatches = 0;
let isolatedPages = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[1].length > 60) {
    titlesOver60++;
  }

  // Meta description
  const descMatch = content.match(/<meta name="description" content="([^"]*)"/i);
  if (descMatch) {
    const len = descMatch[1].length;
    if (len < 100) descsUnder100++;
    if (len > 160) descsOver160++;
  }

  // OG & Canonical match
  const canMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
  const ogMatch = content.match(/<meta property="og:url" content="([^"]+)"/);
  const twMatch = content.match(/<meta property="twitter:url" content="([^"]+)"/);
  if (canMatch && ogMatch) {
    if (canMatch[1] !== ogMatch[1] || (twMatch && canMatch[1] !== twMatch[1])) {
      ogMismatches++;
    }
  }

  // Outlinks (skip pure redirect stubs)
  if (!content.includes('<meta http-equiv="refresh"')) {
    const staticSeoMatch = content.match(/<main id="static-seo"[\s\S]*?<\/main>/);
    if (!staticSeoMatch) {
      isolatedPages++;
    } else {
      const links = [...staticSeoMatch[0].matchAll(/<a\s+[^>]*href="([^"]+)"/g)];
      if (links.length < 8) isolatedPages++;
    }
  }
}

console.log(`Titles > 60 chars: ${titlesOver60}`);
console.log(`Descriptions < 100 chars: ${descsUnder100}`);
console.log(`Descriptions > 160 chars: ${descsOver160}`);
console.log(`Open Graph mismatches: ${ogMismatches}`);
console.log(`Isolated pages (< 8 links): ${isolatedPages}`);

if (titlesOver60 > 0 || descsUnder100 > 0 || descsOver160 > 0 || ogMismatches > 0 || isolatedPages > 0) {
  allPassed = false;
} else {
  console.log('[PASS] All titles, descriptions, OG tags, and internal outlinks passed 100%!\n');
}

// 4. Check 404 URL Resolution (all 151 URLs from Ahrefs report)
console.log('--- 4. Testing 404 URLs from Ahrefs Report ---');
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
console.log(`404 URLs missing: ${missing404Count} / ${urls404.length}`);
if (missing404Count > 0) {
  allPassed = false;
} else {
  console.log('[PASS] 100% of previously 404 URLs resolved!\n');
}

console.log('=====================================================');
if (allPassed) {
  console.log('🎉 AUDIT COMPLETE: ALL ISSUES ARE 100% RESOLVED!');
} else {
  console.error('❌ SOME CHECKS FAILED!');
  process.exit(1);
}
