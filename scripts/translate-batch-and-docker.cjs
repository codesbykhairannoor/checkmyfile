const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LANG_CODES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

// Master English dictionary to translate
const SOURCE_STRINGS = {
  // Tool names
  toolName: "Batch PDF Processing",
  toolTitle: "Ultra-Batch PDF Processing - Bulk Compress, Grayscale, Watermark Offline",
  toolH1: "Ultra-Batch PDF Processing: Process Folders & Hundreds of Files in RAM",
  toolDesc: "Process hundreds of PDF files or full folders simultaneously in your local browser memory. Bulk compress, convert to grayscale, rotate, protect, and watermark with 1-click ZIP download.",

  // Batch Editor Strings
  batch_title: "Ultra-Batch PDF Processing",
  batch_desc: "Process dozens or hundreds of PDF files simultaneously in browser RAM. Zero server uploads.",
  batch_add_files: "Add PDF Files",
  batch_add_folder: "Add Entire Folder",
  batch_clear_all: "Clear All",
  batch_select_action: "Select Batch Action to Apply:",
  action_compress: "Compress PDF",
  action_grayscale: "Grayscale B&W",
  action_rotate: "Rotate Pages",
  action_protect: "Password Protect",
  action_watermark: "Text Watermark",
  action_sanitize: "Strip Metadata",
  compress_level_label: "Compression Preset:",
  rotate_angle_label: "Rotation Angle:",
  password_label: "Set AES-256 Encryption Password:",
  watermark_text_label: "Watermark Stamp Text:",
  grayscale_batch_info: "All color elements, charts, and images will be converted to monochromatic grayscale for ink-saving printing.",
  sanitize_batch_info: "Author names, software tags, creation dates, and GPS coordinates will be stripped from all documents.",
  batch_processing_now: "Processing Batch...",
  batch_completed_title: "Batch Complete: Files Ready!",
  download_all_zip: "Download All as ZIP (.zip)",
  batch_queue_label: "Documents in Queue",
  start_batch_btn: "Start Batch Processing",
  no_batch_files_title: "No files selected yet",
  no_batch_files_desc: "Drag and drop multiple PDF files or an entire folder to begin high-speed local processing.",

  // Enterprise / Docker Pricing Strings
  pricingEnterpriseTitle: "On-Premises / Docker",
  pricingEnterprisePrice: "Self-Hosted",
  pricingEnterpriseSub: "For enterprises, banks, and air-gapped intranet environments.",
  pricingEnterpriseItem1: "100% Air-Gapped (Runs offline without internet)",
  pricingEnterpriseItem2: "Docker & Kubernetes deployment ready",
  pricingEnterpriseItem3: "Unlimited internal employee seats",
  pricingEnterpriseItem4: "Zero server cost, zero data egress",
  pricingEnterpriseBtn: "View Docker Guide",
  copiedShareLink: "Link copied to clipboard!"
};

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function main() {
  console.log(`Starting translation for ${LANG_CODES.length} languages...`);
  const keys = Object.keys(SOURCE_STRINGS);
  const englishTexts = keys.map(k => SOURCE_STRINGS[k]);

  const translationsByLang = {
    en: { ...SOURCE_STRINGS }
  };

  const remainingLangs = LANG_CODES.filter(l => l !== 'en');
  const chunks = chunkArray(remainingLangs, 6);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Translating chunk ${i + 1}/${chunks.length}: [${chunk.join(', ')}]...`);

    const promises = chunk.map(async (lang) => {
      try {
        const targetCode = lang === 'he' ? 'he' : (lang === 'zh' ? 'zh-CN' : lang);
        const res = await translate(englishTexts, { to: targetCode, forceTo: true });
        const translatedDict = {};
        keys.forEach((key, idx) => {
          translatedDict[key] = res[idx]?.text || englishTexts[idx];
        });
        return { lang, data: translatedDict };
      } catch (err) {
        console.error(`Error translating to ${lang}:`, err.message);
        // Fallback to English
        return { lang, data: { ...SOURCE_STRINGS } };
      }
    });

    const results = await Promise.all(promises);
    for (const r of results) {
      translationsByLang[r.lang] = r.data;
    }
  }

  // Save raw translations cache
  const outPath = path.join(__dirname, 'batch-translations-cache.json');
  fs.writeFileSync(outPath, JSON.stringify(translationsByLang, null, 2), 'utf8');
  console.log(`Saved batch translations to ${outPath}`);
}

main().catch(console.error);
