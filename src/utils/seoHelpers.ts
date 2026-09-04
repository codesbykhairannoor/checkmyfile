export const SUFFIX_BY_LANG: Record<string, string> = {
  en: '100% free, private, and runs directly in your browser with zero server uploads.',
  id: '100% gratis, aman, dan diproses langsung di browser Anda tanpa upload server.',
  es: '100% gratis, privado y procesado directamente en su navegador sin subir archivos.',
  fr: '100% gratuit, privé et exécuté directement dans votre navigateur sans serveur.',
  de: '100% kostenlos, sicher und direkt im Browser ohne Server-Uploads verarbeitet.',
  it: '100% gratuito, privato ed eseguito direttamente nel browser senza caricamenti.',
  pt: '100% gratuito, privado e processado diretamente no navegador sem enviar arquivos.',
  ru: '100% бесплатно, безопасно и работает прямо в браузере без загрузки на сервер.',
  ja: '100%無料で安全、ファイルをサーバーに送信せず、すべてブラウザ内でローカルに安全かつプライベートに高速処理します。',
  ko: '100% 무료이며 안전합니다. 서버 업로드 없이 브라우저 내에서 직접 비공개로 빠르고 안전하게 처리됩니다.',
  zh: '100% 免费且安全，所有文档均在浏览器本地通过 WebAssembly 离线处理，无需上传到云端服务器，全面保障您的数据与隐私安全。',
  tr: '100% ücretsiz, güvenli ve sunucuya yükleme yapmadan doğrudan tarayıcınızda işlenir.',
  vi: '100% miễn phí, an toàn và xử lý trực tiếp trong trình duyệt mà không cần tải lên máy chủ.',
  pl: '100% darmowe, bezpieczne i przetwarzane bezpośrednio w przeglądarce bez wysyłania na serwer.',
  nl: '100% gratis, veilig en direct in uw browser verwerkt zonder uploads naar een server.',
  th: 'ฟรี 100% ปลอดภัย และประมวลผลโดยตรงในเบราว์เซอร์ของคุณโดยไม่ต้องอัปโหลดไปยังเซิร์ฟเวอร์',
  cs: '100% zdarma, bezpečné a zpracované přímo v prohlížeči bez nahrávání na server.',
  sv: '100% gratis, säkert och bearbetas direkt i din webbläsare utan serveruppladdningar.',
  ro: '100% gratuit, privat și procesat direct în browserul dvs. fără încărcare pe server.',
  el: '100% δωρεάν, ασφαλές και επεξεργάζεται απευθείας στο πρόγραμμα περιήγησης χωρίς μεταφόρτωση.',
  hu: '100% ingyenes, biztonságos és közvetlenül a böngészőben feldolgozott szerverfeltöltés nélkül.',
  da: '100% gratis, sikkert og behandlet direkte i din browser uden serveruploads.',
  fi: '100% ilmainen, turvallinen ja käsitellään suoraan selaimessasi ilman palvelimelle lataamista.',
  no: '100% gratis, sikkert og behandlet direkte i nettleseren din uten serveropplastinger.',
  sk: '100% zadarmo, bezpečné a spracované priamo v prehliadači bez nahrávania na server.',
  uk: '100% безкоштовно, безпечно та обробляється безпосередньо у браузері без завантаження на сервер.',
  ms: '100% percuma, selamat dan diproses terus dalam penyemak imbas anda tanpa muat naik ke pelayan.',
  ar: 'مجاني 100% وآمن ويتم معالجته مباشرة في متصفحك دون الحاجة إلى تحميل أي ملفات إلى الخادم.',
  he: '100% בחינם, מאובטח ומעובד ישירות בדפדפן שלך ללא העלאת קבצים לשרת כלل.',
  hi: '100% मुफ़्त, सुरक्षित और बिना किसी सर्वर अपलोड के सीधे आपके ब्राउज़र में संसाधित होता है।'
};

/**
 * Ensures title does not exceed 60 characters for optimal SERP display and Ahrefs compliance.
 */
export const cleanMetaTitle = (title: string): string => {
  let t = title.trim();
  if (t.length > 60) {
    if (t.includes(' | HandleMyFile')) {
      const stripped = t.replace(' | HandleMyFile', '').trim();
      if (stripped.length <= 60) return stripped;
      return stripped.slice(0, 57).trim() + '...';
    }
    return t.slice(0, 57).trim() + '...';
  }
  return t;
};

/**
 * Ensures meta description is between 100 and 155 characters.
 * Appends localized value proposition if too short (<100) and truncates cleanly if too long (>155).
 */
export const cleanMetaDescription = (desc: string, lang: string = 'en'): string => {
  let d = desc.trim();
  const suffix = SUFFIX_BY_LANG[lang] || SUFFIX_BY_LANG['en'];

  if (d.length < 100) {
    const separator = /[\.\!\?。！？]$/.test(d) ? ' ' : '. ';
    d = `${d}${separator}${suffix}`.trim();

    if (d.length < 100) {
      d = `${d} HandleMyFile.`.trim();
    }
  }

  if (d.length > 155) {
    const sliced = d.slice(0, 152);
    const lastSpace = sliced.lastIndexOf(' ');
    if (lastSpace > 110) {
      return sliced.slice(0, lastSpace).trim() + '...';
    }
    return sliced.trim() + '...';
  }
  return d;
};
