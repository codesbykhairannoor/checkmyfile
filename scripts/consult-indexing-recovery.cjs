const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = process.env.OPENROUTER_API_KEY || '';

const MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek-V3', file: 'scripts/recovery_deepseek_v3.md' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o-mini', file: 'scripts/recovery_gpt_4o_mini.md' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama-3.3-70B', file: 'scripts/recovery_llama_3_3_70b.md' }
];

const PROMPT = `
You are a Principal Google Search Quality Engineer & Senior Technical SEO Architect.
The webmaster of "handlemyfile.com" has just completed an emergency overhaul of their codebase following a 3-month flatline (1,412 pages stuck in "Discovered - currently not indexed", 7 clicks total, 168 404s).

Here is the exact summary of the architectural changes deployed to the codebase today:

### 1. FATAL CLOAKING REMOVED
- **Before**: Pre-rendered static SEO HTML was styled with \`#anti-fouc { position: absolute; width: 1px; height: 1px; clip: rect(0,0,0,0); overflow: hidden; }\`. Google's Chromium WRS rendered all textual content as invisible 1x1px cloaked text.
- **After**: \`anti-fouc\` has been completely deleted. Replaced with \`#static-seo-styles\` rendering fully visible, responsive semantic HTML (\`<main id="static-seo">\`, \`<article>\`, \`<header>\`, \`<h1>\`, \`<h2>\`, \`<p>\`, \`<ul>\`, \`<li>\`) with clean readable typography (max-width 1100px, 1.6 line-height, proper contrast).

### 2. DECEPTIVE STRUCTURED DATA ELIMINATED
- **Before**: Every page injected hardcoded fake \`aggregateRating\` (4.9/5 from 1,250 reviews) for a new site with 7 clicks, triggering Google rich snippet penalty filters.
- **After**: All fake ratings wiped clean. Only 100% compliant Schema.org JSON-LD is injected:
  - \`WebApplication\` (with zero price, HTML5/WASM requirements).
  - \`HowTo\` (with genuine step-by-step instructions matching on-page content).
  - \`FAQPage\` (with authentic questions and answers directly rendered in the DOM).

### 3. GOOGLE INDEXING API ABUSE HALTED
- **Before**: A Windows Scheduled Task daemon was pushing 200 non-Job/non-Broadcast URLs every day to Google Indexing API, which risks algorithmic spam flagging.
- **After**: The scheduled task was permanently deleted. Script has guardrails and is deactivated.

### 4. 404s & SOFT-404s REPAIRED
- **Before**: 168 404 errors in GSC; missing slugs caused blank states; soft-404 redirects were kicking users to homepage.
- **After**: All legacy GSC 404 paths are cleanly mapped to relevant active tool URLs; invalid garbage slugs return true 404; created dedicated, lightweight \`public/404.html\`.

### 5. PDF TO WORD ENGINE & MULTILINGUAL SSG LAUNCHED
- **Engine**: Implemented client-side dual-layer engine (primary WASM + spatial reflow parser OpenXML DOCX generator via pdfjs-dist + fflate).
- **Navigation**: "PDF to Word" integrated into Desktop Quick Tabs, Mega Menu, Mobile Quick Tabs, and Mobile Menu.
- **SSG**: 3,649 static HTML files generated across 30 languages with distinct section styling for different tools (\`pdf-to-word\` vs \`pdf-to-word-without-losing-formatting\`).
- **Internal Linking**: Injected an internal tools directory on all pages (no orphan pages).
- **Sitemaps**: Generated \`sitemap-index.xml\`, 30 language-specific sitemaps, \`sitemap-all.xml\`, RSS 2.0 \`feed.xml\`, and Atom \`atom.xml\`.

---

### PLEASE PROVIDE A RIGOROUS, HONEST, TECHNICAL ASSESSMENT:
1. **CODE & ARCHITECTURE AUDIT**: Is the current codebase clean, modern, and aligned with Google's Search Essentials (formerly Webmaster Guidelines)? Are there any remaining algorithmic traps?
2. **INDEXABILITY & GOOGLEBOT PERCEPTION**: Will Google now be able to easily crawl and index these pages? How will Googlebot Chromium WRS react to the visible pre-rendered HTML replacing the 1px cloaking?
3. **RECOVERY TRAJECTORY & TIMELINE**: What is the realistic timeline for Google to re-evaluate the domain? How will the transition from "Discovered - currently not indexed" to "Indexed" unfold?
4. **TACTICAL GSC ACTION PLAN**: What EXACT steps should the webmaster execute inside Google Search Console right now (e.g., Validate Fix on 404s, resubmitting sitemap, URL Inspection on key seed pages)?
5. **LONG-TERM QUALITY SIGNALS**: How can the webmaster ensure Google continues to love and favor this website over competitors?
`;

function callOpenRouter(modelId) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: modelId,
      messages: [
        { role: 'user', content: PROMPT }
      ],
      temperature: 0.3,
      max_tokens: 2500
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://handlemyfile.com',
        'X-Title': 'HandleMyFile Codebase SEO Re-evaluation',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || JSON.stringify(parsed.error)));
          } else if (parsed.choices && parsed.choices.length > 0) {
            resolve({
              content: parsed.choices[0].message.content,
              usage: parsed.usage
            });
          } else {
            reject(new Error('Unexpected response format: ' + data.substring(0, 300)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🌐 INITIATING MULTI-AI RE-EVALUATION PANEL VIA OPENROUTER...');
  console.log('💰 Estimated cost: < $0.003 total\n');

  let totalCost = 0;

  for (const model of MODELS) {
    console.log(`🤖 Consulting ${model.name} (${model.id})...`);
    const startTime = Date.now();
    try {
      const result = await callOpenRouter(model.id);
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`✅ ${model.name} responded in ${duration}s!`);
      if (result.usage) {
        console.log(`   Tokens: Prompt=${result.usage.prompt_tokens}, Completion=${result.usage.completion_tokens}, Total=${result.usage.total_tokens}`);
      }

      fs.writeFileSync(path.join(__dirname, '..', model.file), result.content, 'utf8');
      console.log(`   Saved report to ${model.file}\n`);
    } catch (err) {
      console.error(`❌ Failed with ${model.name}:`, err.message);
    }
  }

  console.log('🎉 ALL AI REVIEWS COMPLETE!');
}

main().catch(console.error);
