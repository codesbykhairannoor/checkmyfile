export const SUFFIX_BY_LANG: Record<string, string> = {
  en: '100% private, secure, and runs directly in your browser with zero server uploads.',
  id: '100% privat, aman, dan diproses langsung di browser Anda tanpa upload server.',
  es: '100% privado, seguro y procesado directamente en su navegador sin subir archivos.',
  fr: '100% privé, sécurisé et exécuté directement dans votre navigateur sans serveur.',
  de: '100% privat, sicher und direkt im Browser ohne Server-Uploads verarbeitet.',
  it: '100% privato, sicuro ed eseguito direttamente nel browser senza caricamenti.',
  pt: '100% privado, seguro e processado diretamente no navegador sem enviar arquivos.',
  ru: '100% конфиденциально, безопасно и работает прямо в браузере без загрузки на сервер.',
  ja: '100%プライベートで安全、ファイルをサーバーに送信せず、すべてブラウザ内でローカルに安全かつ高速処理します。',
  ko: '100% 비공개이며 안전합니다. 서버 업로드 없이 브라우저 내에서 직접 빠르고 안전하게 처리됩니다.',
  zh: '100% 本地隐私且安全，所有文档均在浏览器本地通过 WebAssembly 离线处理，无需上传到云端服务器。',
  tr: '%100 gizli, güvenli ve sunucuya yükleme yapmadan doğrudan tarayıcınızda işlenir.',
  vi: '100% riêng tư, an toàn và xử lý trực tiếp trong trình duyệt mà không cần tải lên máy chủ.',
  pl: '100% prywatne, bezpieczne i przetwarzane bezpośrednio w przeglądarce bez wysyłania na serwer.',
  nl: '100% privé, veilig en direct in uw browser verwerkt zonder uploads naar een server.',
  th: 'เป็นส่วนตัว 100% ปลอดภัย และประมวลผลโดยตรงในเบราว์เซอร์ของคุณโดยไม่ต้องอัปโหลดไปยังเซิร์ฟเวอร์',
  cs: '100% soukromé, bezpečné a zpracované přímo v prohlížeči bez nahrávání na server.',
  sv: '100% privat, säkert och bearbetas direkt i din webbläsare utan serveruppladdningar.',
  ro: '100% privat, securizat și procesat direct în browserul dvs. fără încărcare pe server.',
  el: '100% ιδιωτικό, ασφαλές και επεξεργάζεται απευθείας στο πρόγραμμα περιήγησης χωρίς μεταφόρτωση.',
  hu: '100% privát, biztonságos és közvetlenül a böngészőben feldolgozott szerverfeltöltés nélkül.',
  da: '100% privat, sikkert og behandlet direkte i din browser uden serveruploads.',
  fi: '100% yksityinen, turvallinen ja käsitellään suoraan selaimessasi ilman palvelimelle lataamista.',
  no: '100% privat, sikkert og behandlet direkte i nettleseren din uten serveropplastinger.',
  sk: '100% súkromné, bezpečné a spracované priamo v prehliadači bez nahrávania na server.',
  uk: '100% приватно, безпечно та обробляється безпосередньо у браузері без завантаження на сервер.',
  ms: '100% privasi, selamat dan diproses terus dalam penyemak imbas anda tanpa muat naik ke pelayan.',
  ar: 'خصوصية 100% وآمن ويتم معالجته مباشرة في متصفحك دون الحاجة إلى تحميل أي ملفات إلى الخادم.',
  he: '100% פרטי, מאובטח ומעובד ישירות בדפדפן שלך ללא העלאת קבצים לשרת כלל.',
  hi: '100% निजी, सुरक्षित और बिना किसी सर्वर अपलोड के सीधे आपके ब्राउज़र में संसाधित होता है।'
};

/**
 * Ensures title fits cleanly within SERP display limits (~60 chars) without mid-word "..." truncation.
 */
export const cleanMetaTitle = (title: string): string => {
  let t = title.replace(/\s+/g, ' ').trim();
  if (t.length <= 60) return t;

  if (t.includes(' | HandleMyFile')) {
    t = t.replace(' | HandleMyFile', '').trim();
    if (t.length <= 60) return t;
  }

  // Try splitting on common subtitle separators and keeping the primary keyword phrase
  for (const sep of [' — ', ' – ', ' - ', ': ', ' | ']) {
    if (t.includes(sep)) {
      const primary = t.split(sep)[0].trim();
      if (primary.length >= 18 && primary.length <= 60) {
        return primary;
      }
    }
  }

  // Word-boundary trim without injecting "..."
  const sliced = t.slice(0, 60);
  const lastSpace = sliced.lastIndexOf(' ');
  if (lastSpace >= 25) {
    return sliced.slice(0, lastSpace).replace(/[\s\-–—:,|]+$/, '').trim();
  }
  return sliced.trim();
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
