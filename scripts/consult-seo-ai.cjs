const fs = require('fs');
const https = require('https');
const path = require('path');

// User OpenRouter Chat Key (from same user account user_3KXf3oBQGwNN5xxmjSydNO5Z8Tb with $0.39 budget)
const API_KEY = process.env.OPENROUTER_API_KEY || '';

const MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek-V3' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama-3.3-70B' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o-mini' }
];

const AUDIT_PROMPT = `
You are an elite Principal Technical SEO Architect, Google Webmaster Systems specialist, and Modern Web Application Performance Engineer.
You are conducting a forensic post-mortem and recovery strategy for a web application that has flatlined for 3 months.

### WEBSITE PROFILE
- Domain: handlemyfile.com
- Stack: Vite + React 19 (SPA) deployed on Vercel, with custom pre-rendering scripts (generate-seo-html.ts) writing static HTML to dist/
- Core Value Prop: 100% Client-Side WebAssembly / JS Document Utilities (PDF merge, compress, split, convert, OCR, edit, sign, redact, zero-upload privacy)
- Domain Age: ~3 Months

### LIVE GOOGLE SEARCH CONSOLE (GSC) METRICS (Last 3 Months)
- Total Clicks: 7 clicks
- Total Impressions: 3,200 impressions (had a small peak in late August of ~300/day, then flatlined down to ~10/day in Oct)
- Average CTR: 0.2%
- Average Position: 63.8
- Indexing Coverage Breakdown:
  * Indexed pages: 358
  * Not Indexed pages: 1,610
    - "Ditemukan - saat ini tidak diindeks" (Discovered - currently not indexed): 1,412 URLs!
    - "Tidak ditemukan (404)": 168 URLs (Status: Gagal)
    - "Halaman dengan pengalihan" (Redirects): 28 URLs
    - "Di-crawl - saat ini tidak diindeks" (Crawled - currently not indexed): 6 URLs

### CODEBASE FORENSIC AUDIT FINDINGS (Discovered inside the repository)
1. **THE CSS CLOAKING / HIDDEN TEXT FATAL BLUNDER**:
   In \`scripts/generate-seo-html.ts\`, the pre-rendered SEO content (H1, H2, How-To steps, FAQs, tools directory) is placed in \`<main id="static-seo">\`, BUT it is styled in \`<head>\` with:
   \`\`\`css
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
   \`\`\`
   The developer added this to prevent "Flash of Unstyled Content" (FOUC) before React loads! But Googlebot uses headless Chromium to render CSS. All textual content on every generated page is rendered visually at 1x1 pixel and clipped off-screen into invisibility.

2. **GOOGLE INDEXING API MISUSE**:
   In \`scripts/submit-google-indexing.ts\` and \`scripts/google-indexing-daemon.ts\`, the site has an automated daily cron daemon pushing 200 URLs/day to Google Indexing API (\`https://indexing.googleapis.com/v1/urlNotifications:publish\` with \`URL_UPDATED\`). Google's official documentation explicitly specifies the Indexing API is ONLY for JobPosting or BroadcastEvent pages.

3. **PROGRAMMATIC MULTILINGUAL INFLATION ON A FRESH DOMAIN**:
   The site supports 30 languages across ~50 tools, generating ~1,800+ static HTML pages with Google Translate machine translations and identical section structures ("Upload -> Select -> Download"), launched all at once on a brand-new domain with Domain Rating (DR) = 0 and zero backlinks.

4. **FABRICATED STRUCTURED DATA (SPAMMY SCHEMA)**:
   In \`generate-seo-html.ts\`, JSON-LD schema includes hardcoded fake reviews:
   \`"aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": 3309 }\`
   There is no user rating or review submission mechanism anywhere on the website.

5. **168 404 ERRORS & SOFT 404 HOME-PAGE REDIRECTS**:
   Old/corrupted slugs (e.g. \`/ja/pdf-\`, \`/uk/-\`, \`/ar/-csv\`) produced 168 404s. The developer attempted to fix this in \`404-redirect-map.json\` by redirecting specific tool URLs (e.g., \`/de/pdf-zu-word\` -> \`/de\`, \`/vi/pdf-to-word\` -> \`/vi\`, \`/th/pdf-to-image\` -> \`/th\`) directly to localized homepages, which Google Search treats as Soft 404s.

6. **DISABLED HIGH-VOLUME TOOL**:
   The highest-volume global search query in this niche ("pdf to word") is disabled in \`src/App.tsx\` (\`disabledSlugs = ['pdf-to-word', ...]\`) and redirected.

7. **Vercel SPA Rewrites Conflict**:
   In \`vercel.json\`, \`cleanUrls: true\` and \`rewrites: [{ "source": "/(.*)", "destination": "/index.html" }]\` routes unmatched static requests to the generic root index.html rather than returning a 404 HTTP status code.

### YOUR TASK
Provide a rigorous, candid, and highly technical review answering:
1. **Diagnosis**: Why did impressions rise briefly in late August and then flatline? Why are 1,412 pages stuck in "Discovered - currently not indexed"?
2. **Impact Analysis**: Rank the severity of the 7 issues discovered (from #1 most fatal to #7). Explain specifically how Google's WRS (Web Rendering Service) and Spam algorithms reacted to the \`#static-seo\` 1px CSS and fake AggregateRating.
3. **Turnaround Roadmap**: Give an exact, prioritized, pragmatic step-by-step action plan to rescue the domain within 30-60 days.
4. **Summary Verdict**: A concise 2-sentence bottom-line conclusion for the developer.

Please be deeply technical, direct, and actionable.
`;

function callOpenRouter(modelId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: AUDIT_PROMPT }],
      temperature: 0.2,
      max_tokens: 2000
    });

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'HTTP-Referer': 'https://handlemyfile.com',
        'X-Title': 'HandleMyFile SEO Recovery Consultation'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) {
            reject(new Error(`[${modelId}] API Error: ` + JSON.stringify(json.error)));
          } else {
            const usage = json.usage || {};
            let text = '';
            if (json.choices && json.choices[0] && json.choices[0].message) {
              text = json.choices[0].message.content || '';
            }
            resolve({ model: modelId, text: String(text), usage });
          }
        } catch (e) {
          reject(new Error(`[${modelId}] Parse error: ` + e.message + ' Raw: ' + body.slice(0, 200)));
        }
      });
    });

    req.on('error', e => reject(e));
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🤖 INITIATING MULTI-AI SEO CONSULTATION COUNCIL VIA OPENROUTER...\n');
  let grandTotalCost = 0;
  const results = [];

  for (const m of MODELS) {
    process.stdout.write(`⏳ Consulting ${m.name} (${m.id})... `);
    try {
      const res = await callOpenRouter(m.id);
      const cost = res.usage.cost || 0;
      grandTotalCost += cost;
      console.log(`SUCCESS! (Cost: $${cost.toFixed(5)}, Tokens: ${res.usage.total_tokens})`);

      const outPath = path.join(__dirname, `ai_consult_${m.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`);
      fs.writeFileSync(outPath, res.text, 'utf8');
      results.push({ name: m.name, cost, file: outPath });
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 ALL CONSULTATIONS FINISHED!`);
  console.log(`💰 GRAND TOTAL SPENT: $${grandTotalCost.toFixed(5)} (Target: < $0.50)`);
  console.log('='.repeat(60));
}

main().catch(console.error);
