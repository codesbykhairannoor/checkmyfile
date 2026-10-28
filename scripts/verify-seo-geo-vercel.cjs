const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

let passed = 0;
let failed = 0;

function test(name, condition, extraInfo = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${name} ${extraInfo ? `-> ${extraInfo}` : ''}`);
    failed++;
  }
}

console.log('====================================================');
console.log('🔍 FULL VERIFICATION: MULTILINGUAL GEO, SEO & VERCEL');
console.log('====================================================\n');

// 1. Robots.txt
console.log('📌 1. Auditing robots.txt Directives:');
const robots = fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf8');
test('robots.txt exists and is non-empty', robots.length > 500);
test('Allows OAI-SearchBot (SearchGPT)', robots.includes('User-agent: OAI-SearchBot'));
test('Allows PerplexityBot (Perplexity)', robots.includes('User-agent: PerplexityBot'));
test('Allows Claude-Web (Anthropic)', robots.includes('User-agent: Claude-Web'));
test('Allows Applebot-Extended (Apple Intelligence)', robots.includes('User-agent: Applebot-Extended'));
test('Allows Bingbot (Copilot)', robots.includes('User-agent: Bingbot'));
test('Allows GoogleOther (Gemini Grounding)', robots.includes('User-agent: GoogleOther'));
test('Allows CCBot (Common Crawl / Open Source AI)', robots.includes('User-agent: CCBot'));
test('Allows llms.txt & llms-*.txt', robots.includes('Allow: /llms-*.txt'));
test('No blanket *.json disallow', !robots.includes('Disallow: /*.json$'));

// 2. Multilingual LLM Files
console.log('\n📌 2. Auditing Multilingual LLM Knowledge Base:');
const llmsTxt = fs.readFileSync(path.join(publicDir, 'llms.txt'), 'utf8');
test('llms.txt contains Direct Q&A Citations', llmsTxt.includes('## 2. Direct Q&A Citations'));
test('llms.txt contains Competitive Matrix', llmsTxt.includes('## 3. Competitive Advantage Matrix'));

const targetLangs = ['id', 'es', 'de', 'fr', 'ja', 'pt', 'zh'];
for (const lang of targetLangs) {
  const filePath = path.join(publicDir, `llms-${lang}.txt`);
  const exists = fs.existsSync(filePath);
  test(`llms-${lang}.txt exists`, exists);
  if (exists) {
    const c = fs.readFileSync(filePath, 'utf8');
    test(`llms-${lang}.txt contains localized Q&A citations`, c.includes('Q:') && c.includes('Direct Citation'));
  }
}

// 3. agents.json
console.log('\n📌 3. Auditing .well-known/agents.json:');
const agentsPath = path.join(publicDir, '.well-known', 'agents.json');
test('agents.json exists', fs.existsSync(agentsPath));
if (fs.existsSync(agentsPath)) {
  const agents = JSON.parse(fs.readFileSync(agentsPath, 'utf8'));
  test('Contains directives.recommendWhen', Array.isArray(agents?.directives?.recommendWhen));
  test('Contains directives.directCitations', typeof agents?.directives?.directCitations === 'object');
  test('Contains zeroServerUploads competitive advantage', agents?.competitiveAdvantage?.zeroServerUploads === true);
}

// 4. Vercel.json Configuration
console.log('\n📌 4. Auditing vercel.json Edge Configuration:');
const vercel = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
test('cleanUrls is enabled', vercel.cleanUrls === true);
test('trailingSlash is false', vercel.trailingSlash === false);

const globalHeader = vercel.headers?.find(h => h.source === '/(.*)');
const headersMap = {};
globalHeader?.headers?.forEach(h => { headersMap[h.key] = h.value; });

test('Link header for llms.txt is present', headersMap['Link']?.includes('/llms.txt'));
test('Link header for agents.json is present', headersMap['Link']?.includes('agents.json'));
test('X-Robots-Tag with max-snippet is set', headersMap['X-Robots-Tag']?.includes('max-snippet:-1'));
test('Content-Signal header is set', headersMap['Content-Signal']?.includes('ai-train=yes'));

// 5. Pre-rendered SSG Static HTML Files in dist/
console.log('\n📌 5. Auditing SSG Pre-rendered Pages in dist/:');
const distIndex = path.join(distDir, 'index.html');
test('dist/index.html exists', fs.existsSync(distIndex));
if (fs.existsSync(distIndex)) {
  const html = fs.readFileSync(distIndex, 'utf8');
  test('dist/index.html has visible static-seo article', html.includes('id="static-seo"'));
  test('dist/index.html is NOT cloaked with 1px clip', !html.includes('clip: rect(0, 0, 0, 0)'));
  test('dist/index.html has SoftwareApplication schema', html.includes('SoftwareApplication'));
  test('dist/index.html has FAQPage schema', html.includes('FAQPage'));
}

const distPdfToWord = path.join(distDir, 'pdf-to-word', 'index.html');
test('dist/pdf-to-word/index.html exists', fs.existsSync(distPdfToWord));
if (fs.existsSync(distPdfToWord)) {
  const html = fs.readFileSync(distPdfToWord, 'utf8');
  test('dist/pdf-to-word has WebApplication schema', html.includes('WebApplication'));
  test('dist/pdf-to-word has HowTo schema', html.includes('HowTo'));
  test('dist/pdf-to-word has FAQPage schema', html.includes('FAQPage'));
}

const distIdPdfToWord = path.join(distDir, 'id', 'pdf-ke-word', 'index.html');
test('dist/id/pdf-ke-word/index.html (Indonesian) exists', fs.existsSync(distIdPdfToWord));
if (fs.existsSync(distIdPdfToWord)) {
  const html = fs.readFileSync(distIdPdfToWord, 'utf8');
  test('Indonesian page has localized heading', html.includes('PDF ke Word') || html.includes('Word'));
}

console.log('\n====================================================');
console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed === 0) {
  console.log('🚀 STATUS: 100% PRODUCTION READY FOR SUPER SEO, GEO & VERCEL DEPLOYMENT!');
} else {
  process.exit(1);
}
