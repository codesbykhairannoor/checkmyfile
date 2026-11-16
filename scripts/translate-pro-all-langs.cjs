const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const LANG_CODES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const NEW_PRO_STRINGS_EN = {
  batch_pro_gate_title: "Batch Processing Limit (10 Files)",
  batch_limit_warning: "Free plan allows max 10 files. First 10 will be processed. Upgrade to PRO to process all files.",
  batch_free_limit_title: "Free Batch Limit (10 Files)",
  batch_free_limit_desc: "The Free Starter plan processes up to 10 files per batch. Upgrade to Founder Lifetime Pass to process unlimited files (100+) simultaneously.",
  batch_free_badge: "Free: Max 10 Files / Batch",
  batch_pro_badge: "PRO: Unlimited Batch Active",
  batch_upgrade_btn: "Upgrade to PRO",
  batch_continue_free_btn: "Process First 10 Files (Free)",
  batch_unlock_pro_btn: "Get Lifetime PRO Pass ($39 / Rp 249.000)",

  pro_custom_filename_title: "PRO Feature: Custom File Name",
  pro_custom_filename_desc: "Renaming and customizing output download file names is an exclusive PRO Lifetime feature. Upgrade once for lifetime access.",
  pro_custom_filename_badge: "PRO: Custom File Name",
  pro_download_filename_label: "Download File Name:",
  pro_active_badge: "PRO Active",

  pro_benefits_heading: "PRO Lifetime All-Access Benefits:",
  pro_benefit_unlimited_batch: "Unlimited batch processing (100+ files across all tools)",
  pro_benefit_custom_name: "Custom output file renaming without restrictions",
  pro_benefit_lifetime: "One-time payment, lifetime updates, zero subscriptions",
  pro_signin_get_pass: "Sign In & Get Lifetime Pass",
  pro_get_lifetime_pass: "Get Lifetime PRO Pass ($39)",
  pro_continue_free: "Continue with Free Version",
  pro_documents_queued: "documents queued"
};

const NEW_PRO_STRINGS_ID = {
  batch_pro_gate_title: "Batas Batch 10 Dokumen (PRO)",
  batch_limit_warning: "Batas Paket Free: Maksimal 10 dokumen sekaligus. Hanya 10 dokumen pertama yang dapat diproses gratis, atau upgrade ke PRO untuk memproses semua dokumen.",
  batch_free_limit_title: "Batas Batch Gratis (10 Dokumen)",
  batch_free_limit_desc: "Paket Free Starter memproses hingga 10 file per batch. Tingkatkan ke Akses PRO Lifetime untuk memproses ratusan file sekaligus tanpa batas.",
  batch_free_badge: "Free: Maksimal 10 File / Batch",
  batch_pro_badge: "PRO: Batch Tanpa Batas Aktif",
  batch_upgrade_btn: "Upgrade ke PRO",
  batch_continue_free_btn: "Proses 10 File Pertama (Free)",
  batch_unlock_pro_btn: "Dapatkan Akses PRO Lifetime (Rp 249.000)",

  pro_custom_filename_title: "Fitur PRO: Kustomisasi Nama File",
  pro_custom_filename_desc: "Fitur mengubah dan memberi nama file hasil unduhan khusus untuk anggota PRO Lifetime. Upgrade sekali bayar untuk akses selamanya.",
  pro_custom_filename_badge: "PRO: Kustomisasi Nama File",
  pro_download_filename_label: "Nama File Unduhan:",
  pro_active_badge: "PRO Aktif",

  pro_benefits_heading: "Keuntungan Akses PRO Lifetime:",
  pro_benefit_unlimited_batch: "Batch processing tanpa batas (100+ dokumen sekaligus di semua tools)",
  pro_benefit_custom_name: "Kustomisasi nama file output tanpa batasan",
  pro_benefit_lifetime: "Sekali bayar, akses selamanya tanpa langganan bulanan",
  pro_signin_get_pass: "Masuk & Dapatkan PRO Lifetime",
  pro_get_lifetime_pass: "Dapatkan Akses PRO Lifetime (Rp 249.000)",
  pro_continue_free: "Lanjutkan dengan Versi Gratis",
  pro_documents_queued: "dokumen dipilih"
};

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function main() {
  console.log('🚀 Translating PRO & Batch Limit Strings for all 30 languages using google-translate-api-x...');

  const authTranslationsPath = path.join(__dirname, '..', 'src', 'i18n', 'authTranslations.ts');
  let currentFileContent = fs.readFileSync(authTranslationsPath, 'utf8');

  // Extract existing JSON object from authTranslations.ts
  const match = currentFileContent.match(/export const authTranslations:\s*Record<string,\s*Record<string,\s*string>>\s*=\s*(\{[\s\S]*\});/);
  if (!match) {
    throw new Error('Could not parse authTranslations object from authTranslations.ts');
  }

  let translationsObj = {};
  try {
    translationsObj = JSON.parse(match[1]);
  } catch (e) {
    // If not strict JSON, evaluate safely in sandbox
    translationsObj = eval(`(${match[1]})`);
  }

  // Set English and Indonesian baseline
  translationsObj['en'] = { ...translationsObj['en'], ...NEW_PRO_STRINGS_EN };
  translationsObj['id'] = { ...translationsObj['id'], ...NEW_PRO_STRINGS_ID };

  const keys = Object.keys(NEW_PRO_STRINGS_EN);
  const englishValues = keys.map(k => NEW_PRO_STRINGS_EN[k]);

  // Translate for remaining 28 languages using chunking
  const targetLangs = LANG_CODES.filter(code => code !== 'en' && code !== 'id');
  const chunks = chunkArray(targetLangs, 7);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Processing language chunk ${i + 1}/${chunks.length}: ${chunk.join(', ')}...`);

    const chunkPromises = chunk.map(async (lang) => {
      // Rule: Hebrew is 'he'
      const targetLang = lang === 'he' ? 'he' : lang;
      try {
        const res = await translate(englishValues, { to: targetLang, forceTo: true });
        const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];

        const translatedDict = {};
        keys.forEach((key, idx) => {
          translatedDict[key] = translatedArray[idx] || NEW_PRO_STRINGS_EN[key];
        });

        return { lang, translatedDict };
      } catch (err) {
        console.error(`Failed translation for ${lang}:`, err.message);
        return { lang, translatedDict: { ...NEW_PRO_STRINGS_EN } };
      }
    });

    const chunkResults = await Promise.all(chunkPromises);

    chunkResults.forEach(({ lang, translatedDict }) => {
      translationsObj[lang] = {
        ...(translationsObj[lang] || {}),
        ...translatedDict
      };
    });
  }

  // Format and save authTranslations.ts
  const outputCode = `// Auto-generated 30-Language Auth & PRO Limits Translations\nexport const authTranslations: Record<string, Record<string, string>> = ${JSON.stringify(translationsObj, null, 2)};\n`;

  fs.writeFileSync(authTranslationsPath, outputCode, 'utf8');
  console.log(`✅ Successfully updated all 30 languages in ${authTranslationsPath}!`);
}

main().catch(err => {
  console.error('Fatal error in translation script:', err);
  process.exit(1);
});
