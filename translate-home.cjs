const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const TARGET_FILE = path.join(__dirname, 'src', 'i18n', 'translations.ts');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const langMap = {
  'zh': 'zh-CN',
  'he': 'iw',
};

const keys = [
  'homeHeroBadge',
  'homeHeroTitle',
  'homeHeroSubtitle',
  'homeSearchNotFound',
  'homeSearchNotFoundDesc',
  'homeTryNow'
];

const englishStrings = [
  '100% Client-Side Processing',
  'All Document Tools in One Place',
  'Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly. Free, no size limits, and highly secure.',
  'No tools found matching',
  'Try using different keywords or select the All Tools category.',
  'Try Now Offline'
];

const run = async () => {
  let content = fs.readFileSync(TARGET_FILE, 'utf8');

  // Interface injection
  if (!content.includes('homeHeroBadge?: string;')) {
    const interfaceInsertion = `
  homeHeroBadge?: string;
  homeHeroTitle?: string;
  homeHeroSubtitle?: string;
  homeSearchNotFound?: string;
  homeSearchNotFoundDesc?: string;
  homeTryNow?: string;
`;
    content = content.replace(/export interface UiDictionary \{/, `export interface UiDictionary {${interfaceInsertion}`);
  }

  // Clear existing if any to avoid duplicates
  for (const key of keys) {
    const regex2 = new RegExp(`\\s*${key}:\\s*['"\`].*?['"\`],`, 'g');
    content = content.replace(regex2, '');
  }

  const langs = ['id', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'ru', 'ar', 'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'];
  
  const DELIM = ' ||| ';
  const joined = englishStrings.join(DELIM);

  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    const translateCode = langMap[lang] || lang;
    console.log(`[${i+1}/${langs.length}] Translating to ${translateCode}...`);
    
    let translatedStrings = [];
    let retries = 3;
    while(retries > 0) {
      try {
        const res = await translate(joined, { to: translateCode });
        translatedStrings = res.text.split(DELIM).map(s => s.trim());
        if (translatedStrings.length !== englishStrings.length) {
           throw new Error("Mismatch length");
        }
        break;
      } catch (err) {
        retries--;
        console.error(`  -> Error. Retries left: ${retries}`);
        if (retries === 0) {
          translatedStrings = [...englishStrings]; // fallback
        }
        await sleep(3000); 
      }
    }

    let insertion = ``;
    for (let j = 0; j < keys.length; j++) {
       const safeVal = translatedStrings[j].replace(/'/g, "\\'");
       insertion += `\n    ${keys[j]}: '${safeVal}',`;
    }

    const regex = new RegExp(`^(\\s*)${lang}:\\s*\\{`, 'm');
    content = content.replace(regex, `$1${lang}: {${insertion}`);
    fs.writeFileSync(TARGET_FILE, content);
  }
  
  // also update en
  let enInsertion = ``;
  for (let j = 0; j < keys.length; j++) {
     const safeVal = englishStrings[j].replace(/'/g, "\\'");
     enInsertion += `\n    ${keys[j]}: '${safeVal}',`;
  }
  content = content.replace(/^(\s*)en:\s*\{/m, `$1en: {${enInsertion}`);
  fs.writeFileSync(TARGET_FILE, content);

  console.log("Done translating home keys.");
};

run().catch(console.error);
