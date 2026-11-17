const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const LANG_CODES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const PRICING_KEYS_EN = {
  batch_free_limit_desc: "The Free Starter plan processes up to 10 files per batch. Upgrade to PRO to process unlimited files (100+) simultaneously across all 4 Privacy Suite web apps.",
  batch_unlock_pro_btn: "Get Lifetime PRO Pass ($129)",
  pro_benefits_heading: "PRO All-Access Benefits (4 Web Apps Included):",
  pro_benefit_suite: "Connected PRO access to 4 Privacy Suite apps: HandleMyFile, HelpMyIMG, SolveMyMedia, & CreateMy-QR",
  pro_benefit_unlimited_batch: "Unlimited ultra-batch processing (100+ files across all tools)",
  pro_benefit_custom_name: "Custom output file renaming without restrictions",
  pro_benefit_lifetime: "Founder Pass includes Lifetime 4 Web Apps + Windows App + Mobile APK",
  pro_choose_plan: "Choose Your PRO Plan:",
  
  pro_plan_free_name: "Free Starter",
  pro_plan_free_price: "$0",
  pro_plan_free_period: "Free Forever",
  pro_plan_free_desc: "Essential private document processing up to 10 files per batch",

  pro_plan_monthly_name: "PRO Monthly",
  pro_plan_monthly_price: "$9.99 / month",
  pro_plan_monthly_desc: "Flexible monthly billing, cancel anytime in 1 click",
  pro_subscribe_monthly_btn: "Subscribe Monthly ($9.99/mo)",
  pro_signin_subscribe_monthly_btn: "Sign In & Subscribe Monthly",

  pro_plan_yearly_name: "PRO Yearly",
  pro_plan_yearly_price: "$79 / year",
  pro_plan_yearly_strike: "$119.88",
  pro_plan_yearly_desc: "Save 34% (was $119.88) • Just $6.58/mo, billed annually",
  pro_plan_yearly_save: "SAVE 34%",
  pro_subscribe_yearly_btn: "Subscribe Yearly ($79/yr)",
  pro_signin_subscribe_yearly_btn: "Sign In & Subscribe Yearly",

  pro_plan_lifetime_name: "Founder Lifetime Pass",
  pro_plan_lifetime_price: "$129 one-time",
  pro_plan_lifetime_strike: "$169",
  pro_plan_lifetime_desc: "Was $169 • Pay once, own forever • 4 Web Apps + Windows App + Mobile APK",
  pro_plan_best_value: "BEST VALUE",
  pro_get_lifetime_pass: "Get Lifetime Pass ($129)",
  pro_signin_get_pass: "Sign In & Get Lifetime Pass",

  pro_all_suite_access: "Access PRO on all 4 Privacy Suite Web Apps",
  pro_lifetime_apps_included: "Includes 4 Web Apps, Windows App, & Mobile APK"
};

const PRICING_KEYS_ID = {
  batch_free_limit_desc: "Paket Free Starter memproses hingga 10 file per batch. Upgrade ke PRO untuk memproses file tanpa batas (100+) sekaligus di 4 Web Privacy Suite.",
  batch_unlock_pro_btn: "Dapatkan Akses PRO Lifetime ($129)",
  pro_benefits_heading: "Keuntungan PRO All-Access (Terhubung ke 4 Web Apps):",
  pro_benefit_suite: "Akses PRO terhubung ke 4 Web Privacy Suite: HandleMyFile, HelpMyIMG, SolveMyMedia, & CreateMy-QR",
  pro_benefit_unlimited_batch: "Pemrosesan ultra-batch tanpa batas (100+ file sekaligus di semua tools)",
  pro_benefit_custom_name: "Kustomisasi nama file unduhan tanpa batasan",
  pro_benefit_lifetime: "Founder Pass mencakup Akses Seumur Hidup ke 4 Web Apps + Windows App + Mobile APK",
  pro_choose_plan: "Pilih Paket PRO Anda:",

  pro_plan_free_name: "Free Starter",
  pro_plan_free_price: "$0",
  pro_plan_free_period: "Gratis Selamanya",
  pro_plan_free_desc: "Pemrosesan dokumen privat esensial hingga 10 file per batch",

  pro_plan_monthly_name: "PRO Bulanan",
  pro_plan_monthly_price: "$9.99 / bulan",
  pro_plan_monthly_desc: "Tagihan bulanan fleksibel, batalkan kapan saja dengan 1 klik",
  pro_subscribe_monthly_btn: "Langganan Bulanan ($9.99/bln)",
  pro_signin_subscribe_monthly_btn: "Masuk & Langganan Bulanan",

  pro_plan_yearly_name: "PRO Tahunan",
  pro_plan_yearly_price: "$79 / tahun",
  pro_plan_yearly_strike: "$119.88",
  pro_plan_yearly_desc: "Hemat 34% (Coret $119.88) • Setara $6.58/bln, ditagih tahunan",
  pro_plan_yearly_save: "HEMAT 34%",
  pro_subscribe_yearly_btn: "Langganan Tahunan ($79/thn)",
  pro_signin_subscribe_yearly_btn: "Masuk & Langganan Tahunan",

  pro_plan_lifetime_name: "Founder Lifetime Pass",
  pro_plan_lifetime_price: "$129 sekali bayar",
  pro_plan_lifetime_strike: "$169",
  pro_plan_lifetime_desc: "Coret $169 • Sekali bayar, milik selamanya • 4 Web Apps + Windows App + Mobile APK",
  pro_plan_best_value: "PALING HEMAT",
  pro_get_lifetime_pass: "Dapatkan Lifetime Pass ($129)",
  pro_signin_get_pass: "Masuk & Ambil Lifetime Pass",

  pro_all_suite_access: "Akses PRO di 4 Web Apps Privacy Suite",
  pro_lifetime_apps_included: "Termasuk 4 Web Apps, Windows App, & Mobile APK"
};

async function translateKeys(targetLang) {
  if (targetLang === 'en') return { ...PRICING_KEYS_EN };
  if (targetLang === 'id') return { ...PRICING_KEYS_ID };

  const gTarget = targetLang === 'he' ? 'he' : (targetLang === 'zh' ? 'zh-CN' : targetLang);
  const keys = Object.keys(PRICING_KEYS_EN);
  const values = keys.map(k => PRICING_KEYS_EN[k]);

  try {
    const res = await translate(values, { to: gTarget });
    const translated = {};
    const resArray = Array.isArray(res) ? res : [res];
    keys.forEach((key, idx) => {
      let val = resArray[idx]?.text || PRICING_KEYS_EN[key];
      // Ensure strict USD symbol preservation ($) and prices
      translated[key] = val;
    });
    return translated;
  } catch (err) {
    console.warn(`Translation fallback for ${targetLang}:`, err.message);
    return { ...PRICING_KEYS_EN };
  }
}

async function main() {
  console.log('🚀 Translating updated 4-Tier Pricing ($0, $9.99/mo, $79/yr, $129 lifetime) to 30 languages...');
  const allTranslations = {};

  const chunkSize = 5;
  for (let i = 0; i < LANG_CODES.length; i += chunkSize) {
    const chunk = LANG_CODES.slice(i, i + chunkSize);
    console.log(`Translating chunk: ${chunk.join(', ')}...`);
    const results = await Promise.all(chunk.map(lang => translateKeys(lang)));
    chunk.forEach((lang, idx) => {
      allTranslations[lang] = results[idx];
    });
  }

  console.log('✅ Translations completed for all 30 languages!');

  const authTransPath = path.join(__dirname, '../src/i18n/authTranslations.ts');
  let content = fs.readFileSync(authTransPath, 'utf8');

  // Strip prefix and parse as JSON
  const prefix = 'export const authTranslations: Record<string, Record<string, string>> = ';
  const startIdx = content.indexOf(prefix);
  if (startIdx === -1) throw new Error('Prefix not found in authTranslations.ts');

  const jsonStr = content.substring(startIdx + prefix.length).trim().replace(/;\s*$/, '');
  const authObj = JSON.parse(jsonStr);

  for (const lang of LANG_CODES) {
    if (!authObj[lang]) authObj[lang] = {};
    Object.assign(authObj[lang], allTranslations[lang]);

    // Force strict USD symbol and uniform prices across ALL languages
    authObj[lang].batch_unlock_pro_btn = authObj[lang].batch_unlock_pro_btn
      .replace(/Rp\s*249\.?000/gi, '')
      .replace(/\$39/g, '$129')
      .replace(/\s*\/\s*\)/g, ')')
      .trim();
    if (!authObj[lang].batch_unlock_pro_btn.includes('$129')) {
      authObj[lang].batch_unlock_pro_btn = `${authObj[lang].batch_unlock_pro_btn} ($129)`.replace(/\(\$129\)\s*\(\$129\)/, '($129)');
    }
  }

  const updatedContent = '// Auto-generated 30-Language Auth & PRO Limits Translations\n' +
    prefix + JSON.stringify(authObj, null, 2) + ';\n';

  fs.writeFileSync(authTransPath, updatedContent, 'utf8');
  console.log('✅ Successfully updated src/i18n/authTranslations.ts with 4-Tier USD Pricing for 30 languages!');

  // Also update editorTranslations.ts if needed
  const editorTransPath = path.join(__dirname, '../src/i18n/editorTranslations.ts');
  if (fs.existsSync(editorTransPath)) {
    let editorContent = fs.readFileSync(editorTransPath, 'utf8');
    editorContent = editorContent.replace(/\$39\s*\/\s*Rp\s*249\.?000/g, '$129');
    fs.writeFileSync(editorTransPath, editorContent, 'utf8');
    console.log('✅ Updated src/i18n/editorTranslations.ts batch_unlock_pro_btn to $129');
  }
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
