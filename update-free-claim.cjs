const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const TARGET_FILE = path.join(__dirname, 'src', 'i18n', 'translations.ts');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const newText = 'HandleMyFile is built to remain completely free. Our mission is to democratize document utilities for everyone, everywhere.';
const langs = ['id','es','fr','de','ja','zh-CN','pt','ru','ar','hi','it','ko','nl','tr','pl','vi','th','sv','cs','da','el','fi','iw','hu','no','ro','sk','uk','ms'];

async function main() {
  let lines = fs.readFileSync(TARGET_FILE, 'utf8').split('\n');
  
  let currentLang = 'en';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // detect language block
    const langMatch = line.match(/^  ([a-zA-Z-]+):\s*\{/);
    if (langMatch) {
      currentLang = langMatch[1];
      continue;
    }

    if (line.includes('pageAboutSec3Desc:')) {
      if (currentLang === 'en') {
        lines[i] = `    pageAboutSec3Desc: '${newText.replace(/'/g, "\\'")}',`;
      } else if (langs.includes(currentLang)) {
        console.log(`Translating for ${currentLang}...`);
        try {
          const res = await translate(newText, { to: currentLang });
          const translated = res.text.replace(/'/g, "\\'");
          lines[i] = `    pageAboutSec3Desc: '${translated}',`;
        } catch (err) {
          console.log(`Failed to translate ${currentLang}`);
        }
        await sleep(500);
      }
    }
  }

  fs.writeFileSync(TARGET_FILE, lines.join('\n'));
  console.log("Done updating free claim securely");
}

main();
