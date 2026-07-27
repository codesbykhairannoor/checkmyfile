const fs = require('fs');
const path = require('path');

const shortNames = {
  'merge-pdf': 'Merge PDF',
  'edit-pdf': 'Edit PDF',
  'split-pdf': 'Split PDF',
  'rotate-pdf': 'Rotate PDF',
  'page-numbers': 'Page Numbers',
  'watermark-pdf': 'Watermark PDF',
  'remove-pdf': 'Remove Pages',
  'organize-pdf': 'Organize PDF',
  'crop-pdf': 'Crop PDF',
  'sign-pdf': 'Sign PDF',
  'protect-pdf': 'Protect PDF',
  'unlock-pdf': 'Unlock PDF',
  'extract-images-pdf': 'Extract Images',
  'grayscale-pdf': 'Grayscale PDF',
  'scan-to-pdf': 'Scan to PDF',
  'remove-pdf-metadata': 'Remove Metadata',
  'compare-pdf': 'Compare PDF',
  'redact-pdf': 'Redact PDF',
  'reverse-pdf': 'Reverse PDF',
  'resize-pdf': 'Resize PDF',
  'word-to-pdf': 'Word to PDF',
  'excel-to-pdf': 'Excel to PDF',
  'ppt-to-pdf': 'PPT to PDF',
  'txt-to-pdf': 'TXT to PDF',
  'pdf-to-word': 'PDF to Word',
  'pdf-to-ppt': 'PDF to PPT',
  'csv-to-excel': 'CSV to Excel',
  'excel-to-csv': 'Excel to CSV',
  'image-to-pdf': 'Image to PDF',
  'pdf-to-image': 'PDF to Image',
  'compress-pdf': 'Compress PDF',
  'ocr-pdf': 'OCR PDF'
};

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

async function translateChunk(texts, targetLang) {
  if (targetLang === 'en') return texts;
  let gLang = targetLang;
  if (gLang === 'zh') gLang = 'zh-CN';
  if (gLang === 'he') gLang = 'iw';
  
  const delimiter = ' ||| ';
  const query = texts.join(delimiter);
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + gLang + "&dt=t&q=" + encodeURIComponent(query);
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const translatedText = data[0].map(x => x[0]).join('');
    const parts = translatedText.split(/\s*\|\|\|\s*/);
    return parts.map(x => x.trim().replace(/^"|"$/g, ''));
  } catch (e) {
    console.error('Translation failed for', targetLang, e);
    return texts;
  }
}

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function run() {
  const toolNames = {};
  const toolSlugs = {};
  
  const keys = Object.keys(shortNames);
  const values = Object.values(shortNames);
  
  for (const lang of langs) {
    console.log(`Translating to ${lang}...`);
    let translatedVals = values;
    
    if (lang !== 'en') {
      const chunk1 = await translateChunk(values.slice(0, 15), lang);
      await new Promise(r => setTimeout(r, 800));
      const chunk2 = await translateChunk(values.slice(15, 32), lang);
      await new Promise(r => setTimeout(r, 800));
      translatedVals = [...chunk1, ...chunk2];
    }
    
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      let tName = translatedVals[i] || values[i];
      
      if (!toolNames[id]) toolNames[id] = {};
      if (!toolSlugs[id]) toolSlugs[id] = {};
      
      toolNames[id][lang] = tName;
      toolSlugs[id][lang] = createSlug(tName);
    }
  }
  
  const tsContent = "// Auto-generated Short Names and Slugs\n" +
    "export const toolNames: Record<string, Record<string, string>> = " + JSON.stringify(toolNames, null, 2) + ";\n\n" +
    "export const toolSlugs: Record<string, Record<string, string>> = " + JSON.stringify(toolSlugs, null, 2) + ";\n";
    
  fs.writeFileSync('src/i18n/slugTranslations.ts', tsContent);
  console.log('Successfully generated src/i18n/slugTranslations.ts');
}

run();
