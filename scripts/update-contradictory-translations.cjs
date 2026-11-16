const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const translate = require('google-translate-api-x');

// Target 30 languages
const LANG_CODES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'iw', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

// Clean, realistic strings that avoid self-contradiction ("jilat ludah")
const STRINGS_EN = {
  pagePricingHero: "Zero Subscriptions. Fair & Private.",
  pagePricingHeroSub: "Enterprise-grade document tools usually cost $20/month. We believe privacy and utility should be accessible to everyone. HandleMyFile offers a generous free tier and an affordable lifetime pass.",
  pagePricingBadge: "Fair & Transparent Pricing",
  pagePricingSec4Desc: "To keep HandleMyFile sustainable, we offer a generous Free Starter plan alongside an optional Founder Lifetime Pass. Your privacy is our top priority: all files are processed locally on your device in browser RAM with zero server uploads.",
  pricingHmfItem2: "Standard batch up to 10 files",
  pricingHmfItem3: "No account required for free tools",
  compareTr5Col3: "Free Starter + Lifetime Pass",
  compareTr6Col3: "Not Required for Free Tools",
  pageAboutSub: "We believe private document tools should be accessible to everyone. HandleMyFile provides free client-side processing alongside an optional Lifetime Pass.",
  pageAboutSec3Desc: "HandleMyFile provides a permanent free tier with zero server uploads, and an optional Lifetime Pass for unlimited batch needs.",
  pageAboutCard3Desc: "We translated our entire platform into 30 languages. Zero monthly subscriptions, fair pricing, and world-class tools available globally.",
  pagePrivacyCard3Desc: "No account or email registration required to use our free document tools. You remain completely anonymous with zero server uploads.",
  pagePrivacySec1Desc: "We do not store your documents. We do not require email registrations to use our free tools. Every single bit of your document data remains exclusively on your physical device in browser RAM.",
  pageTosAgreementDesc: "By accessing and using HandleMyFile, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service. Our platform provides a generous free tier alongside an optional PRO Lifetime Pass for personal and commercial use.",
  pageUseCasesSec4Desc: "Students shouldn't have to pay $20/month just to merge their group project assignments or compress a presentation to fit the university portal's 5MB upload limit. HandleMyFile provides free, private document tools with zero server uploads, making it easy to finish schoolwork safely."
};

const STRINGS_ID = {
  pagePricingHero: "Nol Langganan Bulanan. Adil & Privat.",
  pagePricingHeroSub: "Alat dokumen tingkat enterprise biasanya berbiaya $20/bulan. Kami percaya privasi dan utilitas harus dapat diakses oleh semua orang. HandleMyFile menyediakan paket gratis yang bermanfaat dan pass lifetime yang terjangkau.",
  pagePricingBadge: "Harga Adil & Transparan",
  pagePricingSec4Desc: "Agar HandleMyFile tetap berkelanjutan, kami menyediakan paket Free Starter dan opsi Founder Lifetime Pass. Privasi Anda adalah prioritas utama: seluruh file diproses secara lokal di RAM browser perangkat Anda tanpa unggah ke server.",
  pricingHmfItem2: "Batch gratis hingga 10 file",
  pricingHmfItem3: "Tanpa akun untuk fitur gratis",
  compareTr5Col3: "Free Starter + Lifetime Pass",
  compareTr6Col3: "Tidak Perlu Akun untuk Alat Gratis",
  pageAboutSub: "Kami percaya utilitas dokumen yang privat harus dapat diakses oleh semua orang. HandleMyFile menyediakan pemrosesan sisi klien gratis dan opsi Lifetime Pass.",
  pageAboutSec3Desc: "HandleMyFile menyediakan paket gratis permanen tanpa unggah ke server, dan opsi Lifetime Pass untuk kebutuhan batch tanpa batas.",
  pageAboutCard3Desc: "Kami menerjemahkan platform kami ke dalam 30 bahasa. Nol langganan bulanan, harga adil, dan utilitas kelas dunia yang dapat diakses secara global.",
  pagePrivacyCard3Desc: "Tidak diperlukan pendaftaran akun atau email untuk menggunakan alat gratis kami. Anda memproses dokumen secara anonim tanpa unggahan ke server.",
  pagePrivacySec1Desc: "Kami tidak menyimpan dokumen Anda. Kami tidak mewajibkan registrasi email untuk menggunakan alat gratis kami. Seluruh data dokumen Anda tetap berada di perangkat fisik Anda di RAM browser.",
  pageTosAgreementDesc: "Dengan mengakses dan menggunakan HandleMyFile, Anda menyetujui Ketentuan Layanan ini. Platform kami menyediakan paket gratis yang bermanfaat serta opsi PRO Lifetime Pass untuk penggunaan pribadi dan komersial.",
  pageUseCasesSec4Desc: "Pelajar tidak perlu membayar $20/bulan hanya untuk menggabungkan tugas kelompok atau mengompres presentasi. HandleMyFile menyediakan alat dokumen gratis dan privat tanpa unggahan ke server, memudahkan penyelesaian tugas secara aman."
};

async function translateStrings(targetLang) {
  if (targetLang === 'en') return { ...STRINGS_EN };
  if (targetLang === 'id') return { ...STRINGS_ID };

  // Google Translate ISO code normalization
  const gTarget = targetLang === 'iw' ? 'he' : (targetLang === 'zh' ? 'zh-CN' : targetLang);

  const keys = Object.keys(STRINGS_EN);
  const values = keys.map(k => STRINGS_EN[k]);

  try {
    const res = await translate(values, { to: gTarget });
    const translated = {};
    const resArray = Array.isArray(res) ? res : [res];
    keys.forEach((key, idx) => {
      translated[key] = resArray[idx]?.text || STRINGS_EN[key];
    });
    return translated;
  } catch (err) {
    console.warn(`Translation fallback for ${targetLang} due to error:`, err.message);
    return { ...STRINGS_EN };
  }
}

async function main() {
  console.log('🚀 Starting translation of 15 adjusted keys into 30 languages...');
  const allTranslations = {};

  // Batch in chunks of 5 languages
  const chunkSize = 5;
  for (let i = 0; i < LANG_CODES.length; i += chunkSize) {
    const chunk = LANG_CODES.slice(i, i + chunkSize);
    console.log(`Translating chunk: ${chunk.join(', ')}...`);
    const results = await Promise.all(chunk.map(lang => translateStrings(lang)));
    chunk.forEach((lang, idx) => {
      allTranslations[lang] = results[idx];
    });
  }

  console.log('✅ Translations ready for all 30 languages!');

  // Now apply updates to src/i18n/translations.ts using TypeScript AST
  const translationsFilePath = path.join(__dirname, '../src/i18n/translations.ts');
  const src = fs.readFileSync(translationsFilePath, 'utf8');
  const sourceFile = ts.createSourceFile('translations.ts', src, ts.ScriptTarget.Latest, true);

  const replacements = [];

  let baseDictNode = null;
  const langDictNodes = {};

  ts.forEachChild(sourceFile, node => {
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach(decl => {
        if (decl.name.text === 'baseDict' && decl.initializer && ts.isObjectLiteralExpression(decl.initializer)) {
          baseDictNode = decl.initializer;
        }
        if (decl.name.text === 'UI_TRANSLATIONS' && decl.initializer && ts.isObjectLiteralExpression(decl.initializer)) {
          decl.initializer.properties.forEach(prop => {
            if (ts.isPropertyAssignment(prop)) {
              const lang = prop.name.text || prop.name.escapedText;
              if (prop.initializer && ts.isObjectLiteralExpression(prop.initializer)) {
                langDictNodes[lang] = prop.initializer;
              }
            }
          });
        }
      });
    }
  });

  // 1. Replacements for baseDict (English)
  if (baseDictNode) {
    baseDictNode.properties.forEach(p => {
      if (ts.isPropertyAssignment(p)) {
        const k = p.name.text || p.name.escapedText;
        if (STRINGS_EN[k] !== undefined) {
          replacements.push({
            start: p.initializer.getStart(sourceFile),
            end: p.initializer.getEnd(),
            text: JSON.stringify(STRINGS_EN[k])
          });
        }
      }
    });
  }

  // 2. Replacements for each language in UI_TRANSLATIONS
  for (const [lang, objNode] of Object.entries(langDictNodes)) {
    const dict = allTranslations[lang] || STRINGS_EN;
    objNode.properties.forEach(p => {
      if (ts.isPropertyAssignment(p)) {
        const k = p.name.text || p.name.escapedText;
        if (dict[k] !== undefined) {
          replacements.push({
            start: p.initializer.getStart(sourceFile),
            end: p.initializer.getEnd(),
            text: JSON.stringify(dict[k])
          });
        }
      }
    });
  }

  // Sort replacements descending by start position so offsets don't change
  replacements.sort((a, b) => b.start - a.start);

  let updatedSrc = src;
  for (const r of replacements) {
    updatedSrc = updatedSrc.substring(0, r.start) + r.text + updatedSrc.substring(r.end);
  }

  fs.writeFileSync(translationsFilePath, updatedSrc, 'utf8');
  console.log(`✅ Updated ${replacements.length} property values across all 30 languages in translations.ts!`);

  // Also update catalogTranslations.ts
  const catalogPath = path.join(__dirname, '../src/i18n/catalogTranslations.ts');
  let catContent = fs.readFileSync(catalogPath, 'utf8');
  catContent = catContent.replace(
    'Merge and combine multiple PDF files into one single document. Instant local processing, 100% private, no limit.',
    'Merge and combine multiple PDF files into one single document. Instant local processing, 100% private in browser memory.'
  );
  catContent = catContent.replace(
    'Gabungkan beberapa file PDF menjadi satu dokumen menggunakan WebAssembly sisi klien murni. Tidak ada unggahan file, privasi terjamin 100%, tanpa batas.',
    'Gabungkan beberapa file PDF menjadi satu dokumen menggunakan WebAssembly sisi klien murni. Tidak ada unggahan file, privasi terjamin 100%, cepat dan aman.'
  );
  fs.writeFileSync(catalogPath, catContent, 'utf8');
  console.log('✅ Updated catalogTranslations.ts!');
}

main().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
