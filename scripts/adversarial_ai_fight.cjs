const fs = require('fs');
const path = require('path');
const https = require('https');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const prompt = `You are staging a FIERCE, NO-HOLDS-BARRED ADVERSARIAL DEBATE between three world-class AI personas about the current production state of "HandleMyFile" (https://handlemyfile.com):

### THE CONTEXT (CURRENT AUDITED STATE OF HANDLEMYFILE):
- **Core Engine**: 100% Client-Side WebAssembly (WASM). No files are uploaded to servers (Zero-Egress).
- **Recent Fixes**:
  1. Completely eradicated #anti-fouc 1px hidden cloaking. Pre-rendered HTML is now clean, 100% visible semantic HTML with real <article>, <header>, <h1>, <h2>, <p>, and internal links.
  2. Deleted all fake aggregateRating schemas (no fake 4.9/5 stars). Only clean SoftwareApplication, FAQPage, and HowTo JSON-LD.
  3. Added PDF to Word WASM dual-layer engine (C++ WASM + spatial paragraph layout recovery).
  4. 3,649 static pre-rendered HTML files across 30 languages with 100% reciprocal hreflang tags.
  5. Robots.txt whitelists 15+ AI crawlers (SearchGPT, Perplexity, Claude, Applebot-Extended, CCBot, GoogleOther, Bingbot).
  6. Dedicated localized LLM knowledge bases: llms.txt, llms-full.txt, and llms-{id,es,de,fr,ja,pt,zh}.txt with Direct Q&A Citation Snippets.
  7. Vercel edge headers: Link header for llms.txt, X-Robots-Tag (max-snippet:-1), Content-Signal (ai-train=yes).

### THE DEBATERS:
1. **DR. CYNIC (The Ruthless Red-Team Skeptic)**:
   - Extremely skeptical, aggressive, challenges every assumption.
   - Attacks: "Why might Google STILL drag its feet? Can 3,649 pages be viewed as programmatic SEO spam? Why would Perplexity or ChatGPT cite HandleMyFile when Adobe and iLovePDF have millions of backlinks? What blind spots are we ignoring?"
2. **ALEX (The GEO & WebAssembly Architecture Defender)**:
   - Passionate, razor-sharp, data-driven defender.
   - Rebuts Dr. Cynic with hard technical facts: Why the cloaking fix unlocks crawl budget, why RAG embeddings prefer zero-hedging Q&A citation snippets over bloated cloud sites, and why zero-upload privacy gives an unassailable USP.
3. **THE SUPREME JUDGE (Chief AI Retrieval & Search Benchmark Officer)**:
   - Impartial, authoritative.
   - Evaluates the brawl point-by-point.
   - Awards an honest Readiness Score (0-100).
   - Delivers the final verdict: What is the single biggest threat remaining, and what will happen in the next 14 to 30 days when Googlebot and Perplexity recrawl?

Write out the full, heated, dramatic, highly technical debate with intense back-and-forth dialogue!`;

async function callOpenRouter(modelName, systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6,
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
        'X-Title': 'HandleMyFile Adversarial AI Battle',
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

async function runBattle() {
  console.log('🥊 Memulai Pertarungan Sengit antar AI (Adversarial Showdown)...');

  try {
    console.log('🔥 Memanggil Meta Llama-3.3-70B Instruct untuk memandu debat red team vs blue team...');
    const result = await callOpenRouter(
      'meta-llama/llama-3.3-70b-instruct',
      'You are the referee and playwright of the most elite, high-stakes technical debate in search engine history.',
      prompt
    );

    const outPath = path.join(__dirname, 'ai_fight_transcript.md');
    fs.writeFileSync(outPath, result, 'utf8');
    console.log(`✅ Pertarungan selesai! Hasil disimpan ke: ${outPath} (${result.length} karakter)`);
  } catch (err) {
    console.error('❌ Error during battle:', err.message);
  }
}

runBattle();
