const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const OUT_DIR = path.join(__dirname, 'src', 'locales', 'seo', 'merge-pdf');
const EN_PATH = path.join(OUT_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

// Helper to delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const langMap = {
  'zh-CN': 'zh-cn',
  'zh-TW': 'zh-tw'
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
    data.faqs[4].q, data.faqs[4].a,
    // NEW FIELDS
    data.sections[1].badgeText || 'Quick Guide',
    data.sections[2].badgeText || 'Local Processing',
    data.sections[3].badgeText || 'Security First',
    data.sections[4].badgeText || 'Lightning Fast',
    data.faqTitle || 'Frequently Asked Questions',
    data.supportCenter || 'Support Center',
    (data.badges && data.badges[0]) || 'Zero server latency',
    (data.badges && data.badges[1]) || 'No upload bandwidth',
    (data.badges && data.badges[2]) || 'Instant processing'
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
  data.faqs[4].q = strings[i++]; data.faqs[4].a = strings[i++];
  // NEW FIELDS
  data.sections[1].badgeText = strings[i++];
  data.sections[2].badgeText = strings[i++];
  data.sections[3].badgeText = strings[i++];
  data.sections[4].badgeText = strings[i++];
  data.faqTitle = strings[i++];
  data.supportCenter = strings[i++];
  data.badges = [strings[i++], strings[i++], strings[i++]];
  return data;
};

const run = async () => {
  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.json') && f !== 'en.json');
  
  console.log(`Found ${files.length} languages to fully translate for merge-pdf.`);

  const englishStrings = extractStrings(enData);
  const DELIM = ' ||| ';
  const joined = englishStrings.join(DELIM);

  for (let t = 0; t < files.length; t++) {
    const file = files[t];
    const lang = file.replace('.json', '');
    const langCode = langMap[lang] || lang;
    const filePath = path.join(OUT_DIR, file);

    console.log(`[${t+1}/${files.length}] Translating to ${langCode}...`);
    
    let res;
    let retries = 3;
    while(retries > 0) {
      try {
        res = await translate(joined, { to: langCode });
        break;
      } catch (err) {
        retries--;
        console.error(`    -> Error for ${langCode}. Retries left: ${retries}. Msg: ${err.message}`);
        if (retries === 0) throw err;
        await sleep(5000); 
      }
    }

    let translatedArray = res.text.split(DELIM);
    
    if (translatedArray.length !== englishStrings.length) {
       translatedArray = res.text.split(/\|\|\|| \|\|\| | \|\|\|/g).map(s => s.trim());
    }

    if (translatedArray.length === englishStrings.length) {
      const translatedData = injectStrings(JSON.parse(JSON.stringify(enData)), translatedArray);
      fs.writeFileSync(filePath, JSON.stringify(translatedData, null, 2));
      console.log(`    -> Success`);
      await sleep(1000); 
    } else {
      console.error(`    -> Delimiter mismatch. Expected ${englishStrings.length}, got ${translatedArray.length}. Skipping.`);
    }
  }

  console.log(`\nFull translation complete!`);
};

run().catch(console.error);
