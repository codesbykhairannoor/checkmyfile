const fs = require('fs');
const path = require('path');
const https = require('https');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const vercelJson = fs.readFileSync(path.join(__dirname, '../vercel.json'), 'utf8');
const llmsTxt = fs.readFileSync(path.join(__dirname, '../public/llms.txt'), 'utf8');

const prompt = `You are an elite panel of Search Engine Optimization (SEO), Generative Engine Optimization (GEO), and Vercel Edge Infrastructure Architects.

We need your expert critique, debate, and verdict on TWO CRITICAL ARCHITECTURAL DECISIONS for "HandleMyFile" (https://handlemyfile.com), an enterprise-grade 100% client-side WASM PDF platform:

=== 1. MULTILINGUAL GEO & LLM CHATBOT FOCUS (30 LANGUAGES) ===
HandleMyFile supports 30 languages (en, id, es, fr, de, ja, pt, ru, zh, ar, etc.) with pre-rendered static HTML pages for all tools (e.g., https://handlemyfile.com/id/pdf-ke-word, https://handlemyfile.com/es/pdf-a-word, https://handlemyfile.com/de/pdf-in-word).

QUESTION FOR DEBATE:
- When a user asks an LLM (ChatGPT, Perplexity, Claude, Gemini) in Indonesian ("rekomendasi website ubah pdf ke word gratis tanpa upload server") or Spanish or German:
  - Is having a single English-centric \`llms.txt\` sufficient, or is it a major bottleneck for non-English queries?
  - Should we implement dedicated localized \`llms-{lang}.txt\` files (e.g. \`llms-id.txt\`, \`llms-es.txt\`, \`llms-de.txt\`) with native localized Q&A citation snippets?
  - Or should we add multilingual Q&A sections directly inside \`llms.txt\` and \`llms-full.txt\`?
  - How do multilingual embeddings (e.g., Cohere Embed v3 Multilingual, OpenAI text-embedding-3) and cross-lingual RAG retrieve and cite localized URLs?

=== 2. VERCEL.JSON AUDIT & LIVE EDGE ROUTING ===
Here is our EXACT current \`vercel.json\`:
\`\`\`json
${vercelJson}
\`\`\`

Our SSG build outputs 3,649 static HTML files into \`dist/\`, such as:
- \`dist/index.html\`
- \`dist/pdf-to-word/index.html\`
- \`dist/id/index.html\`
- \`dist/id/pdf-ke-word/index.html\`

QUESTION FOR DEBATE:
- Does \`"cleanUrls": true, "trailingSlash": false\` combined with \`"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]\` properly serve these 3,649 static HTML files to Googlebot and PerplexityBot, or does the SPA rewrite risk intercepting static paths?
- What exact HTTP headers are missing or sub-optimal in \`vercel.json\`?
  - \`Link\` header syntax: Is \`</llms.txt>; rel="llms-txt"\` recognized by bots, or should it also include \`rel="alternate"; type="text/markdown"\`?
  - Should we inject \`Content-Signal\` headers in Vercel?
  - Should we inject \`X-Robots-Tag: all, max-snippet:-1, max-image-preview:large, max-video-preview:-1\`?
  - What caching headers are best for \`llms.txt\`, \`robots.txt\`, and \`agents.json\`?

=== DELIVERABLES ===
1. Multilingual LLM Strategy: Detailed verdict and concrete implementation plan.
2. Production-ready, fully corrected \`vercel.json\` with all headers, routing rules, and verification checks.
3. Verification steps to test locally or on live Vercel deployments.`;

async function callOpenRouter(modelName, systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2500
    });

    const req = https.request({
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://handlemyfile.com',
        'X-Title': 'HandleMyFile Multilingual GEO & Vercel Debate',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error(`API Error: ${body}`));
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

async function run() {
  console.log('🚀 Running Multi-AI Debate on Multilingual GEO & Vercel Configuration...');

  const models = [
    {
      id: 'openai/gpt-4o-mini',
      name: 'OpenAI GPT-4o-mini',
      file: 'scripts/debate_vercel_gpt4o.md'
    },
    {
      id: 'meta-llama/llama-3.3-70b-instruct',
      name: 'Meta Llama-3.3-70B',
      file: 'scripts/debate_vercel_llama.md'
    },
    {
      id: 'qwen/qwen-2.5-72b-instruct',
      name: 'Qwen-2.5-72B',
      file: 'scripts/debate_vercel_qwen.md'
    }
  ];

  for (const m of models) {
    console.log(`🤖 Querying ${m.name}...`);
    try {
      const resp = await callOpenRouter(
        m.id,
        'You are a distinguished web infrastructure and search retrieval authority.',
        prompt
      );
      fs.writeFileSync(path.join(__dirname, '..', m.file), resp, 'utf8');
      console.log(`✅ ${m.name} finished (${resp.length} chars) -> ${m.file}`);
    } catch (err) {
      console.error(`❌ ${m.name} failed:`, err.message);
    }
  }

  console.log('🏁 Debate finished!');
}

run();
