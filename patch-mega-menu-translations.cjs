const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const langMap = {
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'th': 'th'
};

const STRINGS = [
  "ALL PDF TOOLS",
  "📁 ORGANIZE PDF",
  "⚡ OPTIMIZE & ENHANCE",
  "📊 SPREADSHEET TOOLS",
  "🔐 SECURITY & SIGN",
  "📑 CONVERT FROM PDF",
  "🔄 CONVERT TO PDF",
  "🔧 MORE PDF TOOLS"
];

async function run() {
  const translationsPath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
  let content = fs.readFileSync(translationsPath, 'utf8');

  // Languages to process (we'll process all 30 just to be safe, overwriting or injecting)
  const LANGS = [
    'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
    'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
    'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms',
    'zh-TW'
  ];

  for (let lang of LANGS) {
    const langCode = langMap[lang] || lang;
    
    // Check if navAllPdfTools already exists for this language to avoid duplicate work if possible
    // Wait, the safest is to just translate and patch.
    console.log(`Translating for ${langCode}...`);
    
    let translated = [];
    for (let str of STRINGS) {
      try {
        let res = await translate(str, { to: langCode, forceTo: langCode.startsWith('zh') });
        translated.push(res.text.replace(/'/g, "\\'"));
        await sleep(500);
      } catch(e) {
        console.error(e);
        translated.push(str.replace(/'/g, "\\'"));
      }
    }
    
    if (translated.length === 8) {
      const langRegex = new RegExp(`("${lang}"|'${lang}'|${lang}):\\s*\\{([\\s\\S]*?)\\},\\s*(?=("|'|\\w+):\\s*\\{|\\};)`, 'g');
      
      content = content.replace(langRegex, (match, p1, p2) => {
        let newBlock = p2;
        
        // If it already has navAllPdfTools, we could replace it, but it's simpler to just replace if exists, or append if not.
        // Actually, let's just do a blanket replacement for each.
        const keys = [
          'navAllPdfTools', 'navOrganizePdf', 'navOptimizeEnhance', 'navSpreadsheetTools',
          'navSecuritySign', 'navConvertFromPdf', 'navConvertToPdf', 'navMoreTools'
        ];
        
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const trans = translated[i];
          const keyRegex = new RegExp(`${key}:\\s*['"].*?['"],`, 'g');
          
          if (newBlock.match(keyRegex)) {
            newBlock = newBlock.replace(keyRegex, `${key}: '${trans}',`);
          } else {
            // Append it to the top of the block, right after {
            newBlock = `\n    ${key}: '${trans}',` + newBlock;
          }
        }
        
        return `${p1}: {${newBlock}},`;
      });
      
      console.log(`  -> Injected for ${lang}`);
    }
  }

  fs.writeFileSync(translationsPath, content, 'utf8');
  console.log("Done!");
}

run();
