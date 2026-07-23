const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const TARGET_FILE = path.join(__dirname, 'src', 'i18n', 'translations.ts');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const PAGES_DICTIONARY = {
  // Pricing
  footerPricing: 'Pricing',
  pagePricingHero: 'Zero Subscriptions. Zero Limits.',
  pagePricingHeroSub: 'Enterprise-grade document tools usually cost $20/month. We believe privacy and utility should be a fundamental human right. HandleMyFile is completely free.',
  pagePricingBadge: 'Radically Free',
  pagePricingComp: 'Traditional Cloud Tools',
  pagePricingSec3Title: 'How is this possible?',
  pagePricingSec3Desc: 'Traditional tools have expensive server bills because they process your files on their cloud. We ported C++ and Rust engines to run inside your browser. Your computer does the heavy lifting, meaning our server costs are near zero. We pass those savings directly to you.',
  pagePricingSec4Title: 'No Hidden Trackers. No Annoying Ads.',
  pagePricingSec4Desc: 'If a product is free, usually you are the product. Not here. HandleMyFile is supported by community goodwill. We do not sell your data, we do not embed third-party advertising networks, and we definitely do not track your documents.',
  pagePricingSec5Title: 'Free for Business Use',
  pagePricingSec5Desc: 'Yes, you can use HandleMyFile for your company. In fact, our local processing architecture makes us the only platform safe enough for strict corporate environments, legal teams, and healthcare professionals.',
  pagePricingSec6Title: 'Support the Project',
  pagePricingSec6Desc: 'We don\'t charge a subscription, but keeping the domain and development alive takes time. If HandleMyFile saved your day, consider sharing it with your team. Word of mouth is our only marketing strategy.',
  shareBtn: 'Share HandleMyFile',

  // Security
  footerSecurity: 'Security & Trust',
  pageSecurityHero: 'Mathematical Privacy. Zero Uploads.',
  pageSecurityHeroSub: 'Most document tools promise they delete your files after 1 hour. We promise we never see your files in the first place.',
  pageSecurityBadge: 'Trust Center',
  pageSecuritySec2Title: 'The WebAssembly Revolution',
  pageSecuritySec3Title: 'Blind to Your Data',
  pageSecuritySec3Desc: 'We do not run tracking scripts on your documents. We do not extract metadata, text contents, or images. The processing sandbox is entirely self-contained within your browser tab.',
  pageSecuritySec4Title: 'Compliance by Default',
  pageSecuritySec4Desc: 'Because HandleMyFile cannot access your files, using our tools automatically complies with the strictest data protection laws worldwide.',
  pageSecuritySec5Title: 'Don\'t Trust Us. Verify It.',
  pageSecuritySec5Desc: 'You don\'t have to take our word for it. You can prove our offline guarantee yourself in 3 simple steps:',
  pageSecuritySec6Title: 'The Future is Local',
  pageSecuritySec6Desc: 'We envision a web where utility apps respect your hardware and your privacy. Welcome to the new era of client-side computing.',

  // Use Cases
  footerUseCases: 'Use Cases',
  pageUseCasesHero: 'Built for Every Profession',
  pageUseCasesHeroSub: 'From strict legal environments to creative agencies, discover why professionals trust our client-side processing architecture.',
  pageUseCasesBadge: 'Industry Solutions',
  pageUseCasesSec2Title: 'Legal & Law Firms',
  pageUseCasesSec2Desc: 'Attorneys handle highly confidential NDAs, contracts, and court filings. Uploading these documents to random cloud APIs is a major liability. With HandleMyFile, legal teams can redact, merge, and split PDF case files entirely offline, ensuring absolute client confidentiality.',
  pageUseCasesSec3Title: 'Human Resources (HR)',
  pageUseCasesSec3Desc: 'HR departments deal with PII (Personally Identifiable Information) on a daily basis. Scanning IDs, handling payroll spreadsheets, and managing offer letters requires strict GDPR/CCPA compliance. HandleMyFile lets HR professionals manage these files without violating internal IT security policies.',
  pageUseCasesSec4Title: 'Students & Education',
  pageUseCasesSec4Desc: 'Students shouldn\'t have to pay $20/month just to merge their group project assignments or compress a presentation to fit the university portal\'s 5MB upload limit. HandleMyFile provides unlimited access to premium tools for free, with zero file size limits.',
  pageUseCasesSec5Title: 'Real Estate & Agents',
  pageUseCasesSec5Desc: 'Real estate agents handle massive property brochures packed with high-resolution images that are too large to email to clients. They also need to quickly watermark property plans and sign lease agreements. HandleMyFile handles 100MB+ files instantly.',
  pageUseCasesSec6Title: 'Find Your Own Use Case',
  pageUseCasesSec6Desc: 'No matter your industry, if you work with documents, HandleMyFile is the safest and fastest way to get the job done. Try our full suite of 20+ tools today.',

  // Compare
  footerCompare: 'Compare',
  pageCompareHero: 'HandleMyFile vs The Rest',
  pageCompareHeroSub: 'Tired of waiting for files to upload? Frustrated by 5MB file limits? Discover why professionals are switching to client-side document tools.',
  pageCompareBadge: 'The Smart Alternative',
  pageCompareSec2Title: 'Feature Comparison',
  pageCompareSec3Title: 'Stop Waiting on Progress Bars',
  pageCompareSec3Desc: 'With cloud tools, if you want to merge three 50MB PDFs, you have to upload 150MB of data. Then wait for their server to process it. Then download the 150MB result. HandleMyFile processes the 150MB instantly on your local disk.',
  pageCompareSec4Title: 'Privacy is Not a Premium Feature',
  pageCompareSec4Desc: 'Competitors ask you to pay $20 a month for "Secure Processing". We believe you shouldn\'t have to pay a ransom to keep your documents private. Our offline architecture guarantees privacy by default, for free.',
  pageCompareSec5Title: 'Escape the File Size Trap',
  pageCompareSec5Desc: 'Have you ever tried to compress a PDF, only to be told the file is "Too large for the free tier"? We hate artificial limits. HandleMyFile uses your device\'s RAM, meaning you can process 1GB+ files if your computer can handle it.',
  pageCompareSec6Title: 'Make the Switch Today',
  pageCompareSec6Desc: 'Stop compromising on speed, privacy, and cost. Join thousands of professionals who have already switched to the fastest offline document toolkit on the web.',

  // Languages
  footerLanguages: 'Supported Languages',
  pageLangHero: 'Available Worldwide',
  pageLangHeroSub: 'Document utilities should be accessible to everyone, regardless of what language you speak. We currently support 30 localized versions of HandleMyFile.',
  pageLangBadge: 'Global Platform',
  pageLangSec2Title: 'Select Your Region',
  pageLangSec3Title: 'Universal Interface',
  pageLangSec3Desc: 'Every tool, button, error message, and guide on HandleMyFile has been localized. We maintain a strict translation matrix to ensure your experience feels native and intuitive.',
  pageLangSec4Title: 'Zero Latency, Anywhere',
  pageLangSec4Desc: 'Because HandleMyFile relies on WebAssembly processing instead of cloud servers, it doesn\'t matter if you are in New York or Jakarta. You will experience the exact same instant document processing speeds without network latency.',
  pageLangSec5Title: 'Community Driven',
  pageLangSec5Desc: 'Notice a translation that feels slightly off? We rely on our global user base to help refine and perfect our localizations. Contact us to suggest improvements for your native language.',
  pageLangSec6Title: 'Ready to Process?',
  pageLangSec6Desc: 'Choose a tool below to get started securely and for free.'
};

const langs = ['id','es','fr','de','ja','zh','pt','ru','ar','hi','it','ko','nl','tr','pl','vi','th','sv','cs','da','el','fi','iw','hu','no','ro','sk','uk','ms'];

async function main() {
  let content = fs.readFileSync(TARGET_FILE, 'utf8');
  let lines = content.split(/\r?\n/);

  // Inject into baseDict if missing
  const baseDictIndex = lines.findIndex(l => l.includes('const baseDict: UiDictionary = {'));
  if (baseDictIndex !== -1 && !lines.slice(baseDictIndex).some(l => l.includes('footerPricing:'))) {
    console.log('Injecting 5 pages keys into baseDict (English)...');
    const enInsertion = Object.entries(PAGES_DICTIONARY).map(([k, v]) => `  ${k}: '${v.replace(/'/g, "\\'")}',`);
    lines.splice(baseDictIndex + 1, 0, ...enInsertion);
  }

  // Inject into 29 languages
  for (let lang of langs) {
    const langKey = lang === 'zh-CN' ? 'zh' : lang;
    const blockStartRegex = new RegExp(`^  ${langKey}:\\s*\\{`);
    let blockStartIndex = lines.findIndex(l => blockStartRegex.test(l));

    if (blockStartIndex === -1) {
      console.log(`Language block ${lang} not found!`);
      continue;
    }

    // Check if it already has the new keys
    let hasKeys = false;
    for (let i = blockStartIndex; i < lines.length; i++) {
      if (lines[i].includes('footerPricing:')) {
        hasKeys = true; break;
      }
      if (lines[i].includes('},')) break;
    }

    if (hasKeys) {
      console.log(`[${lang}] already has the 5 pages translated.`);
      continue;
    }

    console.log(`[${lang}] Translating 5 massive pages...`);
    let translatedDict = {};
    let success = false;
    let retries = 3;

    while (!success && retries > 0) {
      try {
        const values = Object.values(PAGES_DICTIONARY);
        const res = await translate(values, { to: lang === 'zh' ? 'zh-CN' : lang });
        const translatedValues = Array.isArray(res) ? res.map(r => r.text) : [res.text];
        
        Object.keys(PAGES_DICTIONARY).forEach((key, index) => {
          translatedDict[key] = translatedValues[index] ? translatedValues[index].replace(/'/g, "\\'") : '';
        });
        success = true;
      } catch (err) {
        retries--;
        console.log(`  -> Error. Retries left: ${retries}`);
        await sleep(3000);
      }
    }

    if (success) {
      const insertion = Object.entries(translatedDict).map(([k, v]) => `    ${k}: '${v}',`);
      lines.splice(blockStartIndex + 1, 0, ...insertion);
      console.log(`[${lang}] Injected successfully.`);
    } else {
      console.log(`[${lang}] FAILED to translate.`);
    }
    
    // Save continuously!
    fs.writeFileSync(TARGET_FILE, lines.join('\n'));
    await sleep(2000);
  }

  console.log("5 Pages translation sync complete!");
}

main();
