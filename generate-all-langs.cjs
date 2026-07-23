const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const TARGET_FILE = path.join(__dirname, 'src', 'i18n', 'translations.ts');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const langs = ['id','es','fr','de','ja','zh-CN','pt','ru','ar','hi','it','ko','nl','tr','pl','vi','th','sv','cs','da','el','fi','iw','hu','no','ro','sk','uk','ms'];

async function main() {
  let content = fs.readFileSync(TARGET_FILE, 'utf8');

  // Extract baseDict (English) keys and values
  const enBlockMatch = content.match(/const baseDict: UiDictionary = \{([\s\S]*?)\n\};/);
  if (!enBlockMatch) {
    console.error("Could not find baseDict");
    return;
  }
  
  const enBlock = enBlockMatch[1];
  const dict = {};
  
  // Quick regex to parse keys and values
  const regex = /^\s*([a-zA-Z0-9_]+):\s*'(.*?)',$/gm;
  let match;
  while ((match = regex.exec(enBlock)) !== null) {
    dict[match[1]] = match[2].replace(/\\'/g, "'");
  }

  const keys = Object.keys(dict);
  const values = Object.values(dict);

  console.log(`Found ${keys.length} keys to translate.`);

  let newBlocks = '';

  for (let lang of langs) {
    // check if language already exists
    const langKey = lang === 'zh-CN' ? 'zh' : lang; // translations.ts uses 'zh' right now
    if (new RegExp(`^  ${langKey}:\\s*\\{`, 'm').test(content)) {
      console.log(`[${lang}] already exists. Skipping.`);
      continue;
    }

    console.log(`[${lang}] Translating full dictionary...`);
    let translatedDict = {};
    let success = false;
    let retries = 3;

    while (!success && retries > 0) {
      try {
        const res = await translate(values, { to: lang });
        const translatedValues = Array.isArray(res) ? res.map(r => r.text) : [res.text];
        
        keys.forEach((key, index) => {
          translatedDict[key] = translatedValues[index] ? translatedValues[index].replace(/'/g, "\\'") : '';
        });
        success = true;
      } catch (err) {
        retries--;
        console.log(`  -> Error. Retries left: ${retries}`);
        await sleep(5000); // Wait longer for huge payloads
      }
    }

    if (success) {
      let block = `\n  ${langKey}: {\n`;
      Object.entries(translatedDict).forEach(([k, v]) => {
        block += `    ${k}: '${v}',\n`;
      });
      block += `  },`;
      newBlocks += block;
      console.log(`[${lang}] Translated successfully.`);
    } else {
      console.log(`[${lang}] FAILED.`);
    }
    await sleep(2000);
  }

  if (newBlocks) {
    // Insert before the closing `};` of `export const UI_TRANSLATIONS`
    content = content.replace(/\n};\n*export const getUiTranslations/, `${newBlocks}\n};\n\nexport const getUiTranslations`);
    fs.writeFileSync(TARGET_FILE, content);
    console.log("Translations injected!");
  } else {
    console.log("No new translations added.");
  }
}

main();
