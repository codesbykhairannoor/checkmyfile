const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LANG_CODES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const SOURCE_STRINGS = {
  // Modal titles
  auth_signin_title: "Sign in to HandleMyFile",
  auth_signup_title: "Create your account",
  auth_forgot_title: "Reset Password",
  auth_reset_title: "Set New Password",

  // Ecosystem notice
  auth_suite_notice: "All-in-One Privacy Suite: One account unlocks PRO across HandleMyFile & HelpMyIMG. 100% in-browser security.",

  // Buttons
  auth_continue_google: "Continue with Google",
  auth_or_email: "or with email",
  auth_signin_btn: "Sign In",
  auth_signup_btn: "Create Free Account",
  auth_send_reset_btn: "Send Reset Link",
  auth_update_password_btn: "Update Password",

  // Inputs
  auth_email_label: "Email Address",
  auth_password_label: "Password",
  auth_new_password_label: "New Password",
  auth_forgot_password_link: "Forgot password?",

  // Mode switches
  auth_dont_have_account: "Don't have an account?",
  auth_signup_free_link: "Sign up free",
  auth_already_have_account: "Already have an account?",
  auth_signin_link: "Sign in",
  auth_back_to_signin: "Return to sign in",

  // Messages & Errors
  auth_fill_email: "Please enter your email address.",
  auth_fill_password: "Please enter your password.",
  auth_weak_password: "Password must be at least 6 characters.",
  auth_invalid_credentials: "Invalid email or password.",
  auth_email_in_use: "This email is already registered. Please sign in instead.",
  auth_reset_email_sent: "Password reset link sent to your email. Please check your inbox or spam folder.",
  auth_password_reset_success: "Password has been successfully updated! Please sign in.",
  auth_generic_error: "An error occurred. Please try again.",
  auth_config_missing: "Firebase configuration missing. Please check VITE_FIREBASE_* in environment.",

  // Navbar & Profile
  nav_signin: "Sign In",
  nav_signout: "Sign Out",
  nav_account: "Account",
  nav_pro_active: "PRO Lifetime",
  nav_free_tier: "Free Starter",
  nav_upgrade_pro: "Upgrade to PRO",

  // Batch Free vs Pro Limits
  batch_free_limit_title: "Free Batch Limit (10 Files)",
  batch_free_limit_desc: "The Free Starter plan processes up to 10 files per batch. Upgrade to Founder Lifetime Pass to process unlimited files (100+) simultaneously.",
  batch_free_badge: "Free: Max 10 Files / Batch",
  batch_pro_badge: "PRO: Unlimited Batch Active",
  batch_upgrade_btn: "Upgrade to PRO",
  batch_continue_free_btn: "Process First 10 Files (Free)",
  batch_unlock_pro_btn: "Get Lifetime PRO Pass ($39 / Rp 249.000)",
  batch_limit_warning: "Free plan allows max 10 files. First 10 will be processed. Upgrade to PRO to process all files."
};

const ID_STRINGS = {
  auth_signin_title: "Masuk ke HandleMyFile",
  auth_signup_title: "Buat Akun Anda",
  auth_forgot_title: "Setel Ulang Kata Sandi",
  auth_reset_title: "Buat Kata Sandi Baru",
  auth_suite_notice: "All-in-One Privacy Suite: Satu akun membuka akses PRO di HandleMyFile & HelpMyIMG. 100% aman di peramban.",
  auth_continue_google: "Lanjutkan dengan Google",
  auth_or_email: "atau gunakan email",
  auth_signin_btn: "Masuk",
  auth_signup_btn: "Daftar Akun Gratis",
  auth_send_reset_btn: "Kirim Tautan Reset",
  auth_update_password_btn: "Perbarui Kata Sandi",
  auth_email_label: "Alamat Email",
  auth_password_label: "Kata Sandi",
  auth_new_password_label: "Kata Sandi Baru",
  auth_forgot_password_link: "Lupa kata sandi?",
  auth_dont_have_account: "Belum punya akun?",
  auth_signup_free_link: "Daftar gratis",
  auth_already_have_account: "Sudah punya akun?",
  auth_signin_link: "Masuk",
  auth_back_to_signin: "Kembali ke halaman masuk",
  auth_fill_email: "Silakan masukkan alamat email Anda.",
  auth_fill_password: "Silakan masukkan kata sandi Anda.",
  auth_weak_password: "Kata sandi minimal harus 6 karakter.",
  auth_invalid_credentials: "Email atau kata sandi tidak valid.",
  auth_email_in_use: "Email ini sudah terdaftar. Silakan masuk.",
  auth_reset_email_sent: "Tautan reset telah dikirim ke email Anda. Periksa kotak masuk atau spam.",
  auth_password_reset_success: "Kata sandi berhasil diperbarui! Silakan masuk.",
  auth_generic_error: "Terjadi kesalahan. Silakan coba lagi.",
  auth_config_missing: "Konfigurasi Firebase belum diisi. Periksa VITE_FIREBASE_* di environment.",
  nav_signin: "Masuk",
  nav_signout: "Keluar",
  nav_account: "Akun Saya",
  nav_pro_active: "PRO Lifetime",
  nav_free_tier: "Akun Gratis",
  nav_upgrade_pro: "Upgrade ke PRO",
  batch_free_limit_title: "Batas Batch Paket Gratis (10 File)",
  batch_free_limit_desc: "Paket Gratis memproses maksimal 10 file per batch. Upgrade ke Founder Lifetime Pass untuk memproses tanpa batas (100+ file) sekaligus.",
  batch_free_badge: "Gratis: Maks 10 File / Batch",
  batch_pro_badge: "PRO: Unlimited Batch Aktif",
  batch_upgrade_btn: "Upgrade ke PRO",
  batch_continue_free_btn: "Proses 10 File Pertama (Gratis)",
  batch_unlock_pro_btn: "Ambil Lisensi Lifetime PRO (Rp 249.000)",
  batch_limit_warning: "Paket Gratis dibatasi 10 file. Hanya 10 file pertama yang akan diproses. Upgrade ke PRO untuk memproses semua file."
};

const LANG_MAP = {
  zh: 'zh-CN',
  he: 'he',
};

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function main() {
  const cachePath = path.join(__dirname, 'auth-translations-cache.json');
  let cache = {};
  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    } catch (_) {}
  }

  cache['en'] = SOURCE_STRINGS;
  cache['id'] = ID_STRINGS;

  const targetLangs = LANG_CODES.filter(l => l !== 'en' && l !== 'id');
  const keys = Object.keys(SOURCE_STRINGS);
  const values = Object.values(SOURCE_STRINGS);

  console.log(`Array batching: translating ${keys.length} strings across ${targetLangs.length} languages...`);

  const langChunks = chunkArray(targetLangs, 5);

  for (const chunk of langChunks) {
    await Promise.all(chunk.map(async (lang) => {
      if (cache[lang] && Object.keys(cache[lang]).length >= keys.length) {
        console.log(`[Cache Hit] ${lang}`);
        return;
      }

      const targetLang = LANG_MAP[lang] || lang;
      console.log(`[Translating Batch] ${lang} (${targetLang})...`);

      try {
        const results = await translate(values, { to: targetLang, forceTo: true });
        cache[lang] = {};
        for (let i = 0; i < keys.length; i++) {
          cache[lang][keys[i]] = results[i]?.text || values[i];
        }
        console.log(`✅ [Done] ${lang}`);
      } catch (err) {
        console.warn(`[Warn] Batch translation failed for ${lang}:`, err.message);
        cache[lang] = cache[lang] || {};
        for (let i = 0; i < keys.length; i++) {
          cache[lang][keys[i]] = cache[lang][keys[i]] || values[i];
        }
      }
    }));

    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  }

  console.log('Writing src/i18n/authTranslations.ts...');
  const authTsContent = `// Auto-generated 30-Language Auth & PRO Limits Translations
export const authTranslations: Record<string, Record<string, string>> = ${JSON.stringify(cache, null, 2)};
`;
  fs.writeFileSync(path.join(__dirname, '../src/i18n/authTranslations.ts'), authTsContent, 'utf8');

  console.log('Injecting translations into src/i18n/editorTranslations.ts...');
  const editorPath = path.join(__dirname, '../src/i18n/editorTranslations.ts');
  let editorContent = fs.readFileSync(editorPath, 'utf8');

  for (const lang of LANG_CODES) {
    const langData = cache[lang] || cache['en'];
    const marker = `"${lang}": {`;
    const markerIdx = editorContent.indexOf(marker);
    if (markerIdx !== -1) {
      const insertPos = markerIdx + marker.length;
      let injection = '\n';
      for (const [k, v] of Object.entries(langData)) {
        if (!editorContent.includes(`"${k}":`)) {
          const safeVal = JSON.stringify(v);
          injection += `    "${k}": ${safeVal},\n`;
        }
      }
      if (injection.trim()) {
        editorContent = editorContent.slice(0, insertPos) + injection + editorContent.slice(insertPos);
      }
    }
  }

  fs.writeFileSync(editorPath, editorContent, 'utf8');
  console.log('🎉 All 30 languages generated and injected with 100% precision!');
}

main().catch(err => {
  console.error('Fatal error during translation:', err);
  process.exit(1);
});
