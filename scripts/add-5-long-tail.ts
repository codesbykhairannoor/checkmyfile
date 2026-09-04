import { Project, SyntaxKind, ArrayLiteralExpression } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';
import translate from 'google-translate-api-x';

const LANGUAGES = ['en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'];

const GEO_TYPES = [
  'geo_targeting', 'word_geo_targeting', 'excel_geo_targeting', 'ppt_geo_targeting',
  'image_geo_targeting', 'txt_geo_targeting', 'protect_geo_targeting', 'unlock_geo_targeting',
  'redact_geo_targeting', 'sign_geo_targeting', 'metadata_geo_targeting', 'rotate_geo_targeting',
  'watermark_geo_targeting', 'grayscale_geo_targeting', 'reverse_geo_targeting', 'resize_geo_targeting',
  'pagenum_geo_targeting', 'organize_geo_targeting', 'scan_geo_targeting', 'ocr_geo_targeting',
  'compare_geo_targeting', 'edit_geo_targeting', 'csv_excel_geo_targeting', 'excel_csv_geo_targeting'
];

const PRIVACY_TYPES = [
  'privacy_security', 'word_privacy_security', 'excel_privacy_security', 'ppt_privacy_security',
  'image_privacy_security', 'txt_privacy_security', 'protect_privacy_security', 'unlock_privacy_security',
  'redact_privacy_security', 'sign_privacy_security', 'metadata_privacy_security', 'rotate_privacy_security',
  'watermark_privacy_security', 'grayscale_privacy_security', 'reverse_privacy_security', 'resize_privacy_security',
  'pagenum_privacy_security', 'organize_privacy_security', 'scan_privacy_security', 'ocr_privacy_security',
  'compare_privacy_security', 'edit_privacy_security', 'csv_excel_privacy_security', 'excel_csv_privacy_security'
];

const PERFORMANCE_TYPES = [
  'performance', 'word_performance', 'excel_performance', 'ppt_performance',
  'image_performance', 'txt_performance', 'protect_performance', 'unlock_performance',
  'redact_performance', 'sign_performance', 'metadata_performance', 'rotate_performance',
  'watermark_performance', 'grayscale_performance', 'reverse_performance', 'resize_performance',
  'pagenum_performance', 'organize_performance', 'scan_performance', 'ocr_performance',
  'compare_performance', 'edit_performance', 'csv_excel_performance', 'excel_csv_performance'
];

function getRandom(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

const tools = [
  {
    id: 'compress-pdf-to-100kb',
    category: 'pdf',
    iconName: 'Minimize',
    en: {
      slug: 'compress-pdf-to-100kb',
      title: 'Compress PDF to 100KB Free Online | No Uploads',
      h1: 'Compress PDF to 100KB Without Losing Quality',
      description: 'Shrink your PDF files down to 100KB or less directly in your browser. Perfect for email attachments and fast sharing. 100% private.',
      json: {
        sections: [
          { type: 'GEO', title: 'Local Compression Engine', content: 'Our advanced WASM engine compresses your PDF locally. No file limits.' },
          { type: 'PRIVACY', title: 'Zero Data Retention', content: 'Since files never leave your device, your private data remains yours alone.' },
          { type: 'PERFORMANCE', title: 'Lightning Fast 100KB', content: 'Hit your 100KB target size in milliseconds without server delays.' }
        ]
      }
    }
  },
  {
    id: 'merge-pdf-files-offline',
    category: 'pdf',
    iconName: 'Combine',
    en: {
      slug: 'merge-pdf-files-offline',
      title: 'Merge PDF Files Offline Free | 100% Secure',
      h1: 'Merge Your PDFs Offline in the Browser',
      description: 'Combine multiple highly sensitive PDF documents without an internet connection. Works fully offline after loading.',
      json: {
        sections: [
          { type: 'GEO', title: 'Offline Merging', content: 'Combine your tax forms and legal documents without sending them anywhere.' },
          { type: 'PRIVACY', title: 'Military Grade Privacy', content: 'We guarantee absolute privacy because we physically cannot see your files.' },
          { type: 'PERFORMANCE', title: 'Instant Processing', content: 'Merge 100s of pages instantly with client-side processing.' }
        ]
      }
    }
  },
  {
    id: 'convert-scanned-pdf-to-text',
    category: 'pdf',
    iconName: 'FileText',
    en: {
      slug: 'convert-scanned-pdf-to-text',
      title: 'Convert Scanned PDF to Searchable Text | Free OCR',
      h1: 'Turn Scanned PDFs into Editable Text',
      description: 'Use advanced browser-based OCR to extract text from scanned images and unsearchable PDFs. 100% free and private.',
      json: {
        sections: [
          { type: 'GEO', title: 'WebAssembly OCR', content: 'Tesseract OCR runs right in your browser. No cloud APIs involved.' },
          { type: 'PRIVACY', title: 'Confidential Extraction', content: 'Extract text from sensitive ID cards or medical records safely.' },
          { type: 'PERFORMANCE', title: 'High Accuracy', content: 'Support for multiple languages and skewed scans.' }
        ]
      }
    }
  },
  {
    id: 'add-page-numbers-to-pdf-free',
    category: 'pdf',
    iconName: 'ListOrdered',
    en: {
      slug: 'add-page-numbers-to-pdf-free',
      title: 'Add Page Numbers to PDF Free | No Limits',
      h1: 'Insert Page Numbers into PDF Documents',
      description: 'Easily paginate your PDF files. Add customizable page numbers to headers or footers instantly for free.',
      json: {
        sections: [
          { type: 'GEO', title: 'Free Pagination', content: 'Add numbers to unlimited files without hitting paywalls.' },
          { type: 'PRIVACY', title: 'Secure Document Handling', content: 'Your dissertations and reports are numbered privately on your machine.' },
          { type: 'PERFORMANCE', title: 'Batch Numbering', content: 'Apply page numbers to massive documents in a fraction of a second.' }
        ]
      }
    }
  },
  {
    id: 'remove-pdf-watermark-online',
    category: 'pdf',
    iconName: 'Eraser',
    en: {
      slug: 'remove-pdf-watermark-online',
      title: 'Remove PDF Watermark Online Free | Clean PDFs',
      h1: 'Remove Watermarks from PDF Files Safely',
      description: 'Redact or remove intrusive watermarks from your PDF documents. Fully private, browser-based watermark removal tool.',
      json: {
        sections: [
          { type: 'GEO', title: 'Clean Your PDFs', content: 'Remove unwanted stamps, backgrounds, and watermarks.' },
          { type: 'PRIVACY', title: 'Local Redaction', content: 'Erase sensitive watermarks without uploading files to our servers.' },
          { type: 'PERFORMANCE', title: 'Flawless Quality', content: 'We remove the watermark object without degrading your document quality.' }
        ]
      }
    }
  }
];

async function translateBatch(texts: string[], targetLang: string) {
  if (targetLang === 'en') return texts;
  let apiLang = targetLang;
  if (targetLang === 'zh') apiLang = 'zh-cn';
  
  try {
    const res = await translate(texts, { to: apiLang });
    return res.map((r: any) => r.text);
  } catch (err) {
    console.error(`Translation error for ${targetLang}:`, err);
    return texts;
  }
}

async function run() {
  console.log('Starting massive generation & translation script...');

  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
  });

  const pdfToolsFile = project.addSourceFileAtPath('src/catalog/pdfTools.ts');
  if (!pdfToolsFile) throw new Error('Could not find pdfTools.ts');
  const arrayDecl = pdfToolsFile.getVariableDeclaration('pdfTools');
  const arrayLiteral = arrayDecl?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
  if (!arrayLiteral) throw new Error('Could not find pdfTools array');

  for (const tool of tools) {
    console.log(`\nProcessing tool: ${tool.id}`);
    
    // Pick layout types
    const geoType = getRandom(GEO_TYPES);
    const privacyType = getRandom(PRIVACY_TYPES);
    const perfType = getRandom(PERFORMANCE_TYPES);

    const localesDir = path.join(process.cwd(), `src/locales/seo/${tool.id}`);
    fs.mkdirSync(localesDir, { recursive: true });

    let slugsObj: any = { en: `'${tool.en.slug}'` };
    let seoObj: any = {
      en: `{
        title: '${tool.en.title.replace(/'/g, "\\'")}',
        h1: '${tool.en.h1.replace(/'/g, "\\'")}',
        description: '${tool.en.description.replace(/'/g, "\\'")}',
        faqs: defaultFaqs('${tool.id}', 'en')
      }`
    };

    // We translate in batches of languages to avoid rate limits, but using Promise.all inside the batch
    const batchSize = 10;
    for (let i = 0; i < LANGUAGES.length; i += batchSize) {
      const langBatch = LANGUAGES.slice(i, i + batchSize);
      console.log(`Translating batch: ${langBatch.join(', ')}`);
      
      const promises = langBatch.map(async (lang) => {
        if (lang === 'en') {
          // Write English JSON
          const enJson = {
            id: tool.id,
            supportCenter: true,
            heroTitle: tool.en.h1,
            heroDescription: tool.en.description,
            sections: [
              { type: geoType, subTitle: tool.en.json.sections[0].title, subContent: tool.en.json.sections[0].content },
              { type: privacyType, subTitle: tool.en.json.sections[1].title, subContent: tool.en.json.sections[1].content },
              { type: perfType, subTitle: tool.en.json.sections[2].title, subContent: tool.en.json.sections[2].content }
            ]
          };
          fs.writeFileSync(path.join(localesDir, `en.json`), JSON.stringify(enJson, null, 2));
          return;
        }

        const textsToTranslate = [
          tool.en.slug.replace(/-/g, ' '),
          tool.en.title,
          tool.en.h1,
          tool.en.description,
          tool.en.json.sections[0].title,
          tool.en.json.sections[0].content,
          tool.en.json.sections[1].title,
          tool.en.json.sections[1].content,
          tool.en.json.sections[2].title,
          tool.en.json.sections[2].content
        ];

        const translated = await translateBatch(textsToTranslate, lang);
        
        let slug = translated[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // fallback if translation failed to return slug
        if (!slug) slug = `${tool.en.slug}-${lang}`;

        slugsObj[lang] = `'${slug}'`;
        seoObj[lang] = `{
          title: '${translated[1].replace(/'/g, "\\'")}',
          h1: '${translated[2].replace(/'/g, "\\'")}',
          description: '${translated[3].replace(/'/g, "\\'")}',
          faqs: defaultFaqs('${tool.id}', '${lang}')
        }`;

        const langJson = {
          id: tool.id,
          supportCenter: true,
          heroTitle: translated[2],
          heroDescription: translated[3],
          sections: [
            { type: geoType, subTitle: translated[4], subContent: translated[5] },
            { type: privacyType, subTitle: translated[6], subContent: translated[7] },
            { type: perfType, subTitle: translated[8], subContent: translated[9] }
          ]
        };
        fs.writeFileSync(path.join(localesDir, `${lang}.json`), JSON.stringify(langJson, null, 2));
      });

      await Promise.all(promises);
    }

    // Now inject into pdfTools.ts
    const newObjectText = `{
      id: '${tool.id}',
      category: 'pdf',
      iconName: '${tool.iconName}',
      slugs: generateSlugsForId('${tool.id}', {
        ${Object.entries(slugsObj).map(([k, v]) => `${k}: ${v}`).join(',\n        ')}
      }),
      seo: {
        ${Object.entries(seoObj).map(([k, v]) => `${k}: ${v}`).join(',\n        ')}
      }
    }`;

    arrayLiteral.addElement(newObjectText);
    console.log(`Injected ${tool.id} into pdfTools.ts`);
  }

  pdfToolsFile.saveSync();
  console.log('All done!');
}

run().catch(console.error);
