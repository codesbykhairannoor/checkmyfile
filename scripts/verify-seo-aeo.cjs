const fs = require('fs');
const path = require('path');

console.log("==========================================");
console.log("   SUPER CEKLIS: SEO, GEO, AEO, SITEMAP   ");
console.log("==========================================\n");

let allPassed = true;

function check(name, condition, successMsg, failMsg) {
  if (condition) {
    console.log(`[PASS] ✅ ${name}`);
    if (successMsg) console.log(`       -> ${successMsg}`);
  } else {
    console.log(`[FAIL] ❌ ${name}`);
    if (failMsg) console.log(`       -> ${failMsg}`);
    allPassed = false;
  }
}

// 1. Check robots.txt
const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
const robotsContent = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : '';

check('Robots.txt Exists', robotsContent.length > 0, 'public/robots.txt ditemukan.');
check('AI Crawlers Whitelisted', 
  robotsContent.includes('User-agent: PerplexityBot') && 
  robotsContent.includes('User-agent: ClaudeBot') && 
  robotsContent.includes('User-agent: GPTBot'),
  'Perplexity, Claude, dan GPT diizinkan secara eksplisit.',
  'Kehilangan whitelist untuk bot AI.'
);
check('LLMS Directive in Robots', 
  robotsContent.includes('LLMS:'),
  'Direktif LLMS ditemukan di robots.txt (Emerging Standard).',
  'Direktif LLMS tidak ditemukan.'
);

// 2. Check llms.txt Ecosystem
const publicDir = path.join(__dirname, '..', 'public');
const filesInPublic = fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : [];
const llmsFiles = filesInPublic.filter(f => f.startsWith('llms') && f.endsWith('.txt'));

check('LLMS Files (GEO/AEO) Exist', 
  llmsFiles.length >= 30,
  `Ditemukan ${llmsFiles.length} file llms (termasuk 30 bahasa GEO).`,
  `Hanya ditemukan ${llmsFiles.length} file llms.`
);

const mainLlmsPath = path.join(publicDir, 'llms.txt');
const mainLlmsContent = fs.existsSync(mainLlmsPath) ? fs.readFileSync(mainLlmsPath, 'utf8') : '';
check('Brand Differentiation in llms.txt',
  mainLlmsContent.toLowerCase().includes('ilovepdf') || mainLlmsContent.toLowerCase().includes('smallpdf'),
  'Kompetitor disebutkan untuk memicu perbandingan RAG (Prompt Injection).',
  'Tidak ada diferensiasi melawan kompetitor.'
);

// 3. Check SeoHead.tsx for meta tags
const seoHeadPath = path.join(__dirname, '..', 'src', 'components', 'seo', 'SeoHead.tsx');
const seoHeadContent = fs.existsSync(seoHeadPath) ? fs.readFileSync(seoHeadPath, 'utf8') : '';

check('SeoHead Meta llm-context',
  seoHeadContent.includes('llm-context'),
  '<meta name="llm-context"> berhasil diinjeksi ke HTML header.',
  'Meta llm-context tidak ditemukan di SeoHead.tsx.'
);

// 4. Check Sitemap Generation (ensure no .txt files are mapped)
const sitemapXmlPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const sitemapXmlContent = fs.existsSync(sitemapXmlPath) ? fs.readFileSync(sitemapXmlPath, 'utf8') : '';

check('Sitemap Excludes TXT files',
  !sitemapXmlContent.includes('.txt'),
  'Sitemap XML aktual 100% bersih dari file .txt (Aman dari Google Penalty).',
  'Sitemap XML masih menyertakan ekstensi teks.'
);

console.log("\n==========================================");
if (allPassed) {
  console.log("KESIMPULAN: 100% MEMENUHI STANDAR TOP 1! 🚀");
  console.log("Semua komponen SEO Tradisional, AEO, dan GEO aman.");
} else {
  console.log("KESIMPULAN: ADA YANG KURANG, BUTUH PERBAIKAN.");
}
console.log("==========================================");
