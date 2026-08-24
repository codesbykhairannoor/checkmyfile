const translate = require('google-translate-api-x');
const fs = require('fs');

const langs = [
  "en", "id", "es", "fr", "de", "ja", "pt", "ru", "zh-CN", "ar", 
  "hi", "it", "ko", "nl", "tr", "pl", "vi", "th", "sv", "cs", 
  "da", "el", "fi", "he", "hu", "no", "ro", "sk", "uk", "ms"
];

const keywords = [
  "remove-pdf-password-without-password",
  "reorder-pdf-pages-drag-and-drop",
  "reduce-pdf-size-offline",
  "pdf-to-word-without-losing-formatting",
  "scanned-pdf-to-text-ocr"
];

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  let output = "";
  for (const keyword of keywords) {
    const originalText = keyword.split('-').join(' ');
    const slugMap = {};
    for (const lang of langs) {
      try {
        const res = await translate(originalText, { to: lang });
        const translatedSlug = toSlug(res.text);
        let l = lang === 'zh-CN' ? 'zh' : lang;
        slugMap[l] = translatedSlug;
        console.log(`Translated ${keyword} to ${l}: ${translatedSlug}`);
      } catch (err) {
        console.error(`Error translating ${keyword} to ${lang}:`, err.message);
        let l = lang === 'zh-CN' ? 'zh' : lang;
        slugMap[l] = keyword;
      }
    }
    
    output += `// Slugs for ${keyword}\n`;
    output += `slugs: generateSlugsForId('${keyword}', {\n`;
    for (const [l, slug] of Object.entries(slugMap)) {
      output += `  ${l}: '${slug}',\n`;
    }
    output += `}),\n\n`;
  }
  
  fs.writeFileSync('scripts/generated-slugs.txt', output);
  console.log("Slugs written to scripts/generated-slugs.txt");
}

run();
