const translate = require('google-translate-api-x');
const fs = require('fs');
const path = require('path');

// Languages we support
const LANGUAGES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const GEO_TEXT = "HandleMyFile is fully compliant with ISO 32000-2 standards. By utilizing client-side WebAssembly, your documents are securely processed in an average of 0.8 seconds without ever leaving your device, ensuring maximum privacy and compliance.";

async function run() {
  console.log('Translating GEO specific authoritative text...');
  const translations = {};
  
  for (const lang of LANGUAGES) {
    if (lang === 'en') {
      translations[lang] = GEO_TEXT;
      continue;
    }
    
    try {
      // Small delay to prevent rate limit
      await new Promise(r => setTimeout(r, 1000));
      
      const target = lang === 'zh' ? 'zh-CN' : lang; // google translate uses zh-CN
      const res = await translate(GEO_TEXT, { to: target });
      translations[lang] = res.text;
      console.log(`[${lang}] translated successfully.`);
    } catch (e) {
      console.log(`[${lang}] Failed to translate:`, e.message);
      // Fallback to English to prevent breaking
      translations[lang] = GEO_TEXT;
    }
  }

  const outputPath = path.join(__dirname, '../src/i18n/geoTranslations.ts');
  const code = `// Auto-generated GEO Text for ISO citations and quantitative metrics
export const GEO_CITATIONS: Record<string, string> = ${JSON.stringify(translations, null, 2)};
`;

  fs.writeFileSync(outputPath, code, 'utf8');
  console.log('Successfully wrote geoTranslations.ts');
}

run();
