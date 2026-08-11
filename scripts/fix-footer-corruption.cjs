/**
 * Fix footer translation corruption in translations.ts
 * The batch ||| translation caused data to shift by one language.
 * This script re-translates all footer+navbar keys fresh for every language.
 */
const { Project, SyntaxKind } = require('ts-morph');
const translate = require('google-translate-api-x');
const path = require('path');
const fs = require('fs');

const TARGET_FILE = path.join(__dirname, '..', 'src', 'i18n', 'translations.ts');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const langMap = { 'zh': 'zh-CN', 'he': 'iw' };

// Keys that need to be freshly re-translated (known corrupted + their English values)
const FOOTER_KEYS = {
  footerCompany: 'Company',
  footerAbout: 'About Us',
  footerPrivacy: 'Privacy Policy',
  footerTos: 'Terms of Service',
  footerSecurity: 'Security & Trust',
  footerPricing: 'Pricing',
  footerCompare: 'Compare',
  footerLanguages: 'Supported Languages',
  footerUseCases: 'Use Cases',
  footerRights: 'All rights reserved.',
  navAllPdfTools: 'ALL PDF TOOLS',
  navSupportCenter: 'Contact Support',
  ocrTools: 'Convert & OCR',
  brandDescription: 'The all-in-one platform to handle your documents securely. Edit, convert, and sign PDFs with 100% client-side privacy. Fast, free, and strictly confidential.',
};

// Expected correct values to validate (spot-check)
const EXPECTED = {
  zh: {
    footerCompany: ['公司', '公司'],
    footerAbout: ['关于我们'],
    footerSecurity: ['安全'],
  },
  ru: {
    footerAbout: ['о нас', 'о Нас'],
    footerPrivacy: ['конфи'],
  }
};

async function main() {
  console.log('Loading translations.ts via AST...');
  const project = new Project();
  project.addSourceFileAtPath(TARGET_FILE);
  const sourceFile = project.getSourceFileOrThrow(TARGET_FILE);

  const uiTranslationsDecl = sourceFile.getVariableDeclaration('UI_TRANSLATIONS');
  const uiTranslationsObj = uiTranslationsDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  const langs = uiTranslationsObj.getProperties()
    .filter(p => p.isKind(SyntaxKind.PropertyAssignment))
    .map(p => p.getName())
    .filter(l => l !== 'en');

  const keys = Object.keys(FOOTER_KEYS);
  const englishValues = Object.values(FOOTER_KEYS);

  for (const lang of langs) {
    const translateCode = langMap[lang] || lang;
    console.log(`\nProcessing ${lang} (${translateCode})...`);

    const langProp = uiTranslationsObj.getPropertyOrThrow(lang);
    const langObj = langProp.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    // Translate all keys freshly for this language
    const joinedEn = englishValues.join(' ||| ');
    let translations = [];
    let retries = 3;
    while (retries > 0) {
      try {
        const res = await translate(joinedEn, { to: translateCode });
        translations = res.text.split('|||').map(s => s.trim());
        if (translations.length !== keys.length) throw new Error(`Length mismatch: got ${translations.length}, expected ${keys.length}`);
        break;
      } catch (err) {
        retries--;
        console.warn(`  Retry ${3 - retries}/3 for ${lang}:`, err.message);
        await sleep(2000);
        if (retries === 0) {
          // Fallback to English
          translations = [...englishValues];
        }
      }
    }

    // Update or add each key
    let updated = 0;
    keys.forEach((key, i) => {
      const val = translations[i] || englishValues[i];
      const existingProp = langObj.getProperty(key);
      if (existingProp) {
        // Update existing value
        existingProp.getInitializerOrThrow().replaceWithText(`"${val.replace(/"/g, '\\"')}"`);
        updated++;
      } else {
        // Add new key
        langObj.addPropertyAssignment({ name: key, initializer: `"${val.replace(/"/g, '\\"')}"` });
        updated++;
      }
    });
    console.log(`  Updated ${updated} keys`);
    await sleep(500); // rate limit
  }

  console.log('\nSaving translations.ts...');
  sourceFile.saveSync();
  console.log('Done! All footer keys re-translated fresh.');
}

main().catch(console.error);
