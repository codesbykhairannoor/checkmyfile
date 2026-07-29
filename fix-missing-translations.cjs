/**
 * fix-missing-translations.cjs - Final Version
 * 
 * TASKS:
 * 1. Add compareTh1/2/3 + compareTr* (20 keys) to ALL 29 non-EN langs
 * 2. Add pageCompareExpertTitle/Quote/Role to ALL 29 non-EN langs
 * 3. Fix Hindi (hi): add pageCompareBadge, pageCompareSec2-6, footerCompare
 * 4. Add footerAbout/Privacy/Tos to 24 langs missing them (not id,es,fr,de,ja)
 * 5. Add footerCompany, footerSecurity, footerPricing, footerLanguages to langs missing them
 *
 * INSERT STRATEGY:
 * - compareTh/Tr/Expert: insert RIGHT BEFORE "footerLanguages:" in each lang's block
 * - footerAbout/Privacy/Tos + footerCompany/Security/Pricing/Languages: insert same spot
 * - For Hindi: also insert pageCompareBadge, Sec2-6, footerCompare BEFORE footerLanguages
 */

const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const langMap = {
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
};

// All 29 non-EN languages in order (matching footerUseCases occurrence order)
const ALL_LANGS = [
  'id', 'es', 'fr', 'de', 'ja', 'hi', 'pt', 'ru', 'ar',
  'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms',
];

// Note: We need to handle zh-CN and zh-TW if they exist in the file
// Based on translate-tools.cjs, zh-CN and zh-TW are present. Let me check.

// English source values
const EN = {
  // Compare table
  compareTh1: 'Feature',
  compareTh2: 'Typical Cloud API',
  compareTh3: 'HandleMyFile',
  compareTr1Col1: 'File Upload Required',
  compareTr2Col1: 'Data Privacy Guarantee',
  compareTr3Col1: 'Max File Size Limit',
  compareTr3Col2: 'Typically 5MB - 15MB',
  compareTr3Col3: 'Unlimited (RAM constrained)',
  compareTr4Col1: 'Offline Capability',
  compareTr5Col1: 'Cost',
  compareTr5Col2: 'Free Tier + $20/mo',
  compareTr5Col3: '100% Free Forever',
  compareTr6Col1: 'Account Registration',
  compareTr6Col2: 'Required for large files',
  compareTr6Col3: 'Never Required',
  compareTr7Col1: 'Processing Speed',
  compareTr7Col2: 'Dependent on Internet Speed',
  compareTr7Col3: 'Instant (Local CPU)',
  // Expert section
  pageCompareExpertTitle: 'Industry Experts Agree',
  pageCompareExpertQuote: 'Uploading corporate documents to unverified cloud APIs is the number one cybersecurity vulnerability for remote teams in 2026. Client-side processing tools like HandleMyFile represent the only zero-trust architecture suitable for handling confidential PDFs.',
  pageCompareExpertRole: 'Lead Cybersecurity Researcher, Global InfoSec Institute',
  // Footer
  footerAbout: 'About Us',
  footerPrivacy: 'Privacy Policy',
  footerTos: 'Terms of Service',
  footerCompany: 'Company',
  footerSecurity: 'Security & Trust',
  footerPricing: 'Pricing',
  footerLanguages: 'Supported Languages',
  footerCompare: 'Compare',
  // Hindi missing Compare page keys
  pageCompareBadge: 'The Smart Alternative',
  pageCompareSec2Title: 'Feature Comparison',
  pageCompareSec3Title: 'Stop Waiting on Cloud Trash Progress Bars',
  pageCompareSec3Desc: 'With legacy cloud tools, if you want to merge three 50MB PDFs, you are forced to upload 150MB of data. Then you wait for their bloated server to process it. Then you download the 150MB result. That is a 300MB network bottleneck. HandleMyFile processes the 150MB instantly on your local disk using WebAssembly. Tests show our local processing is up to 12.5x faster than average cloud converters.',
  pageCompareSec4Title: '93% of Cloud Tools Monetize Your Data',
  pageCompareSec4Desc: 'Did you know that 93% of free online PDF tools reserve the right to scan your uploaded documents for AI training data? They ask you to pay $20 a month just for Secure Processing. We believe you should not have to pay a ransom to keep your documents private. Our offline architecture guarantees privacy by default, for free.',
  pageCompareSec5Title: 'Escape the File Size Trap',
  pageCompareSec5Desc: 'Have you ever tried to compress a PDF, only to be told the file is Too large for the free tier? Cloud APIs intentionally cripple your workflow with 5MB limits. We hate artificial limits. HandleMyFile uses your device RAM, meaning you can process 1GB+ files locally if your computer can handle it.',
  pageCompareSec6Title: 'Stop Using Cloud Trash. Switch Today.',
  pageCompareSec6Desc: 'Stop compromising on speed, privacy, and cost. Join thousands of professionals who have already switched to the fastest offline document toolkit on the web.',
};

// Languages already having footerAbout (skip for these)
const HAS_FOOTER_ABOUT = new Set(['id', 'es', 'fr', 'de', 'ja']);

// Read the file
const filePath = path.join(__dirname, 'src', 'i18n', 'translations.ts');

const checkKeyInBlock = (block, key) => {
  return block.includes(`${key}:`);
};

const escapeForTS = (str) => {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
};

// Translate an array of strings to a given language
const translateBatch = async (strings, langCode) => {
  if (strings.length === 0) return [];
  
  const forceTo = langCode === 'zh-CN' || langCode === 'zh-TW';
  const DELIM = ' |||SEP||| ';
  const joined = strings.join(DELIM);
  
  let retries = 3;
  while (retries > 0) {
    try {
      const res = await translate(joined, { to: langCode, forceTo });
      let parts = res.text.split(/\s*\|\|\|SEP\|\|\|\s*/);
      
      if (parts.length === strings.length) {
        return parts.map(s => s.trim());
      }
      
      // Fallback: individual
      console.log(`    -> Fallback to individual translation for ${langCode}...`);
      const results = [];
      for (const s of strings) {
        await sleep(300);
        const r = await translate(s, { to: langCode, forceTo });
        results.push(r.text.trim());
      }
      return results;
    } catch (err) {
      retries--;
      console.error(`    -> Error translating to ${langCode}: ${err.message}. Retries: ${retries}`);
      if (retries === 0) {
        console.log(`    -> Using English fallback for ${langCode}`);
        return strings; // fallback to English
      }
      await sleep(5000);
    }
  }
  return strings;
};

const findLangBlockBounds = (lines, langIndex) => {
  // Find the langIndex-th occurrence of "footerUseCases:" (0-indexed)
  let count = 0;
  let blockStart = -1;
  let blockEnd = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('footerUseCases:')) {
      if (count === langIndex) {
        blockStart = i;
        // Find end: next occurrence of footerUseCases or end of translations object
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes('footerUseCases:') || 
              lines[j].includes('export const getUiTranslations')) {
            blockEnd = j;
            break;
          }
        }
        if (blockEnd === -1) blockEnd = lines.length;
        break;
      }
      count++;
    }
  }
  
  return { blockStart, blockEnd };
};

const findInsertionLine = (lines, blockStart, blockEnd, anchor) => {
  for (let i = blockStart; i < blockEnd; i++) {
    if (lines[i].includes(anchor)) {
      return i;
    }
  }
  return -1;
};

const main = async () => {
  console.log('=== Fix Missing Translations ===\n');
  
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  
  console.log(`Loaded file: ${lines.length} lines, ${(content.length/1024).toFixed(1)} KB`);
  
  // Also check for zh-CN and zh-TW
  let zhCNIndex = -1, zhTWIndex = -1;
  const footerUseCasesOccurrences = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('footerUseCases:')) {
      footerUseCasesOccurrences.push(i + 1);
    }
  }
  console.log(`Found ${footerUseCasesOccurrences.length} language blocks`);
  console.log(`Language block line numbers: ${footerUseCasesOccurrences.join(', ')}`);
  
  // Extend ALL_LANGS if we have more than 29 blocks
  const totalLangs = footerUseCasesOccurrences.length;
  if (totalLangs > ALL_LANGS.length) {
    console.log(`\nWARNING: Found ${totalLangs} blocks but only ${ALL_LANGS.length} langs defined. May have zh-CN/zh-TW.`);
  }
  
  // Process each language block
  for (let langIdx = 0; langIdx < totalLangs; langIdx++) {
    const lang = ALL_LANGS[langIdx] || `lang_${langIdx}`;
    const langCode = langMap[lang] || lang;
    
    console.log(`\n[${langIdx + 1}/${totalLangs}] Processing: ${lang} (${langCode})`);
    
    // Re-read lines after each modification
    const currentLines = content.split('\n');
    const { blockStart, blockEnd } = findLangBlockBounds(currentLines, langIdx);
    
    if (blockStart === -1) {
      console.log(`  -> Could not find block, skipping`);
      continue;
    }
    
    const langBlock = currentLines.slice(blockStart, blockEnd).join('\n');
    
    // Determine missing keys
    const missingKeys = [];
    
    // Group 1: compareTh/Tr/Expert - ALL langs need these
    const compareKeys = [
      'compareTh1', 'compareTh2', 'compareTh3',
      'compareTr1Col1', 'compareTr2Col1',
      'compareTr3Col1', 'compareTr3Col2', 'compareTr3Col3',
      'compareTr4Col1',
      'compareTr5Col1', 'compareTr5Col2', 'compareTr5Col3',
      'compareTr6Col1', 'compareTr6Col2', 'compareTr6Col3',
      'compareTr7Col1', 'compareTr7Col2', 'compareTr7Col3',
      'pageCompareExpertTitle', 'pageCompareExpertQuote', 'pageCompareExpertRole',
    ];
    for (const k of compareKeys) {
      if (!checkKeyInBlock(langBlock, k)) missingKeys.push(k);
    }
    
    // Group 2: footerAbout/Privacy/Tos - skip for id, es, fr, de, ja
    if (!HAS_FOOTER_ABOUT.has(lang)) {
      for (const k of ['footerAbout', 'footerPrivacy', 'footerTos']) {
        if (!checkKeyInBlock(langBlock, k)) missingKeys.push(k);
      }
    }
    
    // Group 3: footerCompany/Security/Pricing/Languages/Compare
    for (const k of ['footerCompany', 'footerSecurity', 'footerPricing', 'footerLanguages', 'footerCompare']) {
      if (!checkKeyInBlock(langBlock, k)) missingKeys.push(k);
    }
    
    // Group 4: Hindi-specific - pageCompareBadge + Sec2-6
    if (lang === 'hi') {
      const hiKeys = [
        'pageCompareBadge',
        'pageCompareSec2Title',
        'pageCompareSec3Title', 'pageCompareSec3Desc',
        'pageCompareSec4Title', 'pageCompareSec4Desc',
        'pageCompareSec5Title', 'pageCompareSec5Desc',
        'pageCompareSec6Title', 'pageCompareSec6Desc',
      ];
      for (const k of hiKeys) {
        if (!checkKeyInBlock(langBlock, k)) missingKeys.push(k);
      }
    }
    
    if (missingKeys.length === 0) {
      console.log(`  -> All keys present, skipping`);
      continue;
    }
    
    console.log(`  -> Missing ${missingKeys.length} keys: ${missingKeys.join(', ')}`);
    
    // Translate the missing keys
    const sourceStrings = missingKeys.map(k => EN[k] || k);
    
    let translated;
    try {
      translated = await translateBatch(sourceStrings, langCode);
    } catch (e) {
      console.error(`  -> Translation completely failed, using English fallback`);
      translated = sourceStrings;
    }
    
    // Build the insertion block
    const newLines = missingKeys.map((key, i) => {
      let val = translated[i] || sourceStrings[i];
      // Post-process: restore HandleMyFile brand name (translators sometimes change it)
      val = val.replace(/Handlemeineakte|Handlemydatei|Poignéemonichier|HandleMeiFicheiro/gi, 'HandleMyFile');
      val = escapeForTS(val);
      return `    ${key}: '${val}',`;
    }).join('\n');
    
    // Find insertion point: BEFORE "footerLanguages:" in this block
    // If footerLanguages already exists in this block, insert before pageLangHero
    // If footerLanguages doesn't exist, insert before pageLangHero
    
    let insertAnchor = 'pageLangHero:';
    if (missingKeys.includes('footerLanguages')) {
      // We need to insert WITH footerLanguages before pageLangHero
      insertAnchor = 'pageLangHero:';
    } else {
      // footerLanguages already exists, insert before it
      insertAnchor = 'footerLanguages:';
    }
    
    // Re-read lines (important: content has changed if we modified it above)
    const currentLines2 = content.split('\n');
    const { blockStart: bs2, blockEnd: be2 } = findLangBlockBounds(currentLines2, langIdx);
    
    let insertLine = findInsertionLine(currentLines2, bs2, be2, insertAnchor);
    
    if (insertLine === -1) {
      // Try alternate anchor
      insertAnchor = 'pageLangHeroSub:';
      insertLine = findInsertionLine(currentLines2, bs2, be2, insertAnchor);
    }
    
    if (insertLine === -1) {
      console.log(`  -> Could not find insertion anchor for ${lang}, skipping`);
      continue;
    }
    
    // Insert new lines before the anchor
    const linesArray = content.split('\n');
    linesArray.splice(insertLine, 0, newLines);
    content = linesArray.join('\n');
    
    console.log(`  -> Inserted ${missingKeys.length} keys before line ${insertLine + 1} (${insertAnchor})`);
    
    // Delay to avoid rate limiting
    await sleep(1500);
  }
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('\n=== File saved! ===');
  
  // Verification
  console.log('\n=== Verification ===');
  const verifyKeys = [
    'compareTh1', 'compareTr7Col3', 'pageCompareExpertTitle',
    'footerAbout', 'footerCompany', 'footerSecurity', 'footerPricing',
    'footerLanguages', 'footerCompare', 'pageCompareBadge'
  ];
  const finalContent = fs.readFileSync(filePath, 'utf8');
  for (const key of verifyKeys) {
    const count = (finalContent.match(new RegExp(`${key}:`, 'g')) || []).length;
    const status = count >= 29 ? '✓' : count >= 25 ? '~' : '✗';
    console.log(`  ${status} ${key}: ${count} occurrences`);
  }
};

main().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
