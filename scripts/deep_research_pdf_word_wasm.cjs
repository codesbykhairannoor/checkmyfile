const fs = require('fs');
const https = require('https');

const API_KEY = process.env.OPENROUTER_API_KEY || '';

const RESEARCH_PROMPT = `
You are a World-Class Document Systems Engineer, Compiler Specialist, and WebAssembly (WASM) Architecture Expert.
The developer of "HandleMyFile" (a 100% client-side Zero-Egress in-browser document processing system) is asking for an uncompromising, state-of-the-art technical deep research:

"Is there an open-source, production-ready, or 'perfect' WebAssembly (WASM) engine for converting PDF to Word (DOCX) that has emerged in the last 2 to 6 months? What are the existing repos, npm packages, Rust/C++ projects, and realistic architectural paths for pure client-side PDF to DOCX?"

Please provide a deep, brutally honest, and comprehensive architectural assessment:
1. THE HARD TRUTH (Why PDF to Word is an AI/heuristic nightmare):
   - Explain why PDF (fixed-coordinate glyphs, path operators, no concept of paragraphs/tables/columns) to DOCX (flow-based XML AST) is mathematically an inverse-problem / heuristic reconstruction.
   - Contrast this with DOCX-to-PDF (which is trivial forward-rendering).
2. LATEST OPEN-SOURCE / WASM ECOSYSTEM AUDIT (Recent 2-6 months):
   - Evaluate @bentopdf/pymupdf-wasm (and BentoPDF's pipeline).
   - Evaluate Pyodide + pdf2docx WASM compilation (binary size, cold start, memory limits).
   - Evaluate LibreOffice WASM (LibreOfficeKit / headless soffice via Emscripten) - Writer PDF import vs Draw frames.
   - Evaluate Rust ecosystem: lopdf, pdf-extract, docx-rs, gigapdf-lib, zavora-docx.
   - Evaluate PDFium WASM + custom heuristic engines (e.g. LayoutAnalyzer C++ / pdfjs spatial extraction).
3. IS THERE A "PERFECT" WASM ENGINE TODAY?
   - Deliver the definitive verdict: Does a turnkey, lightweight (< 15MB), Apache/MIT-licensed, high-fidelity PDF-to-Word WASM library exist right now?
4. PRACTICAL STRATEGY FOR THE DEVELOPER:
   - What should HandleMyFile do RIGHT NOW?
   - Option A: Pyodide + pdf2docx (AGPL risk, 25MB+ download, but high layout fidelity).
   - Option B: Progressive Client-Side Layout Reconstruction (PDF.js / PDFium text-run clustering into docx-js / docx-rs).
   - Option C: Honesty/Beta Flagging in UI: How to present PDF-to-Word to users without breaking trust or crashing mobile tabs.
`;

const MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek-V3' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o-mini' }
];

function callModel(m) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: m.id,
      messages: [{ role: 'user', content: RESEARCH_PROMPT }],
      temperature: 0.2,
      max_tokens: 2200
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
        'X-Title': 'HandleMyFile Deep Research PDF-to-Word WASM'
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) reject(new Error(JSON.stringify(json.error)));
          else {
            const text = json.choices?.[0]?.message?.content || '';
            const cost = json.usage?.cost || 0;
            resolve({ name: m.name, text, cost, usage: json.usage });
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔬 DEEP RESEARCH: PDF TO WORD WASM LANDSCAPE...\n');
  for (const m of MODELS) {
    process.stdout.write(`⏳ Consulting ${m.name}... `);
    try {
      const res = await callModel(m);
      console.log(`DONE! Cost: $${res.cost.toFixed(5)}`);
      fs.writeFileSync(`scripts/research_${m.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`, res.text, 'utf8');
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }
  console.log('\n✅ Research completed!');
}

main().catch(console.error);
