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
  pageCompareExpertTitle: "Industry Experts Agree",
  pageCompareExpertQuote: "Uploading corporate documents to unverified cloud APIs is the number one cybersecurity vulnerability for remote teams in 2026. Client-side processing tools like HandleMyFile represent the only zero-trust architecture suitable for handling confidential PDFs.",
  pageCompareExpertRole: "Lead Cybersecurity Researcher, Global InfoSec Institute",
  pageCompareBadge: "The Smart Alternative",
  pageCompareHero: "HandleMyFile vs The Rest",
  pageCompareHeroSub: "Tired of waiting for files to upload? Frustrated by 5MB file limits? Discover why professionals are switching to client-side document tools.",
  pageCompareSec2Title: "Feature Comparison",
  pageCompareSec3Title: "Stop Waiting on Cloud Trash Progress Bars",
  pageCompareSec3Desc: "With legacy cloud tools, if you want to merge three 50MB PDFs, you are forced to upload 150MB of data. Then you wait for their bloated server to process it. Then you download the 150MB result. That is a 300MB network bottleneck. HandleMyFile processes the 150MB instantly on your local disk using WebAssembly. Tests show our local processing is up to 12.5x faster than average cloud converters.",
  pageCompareSec4Title: "93% of Cloud Tools Monetize Your Data",
  pageCompareSec4Desc: "Did you know that 93% of \"free\" online PDF tools reserve the right to scan your uploaded documents for AI training data? They ask you to pay $20 a month just for \"Secure Processing\". We believe you shouldn't have to pay a ransom to keep your documents private. Our offline architecture guarantees privacy by default, for free.",
  pageCompareSec5Title: "Escape the File Size Trap",
  pageCompareSec5Desc: "Have you ever tried to compress a PDF, only to be told the file is \"Too large for the free tier\"? Cloud APIs intentionally cripple your workflow with 5MB limits. We hate artificial limits. HandleMyFile uses your device's RAM, meaning you can process 1GB+ files locally if your computer can handle it.",
  pageCompareSec6Title: "Stop Using Cloud Trash. Switch Today.",
  pageCompareSec6Desc: "Stop compromising on speed, privacy, and cost. Join thousands of professionals who have already switched to the fastest offline document toolkit on the web."
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
      await sleep(1000); // 1s delay per language batch
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
  
  // Find all languages blocks based on footerUseCases
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
  
  // Now for each block, find the inserted keys (between pageUseCasesSec6Desc or shareBtn and pageLangHero)
  for (let b=0; b<blocks.length; b++) {
    const block = blocks[b];
    // Skip id, es, fr, de, ja as they were correct? Wait, es, fr, de, ja were correct.
    // Actually let's just redo all from index 5 (zh) onwards to be safe
    if (b < 5) continue; 
    
    const lang = block.lang;
    const langCode = langMap[lang] || lang;
    
    // Find pageLangHero:
    let pageLangHeroLine = -1;
    for (let i = block.footerUseCasesLine; i < lines.length; i++) {
      if (lines[i].includes('pageLangHero:')) {
        pageLangHeroLine = i;
        break;
      }
      if (lines[i].includes('footerUseCases:') && i > block.footerUseCasesLine + 10) break; // Next block started
    }
    
    if (pageLangHeroLine === -1) {
      console.log(`Could not find pageLangHero for ${lang}`);
      continue;
    }
    
    // Find the start of the inserted block (compareTh1 is usually the first key inserted)
    // Or we can just read all lines above pageLangHero until we hit pageUseCasesSec6Desc or shareBtn
    let insertStart = -1;
    let keysFound = [];
    for (let i = pageLangHeroLine - 1; i > block.footerUseCasesLine; i--) {
      const match = lines[i].match(/^\s*([a-zA-Z0-9_]+):/);
      if (match) {
        const key = match[1];
        if (EN[key]) {
          keysFound.push({key, lineIndex: i});
          insertStart = i;
        } else {
          // Hit an original key that is not in our EN list (like pageUseCasesSec6Desc)
          break;
        }
      }
    }
    
    if (keysFound.length === 0) {
      console.log(`No shifted keys found for ${lang}`);
      continue;
    }
    
    // keysFound is in reverse order.
    keysFound.reverse();
    
    console.log(`[${lang}] Translating ${keysFound.length} keys to ${langCode}...`);
    
    const sourceStrings = keysFound.map(k => EN[k.key]);
    let translated = await translateBatch(sourceStrings, langCode);
    
    // Replace in lines
    for (let i=0; i<keysFound.length; i++) {
      const kInfo = keysFound[i];
      let val = translated[i] || sourceStrings[i];
      val = escapeForTS(val);
      lines[kInfo.lineIndex] = `    ${kInfo.key}: '${val}',`;
    }
    
    // Re-save file incrementally
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`[${lang}] Saved.`);
  }
};

main().catch(console.error);
