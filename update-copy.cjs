const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const TARGET_FILE = path.join(__dirname, 'src', 'i18n', 'translations.ts');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const KEYS_TO_UPDATE = {
  pagePricingSec4Title: 'Sustainable & Transparent',
  pagePricingSec4Desc: 'To keep HandleMyFile 100% free forever, we rely on non-intrusive advertisements and standard web analytics. However, your privacy is our top priority. We never scan, extract, or sell the contents of your files. What happens in the editor, stays in the editor.',
  pageSecuritySec3Title: 'Your Documents Are Blind To Us',
  pageSecuritySec3Desc: 'While we use standard analytics to improve our website experience, our scripts never touch your documents. We do not extract metadata, text contents, or images. The document processing sandbox is entirely self-contained within your browser tab.'
};

const langs = ['id','es','fr','de','ja','zh','pt','ru','ar','hi','it','ko','nl','tr','pl','vi','th','sv','cs','da','el','fi','iw','hu','no','ro','sk','uk','ms'];

async function main() {
  let content = fs.readFileSync(TARGET_FILE, 'utf8');
  let lines = content.split(/\r?\n/);
  
  // Update baseDict (en)
  const baseDictStart = lines.findIndex(l => l.includes('const baseDict: UiDictionary = {'));
  if (baseDictStart !== -1) {
    for (const [k, v] of Object.entries(KEYS_TO_UPDATE)) {
      const idx = lines.findIndex((l, i) => i > baseDictStart && l.includes(`${k}: `));
      if (idx !== -1) {
        lines[idx] = `  ${k}: '${v.replace(/'/g, "\\'")}',`;
      }
    }
  }

  for (let lang of langs) {
    const langKey = lang === 'zh-CN' ? 'zh' : lang;
    const blockStartRegex = new RegExp(`^  ${langKey}:\\s*\\{`);
    let blockStartIndex = lines.findIndex(l => blockStartRegex.test(l));

    if (blockStartIndex === -1) {
      console.log(`Language block ${lang} not found!`);
      continue;
    }

    console.log(`[${lang}] Retranslating ad/analytics copy...`);
    let translatedDict = {};
    let success = false;
    let retries = 3;

    while (!success && retries > 0) {
      try {
        const values = Object.values(KEYS_TO_UPDATE);
        const res = await translate(values, { to: lang === 'zh' ? 'zh-CN' : lang });
        const translatedValues = Array.isArray(res) ? res.map(r => r.text) : [res.text];
        
        Object.keys(KEYS_TO_UPDATE).forEach((key, index) => {
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
      // Replace the exact lines in this block
      for (const [k, v] of Object.entries(translatedDict)) {
        // Find line for this key inside this language block
        // Stop searching if we hit `},`
        for (let i = blockStartIndex + 1; i < lines.length; i++) {
          if (lines[i].trim() === '},') break;
          if (lines[i].includes(`    ${k}: `)) {
            lines[i] = `    ${k}: '${v}',`;
            break;
          }
        }
      }
      console.log(`[${lang}] Updated successfully.`);
    } else {
      console.log(`[${lang}] FAILED to translate.`);
    }
    
    // Save continuously!
    fs.writeFileSync(TARGET_FILE, lines.join('\n'));
    await sleep(2000);
  }

  console.log("Copywriting translation sync complete!");
}

main();
