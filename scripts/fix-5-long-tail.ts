import * as path from 'path';
import * as fs from 'fs';
import translate from 'google-translate-api-x';

const LANGUAGES = ['en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'];

const tools = [
  {
    id: 'compress-pdf-to-100kb',
    en: {
      h1: 'Compress PDF to 100KB Without Losing Quality',
      description: 'Shrink your PDF files down to 100KB or less directly in your browser. Perfect for email attachments and fast sharing. 100% private.',
      sections: [
        { type: 'word_geo_targeting', title: 'Local Compression Engine', content: 'Our advanced WASM engine compresses your PDF locally. No file limits.' },
        { type: 'metadata_privacy_security', title: 'Zero Data Retention', content: 'Since files never leave your device, your private data remains yours alone.' },
        { type: 'protect_performance', title: 'Lightning Fast 100KB', content: 'Hit your 100KB target size in milliseconds without server delays.' }
      ],
      faqs: [
        { q: 'Can I compress a 50MB PDF down to 100KB?', a: 'Depending on the image content, our WASM engine will heavily compress visual data and remove hidden metadata to get as close to 100KB as physically possible.' },
        { q: 'Is it really 100% private?', a: 'Yes. All compression happens directly inside your browser. Your PDF is never uploaded to any server.' },
        { q: 'Will the text become blurry?', a: 'No, vector text and fonts remain razor-sharp. Only embedded images are compressed to hit the 100KB target.' }
      ]
    }
  },
  {
    id: 'merge-pdf-files-offline',
    en: {
      h1: 'Merge Your PDFs Offline in the Browser',
      description: 'Combine multiple highly sensitive PDF documents without an internet connection. Works fully offline after loading.',
      sections: [
        { type: 'sign_geo_targeting', title: 'Offline Merging', content: 'Combine your tax forms and legal documents without sending them anywhere.' },
        { type: 'rotate_privacy_security', title: 'Military Grade Privacy', content: 'We guarantee absolute privacy because we physically cannot see your files.' },
        { type: 'excel_performance', title: 'Instant Processing', content: 'Merge 100s of pages instantly with client-side processing.' }
      ],
      faqs: [
        { q: 'How does it work completely offline?', a: 'Once the page loads, our WebAssembly engine runs locally. You can disconnect your internet and continue merging PDFs.' },
        { q: 'Can I rearrange pages before merging?', a: 'Yes! Simply drag and drop the files in the timeline before you click merge to order them perfectly.' },
        { q: 'Is there a limit on how many PDFs I can merge?', a: 'There are no artificial limits. You are only limited by the RAM available on your local computer.' }
      ]
    }
  },
  {
    id: 'convert-scanned-pdf-to-text',
    en: {
      h1: 'Turn Scanned PDFs into Editable Text',
      description: 'Use advanced browser-based OCR to extract text from scanned images and unsearchable PDFs. 100% free and private.',
      sections: [
        { type: 'image_geo_targeting', title: 'WebAssembly OCR', content: 'Tesseract OCR runs right in your browser. No cloud APIs involved.' },
        { type: 'redact_privacy_security', title: 'Confidential Extraction', content: 'Extract text from sensitive ID cards or medical records safely.' },
        { type: 'scan_performance', title: 'High Accuracy', content: 'Support for multiple languages and skewed scans.' }
      ],
      faqs: [
        { q: 'Does this OCR support multiple languages?', a: 'Yes, our Tesseract-based WebAssembly engine supports over 100 languages. Just ensure the scan is clear.' },
        { q: 'Is it safe to extract text from my passport or ID?', a: 'Absolutely. We do not upload your documents to our servers. The entire OCR process happens within your own browser.' },
        { q: 'Why is the text sometimes inaccurate?', a: 'OCR accuracy depends heavily on the image quality. For best results, ensure your scans have high contrast and are not blurry.' }
      ]
    }
  },
  {
    id: 'add-page-numbers-to-pdf-free',
    en: {
      h1: 'Insert Page Numbers into PDF Documents',
      description: 'Easily paginate your PDF files. Add customizable page numbers to headers or footers instantly for free.',
      sections: [
        { type: 'csv_excel_geo_targeting', title: 'Free Pagination', content: 'Add numbers to unlimited files without hitting paywalls.' },
        { type: 'unlock_privacy_security', title: 'Secure Document Handling', content: 'Your dissertations and reports are numbered privately on your machine.' },
        { type: 'reverse_performance', title: 'Batch Numbering', content: 'Apply page numbers to massive documents in a fraction of a second.' }
      ],
      faqs: [
        { q: 'Can I choose where the page numbers appear?', a: 'Yes, you can customize the position (e.g., bottom-right, top-center) and the margin size for perfect alignment.' },
        { q: 'Is it free for very large PDFs like textbooks?', a: 'Yes! Our tool can paginate a 1000-page textbook in milliseconds, completely free and without file size restrictions.' },
        { q: 'Will it alter my original document formatting?', a: 'No, the page numbers are cleanly overlaid onto the existing PDF structure without altering your original text or margins.' }
      ]
    }
  },
  {
    id: 'remove-pdf-watermark-online',
    en: {
      h1: 'Remove Watermarks from PDF Files Safely',
      description: 'Redact or remove intrusive watermarks from your PDF documents. Fully private, browser-based watermark removal tool.',
      sections: [
        { type: 'watermark_geo_targeting', title: 'Clean Your PDFs', content: 'Remove unwanted stamps, backgrounds, and watermarks.' },
        { type: 'compare_privacy_security', title: 'Local Redaction', content: 'Erase sensitive watermarks without uploading files to our servers.' },
        { type: 'edit_performance', title: 'Flawless Quality', content: 'We remove the watermark object without degrading your document quality.' }
      ],
      faqs: [
        { q: 'Does it remove text watermarks or image watermarks?', a: 'Our tool allows you to draw redaction boxes over both text and image watermarks, effectively erasing them permanently.' },
        { q: 'Can anyone recover the watermark after removal?', a: 'No. The redacted areas are permanently flattened and rasterized, so the hidden data is completely destroyed and unrecoverable.' },
        { q: 'Do I need to pay to remove watermarks?', a: 'Our tool is 100% free with no hidden fees, subscriptions, or intrusive premium pop-ups.' }
      ]
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
  console.log('Starting FAQ injection and layout rebuild script...');

  for (const tool of tools) {
    console.log(`\nProcessing tool: ${tool.id}`);
    const localesDir = path.join(process.cwd(), `src/locales/seo/${tool.id}`);

    // Batch in chunks of 5 languages
    const batchSize = 5;
    for (let i = 0; i < LANGUAGES.length; i += batchSize) {
      const batchLangs = LANGUAGES.slice(i, i + batchSize);
      
      const promises = batchLangs.map(async (lang) => {
        if (lang === 'en') {
          const enJson = {
            id: tool.id,
            supportCenter: true,
            heroTitle: tool.en.h1,
            heroDescription: tool.en.description,
            sections: [
              { type: tool.en.sections[0].type, subTitle: tool.en.sections[0].title, subContent: tool.en.sections[0].content },
              { type: tool.en.sections[1].type, subTitle: tool.en.sections[1].title, subContent: tool.en.sections[1].content },
              { type: tool.en.sections[2].type, subTitle: tool.en.sections[2].title, subContent: tool.en.sections[2].content }
            ],
            faqs: tool.en.faqs
          };
          fs.writeFileSync(path.join(localesDir, `en.json`), JSON.stringify(enJson, null, 2));
          return;
        }

        const textsToTranslate = [
          tool.en.h1,
          tool.en.description,
          tool.en.sections[0].title,
          tool.en.sections[0].content,
          tool.en.sections[1].title,
          tool.en.sections[1].content,
          tool.en.sections[2].title,
          tool.en.sections[2].content,
          tool.en.faqs[0].q,
          tool.en.faqs[0].a,
          tool.en.faqs[1].q,
          tool.en.faqs[1].a,
          tool.en.faqs[2].q,
          tool.en.faqs[2].a,
        ];

        const translated = await translateBatch(textsToTranslate, lang);
        
        const langJson = {
          id: tool.id,
          supportCenter: true,
          heroTitle: translated[0],
          heroDescription: translated[1],
          sections: [
            { type: tool.en.sections[0].type, subTitle: translated[2], subContent: translated[3] },
            { type: tool.en.sections[1].type, subTitle: translated[4], subContent: translated[5] },
            { type: tool.en.sections[2].type, subTitle: translated[6], subContent: translated[7] }
          ],
          faqs: [
            { q: translated[8], a: translated[9] },
            { q: translated[10], a: translated[11] },
            { q: translated[12], a: translated[13] }
          ]
        };
        fs.writeFileSync(path.join(localesDir, `${lang}.json`), JSON.stringify(langJson, null, 2));
      });

      await Promise.all(promises);
      console.log(`Processed languages: ${batchLangs.join(', ')}`);
    }
  }
  console.log('All JSONs regenerated successfully.');
}

run().catch(console.error);
