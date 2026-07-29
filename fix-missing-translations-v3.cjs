const fs = require('fs');
const translate = require('google-translate-api-x');

const filePath = 'src/i18n/translations.ts';

// Map file language codes to Google Translate codes
const langMap = {
  'zh': 'zh-CN',
  'iw': 'he'
};

const EN = {
  footerCompany: 'Company',
  footerSecurity: 'Security & Trust',
  footerPricing: 'Pricing',
  footerLanguages: 'Supported Languages',
  footerCompare: 'Compare',
  footerAbout: 'About Us',
  footerPrivacy: 'Privacy Policy',
  footerTos: 'Terms of Service',
  compareTh1: "Feature",
  compareTh2: "Typical Cloud API",
  compareTh3: "HandleMyFile",
  compareTr1Col1: "File Upload Required",
  compareTr2Col1: "Data Privacy Guarantee",
  compareTr3Col1: "Max File Size Limit",
  compareTr3Col2: "Typically 5MB - 15MB",
  compareTr3Col3: "Unlimited (RAM constrained)",
  compareTr4Col1: "Offline Capability",
  compareTr5Col1: "Cost",
  compareTr5Col2: "Free Tier + $20/mo",
  compareTr5Col3: "100% Free Forever",
  compareTr6Col1: "Account Registration",
  compareTr6Col2: "Required for large files",
  compareTr6Col3: "Never Required",
  compareTr7Col1: "Processing Speed",
  compareTr7Col2: "Dependent on Internet Speed",
  compareTr7Col3: "Instant (Local CPU)",
  pageCompareExpertTitle: "Built for Privacy",
  pageCompareExpertQuote: "Uploading confidential corporate documents to cloud APIs can be a vulnerability for remote teams. Client-side processing tools like HandleMyFile provide a zero-trust architecture suitable for handling sensitive PDFs locally.",
  pageCompareExpertRole: "Privacy by Design",
  pageCompareBadge: "The Smart Alternative",
  pageCompareHero: "HandleMyFile vs The Rest",
  pageCompareHeroSub: "Tired of waiting for files to upload? Frustrated by 5MB file limits? Discover why professionals are switching to client-side document tools.",
  pageCompareSec2Title: "Feature Comparison",
  pageCompareSec3Title: "Stop Waiting on Cloud Progress Bars",
  pageCompareSec3Desc: "With legacy cloud tools, if you want to merge three 50MB PDFs, you are forced to upload 150MB of data. Then you wait for their server to process it. Then you download the 150MB result. That is a 300MB network bottleneck. HandleMyFile processes the 150MB instantly on your local disk using WebAssembly.",
  pageCompareSec4Title: "Keep Your Data Private",
  pageCompareSec4Desc: "Many online PDF tools reserve the right to scan your uploaded documents. Our offline architecture guarantees privacy by default, for free. Your files never leave your device.",
  pageCompareSec5Title: "Escape the File Size Trap",
  pageCompareSec5Desc: "Cloud APIs often limit your workflow with 5MB limits. HandleMyFile uses your device's RAM, meaning you can process 1GB+ files locally if your computer can handle it.",
  pageCompareSec6Title: "Switch Today",
  pageCompareSec6Desc: "Stop compromising on speed, privacy, and cost. Join thousands of professionals who have already switched to the fastest offline document toolkit on the web.",
  pageLangHero: "Supported Languages",
  pageLangHeroSub: "HandleMyFile is fully localized in 30 languages.",
  pageLangBadge: "Global Access",
  pageLangSec2Title: "Native Localization",
  pageLangSec3Title: "Break Language Barriers",
  pageLangSec3Desc: "Use our offline document tools in your native language. We support left-to-right and right-to-left languages with full UI localization.",
  pageLangSec4Title: "No Cloud Translation Needed",
  pageLangSec4Desc: "All UI text is bundled directly into the application, meaning you don't need internet access to switch languages.",
  pageLangSec5Title: "Seamless Switching",
  pageLangSec5Desc: "Change languages instantly without reloading the application.",
  pageLangSec6Title: "Ready to Start?",
  pageLangSec6Desc: "Select your preferred language and experience the fastest offline document tools on the web."
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const escapeForTS = (str) => {
  return str.replace(/'/g, "\\'").replace(/\n/g, "\\n");
};

const translateBatch = async (strings, langCode) => {
  if (strings.length === 0) return [];
  const forceTo = langCode === 'zh-CN' || langCode === 'zh-TW';
  let retries = 3;
  while (retries > 0) {
    try {
      await sleep(1000); 
      const res = await translate(strings, { to: langCode, forceTo });
      return Array.isArray(res) ? res.map(r => r.text.trim()) : [res.text.trim()];
    } catch (err) {
      retries--;
      console.error(`Error translating to ${langCode}: ${err.message}. Retries: ${retries}`);
      if (retries === 0) return strings;
      await sleep(3000);
    }
  }
  return strings;
};

const main = async () => {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  
  // 1. Add missing keys to UiDictionary interface
  let interfaceEnd = lines.findIndex(l => l.includes('const baseDict: UiDictionary'));
  let dictEnd = lines.findIndex(l => l.includes('export const UI_TRANSLATIONS'));
  
  if (interfaceEnd === -1 || dictEnd === -1) {
    throw new Error('Could not find baseDict or UI_TRANSLATIONS');
  }
  
  const interfaceKeysToAdd = Object.keys(EN).map(k => `  ${k}?: string;`);
  const dictKeysToAdd = Object.entries(EN).map(([k, v]) => `  ${k}: '${escapeForTS(v)}',`);
  
  const existingInterfaceKeys = lines.slice(0, interfaceEnd).join('\n');
  const missingInterface = interfaceKeysToAdd.filter(l => !existingInterfaceKeys.includes(l.trim().split(':')[0] + '?'));
  
  const existingDictKeys = lines.slice(interfaceEnd, dictEnd).join('\n');
  const missingDict = dictKeysToAdd.filter(l => !existingDictKeys.includes(l.trim().split(':')[0] + ':'));
  
  let ifaceClose = -1;
  for(let i=interfaceEnd-1; i>0; i--) {
    if(lines[i].includes('}')) { ifaceClose = i; break; }
  }
  if(ifaceClose !== -1 && missingInterface.length > 0) {
    lines.splice(ifaceClose, 0, ...missingInterface);
    dictEnd += missingInterface.length; // offset
  }
  
  let dictClose = -1;
  for(let i=dictEnd-1; i>0; i--) {
    if(lines[i].includes('}')) { dictClose = i; break; }
  }
  if(dictClose !== -1 && missingDict.length > 0) {
    lines.splice(dictClose, 0, ...missingDict);
  }
  
  fs.writeFileSync(filePath, lines.join('\n'));
  
  // 2. Iterate language blocks and inject translations safely
  lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const blocks = [];
  for(let i=270; i<lines.length; i++) {
    if (lines[i].includes('footerUseCases:')) {
      for (let j=i; j>Math.max(0, i-300); j--) {
        const match = lines[j].match(/^\s*\}?,?'?([a-z]{2,3}(?:-[A-Za-z0-9]+)?)'?:\s*\{/);
        if (match) {
          blocks.push({
            lang: match[1],
            headerLine: j,
            footerUseCasesLine: i
          });
          break;
        }
      }
    }
  }
  
  console.log(`Found ${blocks.length} blocks: ${blocks.map(b => b.lang).join(', ')}`);
  
  for (let b=0; b<blocks.length; b++) {
    const block = blocks[b];
    const lang = block.lang;
    const langCode = langMap[lang] || lang;
    
    // In 3331a08, we insert right BEFORE footerUseCases:
    let insertLine = -1;
    for (let i = block.headerLine; i < lines.length; i++) {
      if (lines[i].includes('footerUseCases:')) {
        insertLine = i;
        break;
      }
    }
    
    if (insertLine === -1) {
      console.log(`Could not find insertion point for ${lang}`);
      continue;
    }
    
    const blockContent = lines.slice(block.headerLine, insertLine + 20).join('\n');
    const missingKeys = Object.keys(EN).filter(k => !blockContent.includes(`    ${k}:`));
    
    if (missingKeys.length === 0) {
      console.log(`[${lang}] All keys present.`);
      continue;
    }
    
    console.log(`[${lang}] Translating ${missingKeys.length} keys to ${langCode}...`);
    
    const sourceStrings = missingKeys.map(k => EN[k]);
    let translated = await translateBatch(sourceStrings, langCode);
    
    const newLines = missingKeys.map((key, i) => {
      let val = translated[i] || sourceStrings[i];
      val = val.replace(/Handlemeineakte|Handlemydatei|Poignéemonichier|HandleMeiFicheiro/gi, 'HandleMyFile');
      val = escapeForTS(val);
      return `    ${key}: '${val}',`;
    });
    
    lines.splice(insertLine, 0, ...newLines);
    
    fs.writeFileSync(filePath, lines.join('\n'));
    lines = fs.readFileSync(filePath, 'utf8').split('\n');
    console.log(`[${lang}] Saved.`);
  }
};

main().catch(console.error);
