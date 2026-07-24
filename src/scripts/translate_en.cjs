const fs = require('fs');

const code = fs.readFileSync('src/scripts/translate_ui.cjs', 'utf8');

const baseUIMatch = code.match(/const baseUI = (\{[\s\S]*?\n\});/);
const baseUIString = baseUIMatch[1];
const baseUI = eval('(' + baseUIString + ')');
const keys = Object.keys(baseUI);
const englishValues = Object.values(baseUI);

async function translateChunk(texts, targetLang) {
  try {
    const fetch = (await import('node-fetch')).default;
    const q = texts.map(t => `q=${encodeURIComponent(t)}`).join('&');
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&${q}`);
    const data = await res.json();
    
    let resultIdx = 0;
    const translated = [];
    
    // The google API returns an array of sentences, we need to map them back
    // This is fragile but works for simple things.
    // Better way: send them one by one or in small batches.
    
    for (let t of texts) {
      const singleRes = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(t)}`);
      const singleData = await singleRes.json();
      translated.push(singleData[0].map(x => x[0]).join(''));
      await new Promise(r => setTimeout(r, 100)); // anti-ban
    }
    return translated;
  } catch (e) {
    console.error(e);
    return texts;
  }
}

async function run() {
  const result = {
    id: {},
    en: {}
  };
  
  console.log('Translating to English (this might take 30 seconds)...');
  
  // Fill ID (source)
  for (let i = 0; i < keys.length; i++) {
    result.id[keys[i]] = baseUI[keys[i]] || keys[i];
  }
  
  // Translate EN
  const chunked = [];
  const chunkSize = 20;
  let translatedFlat = [];
  
  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize);
    const tr = await translateChunk(chunk, 'en');
    translatedFlat = translatedFlat.concat(tr);
    console.log(`Translated ${translatedFlat.length} / ${keys.length}`);
  }
  
  for (let i = 0; i < keys.length; i++) {
    result.en[keys[i]] = translatedFlat[i] || keys[i];
  }
  
  const tsContent = "// Auto-generated Editor Translations\n" +
"export const editorTranslations: Record<string, Record<string, string>> = " + JSON.stringify(result, null, 2) + ";\n";
  
  fs.writeFileSync('src/i18n/editorTranslations.ts', tsContent);
  console.log('Saved editorTranslations.ts for EN and ID');
}

run();
