import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const DOMAIN = 'https://handlemyfile.com';

console.log('🤖 ==================================================================');
console.log('🤖          STARTING AHREFSBOT & GOOGLEBOT SITE CRAWL SIMULATION    ');
console.log('🤖                   Target: https://handlemyfile.com               ');
console.log('🤖 ==================================================================\n');

interface CrawlReport {
  url: string;
  statusCode: number;
  redirectTarget?: string;
  title: string;
  titleLength: number;
  metaDesc: string;
  metaDescLength: number;
  canonical: string;
  ogUrl: string;
  h1Count: number;
  h1Text: string;
  outlinksCount: number;
  inlinksCount: number;
  hreflangsCount: number;
  hasXDefault: boolean;
  hasJsonLd: boolean;
  wordCount: number;
  issues: string[];
}

// 1. Robots.txt Inspection
console.log('🔍 [Phase 1] Inspecting robots.txt...');
const robotsPath = path.join(distDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ robots.txt NOT FOUND!');
  process.exit(1);
}
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
console.log('📄 robots.txt Content:\n' + robotsContent.trim() + '\n');
const sitemapDirective = robotsContent.match(/Sitemap:\s*(https?:\/\/[^\s]+)/i);
if (!sitemapDirective) {
  console.error('❌ No Sitemap directive found in robots.txt!');
} else {
  console.log(`✅ Sitemap referenced in robots.txt: ${sitemapDirective[1]}\n`);
}

// 2. Sitemap.xml Inspection
console.log('🔍 [Phase 2] Inspecting & Parsing sitemap.xml...');
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ sitemap.xml NOT FOUND!');
  process.exit(1);
}
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log(`✅ Total URLs discovered in sitemap: ${sitemapLocs.length}`);

// 3. Full Crawl Engine
console.log('\n🕷️ [Phase 3] Beginning Deep Crawl of All Pages...');

function resolveLocalPath(url: string): { filePath: string; exists: boolean; isRedirect: boolean; redirectUrl?: string } {
  const rel = url.replace(DOMAIN, '').replace(/^\//, '');
  
  let targetPath = '';
  if (rel === '') {
    targetPath = path.join(distDir, 'index.html');
  } else {
    targetPath = path.join(distDir, rel, 'index.html');
    if (!fs.existsSync(targetPath)) {
      targetPath = path.join(distDir, rel + '.html');
    }
  }

  if (!fs.existsSync(targetPath)) {
    return { filePath: targetPath, exists: false, isRedirect: false };
  }

  const content = fs.readFileSync(targetPath, 'utf8');
  const redirectMatch = content.match(/<meta http-equiv="refresh" content="0;\s*url=([^"]+)"/i);
  if (redirectMatch) {
    return { filePath: targetPath, exists: true, isRedirect: true, redirectUrl: redirectMatch[1] };
  }

  return { filePath: targetPath, exists: true, isRedirect: false };
}

const crawlQueue: string[] = [...sitemapLocs];
const visited = new Set<string>();
const crawlResults: CrawlReport[] = [];

// Track Inlinks
const inlinkMap: Record<string, number> = {};
const allDiscoveredLinks = new Set<string>();

while (crawlQueue.length > 0) {
  const currentUrl = crawlQueue.shift()!;
  if (visited.has(currentUrl)) continue;
  visited.add(currentUrl);

  const issues: string[] = [];
  const resolution = resolveLocalPath(currentUrl);

  if (!resolution.exists) {
    crawlResults.push({
      url: currentUrl,
      statusCode: 404,
      title: '',
      titleLength: 0,
      metaDesc: '',
      metaDescLength: 0,
      canonical: '',
      ogUrl: '',
      h1Count: 0,
      h1Text: '',
      outlinksCount: 0,
      inlinksCount: 0,
      hreflangsCount: 0,
      hasXDefault: false,
      hasJsonLd: false,
      wordCount: 0,
      issues: ['404 Not Found']
    });
    continue;
  }

  if (resolution.isRedirect) {
    crawlResults.push({
      url: currentUrl,
      statusCode: 301,
      redirectTarget: resolution.redirectUrl,
      title: 'Redirecting...',
      titleLength: 14,
      metaDesc: '',
      metaDescLength: 0,
      canonical: resolution.redirectUrl || '',
      ogUrl: '',
      h1Count: 0,
      h1Text: '',
      outlinksCount: 1,
      inlinksCount: 0,
      hreflangsCount: 0,
      hasXDefault: false,
      hasJsonLd: false,
      wordCount: 5,
      issues: []
    });
    continue;
  }

  const html = fs.readFileSync(resolution.filePath, 'utf8');

  // Title Audit
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const titleLength = title.length;
  if (!title) issues.push('Missing Title Tag');
  else if (titleLength > 60) issues.push(`Title Too Long (${titleLength} chars > 60)`);
  else if (titleLength < 10) issues.push(`Title Too Short (${titleLength} chars)`);

  // Meta Description Audit
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);
  const metaDesc = descMatch ? descMatch[1].trim() : '';
  const metaDescLength = metaDesc.length;
  if (!metaDesc) issues.push('Missing Meta Description');
  else if (metaDescLength < 100) issues.push(`Meta Description Too Short (${metaDescLength} chars < 100)`);
  else if (metaDescLength > 160) issues.push(`Meta Description Too Long (${metaDescLength} chars > 160)`);

  // Canonical Audit
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';
  if (!canonical) issues.push('Missing Canonical Tag');
  else if (canonical !== currentUrl) issues.push(`Canonical Mismatch: Expected ${currentUrl}, Got ${canonical}`);

  // Open Graph & Twitter URL Audit
  const ogUrlMatch = html.match(/<meta property="og:url" content="([^"]+)"/i);
  const ogUrl = ogUrlMatch ? ogUrlMatch[1].trim() : '';
  if (!ogUrl) issues.push('Missing og:url');
  else if (ogUrl !== currentUrl) issues.push(`og:url Mismatch: Expected ${currentUrl}, Got ${ogUrl}`);

  // H1 Audit
  const h1Matches = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/gi)];
  const h1Count = h1Matches.length;
  const h1Text = h1Matches[0] ? h1Matches[0][1].trim() : '';
  if (h1Count === 0) issues.push('Missing H1 Tag');
  else if (h1Count > 1) issues.push(`Multiple H1 Tags (${h1Count})`);

  // JSON-LD Schema Audit
  const jsonLdMatch = html.includes('application/ld+json');
  if (!jsonLdMatch) issues.push('Missing JSON-LD Structured Data');

  // Outlinks & Crawlability Audit
  const outlinkMatches = [...html.matchAll(/<a\s+[^>]*href="([^"]+)"/gi)].map(m => m[1]);
  const internalOutlinks = outlinkMatches.filter(href => href.startsWith('/') || href.startsWith(DOMAIN));
  const outlinksCount = internalOutlinks.length;
  if (outlinksCount === 0) issues.push('Page Has No Outgoing Links');

  // Register inlinks
  for (const link of internalOutlinks) {
    const fullLink = link.startsWith('http') ? link : `${DOMAIN}${link}`;
    const cleanLink = fullLink.split('#')[0].split('?')[0];
    inlinkMap[cleanLink] = (inlinkMap[cleanLink] || 0) + 1;
    allDiscoveredLinks.add(cleanLink);
  }

  // Hreflang Audit (Must have 30 languages + x-default)
  const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/gi)];
  const hreflangsCount = hreflangs.length;
  const hasXDefault = html.includes('hreflang="x-default"');
  if (hreflangsCount < 30) {
    issues.push(`Missing Hreflang Tags (${hreflangsCount}/30)`);
  }
  if (!hasXDefault) {
    issues.push('Missing x-default hreflang');
  }

  // Word Count Audit (stripping HTML tags)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyText = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const urlPath = currentUrl.replace(DOMAIN, '');
  const langMatch = urlPath.match(/^\/([a-z]{2})\//);
  const pageLang = langMatch ? langMatch[1] : 'en';

  let wordCount = 0;
  if (['zh', 'ja', 'th'].includes(pageLang)) {
    const cjkChars = (bodyText.match(/[\u4e00-\u9fa5\u3040-\u30ff\u0e00-\u0e7f]/g) || []).length;
    const nonCjkWords = bodyText.replace(/[\u4e00-\u9fa5\u3040-\u30ff\u0e00-\u0e7f]/g, ' ').split(/\s+/).filter(Boolean).length;
    wordCount = cjkChars + nonCjkWords;
  } else {
    wordCount = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;
  }
  if (wordCount < 100) issues.push(`Low Word Count (${wordCount} words)`);

  crawlResults.push({
    url: currentUrl,
    statusCode: 200,
    title,
    titleLength,
    metaDesc,
    metaDescLength,
    canonical,
    ogUrl,
    h1Count,
    h1Text,
    outlinksCount,
    inlinksCount: 0, // will be updated in second pass
    hreflangsCount,
    hasXDefault,
    hasJsonLd: jsonLdMatch,
    wordCount,
    issues
  });
}

// Second pass: Update Inlink Counts & Audit for Orphan Pages
for (const report of crawlResults) {
  if (report.statusCode === 200) {
    const inlinks = inlinkMap[report.url] || 0;
    report.inlinksCount = inlinks;
    // The seed root homepage does not need internal inlinks to be discovered, but all other pages must have >= 1 inlinks
    if (inlinks === 0 && report.url !== DOMAIN && report.url !== `${DOMAIN}/`) {
      report.issues.push('Orphan Page (0 internal incoming links)');
    }
  }
}

console.log(`✅ Crawled ${crawlResults.length} pages total.\n`);

// 4. Analysis & Health Score Computation
console.log('📊 ==================================================================');
console.log('📊                 AHREFSBOT AUDIT EXECUTIVE SUMMARY                 ');
console.log('📊 ==================================================================\n');

const totalCrawled = crawlResults.length;
const status200 = crawlResults.filter(r => r.statusCode === 200).length;
const status3xx = crawlResults.filter(r => r.statusCode >= 300 && r.statusCode < 400).length;
const status4xx = crawlResults.filter(r => r.statusCode >= 400).length;

const pagesWithIssues = crawlResults.filter(r => r.issues.length > 0);
const cleanPages = crawlResults.filter(r => r.issues.length === 0);

// Specific issue tallies
const titleIssues = crawlResults.filter(r => r.issues.some(i => i.includes('Title')));
const descIssues = crawlResults.filter(r => r.issues.some(i => i.includes('Description')));
const canonicalIssues = crawlResults.filter(r => r.issues.some(i => i.includes('Canonical')));
const ogIssues = crawlResults.filter(r => r.issues.some(i => i.includes('og:url')));
const orphanIssues = crawlResults.filter(r => r.issues.some(i => i.includes('Orphan')));
const hreflangIssues = crawlResults.filter(r => r.issues.some(i => i.includes('Hreflang') || i.includes('x-default')));
const thinContentIssues = crawlResults.filter(r => r.issues.some(i => i.includes('Word Count')));

console.log(`Total URLs Audited:            ${totalCrawled}`);
console.log(`HTTP 200 OK Pages:             ${status200}`);
console.log(`HTTP 3xx Redirects:            ${status3xx}`);
console.log(`HTTP 4xx Errors:               ${status4xx}`);
console.log(`Pages with Zero Issues:        ${cleanPages.length} (${((cleanPages.length / totalCrawled) * 100).toFixed(1)}%)`);
console.log(`Pages with Issues:             ${pagesWithIssues.length}\n`);

console.log('🚨 Core SEO Checks Breakdown:');
console.log(`  - 404 / 4xx Pages:           ${status4xx} (Target: 0)`);
console.log(`  - Title Issues (>60 chars):  ${titleIssues.length} (Target: 0)`);
console.log(`  - Meta Desc Issues:          ${descIssues.length} (Target: 0)`);
console.log(`  - Canonical Mismatches:      ${canonicalIssues.length} (Target: 0)`);
console.log(`  - Open Graph URL Mismatches: ${ogIssues.length} (Target: 0)`);
console.log(`  - Orphan Pages (0 Inlinks):  ${orphanIssues.length} (Target: 0)`);
console.log(`  - Hreflang Issues:           ${hreflangIssues.length} (Target: 0)`);
console.log(`  - Low Word Count Pages:      ${thinContentIssues.length} (Target: 0)\n`);

// Health Score
const healthScore = Math.max(0, Math.round(((totalCrawled - pagesWithIssues.length) / totalCrawled) * 100));
console.log(`🏆 AHREFS SITE HEALTH SCORE: ${healthScore} / 100 🏆\n`);

if (pagesWithIssues.length > 0) {
  console.log('⚠️ Sample Pages with Issues:');
  for (const p of pagesWithIssues.slice(0, 10)) {
    console.log(`- ${p.url}: ${p.issues.join(', ')}`);
  }
  console.log('');
}

// Sample multilingual audit display
console.log('🌐 ==================================================================');
console.log('🌐           MULTILINGUAL SAMPLE CRAWL AUDIT (5 KEY LOCALES)         ');
console.log('🌐 ==================================================================');

const sampleLocales = [
  'https://handlemyfile.com/',
  'https://handlemyfile.com/id/kompres-pdf',
  'https://handlemyfile.com/ja/pdf-asshuku',
  'https://handlemyfile.com/es/comprimir-pdf',
  'https://handlemyfile.com/zh/ya-suo-pdf'
];

for (const sampleUrl of sampleLocales) {
  const sample = crawlResults.find(r => r.url === sampleUrl);
  if (sample) {
    console.log(`\n📍 URL: ${sample.url}`);
    console.log(`   Status:         ${sample.statusCode} ${sample.statusCode === 200 ? 'OK' : ''}`);
    console.log(`   Title (${sample.titleLength} chars):  "${sample.title.slice(0, 60)}"`);
    console.log(`   Desc (${sample.metaDescLength} chars):   "${sample.metaDesc.slice(0, 75)}..."`);
    console.log(`   Canonical:      ${sample.canonical}`);
    console.log(`   H1:             "${sample.h1Text}"`);
    console.log(`   Internal Links: ${sample.outlinksCount} outlinks | ${sample.inlinksCount} inlinks`);
    console.log(`   Hreflangs:      ${sample.hreflangsCount} entries (x-default: ${sample.hasXDefault})`);
    console.log(`   Structured:     JSON-LD Schema ${sample.hasJsonLd ? '✅ Valid' : '❌ Missing'}`);
    console.log(`   Word Count:     ${sample.wordCount} words`);
    console.log(`   Issues Found:   ${sample.issues.length === 0 ? 'None (100% Perfect)' : sample.issues.join(', ')}`);
  }
}

console.log('\n==================================================================');
if (healthScore === 100) {
  console.log('✅ BOT CRAWL COMPLETE: SITE IS FULLY OPTIMIZED FOR SEARCH ENGINES!');
} else {
  console.log(`⚠️ BOT CRAWL FINISHED WITH HEALTH SCORE ${healthScore}/100 - PLEASE FIX REMAINING ISSUES.`);
}
