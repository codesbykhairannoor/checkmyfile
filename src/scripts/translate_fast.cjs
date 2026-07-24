const fs = require('fs');
const fetch = require('node-fetch');

const code = fs.readFileSync('src/scripts/translate_ui.cjs', 'utf8');
const baseUIMatch = code.match(/const baseUI = (\{[\s\S]*?\n\});/);
const baseUI = eval('(' + baseUIMatch[1] + ')');
const keys = Object.keys(baseUI);

const targetLanguages = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'hu', 'no', 'ro', 'uk', 'ms', 'tl'
];

let result = { id: baseUI };

// Load existing
if (fs.existsSync('src/i18n/editorTranslations.ts')) {
  try {
    const existingContent = fs.readFileSync('src/i18n/editorTranslations.ts', 'utf8');
    const existingObjStr = existingContent.replace('export const editorTranslations: Record<string, Record<string, string>> = ', '').replace(/;\s*$/, '');
    const existing = eval('(' + existingObjStr + ')');
    for (const lang of targetLanguages) {
      if (existing[lang] && (lang === 'id' || existing[lang]["Gabungkan Sekarang"] !== "Gabungkan Sekarang")) {
        result[lang] = existing[lang];
      }
    }
  } catch(e) {}
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const DELIMITER = ' \n|||\n ';

async function translateChunk(texts, lang) {
  const combined = texts.join(DELIMITER);
  const params = new URLSearchParams();
  params.append('q', combined);
  
  let retries = 3;
  while(retries > 0) {
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${lang}&dt=t`, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const fullTranslated = data[0].map(x => x[0]).join('');
      // Split by delimiter (accounting for possible spaces added by translation)
      const splits = fullTranslated.split(/\s*\|\|\|\s*/);
      
      // Safety fallback: if split count doesn't match, we fallback to original
      if (splits.length !== texts.length) {
        console.log(`Warning: Split count mismatch for ${lang}. Expected ${texts.length}, got ${splits.length}. Falling back to 1-by-1.`);
        return null;
      }
      return splits;
    } catch(e) {
      console.log(`Chunk failed for ${lang}, retrying...`);
      await delay(2000);
      retries--;
    }
  }
  return null;
}

async function translateSingle(text, lang) {
  let retries = 2;
  while(retries > 0) {
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await res.json();
      return data[0].map(x => x[0]).join('');
    } catch(e) {
      await delay(1000);
      retries--;
    }
  }
  return text;
}

async function run() {
  console.log("Starting ULTRA FAST batch translation...");
  
  for (const lang of targetLanguages) {
    if (result[lang] && Object.keys(result[lang]).length >= keys.length && lang !== 'en' && lang !== 'es') {
       console.log(`Skipping ${lang}`);
       continue;
    }
    if (lang === 'id') continue;
    
    console.log(`Bulk translating to ${lang}...`);
    result[lang] = {};
    
    // Chunking 100 strings at a time
    const CHUNK_SIZE = 100;
    for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
      const chunkKeys = keys.slice(i, i + CHUNK_SIZE);
      const chunkValues = chunkKeys.map(k => baseUI[k] || k);
      
      let translated = await translateChunk(chunkValues, lang);
      
      if (!translated) {
        // Fallback to slow 1-by-1 if chunk completely failed
        translated = [];
        for (let j = 0; j < chunkValues.length; j++) {
           translated.push(await translateSingle(chunkValues[j], lang));
        }
      }
      
      for (let j = 0; j < chunkKeys.length; j++) {
        result[lang][chunkKeys[j]] = translated[j] || chunkValues[j];
      }
      await delay(500); // anti ban
    }
    
    const tsContent = "// Auto-generated Editor Translations\n" +
      "export const editorTranslations: Record<string, Record<string, string>> = " + JSON.stringify(result, null, 2) + ";\n";
    fs.writeFileSync('src/i18n/editorTranslations.ts', tsContent);
    console.log(`Saved language: ${lang}`);
  }
  console.log("ALL DONE FAST!");
}

run();
