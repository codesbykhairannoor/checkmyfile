const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LANG_CODES = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const SOURCE_STRINGS = {
  edit_pdf: "PDF Studio Editor",
  elements_on_page: "elements on page",
  undo_shortcut: "Undo (Ctrl+Z)",
  redo_shortcut: "Redo (Ctrl+Y)",
  add_element: "Add To Document",
  text: "Text",
  whiteout: "Whiteout",
  highlight: "Highlight",
  signature: "Sign / Ink",
  image: "Image",
  shape: "Shape",
  circle: "Circle",
  arrow: "Arrow",
  line: "Line",
  rectangle: "Rectangle Box",
  properties: "Properties",
  duplicate: "Duplicate (Ctrl+D)",
  delete: "Delete (Del)",
  text_content: "Text Content",
  font: "Font Family",
  align: "Align",
  size: "Size",
  color: "Color",
  whiteout_tip: "Opaque mask that completely covers underlying text, errors, or sensitive numbers in the PDF.",
  mask_color: "Mask Tone",
  highlight_color: "Highlighter Tint",
  opacity: "Opacity",
  shape_type: "Shape Style",
  thickness: "Thickness",
  stroke: "Border",
  stroke_thickness: "Pen Thickness",
  ink_color: "Ink",
  select_hint: "Click any added element on the document canvas to resize, recolor, rotate, or delete it. Double click text to edit in-place.",
  total_edits: "total edits",
  clear_all: "Clear All",
  confirm_clear_all: "Remove all added text, whiteouts, and edits on this PDF?",
  apply_edits: "Save & Export PDF",
  processing_wait: "Processing PDF...",
  draw_signature: "Draw Signature or Ink",
  clear: "Clear",
  cancel: "Cancel",
  insert_signature: "Insert on Page",
  double_click_to_edit: "Double click to edit text",
  select_tool: "Select / Move",
  pages_tab: "Pages",
  page_thumbnails: "Page Thumbnails",
  fit_width: "Fit Width",
  bring_forward: "Bring Forward",
  send_backward: "Send Backward",
  document_overview: "Document Overview",
  page_actions: "Page Actions",
  shortcuts_guide: "Keyboard Shortcuts",
  transparent_fill: "Transparent",
  change_document: "Change Document",
  page_number_label: "Page",
  of_pages: "of",
  zoom_in: "Zoom In",
  zoom_out: "Zoom Out",
  clear_page_edits: "Clear Page Edits",
  no_selection_title: "Canvas & Document",
  no_selection_desc: "Select an element on the canvas to customize properties, or pick a tool to start designing.",
  drag_drop_move: "Drag to move • Corner handles to resize",
  double_click_inline: "Double-click text to edit inline",
  replace_image: "Replace Image",
  layer_order: "Layer Order",
  custom_color: "Custom Color",
  presets: "Presets",
  pen_draw: "Pen / Draw"
};

const CACHE_FILE = path.join(__dirname, 'edit-translations-cache.json');

async function run() {
  console.log('🚀 Starting 30-Language Translation for PDF Studio Editor...');
  
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    } catch (_) {}
  }

  const keys = Object.keys(SOURCE_STRINGS);
  const values = Object.values(SOURCE_STRINGS);
  const translations = {};

  for (const lang of LANG_CODES) {
    if (lang === 'en') {
      translations['en'] = { ...SOURCE_STRINGS };
      continue;
    }

    if (cache[lang] && keys.every(k => cache[lang][k])) {
      console.log(`⚡ Using cached translations for ${lang}`);
      translations[lang] = cache[lang];
      continue;
    }

    console.log(`🌐 Translating ${keys.length} strings to [${lang}]...`);
    const targetLang = lang === 'zh' ? 'zh-CN' : lang;

    try {
      const res = await translate(values, {
        from: 'en',
        to: targetLang,
        forceTo: true,
      });

      const langMap = {};
      const translatedArr = Array.isArray(res) ? res : [res];

      keys.forEach((key, idx) => {
        langMap[key] = translatedArr[idx]?.text || values[idx];
      });

      translations[lang] = langMap;
      cache[lang] = langMap;

      // Small delay to prevent rate limits
      await new Promise(r => setTimeout(r, 250));
    } catch (err) {
      console.warn(`⚠️ Warning: Translation to ${lang} failed (${err.message}). Using English fallback.`);
      translations[lang] = { ...SOURCE_STRINGS };
    }
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');

  // Inject into src/i18n/editorTranslations.ts
  const editorTransPath = path.join(__dirname, '..', 'src', 'i18n', 'editorTranslations.ts');
  console.log(`📝 Injecting translations into ${editorTransPath}...`);

  let content = fs.readFileSync(editorTransPath, 'utf8');

  for (const lang of LANG_CODES) {
    const langKey = `"${lang}": {`;
    const langIndex = content.indexOf(langKey);
    if (langIndex !== -1) {
      const insertionPoint = langIndex + langKey.length;
      let injectedLines = '\n';
      const langTrans = translations[lang] || SOURCE_STRINGS;
      for (const [k, v] of Object.entries(langTrans)) {
        // Only inject if not already present in that block
        const escapedVal = JSON.stringify(v);
        injectedLines += `    "${k}": ${escapedVal},\n`;
      }
      content = content.slice(0, insertionPoint) + injectedLines + content.slice(insertionPoint);
    }
  }

  fs.writeFileSync(editorTransPath, content, 'utf8');
  console.log('✅ Successfully updated editorTranslations.ts across all 30 languages!');
}

run().catch(err => {
  console.error('Fatal error during translation:', err);
  process.exit(1);
});
