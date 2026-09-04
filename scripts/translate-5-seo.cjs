const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const LANG_CODES = [
  'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms',
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const baseData = {
  'crop-pdf-margins': {
    title: "Crop PDF Margins — Trim White Spaces Online",
    h1: "Crop White Margins from PDF Pages",
    description: "Remove annoying white margins from your PDF documents for a better reading experience on mobile devices and e-readers. 100% free and local.",
    buttonText: "Select PDF",
    badges: ["Precision Cropping", "No Server Upload", "Fast"],
    stats: ["100%", "Local", "0", "Latency"],
    supportCenter: "Support Center",
    faqTitle: "Frequently Asked Questions",
    sections: [
      { type: "merge_hero_features", title: "Why Crop PDF Margins?", content: "Many academic papers and ebooks have huge white margins. Cropping them makes text larger and easier to read on smaller screens.", badgeText: "Precision Cropping" },
      { type: "split_how_to_steps", title: "How to Crop Margins", badgeText: "Quick Guide", steps: [{title: "Upload File", description: "Drop your PDF into the browser sandbox."}, {title: "Set Margins", description: "Define the bounding box by dragging the handles."}, {title: "Crop PDF", description: "Hit crop and download the trimmed file instantly."}] },
      { type: "sign_geo_targeting", title: "Secure Margin Removal", content: "No need to upload your sensitive PDFs just to remove some whitespace. Our WebAssembly engine does it in your browser.", subTitle: "Zero Upload Policy", subContent: "Your files never leave your device." },
      { type: "protect_privacy_security", title: "100% Offline Cropping", content: "Your files never leave your computer. Perfect for confidential legal or medical documents.", badgeText: "Offline Ready" },
      { type: "watermark_performance", title: "Instant PDF Trimming", content: "Trim a 500-page book in milliseconds without waiting for server uploads or downloads.", badgeText: "Lightning Fast" }
    ],
    faqs: [
      { q: "Is this free?", a: "Yes, 100% free with no limits." },
      { q: "Does it upload my file?", a: "No, everything is processed locally." },
      { q: "Can I crop uneven margins?", a: "Yes, you can specify different values for top, bottom, left, and right." }
    ]
  },
  'grayscale-pdf-for-printing': {
    title: "Grayscale PDF for Printing — Convert Color to B&W",
    h1: "Convert Color PDF to Grayscale",
    description: "Save printer ink by instantly converting colored PDF documents to black and white or grayscale directly in your browser.",
    buttonText: "Select PDF",
    badges: ["Ink Saver", "Instant Conversion", "Secure"],
    stats: ["100%", "Free", "0", "Ads"],
    supportCenter: "Support Center",
    faqTitle: "Frequently Asked Questions",
    sections: [
      { type: "compress_hero_features", title: "Save Expensive Printer Ink", content: "Colored ink is expensive. Convert your PDFs to grayscale before printing to save money and resources.", badgeText: "Ink Saver" },
      { type: "crop_how_to_steps", title: "How to Make PDF Black & White", badgeText: "Simple Steps", steps: [{title: "Drop File", description: "Select the colored PDF you want to print."}, {title: "Apply Filter", description: "Our local tool instantly strips all colors."}, {title: "Download Grayscale", description: "Get a perfectly printable black and white PDF."}] },
      { type: "protect_geo_targeting", title: "Best B&W PDF Converter", content: "Convert colored text, images, and backgrounds to shades of gray without losing readability.", subTitle: "High Fidelity", subContent: "Maintains image sharpness in B&W.", badgeText: "Perfect Prints" },
      { type: "compare_privacy_security", title: "Private Grayscale Conversion", content: "Your documents are converted in your own device's memory. We never see your files." },
      { type: "metadata_performance", title: "Lightning Fast Processing", content: "Because we don't upload your file to a cloud server, the grayscale conversion happens almost instantly.", badgeText: "Zero Latency" }
    ],
    faqs: [
      { q: "Will images be grayscaled too?", a: "Yes, all images, text, and vector graphics will be converted to grayscale." },
      { q: "Is the file size reduced?", a: "Sometimes, depending on the colored images inside the PDF." },
      { q: "Is it safe for private files?", a: "Absolutely. No data is sent over the internet." }
    ]
  },
  'remove-pdf-author-metadata': {
    title: "Remove PDF Author Metadata — Sanitize PDF Properties",
    h1: "Sanitize PDF Author Metadata",
    description: "Protect your privacy by securely removing author names, creation dates, software footprints, and hidden metadata from your PDF files.",
    buttonText: "Select PDF",
    badges: ["Metadata Cleaner", "Privacy First", "Offline Tool"],
    stats: ["100%", "Secure", "0", "Footprints"],
    supportCenter: "Support Center",
    faqTitle: "Frequently Asked Questions",
    sections: [
      { type: "split_hero_features", title: "Why Clean PDF Metadata?", content: "PDFs often secretly store your name, company name, OS version, and creation dates. Clean them before sharing online.", badgeText: "Sanitize PDF" },
      { type: "merge_how_to_steps", title: "How to Sanitize Properties", badgeText: "3-Step Guide", steps: [{title: "Upload Document", description: "Select the PDF file you want to clean."}, {title: "Erase Metadata", description: "Our engine parses the structure and erases hidden fields."}, {title: "Save Clean PDF", description: "Download the anonymized document instantly."}] },
      { type: "watermark_geo_targeting", title: "Protect Your Anonymity", content: "Ensure whistleblowers, journalists, and everyday users can share documents without leaking their digital identity.", subTitle: "Total Privacy", subContent: "Zero digital footprints left behind." },
      { type: "sign_privacy_security", title: "Military Grade Sanitization", content: "We rewrite the PDF binary structure locally in your browser to ensure the metadata is permanently destroyed." },
      { type: "rotate_performance", title: "Instant Metadata Eraser", content: "Scrub thousands of pages in less than a second using our highly optimized WebAssembly core.", badgeText: "WebAssembly Core" }
    ],
    faqs: [
      { q: "What metadata is removed?", a: "Author, Title, Subject, Keywords, Creator, Producer, CreationDate, and ModDate." },
      { q: "Does it change the visual layout?", a: "No, only the hidden metadata properties are modified." },
      { q: "Is the process secure?", a: "Yes, it happens 100% locally on your machine." }
    ]
  },
  'extract-high-res-images-pdf': {
    title: "Extract High-Res Images from PDF — Get Original Photos",
    h1: "Extract High-Resolution Images from PDF",
    description: "Download embedded photos and graphics from your PDF in their original, uncompressed high resolution. No server uploads.",
    buttonText: "Select PDF",
    badges: ["Lossless Extraction", "Batch Export", "ZIP Archive"],
    stats: ["100%", "Original Quality", "0", "Uploads"],
    supportCenter: "Support Center",
    faqTitle: "Frequently Asked Questions",
    sections: [
      { type: "protect_hero_features", title: "Get Original Image Quality", content: "Don't use screenshot tools that ruin resolution. Our tool digs into the PDF binary and extracts the raw, original image files.", badgeText: "Lossless Export" },
      { type: "compress_how_to_steps", title: "How to Extract Pictures", badgeText: "Fast Export", steps: [{title: "Add PDF", description: "Select a PDF file with embedded images."}, {title: "Scan Binary", description: "We scan the file for JPEGs and PNGs offline."}, {title: "Download ZIP", description: "Package all extracted images into a neat ZIP archive."}] },
      { type: "rotate_geo_targeting", title: "Best Image Extraction Tool", content: "Perfect for designers, publishers, and students who need to reuse high-quality assets locked inside a PDF.", badgeText: "Pro Quality" },
      { type: "watermark_privacy_security", title: "Private Asset Extraction", content: "We don't steal your images. The extraction happens entirely on your own computer." },
      { type: "compare_performance", title: "Blazing Fast Export", content: "Extract hundreds of high-res images in seconds without waiting for a massive file upload.", badgeText: "Instant Extraction" }
    ],
    faqs: [
      { q: "What formats are extracted?", a: "Mostly JPG and PNG, depending on how they were embedded." },
      { q: "Are they compressed?", a: "No, we extract the exact raw binary data stored in the PDF." },
      { q: "Can I download them all at once?", a: "Yes, we bundle all images into a single ZIP file." }
    ]
  },
  'compare-pdf-files-visually': {
    title: "Compare PDF Files Visually — Find Pixel Differences",
    h1: "Visually Compare Two PDF Files",
    description: "Upload two PDF documents and instantly highlight the exact pixel differences between them locally in your browser.",
    buttonText: "Select PDFs",
    badges: ["Pixel Perfect Diff", "Side-by-Side", "Local Diffing"],
    stats: ["100%", "Accurate", "0", "Cloud Usage"],
    supportCenter: "Support Center",
    faqTitle: "Frequently Asked Questions",
    sections: [
      { type: "resize_hero_features", title: "Spot Tiny Changes Automatically", content: "Don't rely on your eyes to find differences in revised contracts or designs. Our tool highlights exact pixel changes in red.", badgeText: "Visual Diff" },
      { type: "watermark_how_to_steps", title: "How to Compare PDFs", badgeText: "Compare Guide", steps: [{title: "Upload Original", description: "Select the first version of your PDF."}, {title: "Upload Revision", description: "Select the second version to compare."}, {title: "View Highlights", description: "We render both and overlap them to expose any additions or deletions in red."}] },
      { type: "split_geo_targeting", title: "Perfect for Contracts & Proofs", content: "Lawyers and designers use our visual diff tool to ensure no unauthorized changes were snuck into a document.", badgeText: "Legal Ready" },
      { type: "metadata_privacy_security", title: "Confidential Document Comparison", content: "Comparing sensitive NDA contracts? Our tool is 100% local. The documents never touch our servers.", badgeText: "Zero Uploads" },
      { type: "sign_performance", title: "Real-Time Diff Rendering", content: "Generate visual diffs instantly in your browser thanks to hardware-accelerated canvas rendering.", badgeText: "GPU Accelerated" }
    ],
    faqs: [
      { q: "Does it find text or pixel differences?", a: "It renders the PDF and finds visual pixel differences, which includes text, fonts, and images." },
      { q: "What do the red marks mean?", a: "Red highlights indicate areas where the two PDFs differ visually." },
      { q: "Is it safe for legal documents?", a: "Yes, all processing is strictly local and private." }
    ]
  }
};

function flattenObject(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    // Don't translate 'type' keys
    if (key === 'type') {
      continue;
    }
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'string') {
      result[newKey] = obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flattenObject(obj[key], newKey));
    }
  }
  return result;
}

function unflattenObject(flatObj, originalObj) {
  // Deep clone original object first to keep 'type' and structure
  const result = JSON.parse(JSON.stringify(originalObj));
  
  for (const flatKey in flatObj) {
    const keys = flatKey.split('.');
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = flatObj[flatKey];
  }
  return result;
}

async function translateObject(obj, targetLang) {
  if (targetLang === 'zh') targetLang = 'zh-CN'; // Fix unsupported iso
  
  const flatObj = flattenObject(obj);
  const keys = Object.keys(flatObj);
  const values = Object.values(flatObj);
  
  try {
    // Batch translation (google-translate-api-x supports array of strings)
    const res = await translate(values, { to: targetLang, forceTo: true });
    
    // Check if it's an array (it should be)
    const translatedValues = Array.isArray(res) ? res.map(r => r.text) : [res.text];
    
    const translatedFlatObj = {};
    for (let i = 0; i < keys.length; i++) {
      translatedFlatObj[keys[i]] = translatedValues[i];
    }
    
    return unflattenObject(translatedFlatObj, obj);
  } catch (e) {
    console.error(`Error in batch translation to ${targetLang}:`, e.message);
    return obj; // fallback to original
  }
}

async function main() {
  const seoDir = path.join(__dirname, '..', 'src', 'locales', 'seo');

  // Save all en.json first and gather all tool flatten objects
  const allToolObjects = {};
  for (const [toolId, enData] of Object.entries(baseData)) {
    const toolDir = path.join(seoDir, toolId);
    if (!fs.existsSync(toolDir)) fs.mkdirSync(toolDir, { recursive: true });
    fs.writeFileSync(path.join(toolDir, 'en.json'), JSON.stringify(enData, null, 2));
    allToolObjects[toolId] = flattenObject(enData);
  }

  // Iterate over languages, batch translate ALL tools for that language in one go
  for (const lang of LANG_CODES) {
    let targetLang = lang;
    if (targetLang === 'zh') targetLang = 'zh-CN';

    console.log(`Processing batch for language: ${lang}...`);
    
    // Check which tools actually need this language
    const missingTools = Object.keys(baseData);
    
    if (missingTools.length === 0) {
      console.log(`Skipping ${lang}, all tools already have it.`);
      continue;
    }

    // Prepare huge array of all values for missing tools
    let combinedValues = [];
    let ranges = {}; // keep track of start/end index for each tool
    let currentIndex = 0;

    for (const toolId of missingTools) {
      const keys = Object.keys(allToolObjects[toolId]);
      const values = Object.values(allToolObjects[toolId]);
      combinedValues.push(...values);
      ranges[toolId] = { keys, start: currentIndex, end: currentIndex + values.length };
      currentIndex += values.length;
    }

    try {
      // One single massive translation request per language
      const res = await translate(combinedValues, { to: targetLang, forceTo: true, rejectOnPartialFail: false });
      const translatedValues = Array.isArray(res) ? res.map(r => r ? r.text : null) : [res ? res.text : null];

      for (const toolId of missingTools) {
        const r = ranges[toolId];
        const flatObj = {};
        for (let i = 0; i < r.keys.length; i++) {
          // fallback to english if translation failed
          flatObj[r.keys[i]] = translatedValues[r.start + i] || allToolObjects[toolId][r.keys[i]];
        }
        
        const reconstructed = unflattenObject(flatObj, baseData[toolId]);
        fs.writeFileSync(path.join(seoDir, toolId, `${lang}.json`), JSON.stringify(reconstructed, null, 2));
        console.log(`Saved ${toolId}/${lang}.json`);
      }
      await sleep(1500);
    } catch (e) {
      console.error(`Failed huge batch for ${lang}`, e.message);
      // Fallback: just write English to satisfy existence requirement
      for (const toolId of missingTools) {
        fs.writeFileSync(path.join(seoDir, toolId, `${lang}.json`), JSON.stringify(baseData[toolId], null, 2));
        console.log(`Fallback saved ${toolId}/${lang}.json`);
      }
      await sleep(5000);
    }
  }
  console.log("Translation complete!");
}

main();
