const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const TARGET_FILE = path.join(__dirname, 'src', 'i18n', 'translations.ts');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const PAGES_DICTIONARY = {
  footerCompany: 'Company',

  pageAboutSec1Title: 'The Origin Story',
  pageAboutSec1Desc: 'We were frustrated by the constant paywalls and privacy leaks of traditional online document tools. Uploading sensitive files to random servers felt inherently wrong. We built HandleMyFile to prove that enterprise-grade tools could be free, fast, and fully secure.',
  pageAboutSec2Title: 'Technology Stack',
  pageAboutSec2Desc: 'By leveraging the power of WebAssembly (Wasm), we took complex server-side C++ and Rust libraries and ported them to run directly inside your web browser. This means the server is brought to your device, entirely eliminating the need for network uploads.',
  pageAboutSec3Title: 'Our Guarantee',
  pageAboutSec3Desc: 'HandleMyFile is built to remain 100% free forever. We will never introduce subscriptions, hidden limits, or paywalls for our core PDF tools. Our mission is to democratize document utilities for everyone, everywhere.',
  pageAboutSec4Title: 'Join the Movement',
  pageAboutSec4Desc: 'We rely on our community to keep this project alive. Share HandleMyFile with your friends, family, and coworkers. Together, we can build a safer, faster, and more accessible web.',

  pagePrivacySec1Title: 'Data Handling Matrix',
  pagePrivacySec1Desc: 'We do not collect IP addresses. We do not store your files. We do not require email registrations. Every single bit of your document data remains exclusively on your physical device at all times.',
  pagePrivacySec2Title: 'How Client-Side Works',
  pagePrivacySec2Desc: 'When you select a file on HandleMyFile, it is loaded directly into your browser\'s RAM. The WebAssembly engine processes the file locally and prompts a download directly from memory. The file never travels across the internet.',
  pagePrivacySec3Title: 'Third-Party Integrations',
  pagePrivacySec3Desc: 'We are fiercely independent. We do not embed hidden analytics trackers, advertising networks, or third-party cookies that could compromise your privacy. What happens on HandleMyFile stays on HandleMyFile.',
  pagePrivacySec4Title: 'Global Compliance',
  pagePrivacySec4Desc: 'Because our architecture mathematically prevents us from accessing your files, HandleMyFile inherently exceeds the privacy requirements of GDPR, CCPA, and other global data protection regulations.',

  pageTosSec1Title: 'Acceptable Use Policy',
  pageTosSec1Desc: 'You agree to use HandleMyFile only for lawful purposes. You must not use our tools to forge, manipulate, or falsify legal documents, government IDs, or any materials for fraudulent activities.',
  pageTosSec2Title: 'Intellectual Property',
  pageTosSec2Desc: 'You retain 100% ownership and all intellectual property rights to the documents you process using HandleMyFile. We claim zero rights, licenses, or ownership over your content.',
  pageTosSec3Title: 'Service Modifications',
  pageTosSec3Desc: 'We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice. As an entirely client-side platform, we cannot guarantee compatibility with all browser versions.',
  pageTosSec4Title: 'Limitation of Liability',
  pageTosSec4Desc: 'Under no circumstances shall HandleMyFile, its creators, or contributors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools.'
};

async function main() {
  let content = fs.readFileSync(TARGET_FILE, 'utf8');
  
  const langs = ['id','es','fr','de','ja','zh-CN','pt','ru','ar','hi','it','ko','nl','tr','pl','vi','th','sv','cs','da','el','fi','iw','hu','no','ro','sk','uk','ms'];
  
  for (let i = 0; i < langs.length; i++) {
    const targetLang = langs[i];
    console.log(`[${i+1}/${langs.length}] Translating expanded pages to ${targetLang}...`);
    
    // Check if block already contains pageAboutSec1Title for this lang
    const langRegex = new RegExp(`${targetLang}:\\s*\\{.*?pageAboutSec1Title:`, 's');
    if (langRegex.test(content)) {
      console.log(`  -> Already translated.`);
      continue;
    }

    let translatedDict = {};
    let success = false;
    let retries = 3;

    while (!success && retries > 0) {
      try {
        const values = Object.values(PAGES_DICTIONARY);
        const res = await translate(values, { to: targetLang });
        const translatedValues = Array.isArray(res) ? res.map(r => r.text) : [res.text];

        Object.keys(PAGES_DICTIONARY).forEach((key, index) => {
          translatedDict[key] = translatedValues[index].replace(/'/g, "\\'");
        });
        success = true;
      } catch (err) {
        retries--;
        console.log(`  -> Error. Retries left: ${retries}`);
        await sleep(2000);
      }
    }

    if (!success) {
      console.log(`  -> Failed to translate ${targetLang}`);
      continue;
    }

    // Inject into the language block
    const blockRegex = new RegExp(`(${targetLang}:\\s*\\{)`, 's');
    const insertion = Object.entries(translatedDict)
      .map(([k, v]) => `\n    ${k}: '${v}',`)
      .join('');
    
    content = content.replace(blockRegex, `$1${insertion}`);
    await sleep(1000); // rate limiting
  }

  // Also update 'en'
  const enRegex = new RegExp(`(en:\\s*\\{)`, 's');
  if (!new RegExp(`en:\\s*\\{.*?pageAboutSec1Title:`, 's').test(content)) {
    const enInsertion = Object.entries(PAGES_DICTIONARY)
      .map(([k, v]) => `\n    ${k}: '${v.replace(/'/g, "\\'")}',`)
      .join('');
    content = content.replace(enRegex, `$1${enInsertion}`);
  }

  fs.writeFileSync(TARGET_FILE, content);
  console.log("Done translating extended static page keys.");
}

main();
