const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.join(__dirname, 'src', 'i18n', 'translations.ts');

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

function main() {
  let content = fs.readFileSync(TARGET_FILE, 'utf8');
  let lines = content.split(/\r?\n/);
  
  // Find the closing brace of UiDictionary
  // It should be the first `}` before `const baseDict: UiDictionary = {`
  const baseDictLine = lines.findIndex(l => l.includes('const baseDict: UiDictionary = {'));
  let closingBrace = -1;
  for (let i = baseDictLine - 1; i >= 0; i--) {
    if (lines[i].trim() === '}') {
      closingBrace = i;
      break;
    }
  }
  
  if (closingBrace !== -1 && !lines.slice(0, closingBrace).some(l => l.includes('footerPricing?:'))) {
    const interfaceInsert = Object.keys(PAGES_DICTIONARY).map(k => `  ${k}?: string;`);
    lines.splice(closingBrace, 0, ...interfaceInsert);
    fs.writeFileSync(TARGET_FILE, lines.join('\n'));
    console.log('Successfully injected types into UiDictionary');
  } else {
    console.log('Failed to find insertion point or already injected.');
  }
}
main();
