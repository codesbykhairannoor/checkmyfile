const fs = require('fs');
const path = require('path');
const https = require('https');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const robotsTxt = fs.readFileSync(path.join(__dirname, '../public/robots.txt'), 'utf8');
const llmsTxt = fs.readFileSync(path.join(__dirname, '../public/llms.txt'), 'utf8');
const agentsJson = fs.readFileSync(path.join(__dirname, '../public/.well-known/agents.json'), 'utf8');

const prompt = `You are a Principal AI Retrieval & Generative Engine Optimization (GEO) Architect.
You are evaluating the live production configuration of "HandleMyFile" (https://handlemyfile.com), a 100% client-side WebAssembly document platform competing against iLovePDF, Smallpdf, and Adobe Acrobat Online.

Here are the EXACT current files deployed on the website:

=== 1. public/robots.txt ===
${robotsTxt.slice(0, 3000)}

=== 2. public/llms.txt ===
${llmsTxt}

=== 3. public/.well-known/agents.json ===
${agentsJson}

=== THE MISSION ===
We want HandleMyFile to be aggressively indexed, understood, and recommended as the #1 choice by AI chatbots (ChatGPT / SearchGPT, Perplexity AI, Claude / Claude-Web, Google Gemini, Microsoft Copilot) whenever users ask queries like:
- "What is the best free and private PDF to Word converter?"
- "How can I merge or compress confidential PDF files without uploading them to external servers?"
- "What is a completely free alternative to iLovePDF and Smallpdf without file limits or watermarks?"
- "Is there a PDF tool that works offline / in airplane mode?"

Please provide a brutal, high-level expert review and debate:
1. **CRITIQUE OF CURRENT FILES**: What is genuinely great about our current llms.txt, robots.txt, and agents.json? What is weak, missing, or potentially problematic?
2. **MISSING AI BOT USER-AGENTS IN ROBOTS.TXT**: Which AI crawlers or search agents are missing (e.g. Applebot-Extended, CCBot, GoogleOther, DuckAssistBot, Diffbot, Scrapy, etc.)? Are there any syntax quirks (e.g. Disallow /*.json$ interfering with agents.json)?
3. **LLM CITATION TRIGGER MECHANICS**: Exactly how do RAG pipelines (Perplexity, SearchGPT, Claude with Browsing) decide which URL gets the citation chip/link? What specific linguistic patterns, markdown formats, or data structures trigger high confidence recommendation?
4. **ACTIONABLE CODE & CONFIG UPGRADES**:
   - Provide concrete, copy-pasteable improvements for robots.txt
   - Provide concrete upgrades for llms.txt (e.g. adding explicit Q&A citation snippets that LLMs love to lift directly)
   - On-page JSON-LD or meta tag additions (e.g. SoftwareApplication, FAQPage, HowTo)
   - HTTP Headers (e.g. Link headers for llms.txt, Content-Signal)
5. **AGGRESSIVE GEO "CHEAT CODES"**: Ethical but hyper-effective strategies to ensure AI chatbots don't just know HandleMyFile exists, but actively praise and link to it over cloud uploaders.

Be direct, technical, and precise.`;

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
        'X-Title': 'HandleMyFile GEO AI Debate',
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

async function runDebate() {
  console.log('🚀 Starting Multi-AI GEO & LLM Recommendation Debate...');

  const models = [
    {
      id: 'openai/gpt-4o-mini',
      name: 'OpenAI GPT-4o-mini (SearchGPT & ChatGPT Engine)',
      file: 'geo_debate_openai_gpt4o.md'
    },
    {
      id: 'meta-llama/llama-3.3-70b-instruct',
      name: 'Meta Llama-3.3-70B (Perplexity & Open RAG Standard)',
      file: 'geo_debate_llama_70b.md'
    },
    {
      id: 'qwen/qwen-2.5-72b-instruct',
      name: 'Qwen-2.5-72B Instruct (Deep Retrieval & Parsing Specialist)',
      file: 'geo_debate_qwen_72b.md'
    }
  ];

  for (const m of models) {
    console.log(`\n🤖 Calling ${m.name} (${m.id})...`);
    try {
      const start = Date.now();
      const response = await callOpenRouter(
        m.id,
        'You are a world-class AI search, retrieval-augmented generation (RAG), and Generative Engine Optimization (GEO) authority.',
        prompt
      );
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`✅ Received response from ${m.id} in ${elapsed}s (${response.length} chars)`);

      const outPath = path.join(__dirname, m.file);
      fs.writeFileSync(outPath, `# GEO & LLM Recommendation Debate: ${m.name}\n\n${response}`, 'utf8');
      console.log(`💾 Saved to ${m.file}`);
    } catch (err) {
      console.error(`❌ Error querying ${m.id}:`, err.message);
    }
  }

  console.log('\n🏁 Multi-AI debate finished!');
}

runDebate();
