const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const LANG_CODES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const NEW_MONTHLY_KEYS_EN = {
  pro_choose_plan: "Choose Your PRO Plan:",
  pro_plan_monthly_name: "PRO Monthly",
  pro_plan_monthly_price: "$4.99 / month",
  pro_plan_monthly_desc: "Flexible monthly billing, cancel anytime in 1 click",
  pro_plan_lifetime_name: "Founder Lifetime Pass",
  pro_plan_lifetime_price: "$39 one-time",
  pro_plan_lifetime_desc: "Pay once, lifetime updates & zero monthly subscriptions",
  pro_plan_best_value: "BEST VALUE",
  pro_subscribe_monthly_btn: "Subscribe Monthly ($4.99/mo)",
  pro_signin_subscribe_monthly_btn: "Sign In & Subscribe Monthly"
};

const NEW_MONTHLY_KEYS_ID = {
  pro_choose_plan: "Pilih Paket PRO Anda:",
  pro_plan_monthly_name: "PRO Bulanan",
  pro_plan_monthly_price: "Rp 49.000 / bulan",
  pro_plan_monthly_desc: "Langganan bulanan fleksibel, batalkan kapan saja dengan 1 klik",
  pro_plan_lifetime_name: "Founder Lifetime Pass",
  pro_plan_lifetime_price: "Rp 249.000 sekali bayar",
  pro_plan_lifetime_desc: "Sekali bayar, akses selamanya tanpa langganan bulanan",
  pro_plan_best_value: "PALING HEMAT",
  pro_subscribe_monthly_btn: "Langganan PRO Bulanan (Rp 49.000/bln)",
  pro_signin_subscribe_monthly_btn: "Masuk & Langganan Bulanan"
};

async function translateKeys(targetLang) {
  if (targetLang === 'en') return { ...NEW_MONTHLY_KEYS_EN };
  if (targetLang === 'id') return { ...NEW_MONTHLY_KEYS_ID };

  const gTarget = targetLang === 'he' ? 'he' : (targetLang === 'zh' ? 'zh-CN' : targetLang);
  const keys = Object.keys(NEW_MONTHLY_KEYS_EN);
  const values = keys.map(k => NEW_MONTHLY_KEYS_EN[k]);

  try {
    const res = await translate(values, { to: gTarget });
    const translated = {};
    const resArray = Array.isArray(res) ? res : [res];
    keys.forEach((key, idx) => {
      translated[key] = resArray[idx]?.text || NEW_MONTHLY_KEYS_EN[key];
    });
    return translated;
  } catch (err) {
    console.warn(`Translation fallback for ${targetLang}:`, err.message);
    return { ...NEW_MONTHLY_KEYS_EN };
  }
}

async function main() {
  console.log('🚀 Translating Monthly PRO keys to 30 languages...');
  const allMonthly = {};

  const chunkSize = 5;
  for (let i = 0; i < LANG_CODES.length; i += chunkSize) {
    const chunk = LANG_CODES.slice(i, i + chunkSize);
    console.log(`Translating chunk: ${chunk.join(', ')}...`);
    const results = await Promise.all(chunk.map(lang => translateKeys(lang)));
    chunk.forEach((lang, idx) => {
      allMonthly[lang] = results[idx];
    });
  }

  console.log('✅ Translations completed for all 30 languages!');

  const authTransPath = path.join(__dirname, '../src/i18n/authTranslations.ts');
  let content = fs.readFileSync(authTransPath, 'utf8');

  // Strip prefix and parse as JSON
  const prefix = 'export const authTranslations: Record<string, Record<string, string>> = ';
  const startIdx = content.indexOf(prefix);
  if (startIdx === -1) throw new Error('Prefix not found');

  const jsonStr = content.substring(startIdx + prefix.length).trim().replace(/;\s*$/, '');
  const authObj = JSON.parse(jsonStr);

  for (const lang of LANG_CODES) {
    if (!authObj[lang]) authObj[lang] = {};
    Object.assign(authObj[lang], allMonthly[lang]);
  }

  const updatedContent = '// Auto-generated 30-Language Auth & PRO Limits Translations\n' +
    prefix + JSON.stringify(authObj, null, 2) + ';\n';

  fs.writeFileSync(authTransPath, updatedContent, 'utf8');
  console.log('✅ Successfully updated src/i18n/authTranslations.ts with Monthly PRO keys!');
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
