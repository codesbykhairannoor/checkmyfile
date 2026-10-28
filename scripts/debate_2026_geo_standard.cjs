const fs = require('fs');
const path = require('path');
const https = require('https');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const robotsTxt = fs.readFileSync(path.join(__dirname, '../public/robots.txt'), 'utf8');
const llmsTxt = fs.readFileSync(path.join(__dirname, '../public/llms.txt'), 'utf8');
const agentsJson = fs.readFileSync(path.join(__dirname, '../public/.well-known/agents.json'), 'utf8');
const vercelJson = fs.readFileSync(path.join(__dirname, '../vercel.json'), 'utf8');

// Sample head from dist/pdf-to-word/index.html
let sampleHtmlHead = '';
const sampleHtmlPath = path.join(__dirname, '../dist/pdf-to-word/index.html');
if (fs.existsSync(sampleHtmlPath)) {
  const content = fs.readFileSync(sampleHtmlPath, 'utf8');
  const match = content.match(/<head>([\s\S]*?)<\/head>/i);
  if (match) {
    sampleHtmlHead = match[1].slice(0, 3000);
  }
}

const prompt = `You are an elite research council defining the "2026-2027 SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization) Gold Standard" for Web Applications.

You are conducting a ruthless adversarial forensic audit of "HandleMyFile" (https://handlemyfile.com), an enterprise-grade 100% Client-Side WebAssembly (WASM) document suite.

Here is the CURRENT production configuration:

=== 1. public/robots.txt ===
${robotsTxt.slice(0, 2000)}

=== 2. public/llms.txt ===
${llmsTxt.slice(0, 2500)}

=== 3. public/.well-known/agents.json ===
${agentsJson}

=== 4. vercel.json ===
${vercelJson}

=== 5. Sample Rendered <head> (from dist/pdf-to-word/index.html) ===
${sampleHtmlHead}

---

### YOUR OBJECTIVES:
1. **THE 2026-2027 GEO / AEO / SEO STANDARD**:
   - What are the bleeding-edge standards for 2026-2027 that separate amateur sites from sites that AI engines (SearchGPT, Perplexity Sonar, Claude 3.7, Google Gemini 2.5, DeepSeek-R1 Search) treat as "ground-truth authoritative sources"?
   - (e.g. Entity Reconciliation with Wikidata/Schema.org @graph, Direct-Answer Density (DAD), Claim-Proof Triples, Zero-Hallucination verification markers, Agent-to-Agent protocol integration, RFC 9309, Content-Signal IETF standard).

2. **RUTHLESS AUDIT: DOES HANDLEMYFILE MEET THIS STANDARD OR ARE THERE STILL CACAT (FLAWS)?**:
   - Inspect our files line by line: What subtle flaws, missing properties, or blind spots still exist?
   - Check Schema.org JSON-LD: Are we missing \`isAccessibleForFree\`, \`offers\`, \`creator\`, \`publisher\`, \`sameAs\` entity IDs?
   - Check \`agents.json\`: Is it fully conformant with emerging autonomous agent schemas (OpenAI Agent Manifest, LangChain tool definitions)?
   - Check \`llms.txt\` and on-page HTML: Are there semantic gaps in how claims are proved to an AI evaluator?

3. **CONCRETE CODE UPGRADES & PATCHES**:
   - Provide exact, drop-in code fixes for any defect you discover.
   - Give an authoritative score (0-100) on how close HandleMyFile is to the 2026-2027 Gold Standard.

Be direct, uncompromising, and deeply technical.`;

async function callOpenRouter(modelName, systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 3000
    });

    const req = https.request({
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://handlemyfile.com',
        'X-Title': 'HandleMyFile 2026-2027 GEO Audit',
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

async function runAudit() {
  console.log('🚀 Memulai Multi-AI Council: Merumuskan Standar GEO/AEO 2026-2027 & Forensic Audit...');

  const models = [
    {
      id: 'openai/gpt-4o-mini',
      name: 'OpenAI GPT-4o-mini (SearchGPT & ChatGPT Standard)',
      file: 'scripts/geo_2026_audit_gpt4o.md'
    },
    {
      id: 'meta-llama/llama-3.3-70b-instruct',
      name: 'Meta Llama-3.3-70B (Perplexity & Open Web RAG Standard)',
      file: 'scripts/geo_2026_audit_llama.md'
    },
    {
      id: 'qwen/qwen-2.5-72b-instruct',
      name: 'Qwen-2.5-72B Instruct (Deep Retrieval & Entity Graph Specialist)',
      file: 'scripts/geo_2026_audit_qwen.md'
    }
  ];

  for (const m of models) {
    console.log(`\n🤖 Konsultasi dengan ${m.name}...`);
    try {
      const resp = await callOpenRouter(
        m.id,
        'You are the Chief Standards Officer of the World Wide Web Consortium (W3C) for AI Agents, Search Engines, and Knowledge Graphs.',
        prompt
      );
      const outPath = path.join(__dirname, '..', m.file);
      fs.writeFileSync(outPath, `# 2026-2027 GEO & AEO Forensic Audit: ${m.name}\n\n${resp}`, 'utf8');
      console.log(`✅ ${m.name} selesai! Tersimpan di ${m.file} (${resp.length} karakter)`);
    } catch (err) {
      console.error(`❌ Gagal pada ${m.name}:`, err.message);
    }
  }

  console.log('\n🏁 Audit Dewan AI 2026-2027 selesai!');
}

runAudit();
