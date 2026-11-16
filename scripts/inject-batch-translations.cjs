const fs = require('fs');
const path = require('path');

const cache = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch-translations-cache.json'), 'utf8'));

// 1. UPDATE slugTranslations.ts
const slugPath = path.join(__dirname, '../src/i18n/slugTranslations.ts');
let slugContent = fs.readFileSync(slugPath, 'utf8');

if (!slugContent.includes('"batch-pdf":')) {
  const batchNames = {};
  for (const lang of Object.keys(cache)) {
    batchNames[lang] = cache[lang].toolName || 'Batch PDF Processing';
  }
  const snippet = `  "batch-pdf": ${JSON.stringify(batchNames, null, 4)},\n`;
  slugContent = slugContent.replace('export const toolNames: Record<string, Record<string, string>> = {\n', `export const toolNames: Record<string, Record<string, string>> = {\n${snippet}`);
  fs.writeFileSync(slugPath, slugContent, 'utf8');
  console.log('Updated slugTranslations.ts with batch-pdf');
}

// 2. UPDATE editorTranslations.ts
const editorPath = path.join(__dirname, '../src/i18n/editorTranslations.ts');
let editorContent = fs.readFileSync(editorPath, 'utf8');

const batchEditorKeys = [
  'batch_title', 'batch_desc', 'batch_add_files', 'batch_add_folder',
  'batch_clear_all', 'batch_select_action', 'action_compress',
  'action_grayscale', 'action_rotate', 'action_protect', 'action_watermark',
  'action_sanitize', 'compress_level_label', 'rotate_angle_label',
  'password_label', 'watermark_text_label', 'grayscale_batch_info',
  'sanitize_batch_info', 'batch_processing_now', 'batch_completed_title',
  'download_all_zip', 'batch_queue_label', 'start_batch_btn',
  'no_batch_files_title', 'no_batch_files_desc'
];

for (const lang of Object.keys(cache)) {
  const langBlockMarker = `"${lang}": {`;
  const idx = editorContent.indexOf(langBlockMarker);
  if (idx !== -1) {
    // Generate key-value pairs
    let entries = '';
    for (const key of batchEditorKeys) {
      if (!editorContent.includes(`"${key}":`)) { // check if not already present in general or this block
        const val = JSON.stringify(cache[lang][key] || cache['en'][key] || '');
        entries += `    "${key}": ${val},\n`;
      }
    }
    if (entries) {
      editorContent = editorContent.slice(0, idx + langBlockMarker.length) + '\n' + entries + editorContent.slice(idx + langBlockMarker.length);
    }
  }
}
fs.writeFileSync(editorPath, editorContent, 'utf8');
console.log('Updated editorTranslations.ts with batch editor keys');

// 3. UPDATE translations.ts (UiDictionary + UI_TRANSLATIONS)
const transPath = path.join(__dirname, '../src/i18n/translations.ts');
let transContent = fs.readFileSync(transPath, 'utf8');

// Add to UiDictionary interface
const interfaceSnippet = `
  pricingEnterpriseTitle?: string;
  pricingEnterprisePrice?: string;
  pricingEnterpriseSub?: string;
  pricingEnterpriseItem1?: string;
  pricingEnterpriseItem2?: string;
  pricingEnterpriseItem3?: string;
  pricingEnterpriseItem4?: string;
  pricingEnterpriseBtn?: string;
  copiedShareLink?: string;
`;
if (!transContent.includes('pricingEnterpriseTitle?:')) {
  transContent = transContent.replace('export interface UiDictionary {', `export interface UiDictionary {${interfaceSnippet}`);
}

const enterpriseKeys = [
  'pricingEnterpriseTitle', 'pricingEnterprisePrice', 'pricingEnterpriseSub',
  'pricingEnterpriseItem1', 'pricingEnterpriseItem2', 'pricingEnterpriseItem3',
  'pricingEnterpriseItem4', 'pricingEnterpriseBtn', 'copiedShareLink'
];

for (const lang of Object.keys(cache)) {
  const langMarker = `  "${lang}": {`;
  const langMarkerAlt = `  ${lang}: {`;
  let targetMarker = transContent.includes(langMarker) ? langMarker : (transContent.includes(langMarkerAlt) ? langMarkerAlt : null);
  
  if (targetMarker) {
    const idx = transContent.indexOf(targetMarker);
    let entries = '';
    for (const k of enterpriseKeys) {
      const val = JSON.stringify(cache[lang][k] || cache['en'][k] || '');
      entries += `    ${k}: ${val},\n`;
    }
    // Check if this lang already has pricingEnterpriseTitle
    const sliceCheck = transContent.slice(idx, idx + 800);
    if (!sliceCheck.includes('pricingEnterpriseTitle:')) {
      transContent = transContent.slice(0, idx + targetMarker.length) + '\n' + entries + transContent.slice(idx + targetMarker.length);
    }
  }
}

fs.writeFileSync(transPath, transContent, 'utf8');
console.log('Updated translations.ts with enterprise & share keys');
