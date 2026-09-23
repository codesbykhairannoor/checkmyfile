const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/i18n/editorTranslations.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract the JS object
const objStr = fileContent.replace(/^[\s\S]*?export const editorTranslations[^{]*=/, '').replace(/;\s*export const getEditorTranslation[\s\S]*$/, '');
const dict = eval('(' + objStr + ')');

const newKeys = {
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
    en: 'Repeat Watermark (Tile Pattern)', id: 'Ulangi Watermark (Pola Mosaik)', es: 'Repetir marca de agua (mosaico)', fr: 'Répéter le filigrane (mosaïque)',
    de: 'Wasserzeichen wiederholen (Kachelmuster)', ja: '透かしを繰り返す（タイルパターン）', pt: 'Repetir marca d\'água (mosaico)', ru: 'Повторять водяной знак (мозаика)',
    zh: '平铺重复水印（网格模式）', ar: 'تكرار العلامة المائية (نمط مربعات)', hi: 'वॉटरमार्क दोहराएं (टाइल पैटर्न)', it: 'Ripeti filigrana (motivo a mosaico)',
    ko: '워터마크 반복 (타일 패턴)', nl: 'Watermerk herhalen (tegelpatroon)', tr: 'Filigranı Yinele (Döşeme Deseni)', pl: 'Powtórz znak wodny (wzór kafelkowy)',
    vi: 'Lặp lại hình mờ (xếp gạch)', th: 'ทำซ้ำลายน้ำ (รูปแบบตาราง)', sv: 'Upprepa vattenstämpel (kakelmönster)', cs: 'Opakovat vodoznak (dlaždicový vzor)',
    da: 'Gentag vandmærke (flisemønster)', el: 'Επανάληψη υδατογραφήματος (πλακίδια)', fi: 'Toista vesileima (laattakuvio)', he: 'חזור על סימן מים (תבנית אריחים)',
    hu: 'Vízjel ismétlése (mozaik minta)', no: 'Gjenta vannmerke (flismønster)', ro: 'Repetă filigranul (model mozaic)', sk: 'Opakovať vodotlač (dlaždicový vzor)',
    uk: 'Повторювати водяний знак (плитка)', ms: 'Ulang Tera Air (Corak Mozek)'
  },
  watermark_repeat_desc: {
    en: 'Tile the watermark diagonally across the entire page', id: 'Ulangi watermark secara diagonal di seluruh halaman', es: 'Cubre toda la página con marcas de agua en mosaico', fr: 'Répète le filigrane en mosaïque sur toute la page',
    de: 'Kachelt das Wasserzeichen über die gesamte Seite', ja: 'ページ全体に透かしを敷き詰めます', pt: 'Distribui a marca d\'água em mosaico por toda a página', ru: 'Замостить водяной знак по всей странице',
    zh: '在整个页面上以网格平铺水印', ar: 'تكرار العلامة المائية على كامل الصفحة', hi: 'पूरे पृष्ठ पर वॉटरमार्क दोहराएं', it: 'Disponi la filigrana a mosaico su tutta la pagina',
    ko: '페이지 전체에 워터마크를 타일링합니다', nl: 'Plaats het watermerk over de hele pagina', tr: 'Filigranı tüm sayfa boyunca döşeyin', pl: 'Układaj znak wodny na całej stronie',
    vi: 'Xếp hình mờ trên toàn bộ trang', th: 'ปูกระเบื้องลายน้ำทั่วทั้งหน้า', sv: 'Fördela vattenstämpeln över hela sidan', cs: 'Rozprostřít vodoznak přes celou stránku',
    da: 'Fordel vandmærket over hele siden', el: 'Τοποθέτηση υδατογραφήματος σε ολόκληρη τη σελίδα', fi: 'Levitä vesileima koko sivulle', he: 'פרוס את סימן המים על פני כל הדף',
    hu: 'A vízjel elrendezése az egész oldalon', no: 'Fordel vannmerket over hele siden', ro: 'Așază filigranul pe întreaga pagină', sk: 'Rozložiť vodotlač po celej stránke',
    uk: 'Розташувати водяний знак на всій сторінці', ms: 'Susun tera air di seluruh halaman'
  },
  top_left: {
    en: 'Top Left', id: 'Atas Kiri', es: 'Arriba izquierda', fr: 'Haut gauche',
    de: 'Oben links', ja: '左上', pt: 'Superior esquerdo', ru: 'Сверху слева',
    zh: '左上', ar: 'أعلى اليسار', hi: 'ऊपर बायां', it: 'In alto a sinistra',
    ko: '왼쪽 상단', nl: 'Linksboven', tr: 'Sol Üst', pl: 'Góra lewo',
    vi: 'Trên cùng bên trái', th: 'บนซ้าย', sv: 'Uppe till vänster', cs: 'Vlevo nahoře',
    da: 'Øverst til venstre', el: 'Πάνω αριστερά', fi: 'Ylhäällä vasemmalla', he: 'שמאל למעלה',
    hu: 'Bal felső', no: 'Øverst til venstre', ro: 'Stânga sus', sk: 'Vľavo hore',
    uk: 'Зверху зліва', ms: 'Atas Kiri'
  },
  top_center: {
    en: 'Top Center', id: 'Atas Tengah', es: 'Arriba centro', fr: 'Haut centre',
    de: 'Oben Mitte', ja: '中央上', pt: 'Superior centro', ru: 'Сверху по центру',
    zh: '中上', ar: 'أعلى الوسط', hi: 'ऊपर मध्य', it: 'In alto al centro',
    ko: '중앙 상단', nl: 'Middenboven', tr: 'Orta Üst', pl: 'Góra środek',
    vi: 'Trên cùng chính giữa', th: 'บนกลาง', sv: 'Uppe i mitten', cs: 'Uprostřed nahoře',
    da: 'Øverst i midten', el: 'Πάνω κέντρο', fi: 'Ylhäällä keskellä', he: 'מרכז למעלה',
    hu: 'Felső középső', no: 'Øverst i midten', ro: 'Centru sus', sk: 'V strede hore',
    uk: 'Зверху по центру', ms: 'Atas Tengah'
  },
  top_right: {
    en: 'Top Right', id: 'Atas Kanan', es: 'Arriba derecha', fr: 'Haut droite',
    de: 'Oben rechts', ja: '右上', pt: 'Superior direito', ru: 'Сверху справа',
    zh: '右上', ar: 'أعلى اليمين', hi: 'ऊपर दायां', it: 'In alto a destra',
    ko: '오른쪽 상단', nl: 'Rechtsboven', tr: 'Sağ Üst', pl: 'Góra prawo',
    vi: 'Trên cùng bên phải', th: 'บนขวา', sv: 'Uppe till höger', cs: 'Vpravo nahoře',
    da: 'Øverst til højre', el: 'Πάνω δεξιά', fi: 'Ylhäällä oikealla', he: 'ימין למעלה',
    hu: 'Jobb felső', no: 'Øverst til høyre', ro: 'Dreapta sus', sk: 'Vpravo hore',
    uk: 'Зверху справа', ms: 'Atas Kanan'
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
  bottom_left: {
    en: 'Bottom Left', id: 'Bawah Kiri', es: 'Abajo izquierda', fr: 'Bas gauche',
    de: 'Unten links', ja: '左下', pt: 'Inferior esquerdo', ru: 'Снизу слева',
    zh: '左下', ar: 'أسفل اليسار', hi: 'नीचे बायां', it: 'In basso a sinistra',
    ko: '왼쪽 하단', nl: 'Linksonder', tr: 'Sol Alt', pl: 'Dół lewo',
    vi: 'Dưới cùng bên trái', th: 'ล่างซ้าย', sv: 'Nere till vänster', cs: 'Vlevo dole',
    da: 'Nederst til venstre', el: 'Κάτω αριστερά', fi: 'Alhaalla vasemmalla', he: 'שמאל למטה',
    hu: 'Bal alsó', no: 'Nederst til venstre', ro: 'Stânga jos', sk: 'Vľavo dole',
    uk: 'Знизу зліва', ms: 'Bawah Kiri'
  },
  bottom_center: {
    en: 'Bottom Center', id: 'Bawah Tengah', es: 'Abajo centro', fr: 'Bas centre',
    de: 'Unten Mitte', ja: '中央下', pt: 'Inferior centro', ru: 'Снизу по центру',
    zh: '中下', ar: 'أسفل الوسط', hi: 'नीचे मध्य', it: 'In basso al centro',
    ko: '중앙 하단', nl: 'Middenonder', tr: 'Orta Alt', pl: 'Dół środek',
    vi: 'Dưới cùng chính giữa', th: 'ล่างกลาง', sv: 'Nere i mitten', cs: 'Uprostřed dole',
    da: 'Nederst i midten', el: 'Κάτω κέντρο', fi: 'Alhaalla keskellä', he: 'מרכז למטה',
    hu: 'Alsó középső', no: 'Nederst i midten', ro: 'Centru jos', sk: 'V strede dole',
    uk: 'Знизу по центру', ms: 'Bawah Tengah'
  },
  bottom_right: {
    en: 'Bottom Right', id: 'Bawah Kanan', es: 'Abajo derecha', fr: 'Bas droite',
    de: 'Unten rechts', ja: '右下', pt: 'Inferior direito', ru: 'Снизу справа',
    zh: '右下', ar: 'أسفل اليمين', hi: 'नीचे दायां', it: 'In basso a destra',
    ko: '오른쪽 하단', nl: 'Rechtsonder', tr: 'Sağ Alt', pl: 'Dół prawo',
    vi: 'Dưới cùng bên phải', th: 'ล่างขวา', sv: 'Nere till höger', cs: 'Vpravo dole',
    da: 'Nederst til højre', el: 'Κάτω δεξιά', fi: 'Alhaalla oikealla', he: 'ימין למטה',
    hu: 'Jobb alsó', no: 'Nederst til høyre', ro: 'Dreapta jos', sk: 'Vpravo dole',
    uk: 'Знизу справа', ms: 'Bawah Kanan'
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
  },
  watermark_scale: {
    en: 'Size / Scale', id: 'Ukuran', es: 'Tamaño / Escala', fr: 'Taille / Échelle',
    de: 'Größe / Skalierung', ja: 'サイズ / スケール', pt: 'Tamanho / Escala', ru: 'Размер / Масштаб',
    zh: '大小 / 缩放', ar: 'الحجم / المقياس', hi: 'आकार / पैमाना', it: 'Dimensione / Scala',
    ko: '크기 / 배율', nl: 'Grootte / Schaal', tr: 'Boyut / Ölçek', pl: 'Rozmiar / Skala',
    vi: 'Kích thước / Tỷ lệ', th: 'ขนาด / มาตราส่วน', sv: 'Storlek / Skala', cs: 'Velikost / Měřítko',
    da: 'Størrelse / Skala', el: 'Μέγεθος / Κλίμακα', fi: 'Koko / Mittakaava', he: 'גודל / קנה מידה',
    hu: 'Méret / Méretarány', no: 'Størrelse / Skala', ro: 'Dimensiune / Scară', sk: 'Veľkosť / Mierka',
    uk: 'Розмір / Масштаб', ms: 'Saiz / Skala'
  },
  watermark_rotation: {
    en: 'Rotation', id: 'Rotasi', es: 'Rotación', fr: 'Rotation',
    de: 'Drehung', ja: '回転', pt: 'Rotação', ru: 'Поворот',
    zh: '旋转', ar: 'التدوير', hi: 'घूर्णन', it: 'Rotazione',
    ko: '회전', nl: 'Rotatie', tr: 'Döndürme', pl: 'Obrót',
    vi: 'Xoay', th: 'การหมุน', sv: 'Rotation', cs: 'Otočení',
    da: 'Rotation', el: 'Περιστροφή', fi: 'Kierto', he: 'סיבוב',
    hu: 'Forgatás', no: 'Rotasjon', ro: 'Rotire', sk: 'Otočenie',
    uk: 'Обертання', ms: 'Putaran'
  },
  watermark_text_tab: {
    en: 'Text', id: 'Teks', es: 'Texto', fr: 'Texte',
    de: 'Text', ja: 'テキスト', pt: 'Texto', ru: 'Текст',
    zh: '文本', ar: 'نص', hi: 'पाठ', it: 'Testo',
    ko: '텍스트', nl: 'Tekst', tr: 'Metin', pl: 'Tekst',
    vi: 'Văn bản', th: 'ข้อความ', sv: 'Text', cs: 'Text',
    da: 'Tekst', el: 'Κείμενο', fi: 'Teksti', he: 'טקסט',
    hu: 'Szöveg', no: 'Tekst', ro: 'Text', sk: 'Text',
    uk: 'Текст', ms: 'Teks'
  },
  watermark_image_tab: {
    en: 'Logo (Image)', id: 'Logo (Gambar)', es: 'Logotipo (Imagen)', fr: 'Logo (Image)',
    de: 'Logo (Bild)', ja: 'ロゴ（画像）', pt: 'Logotipo (Imagem)', ru: 'Логотип (Изображение)',
    zh: 'Logo（图片）', ar: 'شعار (صورة)', hi: 'लोगो (छवि)', it: 'Logo (Immagine)',
    ko: '로고 (이미지)', nl: 'Logo (Afbeelding)', tr: 'Logo (Resim)', pl: 'Logo (Obraz)',
    vi: 'Biểu trưng (Hình ảnh)', th: 'โลโก้ (รูปภาพ)', sv: 'Logotyp (Bild)', cs: 'Logo (Obrázek)',
    da: 'Logo (Billede)', el: 'Λογότυπο (Εικόνα)', fi: 'Logo (Kuva)', he: 'לוגו (תמונה)',
    hu: 'Logó (Kép)', no: 'Logo (Bilde)', ro: 'Siglă (Imagine)', sk: 'Logo (Obrázok)',
    uk: 'Логотип (Зображення)', ms: 'Logo (Imej)'
  },
  watermark_text_input: {
    en: 'Watermark Text', id: 'Teks Watermark', es: 'Texto de marca de agua', fr: 'Texte du filigrane',
    de: 'Wasserzeichen-Text', ja: '透かしテキスト', pt: 'Texto da marca d\'água', ru: 'Текст водяного знака',
    zh: '水印文本', ar: 'نص العلامة المائية', hi: 'वॉटरमार्क टेक्स्ट', it: 'Testo filigrana',
    ko: '워터마크 텍스트', nl: 'Watermerktekst', tr: 'Filigran Metni', pl: 'Tekst znaku wodnego',
    vi: 'Văn bản hình mờ', th: 'ข้อความลายน้ำ', sv: 'Vattenstämpeltext', cs: 'Text vodoznaku',
    da: 'Vandmærketekst', el: 'Κείμενο υδατογραφήματος', fi: 'Vesileimateksti', he: 'טקסט סימן מים',
    hu: 'Vízjel szövege', no: 'Vannmerketekst', ro: 'Text filigran', sk: 'Text vodotlače',
    uk: 'Текст водяного знака', ms: 'Teks Tera Air'
  },
  upload_watermark_logo: {
    en: 'Upload Watermark Logo', id: 'Unggah Logo Watermark', es: 'Subir logotipo de marca de agua', fr: 'Télécharger le logo du filigrane',
    de: 'Wasserzeichen-Logo hochladen', ja: '透かしロゴをアップロード', pt: 'Carregar logotipo da marca d\'água', ru: 'Загрузить логотип водяного знака',
    zh: '上传水印 Logo', ar: 'تحميل شعار العلامة المائية', hi: 'वॉटरमार्क लोगो अपलोड करें', it: 'Carica logo filigrana',
    ko: '워터마크 로고 업로드', nl: 'Watermerklogo uploaden', tr: 'Filigran Logosunu Yükle', pl: 'Prześlij logo znaku wodnego',
    vi: 'Tải lên biểu trưng hình mờ', th: 'อัปโหลดโลโก้ลายน้ำ', sv: 'Ladda upp vattenstämpellogotyp', cs: 'Nahrát logo vodoznaku',
    da: 'Upload vandmærkelogo', el: 'Μεταφόρτωση λογότυπου υδατογραφήματος', fi: 'Lataa vesileimalogo', he: 'העלה לוגו סימן מים',
    hu: 'Vízjel logó feltöltése', no: 'Last opp vannmerkelogo', ro: 'Încarcă sigla filigranului', sk: 'Nahrať logo vodotlače',
    uk: 'Завантажити логотип водяного знака', ms: 'Muat Naik Logo Tera Air'
  },
  watermark_text_placeholder: {
    en: 'e.g. CONFIDENTIAL', id: 'contoh: RAHASIA / DRAFT', es: 'ej. CONFIDENCIAL', fr: 'ex. CONFIDENTIEL',
    de: 'z.B. VERTRAULICH', ja: '例: 社外秘 / DRAFT', pt: 'ex. CONFIDENCIAL', ru: 'напр. КОНФИДЕНЦИАЛЬНО',
    zh: '例如：机密 / 绝密', ar: 'مثال: سري للغاية', hi: 'उदा. गोपनीय', it: 'es. RISERVATO',
    ko: '예: 대외비 / 기밀문서', nl: 'bijv. VERTROUWELIJK', tr: 'örneğin GİZLİDİR', pl: 'np. POUFNE',
    vi: 'ví dụ: BẢO MẬT', th: 'เช่น ลับเฉพาะ', sv: 't.ex. KONFIDENTIELLT', cs: 'např. DŮVĚRNÉ',
    da: 'f.eks. FORTROLIGT', el: 'π.χ. ΕΜΠΙΣΤΕΥΤΙΚΟ', fi: 'esim. LUOTTAMUKSELLINEN', he: 'למשל: סודי',
    hu: 'pl. BIZALMAS', no: 'f.eks. KONFIDENSIELT', ro: 'ex. CONFIDENȚIAL', sk: 'napr. DÔVERNÉ',
    uk: 'напр. КОНФІДЕНЦІЙНО', ms: 'cth: SULIT / RAHSIA'
  },
  saving_btn: {
    en: 'Saving...', id: 'Menyimpan...', es: 'Guardando...', fr: 'Enregistrement...',
    de: 'Speichern...', ja: '保存中...', pt: 'Salvando...', ru: 'Сохранение...',
    zh: '正在保存...', ar: 'جارٍ الحفظ...', hi: 'सहेज रहा है...', it: 'Salvataggio in corso...',
    ko: '저장 중...', nl: 'Opslaan...', tr: 'Kaydediliyor...', pl: 'Zapisywanie...',
    vi: 'Đang lưu...', th: 'กำลังบันทึก...', sv: 'Sparar...', cs: 'Ukládání...',
    da: 'Gemmer...', el: 'Αποθήκευση...', fi: 'Tallennetaan...', he: 'שומר...',
    hu: 'Mentés...', no: 'Lagrer...', ro: 'Se salvează...', sk: 'Ukladá sa...',
    uk: 'Збереження...', ms: 'Menyimpan...'
  }
};

const langs = ['en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'];

for (const lang of langs) {
  if (!dict[lang]) {
    dict[lang] = {};
  }
  for (const [k, translations] of Object.entries(newKeys)) {
    dict[lang][k] = translations[lang] || translations['en'];
  }
}

const outStr = '// Auto-generated 30-Language Editor Translations\nexport const editorTranslations: Record<string, Record<string, string>> = ' + JSON.stringify(dict, null, 2) + ';\n\nexport const getEditorTranslation = (key: string, lang: string = \'en\'): string => {\n  const dict = editorTranslations[lang] || editorTranslations[\'en\'] || {};\n  return dict[key] || editorTranslations[\'en\']?.[key] || key;\n};\n';

fs.writeFileSync(filePath, outStr, 'utf8');
console.log('Successfully written complete 30-language keys to editorTranslations.ts!');
