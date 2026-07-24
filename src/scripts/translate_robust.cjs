const fs = require('fs');

const code = fs.readFileSync('src/scripts/translate_ui.cjs', 'utf8');
const baseUIMatch = code.match(/const baseUI = (\{[\s\S]*?\n\});/);
const baseUIString = baseUIMatch[1];
const baseUI = eval('(' + baseUIString + ')');
const keys = Object.keys(baseUI);

const targetLanguages = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'hu', 'no', 'ro', 'uk', 'ms', 'tl'
];

let result = { id: baseUI, en: {} };

// Attempt to load existing translations to skip already done ones
if (fs.existsSync('src/i18n/editorTranslations.ts')) {
  try {
    const existingContent = fs.readFileSync('src/i18n/editorTranslations.ts', 'utf8');
    const existingObjStr = existingContent.replace('export const editorTranslations: Record<string, Record<string, string>> = ', '').replace(/;\s*$/, '');
    const existing = eval('(' + existingObjStr + ')');
    
    // Only keep languages that are actually fully translated (not just full of Indonesian)
    // We check this by seeing if the word "Gabungkan Sekarang" is translated (which in ID is Gabungkan Sekarang)
    for (const lang of targetLanguages) {
      if (existing[lang] && (lang === 'id' || existing[lang]["Gabungkan Sekarang"] !== "Gabungkan Sekarang")) {
        result[lang] = existing[lang];
      }
    }
  } catch (e) {
    console.log("Failed to load existing", e);
  }
}

// Make sure ID is always exact baseUI
result['id'] = baseUI;

const delay = ms => new Promise(res => setTimeout(res, ms));

async function translateText(text, lang) {
  let retries = 3;
  while (retries > 0) {
    try {
      const fetch = (await import('node-fetch')).default;
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data[0].map(x => x[0]).join('');
    } catch (e) {
      console.log(`Failed for ${lang}, retrying in 2s...`);
      await delay(2000);
      retries--;
    }
  }
  return text;
}

async function run() {
  console.log("Starting true robust translation...");
  for (const lang of targetLanguages) {
    if (result[lang] && Object.keys(result[lang]).length >= keys.length && lang !== 'en' && lang !== 'es') {
       // already translated (except we re-check some if needed, but here we assume it's good)
       // actually let's skip if it's already in result and we verified it's not ID
       console.log(`Skipping ${lang}, already translated`);
       continue;
    }
    
    if (lang === 'id') continue;
    
    console.log(`Translating to ${lang}...`);
    result[lang] = {}; // Only create it NOW
    
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (k.length <= 2 || k.match(/^[0-9%]+$/)) {
        result[lang][k] = k;
        continue;
      }
      
      result[lang][k] = await translateText(baseUI[k] || k, lang);
      await delay(300);
    }
    
    const tsContent = "// Auto-generated Editor Translations\n" +
      "export const editorTranslations: Record<string, Record<string, string>> = " + JSON.stringify(result, null, 2) + ";\n";
    fs.writeFileSync('src/i18n/editorTranslations.ts', tsContent);
    console.log(`Saved language: ${lang}`);
  }
  console.log("All done!");
}

run();
