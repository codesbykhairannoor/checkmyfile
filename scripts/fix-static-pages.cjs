const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');
const { Project, SyntaxKind } = require('ts-morph');

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');
const TARGET_FILE = path.join(__dirname, '..', 'src', 'i18n', 'translations.ts');
const CACHE_FILE = path.join(__dirname, '..', 'translation-cache-static.json');

const langMap = {
  'zh': 'zh-CN',
  'he': 'iw',
};

const STATIC_PAGES = [
  'AboutUsPage.tsx',
  'PrivacyPage.tsx',
  'TosPage.tsx',
  'SecurityPage.tsx',
  'PricingPage.tsx',
  'ComparePage.tsx',
  'LanguagesPage.tsx',
  'UseCasesPage.tsx'
];

async function extractKeys() {
  const extracted = {};
  for (const page of STATIC_PAGES) {
    const filePath = path.join(PAGES_DIR, page);
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /t\.([a-zA-Z0-9_]+)\s*\|\|\s*'([^']+)'/g;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
      const key = match[1];
      const val = match[2];
      extracted[key] = val;
    }
  }
  return extracted;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log("Extracting keys...");
  const extracted = await extractKeys();
  console.log(`Extracted ${Object.keys(extracted).length} keys.`);

  const project = new Project();
  project.addSourceFileAtPath(TARGET_FILE);
  const sourceFile = project.getSourceFileOrThrow(TARGET_FILE);

  // Get baseDict
  const baseDictDecl = sourceFile.getVariableDeclaration('baseDict');
  const baseDictInitializer = baseDictDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  
  // Update baseDict with extracted English defaults
  let enUpdated = 0;
  for (const [key, val] of Object.entries(extracted)) {
    if (!baseDictInitializer.getProperty(key)) {
      baseDictInitializer.addPropertyAssignment({
        name: key,
        initializer: `"${val.replace(/"/g, '\\"')}"`
      });
      enUpdated++;
    }
  }
  console.log(`Added ${enUpdated} missing keys to English baseDict.`);

  const uiTranslationsDecl = sourceFile.getVariableDeclaration('UI_TRANSLATIONS');
  const uiTranslationsObj = uiTranslationsDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  const langs = uiTranslationsObj.getProperties()
    .filter(p => p.isKind(SyntaxKind.PropertyAssignment))
    .map(p => p.getName());
    
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  }

  for (const lang of langs) {
    if (lang === 'en') continue;

    console.log(`Processing lang: ${lang}...`);
    const langProp = uiTranslationsObj.getPropertyOrThrow(lang);
    const langObj = langProp.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    
    const missingKeysForLang = [];
    for (const key of Object.keys(extracted)) {
      if (!langObj.getProperty(key)) {
        missingKeysForLang.push(key);
      }
    }

    if (missingKeysForLang.length === 0) {
      console.log(`  All keys present for ${lang}.`);
      continue;
    }

    console.log(`  ${lang} is missing ${missingKeysForLang.length} keys. Translating...`);
    
    cache[lang] = cache[lang] || {};
    
    const keysToTranslate = missingKeysForLang.filter(k => !cache[lang][k]);
    if (keysToTranslate.length > 0) {
      const translateCode = langMap[lang] || lang;
      const joined = keysToTranslate.map(k => extracted[k]).join(' ||| ');
      
      let retries = 3;
      let translatedStrings = [];
      while(retries > 0) {
        try {
          const res = await translate(joined, { to: translateCode });
          translatedStrings = res.text.split('|||').map(s => s.trim());
          if (translatedStrings.length !== keysToTranslate.length) throw new Error("Length mismatch");
          break;
        } catch (err) {
          retries--;
          console.error(`    Translation error for ${lang}. Retries: ${retries}`);
          await sleep(3000);
        }
      }

      if (translatedStrings.length === keysToTranslate.length) {
        keysToTranslate.forEach((k, i) => {
          cache[lang][k] = translatedStrings[i];
        });
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      } else {
        console.error(`    Failed to translate all keys for ${lang}, using English fallbacks.`);
        keysToTranslate.forEach(k => {
          cache[lang][k] = extracted[k];
        });
      }
    }

    // Inject into AST
    for (const key of missingKeysForLang) {
      const translatedVal = cache[lang][key] || extracted[key];
      langObj.addPropertyAssignment({
        name: key,
        initializer: `"${translatedVal.replace(/"/g, '\\"')}"`
      });
    }
  }

  // Check Interface
  const uiDictInterface = sourceFile.getInterfaceOrThrow('UiDictionary');
  let intUpdated = 0;
  for (const key of Object.keys(extracted)) {
    if (!uiDictInterface.getProperty(key)) {
      uiDictInterface.addProperty({
        name: key,
        hasQuestionToken: true,
        type: 'string'
      });
      intUpdated++;
    }
  }
  console.log(`Added ${intUpdated} missing keys to UiDictionary interface.`);

  console.log("Saving file...");
  sourceFile.saveSync();
  console.log("Done!");
}

main().catch(console.error);
