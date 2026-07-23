const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const TARGET_FILE = path.join(__dirname, 'src', 'i18n', 'translations.ts');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const langMap = {
  'zh': 'zh-CN',
  'he': 'iw', // google translate uses 'iw' for hebrew
};

const englishStrings = [
  'ALL PDF TOOLS',
  '📁 ORGANIZE PDF',
  '⚡ OPTIMIZE & ENHANCE',
  '📊 SPREADSHEET TOOLS',
  '🔐 SECURITY & SIGN',
  '📑 CONVERT FROM PDF',
  '🔄 CONVERT TO PDF',
  'Close Menu'
];
const keys = [
  'navAllPdfTools',
  'navOrganizePdf',
  'navOptimizeEnhance',
  'navSpreadsheetTools',
  'navSecuritySign',
  'navConvertFromPdf',
  'navConvertToPdf',
  'navCloseMenu'
];

const run = async () => {
  let content = fs.readFileSync(TARGET_FILE, 'utf8');
  
  // Clean up any existing nav keys first to avoid duplicates
  for (const key of keys) {
    const regex = new RegExp(`\\s*${key}\\?:\\s*string;`, 'g');
    content = content.replace(regex, '');
    const regex2 = new RegExp(`\\s*${key}:\\s*['"\`].*?['"\`],`, 'g');
    content = content.replace(regex2, '');
  }

  // Ensure interface has the keys
  if (!content.includes('navAllPdfTools?: string;')) {
    const interfaceInsertion = `
  navAllPdfTools?: string;
  navOrganizePdf?: string;
  navOptimizeEnhance?: string;
  navSpreadsheetTools?: string;
  navSecuritySign?: string;
  navConvertFromPdf?: string;
  navConvertToPdf?: string;
  navCloseMenu?: string;
`;
    content = content.replace(/export interface UiDictionary \{/, `export interface UiDictionary {${interfaceInsertion}`);
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
           console.log("Mismatched length, trying again...", translatedStrings.length);
           throw new Error("Mismatch");
        }
        break;
      } catch (err) {
        retries--;
        console.error(`  -> Error. Retries left: ${retries}`);
        if (retries === 0) {
          console.error("Failed completely, using english fallbacks");
          translatedStrings = [...englishStrings]; // fallback
        }
        await sleep(3000); 
      }
    }

    // Prepare insertion string
    let insertion = ``;
    for (let j = 0; j < keys.length; j++) {
       // Escape single quotes
       const safeVal = translatedStrings[j].replace(/'/g, "\\'");
       insertion += `\n    ${keys[j]}: '${safeVal}',`;
    }

    // Insert into content right after `  lang: {`
    const regex = new RegExp(`^(\\s*)${lang}:\\s*\\{`, 'm');
    content = content.replace(regex, `$1${lang}: {${insertion}`);
    
    // Save incrementally just in case
    fs.writeFileSync(TARGET_FILE, content);
  }
  
  console.log("Done translating and injecting navbar keys.");
};

run().catch(console.error);
