const fs = require('fs');
const path = require('path');

const tools = [
  { id: 'merge-pdf', title: 'Free Online PDF Merger - Combine PDF Files Locally | Zero Upload', h1: 'Merge PDF Files Instantly in Your Browser', description: 'Combine multiple PDF files into a single document using pure client-side WebAssembly. No file uploads, 100% privacy guaranteed, zero limits.' },
  { id: 'edit-pdf', title: 'Free Online PDF Editor - Add Text & Images Locally | Zero Upload', h1: 'Edit PDF Documents Directly in Your Browser', description: 'A fully client-side interactive PDF Editor. Add text, overlay images, and manipulate PDFs locally with 100% privacy and zero uploads.' },
  { id: 'split-pdf', title: 'Split PDF Online - Extract Pages Separately | Client-Side Privacy', h1: 'Split PDF Documents & Extract Specific Pages', description: 'Separate one or more PDF pages into independent PDF files or a ZIP archive locally. Fast, secure, and 100% browser-based.' },
  { id: 'rotate-pdf', title: 'Rotate PDF Pages Online - Turn PDF 90/180/270 Degrees Locally', h1: 'Rotate PDF Pages & Fix Orientation', description: 'Rotate individual pages or all pages in your PDF document locally in seconds. Zero uploads required.' },
  { id: 'page-numbers', title: 'Add Page Numbers to PDF - Custom Header & Footer Locally', h1: 'Insert Page Numbers into PDF Documents', description: 'Easily add clean, customizable page numbers to your PDF header or footer with full styling control in your browser.' },
  { id: 'watermark-pdf', title: 'Add Watermark to PDF - Stamp Custom Text or Image Locally', h1: 'Stamp Custom Text or Image Watermarks onto PDF', description: 'Protect your intellectual property by stamping transparent text or image watermarks across your PDF pages offline.' },
  { id: 'remove-pdf', title: 'Remove PDF Pages Online - Delete Pages from PDF Locally', h1: 'Remove Pages from PDF Instantly', description: 'Delete unwanted pages from your PDF file securely inside your browser.' },
  { id: 'organize-pdf', title: 'Organize PDF Online - Insert Pages into PDF Locally', h1: 'Insert Pages into PDF Precisely', description: 'Insert another PDF file at a specific page index securely inside your browser.' },
  { id: 'sign-pdf', title: 'Sign PDF Online - Add Electronic Signature to PDF', h1: 'E-Sign PDF Documents Locally', description: 'Draw, upload, or generate an electronic signature and add it to your PDF.' },
  { id: 'protect-pdf', title: 'Protect PDF Online - Password Protect PDF Locally', h1: 'Encrypt & Password Protect PDF Documents', description: 'Secure your PDF files with AES-256 encryption and password protection locally in your browser.' },
  { id: 'unlock-pdf', title: 'Unlock PDF Online - Remove PDF Password Locally', h1: 'Unlock Password Protected PDF Documents', description: 'Remove password and encryption from your PDF files instantly in your browser.' },
  { id: 'crop-pdf', title: 'Crop PDF Online - Remove Margins from PDF Locally', h1: 'Crop PDF Pages Instantly', description: 'Remove white margins or cut PDF pages to a specific size locally in your browser.' },
  { id: 'extract-images-pdf', title: 'Extract Images from PDF - Save All Pictures from PDF', h1: 'Extract Images & Photos from PDF', description: 'Instantly scan your PDF and extract all embedded images as high-quality JPG/PNG files locally.' },
  { id: 'grayscale-pdf', title: 'Convert PDF to Grayscale - Black and White PDF Online', h1: 'Make PDF Black and White', description: 'Convert colored PDF documents to grayscale instantly in your browser to save printing ink.' },
  { id: 'scan-to-pdf', title: 'Scan to PDF - Make PDF Uneditable & Rasterize Online', h1: 'Scan PDF to Make it Uneditable', description: 'Rasterize your PDF documents into flat images inside a PDF. Prevents copy-pasting and editing securely in your browser.' },
  { id: 'remove-pdf-metadata', title: 'Remove PDF Metadata - Sanitize Properties Online', h1: 'Clean and Sanitize PDF Metadata', description: 'Remove author, creator, and other hidden digital footprint properties from your PDF files offline for better privacy.' },
  { id: 'compare-pdf', title: 'Compare PDF - Find Differences Between Two PDFs', h1: 'Compare Two PDF Documents Visually', description: 'Upload two PDF files and highlight the visual differences between them pixel-by-pixel locally.' },
  { id: 'redact-pdf', title: 'Redact PDF - Securely Blackout Text and Images', h1: 'Securely Blackout Sensitive PDF Content', description: 'Draw redaction boxes over private information. The redacted pages are fully rasterized to permanently destroy the hidden text.' },
  { id: 'reverse-pdf', title: 'Reverse PDF Pages - Change PDF Page Order Backwards', h1: 'Reverse the Page Order of Your PDF', description: 'Instantly reverse the sequence of pages in your PDF document from last to first securely in your browser.' },
  { id: 'resize-pdf', title: 'Resize PDF Pages - Change PDF Page Size and Margins', h1: 'Change the Size and Margins of PDF Pages', description: 'Resize your PDF pages to standard sizes like A4 or Letter, add margins, and perfectly center your content.' },
  { id: 'word-to-pdf', title: 'Convert Word to PDF Online - DOCX to PDF Locally | Zero Upload', h1: 'Convert Microsoft Word (DOCX) to PDF Instantly', description: 'Turn your DOCX and DOC documents into pixel-perfect PDF files entirely in your browser without uploading to any server.' },
  { id: 'excel-to-pdf', title: 'Convert Excel to PDF Online - XLSX & XLS to PDF Locally', h1: 'Convert Microsoft Excel Spreadsheets to PDF', description: 'Transform spreadsheets and financial data into clean, printable PDF tables offline in your browser.' },
  { id: 'ppt-to-pdf', title: 'Convert PowerPoint to PDF - PPTX Slides to PDF Locally', h1: 'Convert PowerPoint Presentations to High-Res PDF Slides', description: 'Save PPTX presentation slides as universal PDF documents for easy sharing and printing without server uploads.' },
  { id: 'txt-to-pdf', title: 'Convert TXT to PDF Online - Plain Text to PDF Document', h1: 'Convert Plain Text Files (TXT) into Formatted PDFs', description: 'Quickly turn plain text files or code logs into well-structured, readable PDF documents instantly in your browser.' },
  { id: 'pdf-to-word', title: 'Free PDF to Word Converter (.docx) - 100% Offline Client-Side', h1: 'Convert PDF to Editable Word DOCX in Your Browser', description: 'Extract exact text, layout runs, and paragraphs from any PDF into a clean Microsoft Word (.docx) file directly inside browser memory.' },
  { id: 'pdf-to-ppt', title: 'Free PDF to PowerPoint Converter (.pptx) - Zero Uploads', h1: 'Convert PDF to PowerPoint Presentation Slides Offline', description: 'Turn your multi-page PDF documents into editable PowerPoint (.pptx) slides with high fidelity inside browser RAM.' },
  { id: 'csv-to-excel', title: 'Free CSV to Excel Converter (.xlsx) - Instant Browser Engine', h1: 'Convert Comma Separated CSV to Microsoft Excel Spreadsheet (.xlsx)', description: 'Turn raw CSV files into properly formatted Excel spreadsheets with multi-sheet support and zero data loss offline.' },
  { id: 'excel-to-csv', title: 'Free Excel to CSV Converter (.xlsx to .csv) - Zero Uploads', h1: 'Extract Excel Worksheets to Standard UTF-8 CSV Files', description: 'Quickly export data from Microsoft Excel spreadsheets (.xlsx, .xls) into universal CSV format entirely in your browser.' },
  { id: 'image-to-pdf', title: 'Convert JPG & PNG to PDF Online - Images to PDF Locally', h1: 'Convert PNG & JPG Images into Multi-Page PDF Documents', description: 'Combine photos, screenshots, or PNG/JPG images into a single clean PDF document locally without uploading.' },
  { id: 'pdf-to-image', title: 'Convert PDF to JPG/PNG Images Online - Extract Pages to ZIP', h1: 'Extract PDF Pages as High-Resolution PNG or JPG Images', description: 'Rasterize PDF pages into crystal-clear PNG/JPG images locally. Download individually or as a high-speed ZIP archive.' },
  { id: 'compress-pdf', title: 'Compress PDF Online - Reduce File Size by 60-90% Locally', h1: 'Compress PDF Documents without Losing Quality', description: 'Shrink large PDF files up to 90% using adaptive lossless and DPI rasterization techniques directly in WebAssembly.' },
  { id: 'ocr-pdf', title: 'Free Browser OCR - Extract Text from Scanned PDF & Images', h1: 'Extract Text from Scanned PDFs & Images with Tesseract OCR', description: 'Turn non-searchable scanned PDFs and images into editable plain text locally using multi-language WebAssembly OCR workers.' }
];

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
    
    // Using RegExp to handle weird spaces added by Google Translate around the delimiter
    const parts = translatedText.split(/\s*\|\|\|\s*/);
    return parts.map(x => x.trim().replace(/^"|"$/g, ''));
  } catch (e) {
    console.error('Translation failed for', targetLang, e);
    return texts;
  }
}

async function run() {
  const result = {};
  fs.mkdirSync('src/i18n', { recursive: true });
  
  for (const lang of langs) {
    console.log('Translating to', lang, '...');
    result[lang] = {};
    
    const flatTexts = [];
    for (const tool of tools) {
      flatTexts.push(tool.title, tool.h1, tool.description);
    }
    
    const chunkSize = 15; 
    let translatedFlat = [];
    
    for (let i = 0; i < flatTexts.length; i += chunkSize) {
      const chunk = flatTexts.slice(i, i + chunkSize);
      const translatedChunk = await translateChunk(chunk, lang);
      translatedFlat = translatedFlat.concat(translatedChunk);
      await new Promise(r => setTimeout(r, 600));
    }
    
    let idx = 0;
    for (const tool of tools) {
      result[lang][tool.id] = {
        title: translatedFlat[idx] || tool.title,
        h1: translatedFlat[idx+1] || tool.h1,
        description: translatedFlat[idx+2] || tool.description
      };
      idx += 3;
    }
  }
  
  const tsContent = "// Auto-generated Catalog Translations\n" +
"export const catalogTranslations: Record<string, Record<string, { title: string, h1: string, description: string }>> = " + JSON.stringify(result, null, 2) + ";\n";
  
  fs.writeFileSync('src/i18n/catalogTranslations.ts', tsContent);
  console.log('Done catalogTranslations.ts');
}

run();
