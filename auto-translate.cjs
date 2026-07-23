const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const OUT_DIR = path.join(__dirname, 'src', 'locales', 'seo');
const CACHE_FILE = path.join(__dirname, 'translation-cache.json');

// Helper to delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load or initialize cache
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
}

const saveCache = () => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
};

const extractStrings = (data) => {
  return [
    data.title,
    data.h1,
    data.description,
    data.sections[0].content,
    data.sections[1].steps[0].title,
    data.sections[1].steps[0].description,
    data.sections[1].steps[1].title,
    data.sections[1].steps[1].description,
    data.sections[1].steps[2].title,
    data.sections[1].steps[2].description,
    data.sections[2].title,
    data.sections[2].content,
    data.sections[3].title,
    data.sections[3].content,
    data.sections[4].title,
    data.sections[4].content,
    data.faqs[0].q, data.faqs[0].a,
    data.faqs[1].q, data.faqs[1].a,
    data.faqs[2].q, data.faqs[2].a,
    data.faqs[3].q, data.faqs[3].a,
    data.faqs[4].q,
  ];
};

const injectStrings = (data, strings) => {
  let i = 0;
  data.title = strings[i++];
  data.h1 = strings[i++];
  data.description = strings[i++];
  data.sections[0].content = strings[i++];
  data.sections[1].steps[0].title = strings[i++];
  data.sections[1].steps[0].description = strings[i++];
  data.sections[1].steps[1].title = strings[i++];
  data.sections[1].steps[1].description = strings[i++];
  data.sections[1].steps[2].title = strings[i++];
  data.sections[1].steps[2].description = strings[i++];
  data.sections[2].title = strings[i++];
  data.sections[2].content = strings[i++];
  data.sections[3].title = strings[i++];
  data.sections[3].content = strings[i++];
  data.sections[4].title = strings[i++];
  data.sections[4].content = strings[i++];
  data.faqs[0].q = strings[i++]; data.faqs[0].a = strings[i++];
  data.faqs[1].q = strings[i++]; data.faqs[1].a = strings[i++];
  data.faqs[2].q = strings[i++]; data.faqs[2].a = strings[i++];
  data.faqs[3].q = strings[i++]; data.faqs[3].a = strings[i++];
  data.faqs[4].q = strings[i++];
  return data;
};

// Map locale code to google translate code if needed
const langMap = {
  'zh-CN': 'zh-cn',
  'zh-TW': 'zh-tw'
};

const run = async () => {
  const tools = fs.readdirSync(OUT_DIR).filter(f => fs.statSync(path.join(OUT_DIR, f)).isDirectory());
  
  // Flatten tasks to: [ { tool, lang, path, langCode }, ... ]
  const tasks = [];
  for (const tool of tools) {
    const toolDir = path.join(OUT_DIR, tool);
    const files = fs.readdirSync(toolDir).filter(f => f.endsWith('.json') && f !== 'en.json');
    for (const file of files) {
      const lang = file.replace('.json', '');
      tasks.push({
        tool,
        lang,
        filePath: path.join(toolDir, file),
        langCode: langMap[lang] || lang
      });
    }
  }

  console.log(`Found ${tasks.length} files to translate.`);

  let successCount = 0;
  let cachedCount = 0;

  for (let t = 0; t < tasks.length; t++) {
    const task = tasks[t];
    const cacheKey = `${task.tool}_${task.lang}`;

    if (cache[cacheKey]) {
      cachedCount++;
      continue;
    }

    console.log(`[${t+1}/${tasks.length}] Translating ${task.tool} to ${task.lang}...`);
    
    try {
      const data = JSON.parse(fs.readFileSync(task.filePath, 'utf8'));
      const strings = extractStrings(data);
      
      const DELIM = ' ||| ';
      const joined = strings.join(DELIM);
      
      let res;
      let retries = 3;
      while(retries > 0) {
        try {
          res = await translate(joined, { to: task.langCode });
          break;
        } catch (err) {
          retries--;
          console.error(`    -> Error for ${task.langCode}. Retries left: ${retries}. Msg: ${err.message}`);
          if (retries === 0) throw err;
          await sleep(5000); // 5 sec backoff
        }
      }

      // Split the result
      let translatedArray = res.text.split(DELIM);
      
      // Fallback handling if delimiter was messed up by Google
      if (translatedArray.length !== strings.length) {
         // try case insensitive or stripped spaces
         translatedArray = res.text.split(/\|\|\|| \|\|\| | \|\|\|/g).map(s => s.trim());
      }

      if (translatedArray.length === strings.length) {
        const translatedData = injectStrings(data, translatedArray);
        fs.writeFileSync(task.filePath, JSON.stringify(translatedData, null, 2));
        cache[cacheKey] = true;
        saveCache();
        successCount++;
        
        // Anti-rate-limit delay
        await sleep(1000); 
      } else {
        console.error(`    -> Delimiter mismatch for ${task.tool}_${task.lang}. Expected ${strings.length}, got ${translatedArray.length}. Skipping.`);
      }
    } catch (err) {
      console.error(`    -> Failed to translate ${task.tool}_${task.lang}:`, err.message);
      // Wait longer on critical failure
      await sleep(10000);
    }
  }

  console.log(`\nTranslation complete! Processed: ${successCount}, Cached: ${cachedCount}, Total: ${tasks.length}`);
};

run().catch(console.error);
