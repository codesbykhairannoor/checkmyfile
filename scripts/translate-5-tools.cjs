const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const seoData = {
  "remove-pdf-password-without-password": {
    en: {
      title: "Remove PDF Password Without Password - Unlock PDF",
      h1: "Remove Password from PDF Without Password",
      description: "Remove password protection from your PDF files without needing the original password using our advanced unlock tool.",
      heroBadge: "Instant Unlock",
      heroTitle: "Remove PDF Passwords Instantly",
      heroContent: "Forgot your PDF password? Our tool can help you strip the password protection from your documents in seconds, securely inside your browser.",
      howToBadge: "Quick Guide",
      howToTitle: "How to Unlock PDF",
      step1Title: "Select Locked PDF",
      step1Desc: "Upload the PDF document you want to unlock.",
      step2Title: "Remove Password",
      step2Desc: "Click unlock to strip the password from the document.",
      step3Title: "Download Unlocked PDF",
      step3Desc: "Save the unprotected PDF to your device.",
      geoTitle: "100% Secure Local Processing",
      geoContent: "Your locked documents contain sensitive information. We process them locally using WebAssembly, ensuring 0 bytes ever leave your device.",
      geoSubTitle: "Privacy First",
      geoSubContent: "No cloud servers, no data retention.",
      privacyTitle: "Bank-Level Privacy",
      privacyContent: "We use advanced algorithms to remove encryption without compromising your document's contents.",
      perfTitle: "Lightning Fast",
      perfContent: "Unlock your PDF in milliseconds.",
      perfBadge: "Ultra Fast",
      badges: ["No Upload", "Secure", "Fast"],
      buttonText: "Unlock PDF Now",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Is it safe to unlock my PDF here?", a: "Yes. All processing is done locally in your browser. We do not upload your files to any server." },
        { q: "Can it remove all types of passwords?", a: "It can remove user passwords and owner passwords from standard encrypted PDFs." },
        { q: "Is this tool free?", a: "Yes, it is 100% free to use." }
      ]
    }
  },
  "reorder-pdf-pages-drag-and-drop": {
    en: {
      title: "Reorder PDF Pages Drag and Drop Free - Sort PDF Pages",
      h1: "Reorder PDF Pages Easily with Drag and Drop",
      description: "Organize and reorder pages in your PDF document visually by dragging and dropping thumbnails. 100% free and local.",
      heroBadge: "Easy Reordering",
      heroTitle: "Organize PDF Pages Visually",
      heroContent: "Change the order of your PDF pages simply by dragging and dropping the thumbnails. No complex software needed.",
      howToBadge: "Step-by-Step",
      howToTitle: "How to Reorder PDF Pages",
      step1Title: "Upload PDF",
      step1Desc: "Select the PDF file you want to organize.",
      step2Title: "Drag & Drop",
      step2Desc: "Click and drag the page thumbnails to rearrange them.",
      step3Title: "Save Changes",
      step3Desc: "Download the newly ordered PDF document.",
      geoTitle: "Visual Drag & Drop Interface",
      geoContent: "Our intuitive interface makes it incredibly easy to see your pages and move them exactly where they need to be.",
      geoSubTitle: "Interactive",
      geoSubContent: "Real-time thumbnail generation.",
      privacyTitle: "100% Client-Side Sorting",
      privacyContent: "Your documents are rearranged locally in your browser. We guarantee complete privacy.",
      perfTitle: "Smooth Experience",
      perfContent: "Reorder large documents without lag.",
      perfBadge: "Optimized",
      badges: ["Visual", "Private", "Free"],
      buttonText: "Reorder Pages Now",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Can I delete pages while reordering?", a: "Yes, you can also select pages and remove them if needed." },
        { q: "Does it work on mobile?", a: "Yes, our drag and drop interface is touch-friendly and works on mobile devices." },
        { q: "Are my files uploaded to a server?", a: "No, all reordering happens directly on your device." }
      ]
    }
  },
  "reduce-pdf-size-offline": {
    en: {
      title: "Reduce PDF Size Offline - Local PDF Compressor",
      h1: "Reduce PDF Size Completely Offline in Your Browser",
      description: "Reduce the size of your PDF documents offline directly in your browser without any server uploads. 100% secure.",
      heroBadge: "Offline Compression",
      heroTitle: "Shrink PDF Files Offline",
      heroContent: "Compress large PDFs without an internet connection. Our WebAssembly engine runs entirely offline within your browser.",
      howToBadge: "Quick Steps",
      howToTitle: "How to Reduce PDF Size Offline",
      step1Title: "Add File",
      step1Desc: "Select your large PDF document.",
      step2Title: "Compress",
      step2Desc: "Choose compression level and click compress.",
      step3Title: "Download",
      step3Desc: "Save the smaller PDF file to your computer.",
      geoTitle: "Works Without Internet",
      geoContent: "Once the page is loaded, you can disconnect from the internet and the tool will still work perfectly.",
      geoSubTitle: "True Offline",
      geoSubContent: "No server communication during compression.",
      privacyTitle: "Maximum Privacy Guaranteed",
      privacyContent: "Since no data is ever transmitted over the network, your sensitive documents are 100% secure.",
      perfTitle: "Efficient Engine",
      perfContent: "High compression ratio with fast processing.",
      perfBadge: "High Efficiency",
      badges: ["Offline", "Secure", "Fast"],
      buttonText: "Reduce Size Now",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "How does offline compression work?", a: "We use WebAssembly to run a powerful PDF compression engine directly inside your browser." },
        { q: "Will the quality be ruined?", a: "No, you can choose lossless compression to maintain high visual quality." },
        { q: "Is there a file size limit?", a: "No, since it runs locally, you can compress files as large as your device's memory allows." }
      ]
    }
  },
  "pdf-to-word-without-losing-formatting": {
    en: {
      title: "Free PDF to Word Converter (.docx) Without Losing Formatting",
      h1: "Convert PDF to Editable Word DOCX in Your Browser",
      description: "Extract exact text, layout runs, and paragraphs from any PDF into a clean Microsoft Word (.docx) file directly inside browser memory.",
      heroBadge: "Preserve Formatting",
      heroTitle: "Convert PDF to Word Perfectly",
      heroContent: "Transform your PDF documents into editable Word files while keeping the original layout, fonts, and images intact.",
      howToBadge: "Easy Conversion",
      howToTitle: "How to Convert PDF to Word",
      step1Title: "Upload PDF",
      step1Desc: "Select the PDF file you wish to convert.",
      step2Title: "Convert to DOCX",
      step2Desc: "Click convert to start the local processing.",
      step3Title: "Download Word File",
      step3Desc: "Save the fully editable Word document.",
      geoTitle: "Accurate Layout Retention",
      geoContent: "Our advanced parser understands paragraphs, tables, and columns, ensuring your Word document looks exactly like the PDF.",
      geoSubTitle: "High Fidelity",
      geoSubContent: "Maintain styling and structure.",
      privacyTitle: "Secure Client-Side Conversion",
      privacyContent: "Convert confidential contracts and reports securely. The conversion happens entirely on your device.",
      perfTitle: "Fast Processing",
      perfContent: "Convert multi-page documents in seconds.",
      perfBadge: "Quick Output",
      badges: ["Editable", "Accurate", "Private"],
      buttonText: "Convert to Word",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Will the layout change?", a: "We strive to preserve the exact layout, including tables, images, and text alignment." },
        { q: "Is this processed on a server?", a: "No, the conversion is done completely in your browser for maximum privacy." },
        { q: "Can I edit the text after conversion?", a: "Yes, the resulting DOCX file is fully editable in Microsoft Word or Google Docs." }
      ]
    }
  },
  "scanned-pdf-to-text-ocr": {
    en: {
      title: "Convert Scanned PDF to Text - Free Browser OCR",
      h1: "Extract Text from Scanned PDFs with OCR",
      description: "Turn non-searchable scanned PDFs and images into editable plain text locally using multi-language WebAssembly OCR workers.",
      heroBadge: "Powerful OCR",
      heroTitle: "Extract Text from Scans Instantly",
      heroContent: "Use our advanced Optical Character Recognition (OCR) technology to extract editable text from scanned documents and images.",
      howToBadge: "Simple Guide",
      howToTitle: "How to Extract Text with OCR",
      step1Title: "Upload Scan",
      step1Desc: "Select your scanned PDF or image file.",
      step2Title: "Run OCR",
      step2Desc: "Select the language and start the OCR process.",
      step3Title: "Copy or Download",
      step3Desc: "Get the extracted text instantly.",
      geoTitle: "Multi-Language Support",
      geoContent: "Our OCR engine recognizes multiple languages and complex character sets with high accuracy.",
      geoSubTitle: "Accurate Extraction",
      geoSubContent: "Powered by Tesseract OCR WebAssembly.",
      privacyTitle: "Private OCR Processing",
      privacyContent: "Unlike other OCR tools, we do not send your documents to cloud APIs. The text extraction happens right on your device.",
      perfTitle: "High Accuracy",
      perfContent: "Excellent recognition rate for clear scans.",
      perfBadge: "Precise",
      badges: ["OCR", "Secure", "Free"],
      buttonText: "Start OCR Extraction",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Does it support handwritten text?", a: "Our OCR is optimized for printed text. Handwritten text may have lower accuracy." },
        { q: "Do my files get uploaded?", a: "No, the OCR engine runs entirely in your browser using WebAssembly." },
        { q: "Can I extract text from images too?", a: "Yes, you can upload PNG, JPG, or scanned PDF files." }
      ]
    }
  }
};

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

async function translateArray(texts, targetLang) {
  try {
    const apiLang = targetLang === 'zh' ? 'zh-CN' : targetLang;
    const res = await translate(texts, { to: apiLang });
    return Array.isArray(res) ? res.map(r => r.text) : [res.text];
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error.message);
    return texts;
  }
}

async function run() {
  for (const toolId of Object.keys(seoData)) {
    const targetToolDir = path.join(__dirname, '..', 'src', 'locales', 'seo', toolId);
    if (!fs.existsSync(targetToolDir)) {
      fs.mkdirSync(targetToolDir, { recursive: true });
    }
    
    let layoutConfig = [];
    if (toolId === "remove-pdf-password-without-password") {
      layoutConfig = ["protect_hero_features", "merge_how_to_steps", "compare_geo_targeting", "watermark_privacy_security", "ocr_performance"];
    } else if (toolId === "reorder-pdf-pages-drag-and-drop") {
      layoutConfig = ["word_hero_features", "split_how_to_steps", "watermark_geo_targeting", "unlock_privacy_security", "resize_performance"];
    } else if (toolId === "reduce-pdf-size-offline") {
      layoutConfig = ["split_hero_features", "ocr_how_to_steps", "rotate_geo_targeting", "sign_privacy_security", "split_performance"];
    } else if (toolId === "pdf-to-word-without-losing-formatting") {
      layoutConfig = ["watermark_hero_features", "protect_how_to_steps", "excel_geo_targeting", "redact_privacy_security", "watermark_performance"];
    } else if (toolId === "scanned-pdf-to-text-ocr") {
      layoutConfig = ["resize_hero_features", "merge_how_to_steps", "watermark_geo_targeting", "unlock_privacy_security", "ocr_performance"];
    }

    const en = seoData[toolId].en;
    
    for (const lang of langs) {
      if (lang === 'en') {
        const data = generateLayoutData(en, layoutConfig);
        fs.writeFileSync(path.join(targetToolDir, `${lang}.json`), JSON.stringify(data, null, 2), 'utf8');
        continue;
      }
      
      console.log(`Translating ${toolId} to ${lang}...`);
      
      const textArray = [
        en.title, en.h1, en.description,
        en.heroBadge, en.heroTitle, en.heroContent,
        en.howToBadge, en.howToTitle,
        en.step1Title, en.step1Desc,
        en.step2Title, en.step2Desc,
        en.step3Title, en.step3Desc,
        en.geoTitle, en.geoContent,
        en.geoSubTitle, en.geoSubContent,
        en.privacyTitle, en.privacyContent,
        en.perfTitle, en.perfContent, en.perfBadge,
        ...en.badges,
        en.buttonText, en.supportCenter, en.faqTitle,
        ...en.faqs.map(f => f.q),
        ...en.faqs.map(f => f.a)
      ];

      const tr = await translateArray(textArray, lang);

      let offset = 0;
      const t = {
        title: tr[offset++],
        h1: tr[offset++],
        description: tr[offset++],
        heroBadge: tr[offset++],
        heroTitle: tr[offset++],
        heroContent: tr[offset++],
        howToBadge: tr[offset++],
        howToTitle: tr[offset++],
        step1Title: tr[offset++],
        step1Desc: tr[offset++],
        step2Title: tr[offset++],
        step2Desc: tr[offset++],
        step3Title: tr[offset++],
        step3Desc: tr[offset++],
        geoTitle: tr[offset++],
        geoContent: tr[offset++],
        geoSubTitle: tr[offset++],
        geoSubContent: tr[offset++],
        privacyTitle: tr[offset++],
        privacyContent: tr[offset++],
        perfTitle: tr[offset++],
        perfContent: tr[offset++],
        perfBadge: tr[offset++],
        badges: [tr[offset++], tr[offset++], tr[offset++]],
        buttonText: tr[offset++],
        supportCenter: tr[offset++],
        faqTitle: tr[offset++]
      };
      t.faqs = [
        { q: tr[offset++], a: tr[offset + 2] },
        { q: tr[offset++], a: tr[offset + 2] },
        { q: tr[offset++], a: tr[offset + 2] }
      ];

      const data = generateLayoutData(t, layoutConfig);
      fs.writeFileSync(path.join(targetToolDir, `${lang}.json`), JSON.stringify(data, null, 2), 'utf8');
      
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.log('✅ Done translating 5 new tools to 30 languages!');
}

function generateLayoutData(t, layoutConfig) {
  return {
    title: t.title,
    h1: t.h1,
    description: t.description,
    sections: [
      {
        type: layoutConfig[0],
        title: t.heroTitle,
        content: t.heroContent,
        badgeText: t.heroBadge
      },
      {
        type: layoutConfig[1],
        title: t.howToTitle,
        badgeText: t.howToBadge,
        steps: [
          { title: t.step1Title, description: t.step1Desc },
          { title: t.step2Title, description: t.step2Desc },
          { title: t.step3Title, description: t.step3Desc }
        ]
      },
      {
        type: layoutConfig[2],
        title: t.geoTitle,
        content: t.geoContent,
        subTitle: t.geoSubTitle,
        subContent: t.geoSubContent,
        badgeText: t.geoSubTitle
      },
      {
        type: layoutConfig[3],
        title: t.privacyTitle,
        content: t.privacyContent
      },
      {
        type: layoutConfig[4],
        title: t.perfTitle,
        content: t.perfContent,
        badgeText: t.perfBadge
      }
    ],
    faqs: t.faqs,
    badges: t.badges,
    stats: ["Client-Side", "Fast", "Secure", "Private"],
    buttonText: t.buttonText,
    supportCenter: t.supportCenter,
    faqTitle: t.faqTitle
  };
}

run();
