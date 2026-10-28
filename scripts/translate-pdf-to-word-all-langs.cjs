const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const LANG_CODES = [
  'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const pdfToWordData = {
  title: "Convert PDF to Word Online Free — 100% Private (.docx)",
  h1: "Convert PDF to Editable Word (.docx) Directly in Browser",
  description: "Transform PDF documents into editable Microsoft Word (.docx) files entirely inside your browser. Zero file uploads, no server tracking, 100% private in-RAM processing.",
  buttonText: "Convert to Word (.docx)",
  badges: ["100% In-Browser", "Zero Server Uploads", "Instant Download"],
  stats: ["100%", "Private", "0s", "Server Wait"],
  supportCenter: "Privacy & Document Integrity",
  faqTitle: "Frequently Asked Questions About PDF to Word",
  sections: [
    {
      type: "word_hero_features",
      title: "Why Convert PDF to Word Locally?",
      content: "Traditional online converters upload your confidential files to remote cloud servers. HandleMyFile executes the entire conversion locally in browser memory using WebAssembly, ensuring your contracts, financial statements, and private records never leave your device.",
      badgeText: "Zero-Egress Architecture"
    },
    {
      type: "word_how_to_steps",
      title: "How to Convert PDF to Word in 3 Steps",
      badgeText: "Fast & Frictionless",
      steps: [
        {
          title: "Select or Drop PDF",
          description: "Choose your PDF document. The file is read directly into your device RAM without uploading."
        },
        {
          title: "Intelligent Layout Extraction",
          description: "Our client-side engine reconstructs paragraphs, fonts, and text hierarchy into standard OpenXML."
        },
        {
          title: "Download Editable DOCX",
          description: "Instantly save your converted Word file, ready to open in Microsoft Word, Google Docs, or LibreOffice."
        }
      ]
    },
    {
      type: "word_geo_targeting",
      title: "Enterprise-Grade Document Confidentiality",
      content: "Engineered for legal counsel, accountants, researchers, and enterprises who cannot risk uploading proprietary documents to third-party SaaS servers. Complies with GDPR Article 25 (Privacy by Design) and HIPAA data isolation guidelines.",
      subTitle: "Unhackable In-RAM Execution",
      subContent: "Once you close the browser tab, all document buffers are automatically purged from system memory.",
      badgeText: "Bank-Grade Privacy"
    },
    {
      type: "word_privacy_security",
      title: "Pure Zero-Egress Network Isolation",
      content: "You can even disconnect your Wi-Fi or turn on Airplane Mode after loading the page: the PDF to Word converter continues to operate with 100% functionality completely offline.",
      badgeText: "Offline Ready"
    },
    {
      type: "word_performance",
      title: "Instant In-Memory OpenXML Generation",
      content: "Say goodbye to waiting in server queues or downloading huge attachments. Convert multi-page PDFs to clean, editable Word documents in milliseconds directly on your hardware.",
      badgeText: "High-Speed Conversion"
    }
  ],
  faqs: [
    {
      q: "Can I edit the converted document in Microsoft Word and Google Docs?",
      a: "Yes. The output is a standard OpenXML (.docx) file fully compatible with Microsoft Word 2007 through 365, Google Docs, LibreOffice Writer, and Apple Pages."
    },
    {
      q: "Are my documents uploaded to any remote server?",
      a: "No. HandleMyFile operates under a strict Zero-Egress policy. All parsing, text clustering, and DOCX generation happen 100% inside your web browser sandbox."
    },
    {
      q: "Does this tool work completely offline without internet?",
      a: "Yes. Once the application assets are cached in your browser, you can convert PDFs to Word documents without an active internet connection."
    },
    {
      q: "Is there any file size limit, page limit, or mandatory registration?",
      a: "There are no artificial paywalls, watermarks, or user registrations required. The only limit is your device available RAM."
    },
    {
      q: "Will bold, italic, and font headings be preserved?",
      a: "Yes. Our spatial analyzer detects font weights, styles, and font sizes to maintain your headings, bold emphasis, and italic styling in the converted Word document."
    }
  ]
};

const pdfToWordNoLossData = {
  title: "Convert PDF to Word Without Losing Formatting — Free DOCX Converter",
  h1: "Convert PDF to Word While Preserving Exact Layout & Typography",
  description: "Extract text, fonts, tables, and paragraphs from PDF files into Microsoft Word (.docx) format without scrambling layout or losing formatting. 100% private in your browser.",
  buttonText: "Convert Without Losing Formatting",
  badges: ["Preserve Layout", "Vector Precision", "Zero Upload"],
  stats: ["100%", "Fidelity", "0", "Data Leaks"],
  supportCenter: "High-Fidelity Document Recovery",
  faqTitle: "Formatting & Layout Preservation FAQ",
  sections: [
    {
      type: "compress_hero_features",
      title: "Eliminate Scrambled Text & Broken Line Breaks",
      content: "Most generic PDF converters break text into thousands of disconnected floating text boxes. Our layout engine analyzes spatial reading flow to reconstruct continuous paragraphs, headings, and margins so your Word document is truly editable.",
      badgeText: "True Reflowable Layout"
    },
    {
      type: "organize_how_to_steps",
      title: "How to Keep PDF Formatting When Converting to Word",
      badgeText: "Precision Workflow",
      steps: [
        {
          title: "Upload Your Document",
          description: "Drop your PDF into the local workspace. Every page is rendered visually in real time."
        },
        {
          title: "Spatial Structure Reconstruction",
          description: "Our dual-engine layout analyzer groups word runs into natural lines and paragraph blocks."
        },
        {
          title: "Export Clean .docx",
          description: "Download a clean Word document with proper paragraph spacing, indentations, and font hierarchies."
        }
      ]
    },
    {
      type: "protect_geo_targeting",
      title: "High-Precision Layout Recovery for Complex Documents",
      content: "Specially tuned for academic theses, legal briefs, technical whitepapers, and invoices where formatting errors, missing bullet points, or broken line wraps cannot be tolerated.",
      subTitle: "ISO/IEC 29500 OpenXML Compliance",
      subContent: "Produces standards-compliant Word document packages with clean XML tags and zero bloat.",
      badgeText: "Standard Compliant"
    },
    {
      type: "redact_privacy_security",
      title: "Strict Zero Data Retention Guarantee",
      content: "Because processing happens directly within your browser runtime, neither HandleMyFile nor any third party ever has access to your proprietary intellectual property.",
      badgeText: "Confidentiality Assured"
    },
    {
      type: "watermark_performance",
      title: "Deterministic WebAssembly Layout Engine",
      content: "Leverages modern WebAssembly SIMD and Web Workers to process complex document layouts with zero UI freezing and lightning-fast execution.",
      badgeText: "Near-Native Speed"
    }
  ],
  faqs: [
    {
      q: "How does this tool prevent formatting loss compared to other converters?",
      a: "Instead of creating fragmented text boxes for every word, our engine calculates spatial bounding boxes and line heights to group text into natural Word paragraphs with consistent margins."
    },
    {
      q: "Can I edit the converted Word file as normal reflowable text?",
      a: "Yes. The generated .docx document uses standard paragraph and heading tags, allowing you to edit, add, or delete text without breaking adjacent paragraphs."
    },
    {
      q: "Are tables and multi-page documents supported?",
      a: "Yes. Multi-page documents automatically include clean page breaks, and tabular lines are organized sequentially."
    },
    {
      q: "What fonts are used in the converted Word document?",
      a: "The engine maps standard PDF font families (such as Helvetica, Times, Courier, and Arial) to universally supported OpenXML font definitions like Calibri, Arial, and Times New Roman."
    },
    {
      q: "Is there any cost, subscription, or watermark added?",
      a: "None. HandleMyFile is completely free to use with zero watermarks, zero advertisements, and zero subscriptions."
    }
  ]
};

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'type') continue; // CRITICAL: NEVER translate component identifier!
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          Object.assign(result, flattenObject(item, `${fullKey}[${index}]`));
        } else {
          result[`${fullKey}[${index}]`] = item;
        }
      });
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function unflattenObject(flatObj, template) {
  const result = JSON.parse(JSON.stringify(template));
  for (const flatKey of Object.keys(flatObj)) {
    const keys = flatKey.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = flatObj[flatKey];
  }
  return result;
}

async function translateWithRetry(values, targetLang, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await translate(values, { to: targetLang, forceTo: true });
      return Array.isArray(res) ? res.map(r => r.text) : [res.text];
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`    ⚠️ Retry ${attempt}/${retries} for ${targetLang}: ${err.message}`);
      await sleep(1000 * attempt);
    }
  }
}

async function main() {
  console.log('🚀 GENERATING COMPREHENSIVE MULTILINGUAL SEO SECTIONS FOR PDF TO WORD...');
  console.log(`🌐 Total languages to translate: ${LANG_CODES.length}`);

  const seoBaseDir = path.join(__dirname, '..', 'src', 'locales', 'seo');
  const dir1 = path.join(seoBaseDir, 'pdf-to-word');
  const dir2 = path.join(seoBaseDir, 'pdf-to-word-without-losing-formatting');

  if (!fs.existsSync(dir1)) fs.mkdirSync(dir1, { recursive: true });
  if (!fs.existsSync(dir2)) fs.mkdirSync(dir2, { recursive: true });

  // 1. Write English base files
  fs.writeFileSync(path.join(dir1, 'en.json'), JSON.stringify(pdfToWordData, null, 2), 'utf8');
  fs.writeFileSync(path.join(dir2, 'en.json'), JSON.stringify(pdfToWordNoLossData, null, 2), 'utf8');
  console.log('✅ English base files saved.');

  const flat1 = flattenObject(pdfToWordData);
  const keys1 = Object.keys(flat1);
  const values1 = Object.values(flat1);

  const flat2 = flattenObject(pdfToWordNoLossData);
  const keys2 = Object.keys(flat2);
  const values2 = Object.values(flat2);

  const combinedValues = [...values1, ...values2];
  console.log(`📊 Total string nodes per language: ${combinedValues.length}`);

  for (let i = 0; i < LANG_CODES.length; i++) {
    const lang = LANG_CODES[i];
    let targetLang = lang;
    if (targetLang === 'zh') targetLang = 'zh-CN';

    process.stdout.write(`[${i + 1}/${LANG_CODES.length}] Translating to ${lang}... `);

    try {
      const translatedCombined = await translateWithRetry(combinedValues, targetLang);
      
      const transValues1 = translatedCombined.slice(0, values1.length);
      const transValues2 = translatedCombined.slice(values1.length);

      const transFlat1 = {};
      keys1.forEach((k, idx) => transFlat1[k] = transValues1[idx]);
      const finalJson1 = unflattenObject(transFlat1, pdfToWordData);
      fs.writeFileSync(path.join(dir1, `${lang}.json`), JSON.stringify(finalJson1, null, 2), 'utf8');

      const transFlat2 = {};
      keys2.forEach((k, idx) => transFlat2[k] = transValues2[idx]);
      const finalJson2 = unflattenObject(transFlat2, pdfToWordNoLossData);
      fs.writeFileSync(path.join(dir2, `${lang}.json`), JSON.stringify(finalJson2, null, 2), 'utf8');

      console.log('DONE!');
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }

    // Friendly delay to avoid rate limits
    await sleep(250);
  }

  console.log('\n🎉 ALL 30 LANGUAGES GENERATED FOR PDF TO WORD TOOLS!\n');
}

main().catch(console.error);
