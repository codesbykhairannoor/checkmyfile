const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../i18n/editorTranslations.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newTranslations = {
  watermark_position: {
    en: 'Watermark Position', id: 'Posisi Watermark', es: 'Posición de marca de agua', fr: 'Position du filigrane',
    de: 'Wasserzeichen-Position', ja: '透かしの位置', pt: 'Posição da marca d\'água', ru: 'Положение водяного знака',
    zh: '水印位置', ar: 'موضع العلامة المائية', hi: 'वॉटरमार्क स्थिति', it: 'Posizione filigrana',
    ko: '워터마크 위치', nl: 'Watermerkpositie', tr: 'Filigran Konumu', pl: 'Pozycja znaku wodnego',
    vi: 'Vị trí hình mờ', th: 'ตำแหน่งลายน้ำ', sv: 'Vattenstämpelns position', cs: 'Pozice vodoznaku',
    da: 'Vandmærkeposition', el: 'Θέση υδατογραφήματος', fi: 'Vesileiman sijainti', he: 'מיקום סימן מים',
    hu: 'Vízjel pozíciója', no: 'Vannmerkeposisjon', ro: 'Poziția filigranului', sk: 'Pozícia vodotlače',
    uk: 'Положення водяного знака', ms: 'Kedudukan Tera Air'
  },
  watermark_repeat: {
    en: 'Repeat Watermark (Tile Pattern)', id: 'Ulangi Watermark (Pola Mosaik/Kisi)', es: 'Repetir marca de agua (mosaico)', fr: 'Répéter le filigrane (mosaïque)',
    de: 'Wasserzeichen wiederholen (Kachelmuster)', ja: '透かしを繰り返す（タイルパターン）', pt: 'Repetir marca d\'água (padrão em mosaico)', ru: 'Повторять водяной знак (мозаика)',
    zh: '平铺重复水印（网格模式）', ar: 'تكرار العلامة المائية (نمط مربعات)', hi: 'वॉटरमार्क दोहराएं (टाइल पैटर्न)', it: 'Ripeti filigrana (motivo a mosaico)',
    ko: '워터마크 반복 (타일 패턴)', nl: 'Watermerk herhalen (tegelpatroon)', tr: 'Filigranı Yinele (Döşeme Deseni)', pl: 'Powtórz znak wodny (wzór kafelkowy)',
    vi: 'Lặp lại hình mờ (mô hình xếp gạch)', th: 'ทำซ้ำลายน้ำ (รูปแบบตาราง)', sv: 'Upprepa vattenstämpel (kakelmönster)', cs: 'Opakovat vodoznak (dlaždicový vzor)',
    da: 'Gentag vandmærke (flisemønster)', el: 'Επανάληψη υδατογραφήματος (πλακίδια)', fi: 'Toista vesileima (laattakuvio)', he: 'חזור על סימן מים (תבנית אריחים)',
    hu: 'Vízjel ismétlése (mozaik minta)', no: 'Gjenta vannmerke (flismønster)', ro: 'Repetă filigranul (model mozaic)', sk: 'Opakovať vodotlač (dlaždicový vzor)',
    uk: 'Повторювати водяний знак (плитка)', ms: 'Ulang Tera Air (Corak Mozek)'
  },
  watermark_repeat_desc: {
    en: 'Tile the watermark diagonally across the entire page', id: 'Ulangi watermark secara diagonal di seluruh halaman', es: 'Cubre toda la página con marcas de agua diagonales en mosaico', fr: 'Répète le filigrane en diagonale sur toute la page',
    de: 'Kachelt das Wasserzeichen diagonal über die gesamte Seite', ja: 'ページ全体に斜めに透かしを敷き詰めます', pt: 'Distribui a marca d\'água em mosaico diagonal por toda a página', ru: 'Замостить водяной знак по диагонали по всей странице',
    zh: '在整个页面上以对角线网格平铺水印', ar: 'تكرار العلامة المائية بشكل مائل على كامل الصفحة', hi: 'पूरे पृष्ठ पर तिरछे वॉटरमार्क टाइल करें', it: 'Disponi la filigrana a mosaico diagonale su tutta la pagina',
    ko: '페이지 전체에 대각선 방향으로 워터마크를 타일링합니다', nl: 'Plaats het watermerk diagonaal over de hele pagina', tr: 'Filigranı tüm sayfa boyunca çapraz olarak döşeyin', pl: 'Układaj znak wodny ukośnie na całej stronie',
    vi: 'Xếp hình mờ theo đường chéo trên toàn bộ trang', th: 'ปูกระเบื้องลายน้ำในแนวทแยงทั่วทั้งหน้า', sv: 'Fördela vattenstämpeln diagonalt över hela sidan', cs: 'Rozprostřít vodoznak diagonálně přes celou stránku',
    da: 'Fordel vandmærket diagonalt over hele siden', el: 'Τοποθέτηση υδατογραφήματος διαγώνια σε ολόκληρη τη σελίδα', fi: 'Levitä vesileima vinottain koko sivulle', he: 'פרוס את סימן המים באלכסון על פני כל הדף',
    hu: 'A vízjel átlós elrendezése az egész oldalon', no: 'Fordel vannmerket diagonalt over hele siden', ro: 'Așază filigranul în diagonală pe întreaga pagină', sk: 'Rozložiť vodotlač diagonálne po celej stránke',
    uk: 'Розташувати водяний знак по діагоналі на всій сторінці', ms: 'Susun tera air secara pepenjuru di seluruh halaman'
  },
  center_left: {
    en: 'Center Left', id: 'Tengah Kiri', es: 'Centro izquierda', fr: 'Centre gauche',
    de: 'Mitte links', ja: '中央左', pt: 'Centro esquerda', ru: 'По центру слева',
    zh: '居中偏左', ar: 'وسط يسار', hi: 'मध्य बायां', it: 'Centro sinistra',
    ko: '중앙 왼쪽', nl: 'Midden links', tr: 'Orta Sol', pl: 'Środek po lewej',
    vi: 'Chính giữa bên trái', th: 'กึ่งกลางซ้าย', sv: 'Mitten vänster', cs: 'Střed vlevo',
    da: 'Midt til venstre', el: 'Κέντρο αριστερά', fi: 'Keskellä vasemmalla', he: 'מרכז שמאל',
    hu: 'Közép bal', no: 'Midten venstre', ro: 'Centru stânga', sk: 'Stred vľavo',
    uk: 'По центру зліва', ms: 'Tengah Kiri'
  },
  center: {
    en: 'Center', id: 'Tengah', es: 'Centro', fr: 'Centre',
    de: 'Mitte', ja: '中央', pt: 'Centro', ru: 'По центру',
    zh: '居中', ar: 'الوسط', hi: 'केंद्र', it: 'Centro',
    ko: '중앙', nl: 'Centrum', tr: 'Orta', pl: 'Środek',
    vi: 'Chính giữa', th: 'กึ่งกลาง', sv: 'Centrum', cs: 'Střed',
    da: 'Centrum', el: 'Κέντρο', fi: 'Keskellä', he: 'מרכז',
    hu: 'Közép', no: 'Senter', ro: 'Centru', sk: 'Stred',
    uk: 'Центр', ms: 'Tengah'
  },
  center_right: {
    en: 'Center Right', id: 'Tengah Kanan', es: 'Centro derecha', fr: 'Centre droit',
    de: 'Mitte rechts', ja: '中央右', pt: 'Centro direita', ru: 'По центру справа',
    zh: '居中偏右', ar: 'وسط يمين', hi: 'मध्य दायां', it: 'Centro destra',
    ko: '중앙 오른쪽', nl: 'Midden rechts', tr: 'Orta Sağ', pl: 'Środek po prawej',
    vi: 'Chính giữa bên phải', th: 'กึ่งกลางขวา', sv: 'Mitten höger', cs: 'Střed vpravo',
    da: 'Midt til højre', el: 'Κέντρο δεξιά', fi: 'Keskellä oikealla', he: 'מרכז ימין',
    hu: 'Közép jobb', no: 'Midten høyre', ro: 'Centru dreapta', sk: 'Stred vpravo',
    uk: 'По центру справа', ms: 'Tengah Kanan'
  },
  watermark_color: {
    en: 'Color', id: 'Warna', es: 'Color', fr: 'Couleur',
    de: 'Farbe', ja: '色', pt: 'Cor', ru: 'Цвет',
    zh: '颜色', ar: 'اللون', hi: 'रंग', it: 'Colore',
    ko: '색상', nl: 'Kleur', tr: 'Renk', pl: 'Kolor',
    vi: 'Màu sắc', th: 'สี', sv: 'Färg', cs: 'Barva',
    da: 'Farve', el: 'Χρώμα', fi: 'Väri', he: 'צבע',
    hu: 'Szín', no: 'Farge', ro: 'Culoare', sk: 'Farba',
    uk: 'Колір', ms: 'Warna'
  },
  watermark_transparency: {
    en: 'Transparency', id: 'Transparansi', es: 'Transparencia', fr: 'Transparence',
    de: 'Transparenz', ja: '透明度', pt: 'Transparência', ru: 'Прозрачность',
    zh: '透明度', ar: 'الشفافية', hi: 'पारदर्शिता', it: 'Trasparenza',
    ko: '투명도', nl: 'Transparantie', tr: 'Şeffaflık', pl: 'Przezroczystość',
    vi: 'Độ trong suốt', th: 'ความโปร่งใส', sv: 'Genomskinlighet', cs: 'Průhlednost',
    da: 'Gennemsigtighed', el: 'Διαφάνεια', fi: 'Läpinäkyvyys', he: 'שקיפות',
    hu: 'Átlátszóság', no: 'Gjennomsiktighet', ro: 'Transparență', sk: 'Priehľadnosť',
    uk: 'Прозорість', ms: 'Ketelusan'
  }
};

const langs = ['en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'];

for (const lang of langs) {
  const langKey = `"${lang}": {`;
  const pos = content.indexOf(langKey);
  if (pos !== -1) {
    let insertStr = '\n';
    for (const [key, map] of Object.entries(newTranslations)) {
      const val = map[lang] || map['en'];
      const escaped = val.replace(/"/g, '\\"');
      insertStr += `    "${key}": "${escaped}",\n`;
    }
    content = content.slice(0, pos + langKey.length) + insertStr + content.slice(pos + langKey.length);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected new watermark keys into all 30 languages in editorTranslations.ts!');
