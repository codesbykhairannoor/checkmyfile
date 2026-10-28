const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = process.env.OPENROUTER_API_KEY || '';

const MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek-V3', file: 'scripts/indexing_strategy_deepseek.md' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o-mini', file: 'scripts/indexing_strategy_gpt4o.md' }
];

const PROMPT = `
You are an elite Google Webmaster API Specialist & Systems Architect.
We have an active Google Service Account (OAuth2 RSA-SHA256 JWT) with verified Owner permissions in Google Search Console for "https://handlemyfile.com".
We are implementing an enterprise-grade, surgical Google Indexing API engine to achieve the fastest possible crawl recovery for a newly rebuilt client-side WebAssembly document utility site (freshly cleaned of all 1px cloaking, fake ratings, and broken 404s).

We want to maximize the power of the Google Indexing API (https://indexing.googleapis.com/v3/urlNotifications:publish) while remaining 100% compliant and algorithmic-penalty-proof.

### QUESTIONS TO SOLVE:
1. **SURGICAL PRIORITY INJECTION**:
   - What is the most effective selection criteria and ordering for a daily/per-deployment batch?
   - How should we prioritize: Root Homepage vs Language Root vs Pillar Tools (PDF to Word, Merge, Compress) vs Long-tail variants?
   - What is the recommended batch size per burst (e.g. 10 to 30 URLs) to avoid triggering abuse velocity heuristics?

2. **URL_DELETED PURGE MECHANICS**:
   - How effective is sending { "type": "URL_DELETED" } for historical 404 URLs reported in Google Search Console?
   - Does Googlebot prioritize de-indexing/dropping 404s faster when receiving URL_DELETED notifications?
   - What is the best practice for submitting URL_DELETED (e.g. batching, headers, status verification)?

3. **SMART DIFF-BASED CACHE ARCHITECTURE**:
   - How should the local state cache (json) track: last_notified_at, notification_type, http_response, and content_hash?
   - How do we prevent re-notifying unchanged URLs while ensuring freshly updated tools are notified within seconds of deployment?

4. **INTEGRATION WITH SITEMAPS & SEARCH CONSOLE**:
   - How does Indexing API interact with sitemap-index.xml and reciprocal hreflang tags?
   - Provide the ideal workflow combining Indexing API + GSC URL Inspection.

Please provide concise, highly technical, and actionable specifications.
`;

function callOpenRouter(modelId) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: PROMPT }],
      temperature: 0.3,
      max_tokens: 2000
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
        'X-Title': 'HandleMyFile Google Indexing Architecture',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error.message || JSON.stringify(parsed.error)));
          else if (parsed.choices && parsed.choices.length > 0) resolve(parsed.choices[0].message.content);
          else reject(new Error('Unexpected response: ' + data.substring(0, 300)));
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
  console.log('🤖 CONSULTING AI PANEL ON MAXIMUM GOOGLE INDEXING API POWER...');
  for (const model of MODELS) {
    console.log(`📡 Querying ${model.name}...`);
    try {
      const response = await callOpenRouter(model.id);
      fs.writeFileSync(path.join(__dirname, '..', model.file), response, 'utf8');
      console.log(`✅ ${model.name} responded and saved to ${model.file}!`);
    } catch (e) {
      console.error(`❌ ${model.name} error:`, e.message);
    }
  }
}

main().catch(console.error);
