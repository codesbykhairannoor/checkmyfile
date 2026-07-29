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
  "All Document Tools in One Place",
  "Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly. Free, no size limits, and highly secure.",
  "Security Architecture: 100% Client-Side Processing • 0 Bytes Uploaded • Powered by WebAssembly (WASM)."
];

async function run() {
  const translationsPath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
  let content = fs.readFileSync(translationsPath, 'utf8');

  // Add the new key to interface if not there
  if (!content.includes('homeSecurityBadge?: string;')) {
    content = content.replace(
      'homeHeroSubtitle?: string;',
      'homeHeroSubtitle?: string;\n  homeSecurityBadge?: string;'
    );
  }

  // Add to baseDict (English)
  if (!content.includes('homeSecurityBadge: "Security Architecture:')) {
    content = content.replace(
      'homeHeroSubtitle: "Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly. Free, no size limits, and highly secure.",',
      `homeHeroSubtitle: "Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly. Free, no size limits, and highly secure.",\n  homeSecurityBadge: "Security Architecture: 100% Client-Side Processing • 0 Bytes Uploaded • Powered by WebAssembly (WASM).",`
    );
  }

  const LANGS = [
    'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
    'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
    'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms',
    'zh-TW'
  ];

  for (let lang of LANGS) {
    const langCode = langMap[lang] || lang;
    console.log(`Translating for ${langCode}...`);
    
    let translated = [];
    for (let str of STRINGS) {
      try {
        let res = await translate(str, { to: langCode, forceTo: langCode.startsWith('zh') });
        translated.push(res.text.replace(/"/g, '\\"'));
        await sleep(500);
      } catch(e) {
        console.error(e);
        translated.push(str.replace(/"/g, '\\"'));
      }
    }
    
    if (translated.length === 3) {
      const langRegex = new RegExp(`("${lang}"|'${lang}'|${lang}):\\s*\\{([\\s\\S]*?)\\},\\s*(?=("|'|\\w+):\\s*\\{|\\};)`, 'g');
      
      content = content.replace(langRegex, (match, p1, p2) => {
        let newBlock = p2;
        
        newBlock = newBlock.replace(/homeHeroTitle:\s*".*?",/g, `homeHeroTitle: "${translated[0]}",`);
        newBlock = newBlock.replace(/homeHeroSubtitle:\s*".*?",/g, `homeHeroSubtitle: "${translated[1]}",`);
        
        if (newBlock.includes('homeSecurityBadge:')) {
           newBlock = newBlock.replace(/homeSecurityBadge:\s*".*?",/g, `homeSecurityBadge: "${translated[2]}",`);
        } else {
           newBlock = newBlock.replace(/homeHeroSubtitle:/g, `homeSecurityBadge: "${translated[2]}",\n    homeHeroSubtitle:`);
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
