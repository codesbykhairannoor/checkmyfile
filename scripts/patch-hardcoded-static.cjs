const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');
const { Project, SyntaxKind } = require('ts-morph');

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');
const TARGET_FILE = path.join(__dirname, '..', 'src', 'i18n', 'translations.ts');
const CACHE_FILE = path.join(__dirname, '..', 'translation-cache-hardcode.json');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const langMap = { 'zh': 'zh-CN', 'he': 'iw' };

// All hardcoded strings that need keys + replacements in TSX files
// Format: { key, en, file, oldJsx, newJsx }
const HARDCODED_ITEMS = [
  // AboutUsPage
  { key: 'pageAboutCard1Title', en: 'Absolute Privacy', file: 'AboutUsPage.tsx', oldJsx: '>Absolute Privacy<', newJsx: '>{t.pageAboutCard1Title || \'Absolute Privacy\'}<' },
  { key: 'pageAboutCard1Desc', en: 'We fundamentally redesigned how document tools work. By processing everything locally in your browser, your files never touch a server.', file: 'AboutUsPage.tsx', oldJsx: '>We fundamentally redesigned how document tools work. By processing everything locally in your browser, your files never touch a server.<', newJsx: '>{t.pageAboutCard1Desc || \'We fundamentally redesigned how document tools work. By processing everything locally in your browser, your files never touch a server.\'}<' },
  { key: 'pageAboutCard2Title', en: 'Lightning Fast', file: 'AboutUsPage.tsx', oldJsx: '>Lightning Fast<', newJsx: '>{t.pageAboutCard2Title || \'Lightning Fast\'}<' },
  { key: 'pageAboutCard2Desc', en: 'WebAssembly allows HandleMyFile to run complex PDF manipulations directly on your device CPU, bypassing upload and download bottlenecks.', file: 'AboutUsPage.tsx', oldJsx: '>WebAssembly allows HandleMyFile to run complex PDF manipulations directly on your device CPU, bypassing upload and download bottlenecks.<', newJsx: '>{t.pageAboutCard2Desc || \'WebAssembly allows HandleMyFile to run complex PDF manipulations directly on your device CPU, bypassing upload and download bottlenecks.\'}<' },
  { key: 'pageAboutCard3Title', en: 'For Everyone', file: 'AboutUsPage.tsx', oldJsx: '>For Everyone<', newJsx: '>{t.pageAboutCard3Title || \'For Everyone\'}<' },
  { key: 'pageAboutCard3Desc', en: 'We translated our entire platform into 30 languages. No subscriptions, no hidden fees, just world-class tools available globally.', file: 'AboutUsPage.tsx', oldJsx: '>We translated our entire platform into 30 languages. No subscriptions, no hidden fees, just world-class tools available globally.<', newJsx: '>{t.pageAboutCard3Desc || \'We translated our entire platform into 30 languages. No subscriptions, no hidden fees, just world-class tools available globally.\'}<' },
  { key: 'useToolsNow', en: 'Use Tools Now', file: 'AboutUsPage.tsx', oldJsx: '><span>Use Tools Now</span><', newJsx: '><span>{t.useToolsNow || \'Use Tools Now\'}</span><' },

  // PrivacyPage
  { key: 'pagePrivacyCard1Title', en: 'Zero Data Collection', file: 'PrivacyPage.tsx', oldJsx: '>Zero Data Collection<', newJsx: '>{t.pagePrivacyCard1Title || \'Zero Data Collection\'}<' },
  { key: 'pagePrivacyCard1Desc', en: "We do not collect, store, or transmit your documents. HandleMyFile does not even have a database for user files. Processing occurs entirely within your browser's memory.", file: 'PrivacyPage.tsx', oldJsx: ">We do not collect, store, or transmit your documents. HandleMyFile does not even have a database for user files. Processing occurs entirely within your browser's memory.<", newJsx: ">{t.pagePrivacyCard1Desc || \"We do not collect, store, or transmit your documents. HandleMyFile does not even have a database for user files. Processing occurs entirely within your browser's memory.\"}<" },
  { key: 'pagePrivacyCard2Title', en: 'No Cloud Uploads', file: 'PrivacyPage.tsx', oldJsx: '>No Cloud Uploads<', newJsx: '>{t.pagePrivacyCard2Title || \'No Cloud Uploads\'}<' },
  { key: 'pagePrivacyCard2Desc', en: 'Traditional tools force you to upload sensitive PDFs to foreign servers. We utilize WebAssembly to bring the server to you. Your network tab will prove no files are sent.', file: 'PrivacyPage.tsx', oldJsx: '>Traditional tools force you to upload sensitive PDFs to foreign servers. We utilize WebAssembly to bring the server to you. Your network tab will prove no files are sent.<', newJsx: '>{t.pagePrivacyCard2Desc || \'Traditional tools force you to upload sensitive PDFs to foreign servers. We utilize WebAssembly to bring the server to you. Your network tab will prove no files are sent.\'}<' },
  { key: 'pagePrivacyCard3Title', en: 'Anonymous Usage', file: 'PrivacyPage.tsx', oldJsx: '>Anonymous Usage<', newJsx: '>{t.pagePrivacyCard3Title || \'Anonymous Usage\'}<' },
  { key: 'pagePrivacyCard3Desc', en: 'We do not require accounts, logins, or email registrations. You remain completely anonymous while using the HandleMyFile platform.', file: 'PrivacyPage.tsx', oldJsx: '>We do not require accounts, logins, or email registrations. You remain completely anonymous while using the HandleMyFile platform.<', newJsx: '>{t.pagePrivacyCard3Desc || \'We do not require accounts, logins, or email registrations. You remain completely anonymous while using the HandleMyFile platform.\'}<' },

  // TosPage
  { key: 'pageTosAgreementTitle', en: 'Agreement to Terms', file: 'TosPage.tsx', oldJsx: '>Agreement to Terms<', newJsx: '>{t.pageTosAgreementTitle || \'Agreement to Terms\'}<' },
  { key: 'pageTosAgreementDesc', en: 'By accessing and using HandleMyFile, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service. Our platform is provided completely free of charge for both personal and commercial use.', file: 'TosPage.tsx', oldJsx: '\n              By accessing and using HandleMyFile, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service. Our platform is provided completely free of charge for both personal and commercial use.\n            ', newJsx: '\n              {t.pageTosAgreementDesc || \'By accessing and using HandleMyFile, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service. Our platform is provided completely free of charge for both personal and commercial use.\'}\n            ' },
  { key: 'pageTosLocalProcessTitle', en: 'Local Processing Guarantee', file: 'TosPage.tsx', oldJsx: '>Local Processing Guarantee<', newJsx: '>{t.pageTosLocalProcessTitle || \'Local Processing Guarantee\'}<' },
  { key: 'pageTosLocalProcessDesc', en: 'HandleMyFile provides document manipulation tools that execute strictly within your local browser environment via WebAssembly. We guarantee that:', file: 'TosPage.tsx', oldJsx: '\n                HandleMyFile provides document manipulation tools that execute strictly within your local browser environment via WebAssembly. We guarantee that:\n              ', newJsx: '\n                {t.pageTosLocalProcessDesc || \'HandleMyFile provides document manipulation tools that execute strictly within your local browser environment via WebAssembly. We guarantee that:\'}\n              ' },
  { key: 'pageTosGuarantee1', en: 'Your files are never uploaded to our servers or any third-party infrastructure.', file: 'TosPage.tsx', oldJsx: '>Your files are never uploaded to our servers or any third-party infrastructure.<', newJsx: '>{t.pageTosGuarantee1 || \'Your files are never uploaded to our servers or any third-party infrastructure.\'}<' },
  { key: 'pageTosGuarantee2', en: 'We do not retain copies of your data, metadata, or processed documents.', file: 'TosPage.tsx', oldJsx: '>We do not retain copies of your data, metadata, or processed documents.<', newJsx: '>{t.pageTosGuarantee2 || \'We do not retain copies of your data, metadata, or processed documents.\'}<' },
  { key: 'pageTosDisclaimersTitle', en: 'Disclaimers & Liability', file: 'TosPage.tsx', oldJsx: '>Disclaimers &amp; Liability<', newJsx: '>{t.pageTosDisclaimersTitle || \'Disclaimers & Liability\'}<' },

  // SecurityPage – step cards
  { key: 'pageSecStep1Title', en: '1. Local Selection', file: 'SecurityPage.tsx', oldJsx: '>1. Local Selection<', newJsx: '>{t.pageSecStep1Title || \'1. Local Selection\'}<' },
  { key: 'pageSecStep1Desc', en: 'You select a file. The browser locks the file in local memory. No network request is initiated.', file: 'SecurityPage.tsx', oldJsx: '>You select a file. The browser locks the file in local memory. No network request is initiated.<', newJsx: '>{t.pageSecStep1Desc || \'You select a file. The browser locks the file in local memory. No network request is initiated.\'}<' },
  { key: 'pageSecStep2Title', en: '2. Wasm Engine', file: 'SecurityPage.tsx', oldJsx: '>2. Wasm Engine<', newJsx: '>{t.pageSecStep2Title || \'2. Wasm Engine\'}<' },
  { key: 'pageSecStep2Desc', en: 'Our C/C++ engine runs compiled WebAssembly directly on your CPU to process the document offline.', file: 'SecurityPage.tsx', oldJsx: '>Our C/C++ engine runs compiled WebAssembly directly on your CPU to process the document offline.<', newJsx: '>{t.pageSecStep2Desc || \'Our C/C++ engine runs compiled WebAssembly directly on your CPU to process the document offline.\'}<' },
  { key: 'pageSecStep3Title', en: '3. Direct Save', file: 'SecurityPage.tsx', oldJsx: '>3. Direct Save<', newJsx: '>{t.pageSecStep3Title || \'3. Direct Save\'}<' },
  { key: 'pageSecStep3Desc', en: 'The processed file is reconstructed in memory and saved directly to your hard drive.', file: 'SecurityPage.tsx', oldJsx: '>The processed file is reconstructed in memory and saved directly to your hard drive.<', newJsx: '>{t.pageSecStep3Desc || \'The processed file is reconstructed in memory and saved directly to your hard drive.\'}<' },
  { key: 'pageSecCompliance1', en: 'HIPAA (Healthcare Data)', file: 'SecurityPage.tsx', oldJsx: '> HIPAA (Healthcare Data)<', newJsx: '> {t.pageSecCompliance1 || \'HIPAA (Healthcare Data)\'}<' },
  { key: 'pageSecCompliance2', en: 'GDPR (European Privacy)', file: 'SecurityPage.tsx', oldJsx: '> GDPR (European Privacy)<', newJsx: '> {t.pageSecCompliance2 || \'GDPR (European Privacy)\'}<' },
  { key: 'pageSecCompliance3', en: 'CCPA (California Privacy)', file: 'SecurityPage.tsx', oldJsx: '> CCPA (California Privacy)<', newJsx: '> {t.pageSecCompliance3 || \'CCPA (California Privacy)\'}<' },
  { key: 'pageSecCompliance4', en: 'NDA Protected Files', file: 'SecurityPage.tsx', oldJsx: '> NDA Protected Files<', newJsx: '> {t.pageSecCompliance4 || \'NDA Protected Files\'}<' },
  { key: 'pageSecVerifyStep1', en: 'Step 1: Load HandleMyFile.com in your browser.', file: 'SecurityPage.tsx', oldJsx: '<strong>Step 1:</strong> Load HandleMyFile.com in your browser.', newJsx: '<strong>{t.pageSecVerifyStep1Label || \'Step 1:\'}</strong> {t.pageSecVerifyStep1Desc || \'Load HandleMyFile.com in your browser.\'}' },
  { key: 'pageSecVerifyStep1Label', en: 'Step 1:', file: 'SecurityPage.tsx', oldJsx: null, newJsx: null },
  { key: 'pageSecVerifyStep1Desc', en: 'Load HandleMyFile.com in your browser.', file: 'SecurityPage.tsx', oldJsx: null, newJsx: null },
  { key: 'pageSecVerifyStep2', en: "Step 2: Turn off your Wi-Fi or unplug your ethernet cable.", file: 'SecurityPage.tsx', oldJsx: "<strong>Step 2:</strong> Turn off your Wi-Fi or unplug your ethernet cable.", newJsx: "<strong>{t.pageSecVerifyStep2Label || 'Step 2:'}</strong> {t.pageSecVerifyStep2Desc || 'Turn off your Wi-Fi or unplug your ethernet cable.'}" },
  { key: 'pageSecVerifyStep2Label', en: 'Step 2:', file: 'SecurityPage.tsx', oldJsx: null, newJsx: null },
  { key: 'pageSecVerifyStep2Desc', en: "Turn off your Wi-Fi or unplug your ethernet cable.", file: 'SecurityPage.tsx', oldJsx: null, newJsx: null },
  { key: 'pageSecVerifyStep3', en: "Step 3: Process any PDF. It will work perfectly, proving no server upload is required.", file: 'SecurityPage.tsx', oldJsx: "<strong>Step 3:</strong> Process any PDF. It will work perfectly, proving no server upload is required.", newJsx: "<strong>{t.pageSecVerifyStep3Label || 'Step 3:'}</strong> {t.pageSecVerifyStep3Desc || 'Process any PDF. It will work perfectly, proving no server upload is required.'}" },
  { key: 'pageSecVerifyStep3Label', en: 'Step 3:', file: 'SecurityPage.tsx', oldJsx: null, newJsx: null },
  { key: 'pageSecVerifyStep3Desc', en: "Process any PDF. It will work perfectly, proving no server upload is required.", file: 'SecurityPage.tsx', oldJsx: null, newJsx: null },

  // PricingPage – competitor list
  { key: 'pricingCompItem1', en: 'Data uploaded to their servers', file: 'PricingPage.tsx', oldJsx: '> Data uploaded to their servers<', newJsx: '> {t.pricingCompItem1 || \'Data uploaded to their servers\'}<' },
  { key: 'pricingCompItem2', en: 'File size limits on free tier', file: 'PricingPage.tsx', oldJsx: '> File size limits on free tier<', newJsx: '> {t.pricingCompItem2 || \'File size limits on free tier\'}<' },
  { key: 'pricingCompItem3', en: 'Requires email registration', file: 'PricingPage.tsx', oldJsx: '> Requires email registration<', newJsx: '> {t.pricingCompItem3 || \'Requires email registration\'}<' },
  { key: 'pricingCompItem4', en: 'Slow network processing', file: 'PricingPage.tsx', oldJsx: '> Slow network processing<', newJsx: '> {t.pricingCompItem4 || \'Slow network processing\'}<' },
  { key: 'pricingHmfBadge', en: 'RECOMMENDED', file: 'PricingPage.tsx', oldJsx: '>RECOMMENDED<', newJsx: '>{t.pricingHmfBadge || \'RECOMMENDED\'}<' },
  { key: 'pricingHmfItem1', en: '100% Client-side processing', file: 'PricingPage.tsx', oldJsx: '> 100% Client-side processing<', newJsx: '> {t.pricingHmfItem1 || \'100% Client-side processing\'}<' },
  { key: 'pricingHmfItem2', en: 'Unlimited file sizes & usage', file: 'PricingPage.tsx', oldJsx: '> Unlimited file sizes &amp; usage<', newJsx: '> {t.pricingHmfItem2 || \'Unlimited file sizes & usage\'}<' },
  { key: 'pricingHmfItem3', en: 'No accounts or logins needed', file: 'PricingPage.tsx', oldJsx: '> No accounts or logins needed<', newJsx: '> {t.pricingHmfItem3 || \'No accounts or logins needed\'}<' },
  { key: 'pricingHmfItem4', en: 'Instant WebAssembly speed', file: 'PricingPage.tsx', oldJsx: '> Instant WebAssembly speed<', newJsx: '> {t.pricingHmfItem4 || \'Instant WebAssembly speed\'}<' },
  { key: 'pricingEnterpriseCompliant', en: 'Enterprise Compliant', file: 'PricingPage.tsx', oldJsx: '>Enterprise Compliant<', newJsx: '>{t.pricingEnterpriseCompliant || \'Enterprise Compliant\'}<' },
  { key: 'pricingZeroDataRetention', en: 'Zero-Data Retention', file: 'PricingPage.tsx', oldJsx: '>Zero-Data Retention<', newJsx: '>{t.pricingZeroDataRetention || \'Zero-Data Retention\'}<' },
  { key: 'pricingGdprFriendly', en: 'GDPR & CCPA Friendly', file: 'PricingPage.tsx', oldJsx: '>GDPR &amp; CCPA Friendly<', newJsx: '>{t.pricingGdprFriendly || \'GDPR & CCPA Friendly\'}<' },

  // UseCasesPage – tool list items
  { key: 'useCasesLegalTool1', en: 'Combine Exhibits (Merge PDF)', file: 'UseCasesPage.tsx', oldJsx: '>Combine Exhibits (Merge PDF)<', newJsx: '>{t.useCasesLegalTool1 || \'Combine Exhibits (Merge PDF)\'}<' },
  { key: 'useCasesLegalTool2', en: 'Blackout Text (Redact PDF)', file: 'UseCasesPage.tsx', oldJsx: '>Blackout Text (Redact PDF)<', newJsx: '>{t.useCasesLegalTool2 || \'Blackout Text (Redact PDF)\'}<' },
  { key: 'useCasesLegalTool3', en: 'Add Passwords (Protect PDF)', file: 'UseCasesPage.tsx', oldJsx: '>Add Passwords (Protect PDF)<', newJsx: '>{t.useCasesLegalTool3 || \'Add Passwords (Protect PDF)\'}<' },
  { key: 'useCasesLegalHeader', en: 'Popular Tools for Legal:', file: 'UseCasesPage.tsx', oldJsx: '>Popular Tools for Legal:<', newJsx: '>{t.useCasesLegalHeader || \'Popular Tools for Legal:\'}<' },
  { key: 'useCasesHrHeader', en: 'Popular Tools for HR:', file: 'UseCasesPage.tsx', oldJsx: '>Popular Tools for HR:<', newJsx: '>{t.useCasesHrHeader || \'Popular Tools for HR:\'}<' },
  { key: 'useCasesHrTool1', en: 'Extract Resume Pages (Split PDF)', file: 'UseCasesPage.tsx', oldJsx: '>Extract Resume Pages (Split PDF)<', newJsx: '>{t.useCasesHrTool1 || \'Extract Resume Pages (Split PDF)\'}<' },
  { key: 'useCasesHrTool2', en: 'Compress Offer Letters', file: 'UseCasesPage.tsx', oldJsx: '>Compress Offer Letters<', newJsx: '>{t.useCasesHrTool2 || \'Compress Offer Letters\'}<' },
  { key: 'useCasesHrTool3', en: 'Excel to PDF (Salary tables)', file: 'UseCasesPage.tsx', oldJsx: '>Excel to PDF (Salary tables)<', newJsx: '>{t.useCasesHrTool3 || \'Excel to PDF (Salary tables)\'}<' },
  { key: 'useCasesStudentHeader', en: 'Popular Tools for Students:', file: 'UseCasesPage.tsx', oldJsx: '>Popular Tools for Students:<', newJsx: '>{t.useCasesStudentHeader || \'Popular Tools for Students:\'}<' },
  { key: 'useCasesStudentTool1', en: 'Merge Assignments', file: 'UseCasesPage.tsx', oldJsx: '>Merge Assignments<', newJsx: '>{t.useCasesStudentTool1 || \'Merge Assignments\'}<' },
  { key: 'useCasesStudentTool2', en: 'Compress Presentations (PPTX to PDF)', file: 'UseCasesPage.tsx', oldJsx: '>Compress Presentations (PPTX to PDF)<', newJsx: '>{t.useCasesStudentTool2 || \'Compress Presentations (PPTX to PDF)\'}<' },
  { key: 'useCasesStudentTool3', en: 'Image to PDF (Scanner apps)', file: 'UseCasesPage.tsx', oldJsx: '>Image to PDF (Scanner apps)<', newJsx: '>{t.useCasesStudentTool3 || \'Image to PDF (Scanner apps)\'}<' },
  { key: 'useCasesRealEstateHeader', en: 'Popular Tools for Real Estate:', file: 'UseCasesPage.tsx', oldJsx: '>Popular Tools for Real Estate:<', newJsx: '>{t.useCasesRealEstateHeader || \'Popular Tools for Real Estate:\'}<' },
  { key: 'useCasesRealEstateTool1', en: 'Sign Leases (Sign PDF)', file: 'UseCasesPage.tsx', oldJsx: '>Sign Leases (Sign PDF)<', newJsx: '>{t.useCasesRealEstateTool1 || \'Sign Leases (Sign PDF)\'}<' },
  { key: 'useCasesRealEstateTool2', en: 'Watermark Property Photos', file: 'UseCasesPage.tsx', oldJsx: '>Watermark Property Photos<', newJsx: '>{t.useCasesRealEstateTool2 || \'Watermark Property Photos\'}<' },
  { key: 'useCasesRealEstateTool3', en: 'Compress High-Res Brochures', file: 'UseCasesPage.tsx', oldJsx: '>Compress High-Res Brochures<', newJsx: '>{t.useCasesRealEstateTool3 || \'Compress High-Res Brochures\'}<' },
];

async function main() {
  // Step 1: patch TSX files
  console.log('Patching TSX files...');
  for (const item of HARDCODED_ITEMS) {
    if (!item.oldJsx || !item.newJsx) continue;
    const filePath = path.join(PAGES_DIR, item.file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(item.oldJsx)) {
      content = content.replace(item.oldJsx, item.newJsx);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  [${item.file}] Replaced: ${item.key}`);
    } else {
      console.warn(`  [${item.file}] NOT FOUND: ${item.key} - "${item.oldJsx.substring(0,50)}"`);
    }
  }

  // Step 2: inject keys into translations.ts using ts-morph
  console.log('\nUpdating translations.ts via AST...');
  const project = new Project();
  project.addSourceFileAtPath(TARGET_FILE);
  const sourceFile = project.getSourceFileOrThrow(TARGET_FILE);

  const uniqueItems = HARDCODED_ITEMS.filter((item, idx, arr) => arr.findIndex(i => i.key === item.key) === idx);

  // Interface
  const uiDictInterface = sourceFile.getInterfaceOrThrow('UiDictionary');
  let intAdded = 0;
  for (const item of uniqueItems) {
    if (!uiDictInterface.getProperty(item.key)) {
      uiDictInterface.addProperty({ name: item.key, hasQuestionToken: true, type: 'string' });
      intAdded++;
    }
  }
  console.log(`  Added ${intAdded} keys to UiDictionary interface`);

  // baseDict
  const baseDictDecl = sourceFile.getVariableDeclaration('baseDict');
  const baseDictInit = baseDictDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  let baseAdded = 0;
  for (const item of uniqueItems) {
    if (!baseDictInit.getProperty(item.key)) {
      baseDictInit.addPropertyAssignment({ name: item.key, initializer: `"${item.en.replace(/"/g, '\\"')}"` });
      baseAdded++;
    }
  }
  console.log(`  Added ${baseAdded} keys to baseDict (English)`);

  // Save first to get the interface updated
  sourceFile.saveSync();

  // Step 3: Translate missing keys for all langs
  const uiTranslationsDecl = sourceFile.getVariableDeclaration('UI_TRANSLATIONS');
  const uiTranslationsObj = uiTranslationsDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const langs = uiTranslationsObj.getProperties()
    .filter(p => p.isKind(SyntaxKind.PropertyAssignment))
    .map(p => p.getName())
    .filter(l => l !== 'en');

  let cache = {};
  if (fs.existsSync(CACHE_FILE)) cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));

  for (const lang of langs) {
    const langProp = uiTranslationsObj.getPropertyOrThrow(lang);
    const langObj = langProp.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    const missingKeys = uniqueItems.filter(item => !langObj.getProperty(item.key));
    if (missingKeys.length === 0) { console.log(`  ${lang}: all present`); continue; }

    console.log(`  ${lang}: translating ${missingKeys.length} keys...`);
    cache[lang] = cache[lang] || {};

    const toTranslate = missingKeys.filter(item => !cache[lang][item.key]);
    if (toTranslate.length > 0) {
      const translateCode = langMap[lang] || lang;
      const joined = toTranslate.map(i => i.en).join(' ||| ');
      let retries = 3;
      let results = [];
      while (retries > 0) {
        try {
          const res = await translate(joined, { to: translateCode });
          results = res.text.split('|||').map(s => s.trim());
          if (results.length !== toTranslate.length) throw new Error('Length mismatch');
          break;
        } catch (err) {
          retries--;
          console.warn(`    Error for ${lang}. Retries: ${retries}`);
          await sleep(3000);
        }
      }
      if (results.length === toTranslate.length) {
        toTranslate.forEach((item, i) => { cache[lang][item.key] = results[i]; });
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      } else {
        toTranslate.forEach(item => { cache[lang][item.key] = item.en; });
      }
    }

    for (const item of missingKeys) {
      const val = cache[lang][item.key] || item.en;
      langObj.addPropertyAssignment({ name: item.key, initializer: `"${val.replace(/"/g, '\\"')}"` });
    }
  }

  console.log('\nSaving translations.ts...');
  sourceFile.saveSync();
  console.log('Done!');
}

main().catch(console.error);
