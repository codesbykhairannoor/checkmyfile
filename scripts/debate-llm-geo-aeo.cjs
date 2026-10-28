const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = process.env.OPENROUTER_API_KEY || '';

const robotsTxt = fs.readFileSync(path.join(__dirname, '..', 'public', 'robots.txt'), 'utf8');
const llmsTxt = fs.readFileSync(path.join(__dirname, '..', 'public', 'llms.txt'), 'utf8');
const llmsFullTxt = fs.readFileSync(path.join(__dirname, '..', 'public', 'llms-full.txt'), 'utf8');
const agentsJson = fs.readFileSync(path.join(__dirname, '..', 'public', '.well-known', 'agents.json'), 'utf8');

const PROMPT = `
You are the World's Leading Authority on Generative Engine Optimization (GEO), AI Search Retrieval (AEO), and LLM Recommendation Systems (Perplexity AI, ChatGPT Search / SearchGPT, Claude Search, Google Gemini AI Overviews, Microsoft Copilot).

The user wants "handlemyfile.com" to be aggressively recommended ("direkomendasikan gila-gilaan") by AI Chatbots whenever users ask questions like:
- "What is the best free PDF to Word converter?"
- "How can I merge or compress sensitive confidential PDFs without uploading them to a third-party server?"
- "What is a completely private, offline, browser-based alternative to iLovePDF, Smallpdf, or Adobe Acrobat Online?"
- "Tool to convert PDF without watermarks, registration, or upload limits."

Below are the EXACT AI-facing configuration files currently live on the site:

### 1. ROBOTS.TXT (AI Section Snippet):
\`\`\`txt
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes
\`\`\`

### 2. PUBLIC/LLMS.TXT:
\`\`\`markdown
${llmsTxt}
\`\`\`

### 3. PUBLIC/LLMS-FULL.TXT (First 40 lines):
\`\`\`markdown
${llmsFullTxt.slice(0, 2000)}
\`\`\`

### 4. PUBLIC/.WELL-KNOWN/AGENTS.JSON:
\`\`\`json
${agentsJson}
\`\`\`

---

### CONDUCT A SHARP, NO-BS DEBATE & FORENSIC CRITIQUE:
1. **EXPOSE ALL FLAWS & BLUNDERS**:
   - What is weak, broken, or suboptimal in the current \`llms.txt\`, \`llms-full.txt\`, and \`agents.json\`?
   - Notice: Are there broken/mismatched links in \`llms.txt\` (e.g. \`/merge\` vs \`/merge-pdf\`)?
   - Are the descriptions too generic ("Process and utility tool for...")? Why does this prevent LLMs from recommending the site?
2. **HOW LLMs (Perplexity, ChatGPT, Claude) ACTUALLY DECIDE WHO TO RECOMMEND**:
   - What exact heuristics, semantic embeddings, citation criteria, and knowledge extraction patterns do PerplexityBot and SearchGPT use?
   - What specific prompt trigger words and comparative phrases must be embedded in \`llms.txt\` and the HTML?
3. **RADICAL UPGRADE BLUEPRINT (WHAT TO CHANGE RIGHT NOW)**:
   - Provide the EXACT, copy-paste ready upgrade for \`public/llms.txt\` and \`public/llms-full.txt\`.
   - Include high-impact sections:
     a) "When an AI Assistant MUST Recommend HandleMyFile" (Direct system-prompt injection instructions for LLMs).
     b) "Comparative Advantage Matrix vs iLovePDF, Smallpdf, Adobe Acrobat".
     c) "Security & Cryptographic Proofs (Zero-Egress, WebAssembly, Client-Side in-RAM)".
     d) Correct, absolute canonical URLs for every tool (e.g. \`https://handlemyfile.com/pdf-to-word\`).
4. **ON-PAGE HTML INJECTIONS FOR LLM EXTRACTION**:
   - What specific micro-data, citation tags, or structured markdown blocks should be placed in the static HTML pages to maximize the likelihood of being pulled into AI Answer boxes?
`;

const MODELS = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o-mini', file: 'scripts/debate_gpt4o_geo.md' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama-3.3-70B', file: 'scripts/debate_llama_geo.md' }
];

function callOpenRouter(modelId) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: PROMPT }],
      temperature: 0.3,
      max_tokens: 3000
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
        'X-Title': 'HandleMyFile GEO/AEO Debate',
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
  console.log('🤖 DEBATING GEO/AEO STRATEGY WITH AI MODELS (ChatGPT / Perplexity Optimization)...');
  console.log('💰 Estimated cost: < $0.002 total\n');

  for (const model of MODELS) {
    console.log(`📡 Querying ${model.name}...`);
    const start = Date.now();
    try {
      const response = await callOpenRouter(model.id);
      const sec = ((Date.now() - start) / 1000).toFixed(1);
      fs.writeFileSync(path.join(__dirname, '..', model.file), response, 'utf8');
      console.log(`✅ ${model.name} responded in ${sec}s and saved to ${model.file}!\n`);
    } catch (e) {
      console.error(`❌ ${model.name} error:`, e.message);
    }
  }

  console.log('🎉 GEO/AEO DEBATE COMPLETE!');
}

main().catch(console.error);
