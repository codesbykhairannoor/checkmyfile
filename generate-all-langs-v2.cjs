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
  pageAboutSec3Desc: 'HandleMyFile is built to remain completely free. Our mission is to democratize document utilities for everyone, everywhere.',
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

const langs = ['id','es','fr','de','ja','zh','pt','ru','ar','hi','it','ko','nl','tr','pl','vi','th','sv','cs','da','el','fi','iw','hu','no','ro','sk','uk','ms'];

async function main() {
  let content = fs.readFileSync(TARGET_FILE, 'utf8');

  // Parse English dict
  const regex = /^\s*([a-zA-Z0-9_]+):\s*'(.*?)',$/gm;
  const enBlockMatch = content.match(/const baseDict: UiDictionary = \{([\s\S]*?)\n\};/);
  const dict = {};
  if (enBlockMatch) {
    let match;
    while ((match = regex.exec(enBlockMatch[1])) !== null) {
      dict[match[1]] = match[2].replace(/\\'/g, "'");
    }
  }

  // Merge the new static page dictionary with baseDict
  const fullDict = { ...dict, ...PAGES_DICTIONARY };
  const keys = Object.keys(fullDict);
  const values = Object.values(fullDict);

  let lines = content.split(/\r?\n/);

  for (let lang of langs) {
    const langKey = lang === 'zh-CN' ? 'zh' : lang;
    const blockStartRegex = new RegExp(`^  ${langKey}:\\s*\\{`);
    let blockStartIndex = lines.findIndex(l => blockStartRegex.test(l));

    if (blockStartIndex !== -1) {
      // Check if it has pageAboutSec1Title
      let hasExpanded = false;
      for (let i = blockStartIndex; i < lines.length; i++) {
        if (lines[i].includes('pageAboutSec1Title:')) {
          hasExpanded = true; break;
        }
        if (lines[i].includes('},')) break;
      }
      if (hasExpanded) {
        console.log(`[${lang}] already fully translated.`);
        continue;
      } else {
        console.log(`[${lang}] exists but missing new keys. Translating only new keys...`);
        // We will just delete the old block and regenerate it fully for simplicity, or inject the missing keys.
        // It's easier to just translate the PAGES_DICTIONARY and inject it.
        try {
          const res = await translate(Object.values(PAGES_DICTIONARY), { to: lang === 'zh' ? 'zh-CN' : lang });
          const translatedValues = Array.isArray(res) ? res.map(r => r.text) : [res.text];
          let translatedDict = {};
          Object.keys(PAGES_DICTIONARY).forEach((key, index) => {
            translatedDict[key] = translatedValues[index] ? translatedValues[index].replace(/'/g, "\\'") : '';
          });
          const insertion = Object.entries(translatedDict).map(([k, v]) => `    ${k}: '${v}',`);
          lines.splice(blockStartIndex + 1, 0, ...insertion);
          console.log(`[${lang}] Injected missing keys.`);
        } catch (e) {}
        continue;
      }
    }

    console.log(`[${lang}] Block missing completely. Translating full dictionary...`);
    try {
      const res = await translate(values, { to: lang === 'zh' ? 'zh-CN' : lang });
      const translatedValues = Array.isArray(res) ? res.map(r => r.text) : [res.text];
      
      let blockLines = [`  ${langKey}: {`];
      keys.forEach((key, index) => {
        const val = translatedValues[index] ? translatedValues[index].replace(/'/g, "\\'") : '';
        blockLines.push(`    ${key}: '${val}',`);
      });
      blockLines.push(`  },`);
      
      // Insert right before the last `};`
      const closingIndex = lines.findIndex(l => l.trim() === '};' && lines[lines.indexOf(l)+1]?.includes('export const getUiTranslations'));
      if (closingIndex !== -1) {
        lines.splice(closingIndex, 0, ...blockLines);
        console.log(`[${lang}] Inserted full block.`);
      }
    } catch (e) {
      console.log(`[${lang}] Failed: ${e.message}`);
    }
    await sleep(2000);
  }

  // Also inject missing keys into baseDict if needed
  const baseDictIndex = lines.findIndex(l => l.includes('const baseDict: UiDictionary = {'));
  if (baseDictIndex !== -1 && !lines.slice(baseDictIndex).some(l => l.includes('pageAboutSec1Title:'))) {
    const enInsertion = Object.entries(PAGES_DICTIONARY).map(([k, v]) => `  ${k}: '${v.replace(/'/g, "\\'")}',`);
    lines.splice(baseDictIndex + 1, 0, ...enInsertion);
  }

  fs.writeFileSync(TARGET_FILE, lines.join('\n'));
  console.log("Done generating all langs.");
}

main();
