import { translate } from 'google-translate-api-x';
import * as fs from 'fs';
import * as path from 'path';

// Complete Master English phrases covering every Editor Tool and Live Preview
const MASTER_STRINGS: Record<string, string> = {
  // Navigation & Workspace
  "select_preview_document": "Select Preview Document:",
  "add_more_files": "+ Add More Files",
  "change_document": "Change Document",
  "document_navigation": "Document Navigation",
  "select_page_to_jump": "Select page to jump",
  "page_count_label": "Page",
  "remove_file": "Remove File",
  "loading_module": "Loading module...",
  "loading_preview": "Loading Preview...",
  "processing_wait": "Processing...",
  "original_size": "Original Size:",
  "estimated_result": "Estimated Result:",
  "local_privacy_badge": "✨ 100% Client-Side Privacy: Your files never leave your device.",

  // Merge Tool
  "interactive_merge": "Interactive Merge",
  "merge_desc": "Arrange the PDF file order below by Drag & Drop the document cards.",
  "merge_now": "Merge Now",
  "merging_btn": "Merging...",
  "merge_min_warning": "At least 2 files required to merge.",
  "add_more": "Add More",

  // Split Tool
  "interactive_split": "Interactive Split",
  "split_desc": "Enter the page range you want to split/extract.",
  "page_range_label": "Page Range (Example: 1-3, 5, 8)",
  "split_range_hint": "Pages in this range will be marked with a green \"EXTRACT\" label in the Live Preview on the left.",
  "split_now": "Split Now",
  "splitting_btn": "Splitting...",
  "split_range_empty_err": "Please enter the page range (e.g. 1-3, 5).",

  // Compress Tool
  "interactive_compress": "Interactive Compress",
  "compress_desc": "Choose compression level or adjust percentage slider. Live preview will simulate result.",
  "preset_mode": "Preset Mode",
  "custom_slider_mode": "Custom Slider (%)",
  "compress_slider_label": "Target Compression Level",
  "compress_extreme_title": "Extreme (Smallest)",
  "compress_extreme_desc": "Lowest quality, smallest size",
  "compress_balanced_title": "Balanced (Recommended)",
  "compress_balanced_desc": "Good quality, optimal size",
  "compress_high_title": "High (Best Quality)",
  "compress_high_desc": "High quality, moderate size",
  "compress_now": "Compress Now",
  "compressing_btn": "Compressing...",

  // Rotate Tool
  "interactive_rotate": "Interactive Rotate",
  "rotate_desc": "Rotate your document orientation. Changes will be instantly visible on the preview screen.",
  "quick_rotation": "Quick Rotation",
  "rotate_left": "-90° (Left)",
  "rotate_right": "+90° (Right)",
  "rotate_180": "180° (Flip)",
  "rotate_0": "0° (Reset)",
  "custom_degrees": "Custom Degrees",
  "apply_rotation": "Apply Rotation",
  "rotating_btn": "Rotating...",

  // Page Numbers Tool
  "interactive_page_numbers": "Interactive Page Numbers",
  "page_numbers_desc": "Set page numbering position and style. Numbers will appear in real-time on the canvas.",
  "select_number_position": "Select Number Position",
  "numbering_style": "Numbering Style",
  "text_format": "Text Format",
  "start_at_page": "Start at Page",
  "starting_number": "Starting Number",
  "apply_page_numbers": "Apply Page Numbers",
  "numbering_btn": "Applying Numbers...",
  "bottom_center": "Bottom Center",
  "bottom_left": "Bottom Left",
  "bottom_right": "Bottom Right",
  "top_center": "Top Center",
  "top_left": "Top Left",
  "top_right": "Top Right",

  // Watermark Tool
  "interactive_watermark": "Interactive Watermark",
  "watermark_desc": "Add text or image watermark. Changes will be visible immediately on the preview canvas.",
  "watermark_text_tab": "Text Watermark",
  "watermark_image_tab": "Logo (Image)",
  "watermark_text_input": "Watermark Text",
  "watermark_opacity": "Transparency",
  "watermark_scale": "Scale / Size",
  "watermark_rotation": "Rotation",
  "upload_watermark_logo": "Upload Watermark Logo",
  "apply_watermark": "Apply Watermark",
  "watermarking_btn": "Applying Watermark...",
  "watermark_text_empty_err": "Please enter watermark text.",
  "watermark_img_empty_err": "Please upload watermark image.",

  // Protect & Unlock Tool
  "protect_pdf": "Protect PDF",
  "protect_desc": "Secure your PDF document with strong password encryption completely in your browser.",
  "unlock_pdf": "Unlock PDF",
  "unlock_desc": "Remove password restrictions from your PDF document permanently in your browser.",
  "new_password": "New Password",
  "confirm_password": "Confirm Password",
  "current_doc_password": "Current Document Password",
  "enter_password_placeholder": "Enter password...",
  "retype_password_placeholder": "Retype password...",
  "passwords_not_match": "Passwords do not match.",
  "apply_protect": "Apply PDF Encryption",
  "apply_unlock": "Unlock Document Now",
  "protecting_btn": "Encrypting...",
  "unlocking_btn": "Unlocking...",

  // Crop & Resize Tool
  "crop_pdf": "Crop PDF",
  "crop_desc": "Trim white margins around document pages visually.",
  "margin_top": "Top Margin",
  "margin_bottom": "Bottom Margin",
  "margin_left": "Left Margin",
  "margin_right": "Right Margin",
  "apply_crop": "Crop PDF Now",
  "cropping_btn": "Cropping...",
  "resize_pdf": "Resize PDF",
  "resize_desc": "Change PDF page dimensions and paper size without cropping content.",
  "target_page_size": "Target Paper Size",
  "orientation": "Orientation",
  "portrait": "Portrait (Vertical)",
  "landscape": "Landscape (Horizontal)",
  "auto_fit": "Auto (Keep Original)",
  "apply_resize": "Resize PDF Now",
  "resizing_btn": "Resizing...",

  // Sign Tool
  "sign_pdf": "Sign PDF",
  "sign_desc": "Add legal digital or drawn signatures directly to your PDF documents.",
  "signature_type_draw": "Draw Signature",
  "signature_type_upload": "Upload Signature (PNG/JPG)",
  "signature_type_cert": "Cryptographic Certificate (PKCS#7)",
  "signer_name": "Signer Name (Optional)",
  "ink_thickness": "Ink Thickness",
  "sign_position_hint": "Click on page in Live Preview to position signature, then drag to adjust.",
  "upload_p12_cert": "Select .p12 / .pfx File",
  "cert_password": "Certificate Password",
  "apply_signature": "Apply Signature Now",
  "signing_btn": "Signing...",

  // Redact Tool
  "redact_pdf": "Redact PDF",
  "redact_desc": "Permanently black out sensitive information and rasterize to prevent copying.",
  "black_box_mode": "Black Box Mode",
  "blur_mode": "Blur Mode",
  "add_redact_box": "+ Add Redact Area (Page 1)",
  "show_lock_badge": "Show Security Lock Badge",
  "apply_redaction": "Apply Permanent Redaction",
  "redacting_btn": "Redacting & Rasterizing...",

  // Organize & Remove Pages Tool
  "organize_pdf": "Organize PDF",
  "organize_desc": "Insert or reorder pages inside your PDF document.",
  "insert_file_label": "Insert Document",
  "insert_after_page": "Insert After Page:",
  "insert_at_start": "At the Very Beginning (0)",
  "apply_insert": "Apply Page Insertion",
  "inserting_btn": "Inserting...",
  "remove_pdf": "Remove Pages",
  "remove_desc": "Permanently delete unwanted pages from your document.",
  "pages_to_remove_label": "Pages to Delete (e.g. 1, 3-5)",
  "remove_hint": "Pages in this range will be marked with a red \"REMOVE\" label in the Live Preview.",
  "apply_remove": "Delete Pages Now",
  "removing_btn": "Deleting...",

  // Grayscale & Reverse Tool
  "grayscale_pdf": "Grayscale PDF",
  "grayscale_desc": "Convert all document colors and images to black & white grayscale for printing.",
  "apply_grayscale": "Convert to Grayscale",
  "grayscaling_btn": "Processing Grayscale...",
  "reverse_pdf": "Reverse PDF",
  "reverse_desc": "Reverse document page sequence from back to front (e.g. 1-2-3 becomes 3-2-1).",
  "apply_reverse": "Reverse Page Order",
  "reversing_btn": "Reversing...",

  // Compare Tool
  "compare_pdf": "Compare PDF",
  "compare_desc": "Visually compare two PDF documents side-by-side with highlight diffs.",
  "select_second_pdf": "Select Comparison PDF (Revised)",
  "choose_second_pdf_btn": "Click to Upload Second PDF",
  "compare_hint": "System will highlight every pixel or text difference in red.",
  "apply_compare": "Compare Documents Now",
  "comparing_btn": "Analyzing Differences...",
  "original_document": "Original Document",
  "comparison_diff": "Comparison (Diff)",
  "preview_accuracy": "Visual Similarity Accuracy",
  "preview_comparison_done": "Document visual difference comparison complete.",

  // Image & Office Tools
  "convert_to_image": "Convert PDF to Images",
  "convert_to_image_desc": "Extract high-resolution image files from every page of your PDF.",
  "image_format_label": "Image Format",
  "apply_image_convert": "Extract Images Now",
  "extracting_btn": "Extracting Images...",
  "generic_convert": "Convert Document",
  "generic_convert_desc": "Fast client-side document conversion with preserved fonts and layouts.",
  "apply_generic_convert": "Start Conversion",
  "generic_converting_btn": "Converting...",
  "remove_metadata": "Remove Metadata",
  "remove_metadata_desc": "Sanitize author, creator, GPS, and creation timestamps permanently.",
  "apply_remove_metadata": "Sanitize Metadata Now",
  "sanitizing_btn": "Sanitizing...",
  "scan_to_pdf": "Scan to PDF",
  "scan_to_pdf_desc": "Transform clean digital PDFs into authentic scanned-looking documents.",
  "apply_scan": "Apply Scanner Effect",
  "scanning_btn": "Rasterizing Scanner Effect...",

  // Edit PDF Tool
  "edit_and_sign": "Edit & Sign",
  "edit_pdf_desc": "Add text and images to your document. Drag elements in preview screen.",
  "add_text_btn": "+ Add Text",
  "add_image_btn": "+ Add Image",
  "apply_edit": "Apply Edits",
  "editing_btn": "Applying Edits...",

  // Common UI & Buttons
  "start_now": "Start Now",
  "apply_changes": "Apply Changes",
  "reset_btn": "Reset",
  "download_btn": "Download Result"
};

const SUPPORTED_LANGS = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

function getGTLang(code: string): string {
  if (code === 'zh') return 'zh-CN';
  return code;
}

async function run() {
  console.log(`Starting Batch Translation of ${Object.keys(MASTER_STRINGS).length} phrases across ${SUPPORTED_LANGS.length} languages...`);

  const translations: Record<string, Record<string, string>> = {};

  // English is base
  translations['en'] = { ...MASTER_STRINGS };

  const entries = Object.entries(MASTER_STRINGS);
  const keys = entries.map(e => e[0]);
  const texts = entries.map(e => e[1]);

  for (const lang of SUPPORTED_LANGS) {
    if (lang === 'en') continue;
    process.stdout.write(`Translating to ${lang}... `);
    const targetLang = getGTLang(lang);

    translations[lang] = {};

    try {
      const batchSize = 25;
      for (let i = 0; i < texts.length; i += batchSize) {
        const batchTexts = texts.slice(i, i + batchSize);
        const batchKeys = keys.slice(i, i + batchSize);

        const res = await translate(batchTexts, { to: targetLang, rejectOnPartialFail: false });
        const resArray = Array.isArray(res) ? res : [res];

        for (let j = 0; j < batchKeys.length; j++) {
          const key = batchKeys[j];
          const translatedText = resArray[j]?.text || batchTexts[j];
          translations[lang][key] = translatedText;
          // Also map the original English phrase as an alias
          translations[lang][batchTexts[j]] = translatedText;
        }
      }
      console.log(`✅ Done (${Object.keys(translations[lang]).length} keys)`);
    } catch (err) {
      console.error(`❌ Error on ${lang}:`, err);
      for (let j = 0; j < keys.length; j++) {
        translations[lang][keys[j]] = texts[j];
        translations[lang][texts[j]] = texts[j];
      }
    }
  }

  // Indonesian legacy phrases mapping
  const idLegacyMap: Record<string, string> = {
    "Interactive Compress": "interactive_compress",
    "Pilih tingkat kompresi. Live Preview akan mensimulasikan penurunan kualitas gambar.": "compress_desc",
    "Extreme (Kecil)": "compress_extreme_title",
    "Kualitas terendah, ukuran terkecil": "compress_extreme_desc",
    "Balanced (Rekomendasi)": "compress_balanced_title",
    "Kualitas bagus, ukuran optimal": "compress_balanced_desc",
    "High (Terbaik)": "compress_high_title",
    "Kualitas tinggi, ukuran lumayan besar": "compress_high_desc",
    "Kompres Sekarang": "compress_now",
    "Mengompres...": "compressing_btn",
    "Rotate Pages": "interactive_rotate",
    "Interactive Rotate": "interactive_rotate",
    "Putar orientasi dokumen Anda. Perubahan akan terlihat langsung pada layar pratinjau.": "rotate_desc",
    "Rotasi Cepat": "quick_rotation",
    "Derajat Khusus": "custom_degrees",
    "Terapkan Rotasi": "apply_rotation",
    "Interactive Split": "interactive_split",
    "Ketik rentang halaman yang ingin Anda potong/ekstrak.": "split_desc",
    "Rentang Halaman (Contoh: 1-3, 5, 8)": "page_range_label",
    "Potong Sekarang": "split_now",
    "Interactive Merge": "interactive_merge",
    "Atur urutan file PDF di bawah dengan menggeser (Drag & Drop) kartu dokumen.": "merge_desc",
    "Gabungkan Sekarang": "merge_now",
    "Pilih Dokumen Pratinjau:": "select_preview_document",
    "+ Add More Files": "add_more_files",
    "Ganti Dokumen": "change_document",
    "Change Document": "change_document",
    "Document Navigation": "document_navigation",
    "Pilih halaman untuk melompat": "select_page_to_jump",
    "Interactive Page Numbers": "interactive_page_numbers",
    "Pilih Posisi Angka": "select_number_position",
    "Gaya Penomoran": "numbering_style",
    "Format Teks": "text_format",
    "Mulai di Halaman": "start_at_page",
    "Angka Awal": "starting_number",
    "Terapkan Penomoran": "apply_page_numbers",
    "Interactive Watermark": "interactive_watermark",
    "Teks Watermark": "watermark_text_input",
    "Logo (Gambar)": "watermark_image_tab",
    "Transparansi": "watermark_opacity",
    "Ukuran": "watermark_scale",
    "Rotasi": "watermark_rotation",
    "Terapkan Watermark": "apply_watermark",
    "Kunci PDF": "protect_pdf",
    "Buka Kunci PDF": "unlock_pdf",
    "Kata Sandi Baru": "new_password",
    "Konfirmasi Kata Sandi": "confirm_password",
    "Kata Sandi Dokumen Saat Ini": "current_doc_password",
    "Terapkan Enkripsi PDF": "apply_protect",
    "Hapus kata sandi dari dokumen PDF Anda secara permanen. Proses dekripsi dilakukan 100% di browser Anda.": "unlock_desc",
    "Buka Kunci Sekarang": "apply_unlock",
    "Potong Margin PDF": "crop_pdf",
    "Potong pinggiran putih pada halaman.": "crop_desc",
    "Potong PDF Sekarang": "apply_crop",
    "Margin Atas": "margin_top",
    "Margin Bawah": "margin_bottom",
    "Margin Kiri": "margin_left",
    "Margin Kanan": "margin_right",
    "Resize PDF": "resize_pdf",
    "Ukuran Kertas Target": "target_page_size",
    "Orientasi": "orientation",
    "Ubah Ukuran Sekarang": "apply_resize",
    "Tanda Tangan Dokumen": "sign_pdf",
    "Gambar Tanda Tangan": "signature_type_draw",
    "Unggah Tanda Tangan (PNG/JPG)": "signature_type_upload",
    "Sertifikat Kriptografi (PKCS#7)": "signature_type_cert",
    "Terapkan Tanda Tangan": "apply_signature",
    "Sensor Dokumen (Redact)": "redact_pdf",
    "Tutup informasi rahasia dengan blok hitam permanen.": "redact_desc",
    "Tambah Area Sensor (Halaman 1)": "add_redact_box",
    "Terapkan Sensor Permanen": "apply_redaction",
    "Hapus Halaman": "remove_pdf",
    "Ketik rentang atau nomor halaman yang ingin Anda hapus secara permanen.": "remove_desc",
    "Halaman yang Dihapus (Contoh: 1, 3-5)": "pages_to_remove_label",
    "Hapus Sekarang": "apply_remove",
    "Sisipkan Dokumen": "organize_pdf",
    "Sisipkan Setelah Halaman:": "insert_after_page",
    "Paling Awal (0)": "insert_at_start",
    "Terapkan Sisipan": "apply_insert",
    "Grayscale PDF": "grayscale_pdf",
    "Ubah Semua Warna Menjadi Hitam Putih": "grayscale_desc",
    "Ubah Jadi Hitam Putih": "apply_grayscale",
    "Reverse PDF": "reverse_pdf",
    "Balik Urutan Halaman": "reverse_desc",
    "Balik Urutan Sekarang": "apply_reverse",
    "Compare PDF": "compare_pdf",
    "Pilih File Pembanding (Revisi)": "select_second_pdf",
    "Klik untuk Unggah PDF Pembanding": "choose_second_pdf_btn",
    "Pilih file kedua (File Pembanding). Sistem akan menyorot setiap perbedaan piksel atau huruf dengan warna merah.": "compare_hint",
    "Bandingkan Dokumen Sekarang": "apply_compare",
    "Dokumen Asli": "original_document",
    "Perbandingan (Diff)": "comparison_diff",
    "Akurasi Kemiripan": "preview_accuracy",
    "Hasil perbandingan dokumen telah selesai.": "preview_comparison_done",
    "Bersihkan Metadata": "remove_metadata",
    "Hapus Metadata Sekarang": "apply_remove_metadata",
    "Efek Scan": "scan_to_pdf",
    "Terapkan Efek Scan": "apply_scan",
    "Edit & Sign": "edit_and_sign",
    "Organize Pages": "organize_pdf",
    "Security & Extras": "protect_pdf",
    "Ukuran Asli:": "original_size",
    "Estimasi Hasil:": "estimated_result",
    "Reset": "reset_btn",
    "Unduh Hasil": "download_btn",
    "Download": "download_btn"
  };

  for (const lang of SUPPORTED_LANGS) {
    for (const [legacyKey, standardKey] of Object.entries(idLegacyMap)) {
      if (translations[lang][standardKey]) {
        translations[lang][legacyKey] = translations[lang][standardKey];
      }
    }
  }

  const outputFilePath = path.resolve('src/i18n/editorTranslations.ts');
  const fileContent = `// Auto-generated 30-Language Editor Translations
// Generated with Google Translate API X

export const editorTranslations: Record<string, Record<string, string>> = ${JSON.stringify(translations, null, 2)};

export const getEditorTranslation = (key: string, lang: string = 'en'): string => {
  const dict = editorTranslations[lang] || editorTranslations['en'] || {};
  return dict[key] || editorTranslations['en']?.[key] || key;
};
`;

  fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
  console.log(`🎉 Successfully generated ${outputFilePath} with full 30-language coverage!`);
}

run();
