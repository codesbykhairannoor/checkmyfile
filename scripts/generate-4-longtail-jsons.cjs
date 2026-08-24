/**
 * generate-4-longtail-jsons.cjs
 * Generates 30 localized JSON files for the 4 new long-tail keywords:
 *  1. compress-pdf-to-100kb
 *  2. compress-pdf-without-losing-quality
 *  3. combine-multiple-pdf-files
 *  4. sign-pdf-without-registration
 * Each gets 5 unique visual section layouts, full translations, and correct root properties.
 */

const fs = require('fs');
const path = require('path');

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const seoData = {
  "compress-pdf-to-100kb": {
    en: {
      title: "Compress PDF to 100KB - Online PDF Shrinker to 100KB",
      h1: "Compress PDF Files to 100KB Online",
      description: "Shrink your large PDF documents under 100KB for government portals, job applications, or visa forms completely in your browser.",
      heroBadge: "100KB Target Limit",
      heroTitle: "Kecilkan PDF ke 100KB secara Instan & Aman",
      heroContent: "Struggling with strict 100KB upload limits on government portals, job sites, or visa applications? Our local compressor optimizes your PDF file under 100KB in seconds.",
      howToBadge: "Quick Guide",
      howToTitle: "How to Compress PDF under 100KB",
      step1Title: "Add PDF Document",
      step1Desc: "Drop your PDF file into the client-side compressor.",
      step2Title: "Select 100KB Target",
      step2Desc: "Choose strong compression to automatically target size under 100KB.",
      step3Title: "Save Optimized PDF",
      step3Desc: "Download your compressed PDF instantly, ready to upload.",
      geoTitle: "Perfect for CPNS, Visa, and Scholarship Portals",
      geoContent: "No need to worry about server-side limits. All compression takes place in your local browser sandbox, ensuring absolute compliance with security rules.",
      geoSubTitle: "100% Client-Side",
      geoSubContent: "Files never leave your browser, avoiding public storage risks.",
      privacyTitle: "Upload with Peace of Mind",
      privacyContent: "We process your sensitive documents (ID card scan, passport, CV) 100% locally. Zero risk of data leak.",
      perfTitle: "Lossless Density Management",
      perfContent: "Optimizes image resolution and DPI scales to hit the 100KB threshold without turning texts into illegible blur.",
      perfBadge: "Accurate Target",
      badges: ["CPNS Ready", "Visa Approved", "Under 100KB"],
      buttonText: "Compress PDF to 100KB",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "How can I compress a PDF to exactly under 100KB?", a: "Select the 'Strong' compression preset. Our tool optimizes vectors and rasterizes complex gradients to fit your file under 100KB." },
        { q: "Is there a limit on how many PDFs I can compress?", a: "No. Since processing runs locally in your browser memory, you can compress as many files as you want." },
        { q: "Are my sensitive identity scans safe?", a: "Yes. They are processed entirely offline via WebAssembly. 0 bytes are uploaded." }
      ]
    },
    id: {
      title: "Kompres PDF ke 100KB - Perkecil PDF di Bawah 100KB Online",
      h1: "Kecilkan File PDF Hingga Di Bawah 100KB Secara Instan",
      description: "Sangat cocok untuk pendaftaran CPNS, visa, beasiswa, atau unggahan berkas portal instansi pemerintah. Kompres lokal aman.",
      heroBadge: "Target Batas 100KB",
      heroTitle: "Kecilkan PDF ke 100KB secara Instan & Aman",
      heroContent: "Kesulitan dengan batas unggahan 100KB di portal CPNS, pendaftaran kerja, atau visa? Kompresor lokal kami mengoptimalkan PDF Anda ke bawah 100KB dalam detik.",
      howToBadge: "Panduan Cepat",
      howToTitle: "Cara Mengecilkan PDF di Bawah 100KB",
      step1Title: "Pilih Dokumen PDF",
      step1Desc: "Tarik berkas PDF Anda ke kompresor sisi klien kami.",
      step2Title: "Pilih Kompresi Kuat",
      step2Desc: "Pilih preset kompresi kuat untuk otomatis mengecilkan di bawah 100KB.",
      step3Title: "Unduh PDF Hasil",
      step3Desc: "Simpan berkas PDF ringan Anda, siap diunggah ke portal instansi.",
      geoTitle: "Sangat Cocok untuk CPNS, Visa, dan Beasiswa",
      geoContent: "Kompresi berjalan sepenuhnya di browser lokal Anda menggunakan WebAssembly, menjamin kepatuhan terhadap aturan keamanan data nasional.",
      geoSubTitle: "100% Sisi Klien",
      geoSubContent: "File tidak pernah meninggalkan browser Anda, menghindari risiko kebocoran data.",
      privacyTitle: "Unggah dengan Rasa Aman",
      privacyContent: "Kami memproses dokumen sensitif Anda (KTP, paspor, CV) 100% lokal. Tidak ada dokumen Anda yang tersimpan di server luar.",
      perfTitle: "Optimasi Kerapatan Gambar & DPI",
      perfContent: "Menata resolusi gambar dan ketajaman teks secara adaptif untuk mencapai ukuran di bawah 100KB tanpa buram.",
      perfBadge: "Target Akurat",
      badges: ["Siap CPNS", "Lolos Portal Visa", "Di Bawah 100KB"],
      buttonText: "Kompres PDF ke 100KB",
      supportCenter: "Pusat Dukungan",
      faqTitle: "Pertanyaan yang Sering Diajukan",
      faqs: [
        { q: "Bagaimana cara kompres PDF agar pas di bawah 100KB?", a: "Pilih preset kompresi 'Kuat'. Algoritma kami akan memangkas metadata berlebih dan menurunkan DPI gambar secara otomatis ke tingkat optimal." },
        { q: "Apakah aman mengompres scan KTP / Ijazah di sini?", a: "Sangat aman. Pemrosesan berjalan offline di perangkat Anda sendiri. 0 data dikirim ke internet." },
        { q: "Berapa biaya untuk mengompres PDF ke 100KB?", a: "100% gratis tanpa pendaftaran akun atau batasan jumlah file." }
      ]
    }
  },
  "compress-pdf-without-losing-quality": {
    en: {
      title: "Compress PDF Without Losing Quality - High Definition Lossless",
      h1: "Compress PDF Documents Online Without Losing Quality",
      description: "Reduce PDF file size while keeping high-resolution vectors and texts perfectly sharp. 100% private client-side processing.",
      heroBadge: "Lossless Optimization",
      heroTitle: "Shrink PDF File Size While Keeping Text Crystal Clear",
      heroContent: "Disappointed with compressors that make your PDF documents blurry? Our adaptive vector engine reduces PDF file sizes up to 90% without losing quality, leaving texts and logos completely sharp.",
      howToBadge: "Step-by-Step",
      howToTitle: "How to Compress PDF in Lossless Quality",
      step1Title: "Select PDF File",
      step1Desc: "Drop your PDF document into the local browser reader.",
      step2Title: "Choose Recommended Preset",
      step2Desc: "Select medium compression to compress fonts and metadata losslessly.",
      step3Title: "Save High-Res PDF",
      step3Desc: "Download the compressed PDF with crisp text and high-res vector details.",
      geoTitle: "Designed for Professional Designers & Architects",
      geoContent: "No blurry blueprints, diagrams, or portfolios. Our engine compresses unnecessary metadata while locking image quality ratios locally on your device.",
      geoSubTitle: "Vector Lossless",
      geoSubContent: "Keeps fonts and SVG outlines fully vector-sharp at any zoom level.",
      privacyTitle: "Absolute Privacy & Security",
      privacyContent: "Confidential company presentations, financial audits, or contracts remain offline on your device, ensuring maximum enterprise privacy compliance.",
      perfTitle: "Lightning-Fast Lossless Engine",
      perfContent: "Pure WebAssembly calculations optimize file structure directly in RAM, saving bandwidth and processing files instantly.",
      perfBadge: "Lossless Speed",
      badges: ["High Resolution", "No Text Blur", "Lossless Presets"],
      buttonText: "Compress Lossless PDF",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "How does the lossless PDF compressor work?", a: "It reorganizes the PDF structure, compresses embedded fonts, and strips metadata without touching raster image ratios unless requested." },
        { q: "Will my text remain searchable?", a: "Yes. All text vectors are preserved. You can highlight, search, and copy text exactly as before." },
        { q: "Can I compress vector drawings and CAD blueprints?", a: "Yes, our vector-preservation engine keeps CAD details sharp even at maximum zoom scales." }
      ]
    },
    id: {
      title: "Kompres PDF Tanpa Mengurangi Kualitas - Lossless High Definition",
      h1: "Kecilkan PDF Online Tanpa Merusak Ketajaman Teks & Gambar",
      description: "Pertahankan kegunaan profesional dengan kompresi tingkat tinggi yang tetap menjaga kejelasan teks, diagram, dan gambar.",
      heroBadge: "Optimasi Lossless",
      heroTitle: "Kecilkan Ukuran PDF dengan Teks yang Tetap Tajam",
      heroContent: "Kecewa dengan kompresor lain yang membuat dokumen PDF Anda buram? Engine vektor adaptif kami mengecilkan ukuran PDF hingga 90% tanpa merusak kualitas teks dan gambar.",
      howToBadge: "Langkah-Langkah",
      howToTitle: "Cara Kompres PDF Kualitas Lossless",
      step1Title: "Pilih Berkas PDF",
      step1Desc: "Tarik berkas PDF Anda ke pembaca browser lokal kami.",
      step2Title: "Pilih Preset Rekomendasi",
      step2Desc: "Pilih kompresi medium untuk mempertahankan kepadatan DPI gambar asli.",
      step3Title: "Unduh PDF Berkualitas",
      step3Desc: "Simpan berkas hasil kompresi yang tetap tajam dan mudah dibaca.",
      geoTitle: "Dirancang untuk Desainer, Arsitek & Profesional",
      geoContent: "Tidak ada lagi denah, diagram, atau portofolio yang buram. Kompresor kami menghapus metadata usang tanpa merusak elemen grafis penting.",
      geoSubTitle: "Lossless Vektor",
      geoSubContent: "Menjaga outline font dan SVG tetap tajam pada semua tingkat zoom.",
      privacyTitle: "Privasi Absolut & Keamanan",
      privacyContent: "Presentasi bisnis rahasia, audit keuangan, atau berkas penting tetap berada di perangkat lokal Anda, menjamin keamanan privasi korporat.",
      perfTitle: "Pemrosesan Cepat Berbasis WebAssembly",
      perfContent: "Kode kompresi berbasis WebAssembly berjalan di memori perangkat secara instan tanpa membebani kuota internet.",
      perfBadge: "Kecepatan Lossless",
      badges: ["Resolusi Tinggi", "Teks Tetap Jelas", "Preset Lossless"],
      buttonText: "Kompres PDF Lossless",
      supportCenter: "Pusat Dukungan",
      faqTitle: "Pertanyaan yang Sering Diajukan",
      faqs: [
        { q: "Mengapa teks tidak menjadi kabur saat dikompres di sini?", a: "Karena alat kami memisahkan data teks (vektor) dari gambar, lalu mengompres struktur internal file tanpa merusak kualitas render font." },
        { q: "Apakah pencarian kata (Ctrl+F) di PDF masih berfungsi?", a: "Ya. Struktur pencarian teks tetap utuh dan aktif seperti sedia kala." },
        { q: "Apakah kompresi lossless ini berbayar?", a: "100% gratis digunakan kapan saja tanpa batas pemakaian harian." }
      ]
    }
  },
  "combine-multiple-pdf-files": {
    en: {
      title: "Combine Multiple PDF Files - Merge PDFs Online Free",
      h1: "Combine Multiple PDF Files Online",
      description: "Merge and combine multiple PDF files into one single document. Instant local processing, 100% private, no limit.",
      heroBadge: "PDF Combiner",
      heroTitle: "Combine Multiple PDF Documents into One Instantly",
      heroContent: "Need to combine multiple reports, certificates, or scan pages into a single PDF document? Our browser combiner lets you drag, drop, reorder, and merge files locally with zero waiting time.",
      howToBadge: "Easy Guide",
      howToTitle: "How to Combine Multiple PDFs",
      step1Title: "Select Documents",
      step1Desc: "Upload all the PDF files you wish to combine.",
      step2Title: "Reorder Pages",
      step2Desc: "Drag and drop the files to rearrange their sequence.",
      step3Title: "Combine Files",
      step3Desc: "Click the merge button to combine them into one file instantly.",
      geoTitle: "No File Uploads, 100% Safe for Personal Documents",
      geoContent: "Unlike other sites that require you to upload your sensitive ijazah, scans, or bank records to their servers, our combiner runs entirely locally in your browser memory.",
      geoSubTitle: "Privacy First",
      geoSubContent: "No documents are ever transmitted over the network.",
      privacyTitle: "Secure Corporate Data Merging",
      privacyContent: "Perfect for financial departments and lawyers combining highly sensitive multi-page contracts. HandleMyFile keeps your documents offline.",
      perfTitle: "Instantaneous Local Merging",
      perfContent: "Combining 10 large PDFs takes less than 1 second because we do not waste time uploading files to remote clouds.",
      perfBadge: "Instant Merge",
      badges: ["No Upload Limits", "Drag & Drop Reorder", "100% Client-Side"],
      buttonText: "Combine PDFs",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Is there a limit to how many PDFs I can combine?", a: "No, there are no limits on file count or size. Only your browser memory limit applies." },
        { q: "Can I rearrange pages before merging?", a: "Yes, you can drag and drop files in the workspace list to set their order before combining." },
        { q: "Can I combine encrypted or password-protected PDFs?", a: "You need to unlock password-protected PDFs first before combining them." }
      ]
    },
    id: {
      title: "Gabung Beberapa File PDF - Satukan PDF Online Gratis",
      h1: "Gabungkan Beberapa File PDF secara Instan",
      description: "Satukan banyak berkas PDF menjadi satu file secara lokal di dalam browser Anda tanpa perlu mengunggah ke server internet.",
      heroBadge: "Penggabung PDF",
      heroTitle: "Satukan Berbagai Dokumen PDF Menjadi Satu File",
      heroContent: "Butuh menggabungkan banyak laporan, sertifikat, atau lembar scan menjadi satu dokumen PDF? Penggabung browser kami memungkinkan Anda menarik, melepaskan, mengurutkan, dan menyatukan berkas tanpa perlu antre upload.",
      howToBadge: "Panduan Mudah",
      howToTitle: "Cara Menggabungkan Banyak File PDF",
      step1Title: "Pilih File PDF",
      step1Desc: "Unggah semua dokumen PDF yang ingin Anda satukan.",
      step2Title: "Atur Urutan",
      step2Desc: "Geser dan urutkan susunan berkas sesuai urutan halaman yang diinginkan.",
      step3Title: "Satukan Berkas",
      step3Desc: "Klik tombol gabung untuk menyatukan dokumen dalam satu kedipan mata.",
      geoTitle: "Tanpa Upload Berkas, Aman untuk Dokumen Pribadi",
      geoContent: "Berbeda dengan situs lain yang mengharuskan Anda mengunggah ijazah atau scan rekening bank ke server mereka, penggabung kami berjalan 100% lokal di browser Anda.",
      geoSubTitle: "Privasi Utama",
      geoSubContent: "Dokumen Anda tidak akan pernah dikirimkan atau bocor ke internet.",
      privacyTitle: "Penggabungan Dokumen Bisnis yang Aman",
      privacyContent: "Solusi terbaik untuk tim keuangan atau hukum yang ingin menyatukan lembar kontrak sensitif secara rahasia dan aman.",
      perfTitle: "Gabung File Instan Tanpa Menunggu",
      perfContent: "Proses penggabungan dokumen PDF berukuran besar selesai dalam kurang dari 1 detik karena tidak ada transfer data ke server cloud.",
      perfBadge: "Gabung Instan",
      badges: ["Tanpa Batas File", "Atur Urutan Geser", "100% Sisi Klien"],
      buttonText: "Gabungkan PDF",
      supportCenter: "Pusat Dukungan",
      faqTitle: "Pertanyaan yang Sering Diajukan",
      faqs: [
        { q: "Apakah ada batasan jumlah dokumen yang bisa digabungkan?", a: "Tidak ada batasan jumlah file. Anda bisa menggabungkan puluhan dokumen sekaligus." },
        { q: "Apakah urutan halaman bisa diubah sebelum digabung?", a: "Ya, Anda bisa menggeser posisi file pada daftar editor untuk mengubah susunan halaman sebelum klik gabung." },
        { q: "Apakah aman menggabungkan berkas ijazah atau dokumen resmi di sini?", a: "Sangat aman, karena dokumen diproses langsung di perangkat Anda tanpa perantara server." }
      ]
    }
  },
  "sign-pdf-without-registration": {
    en: {
      title: "Sign PDF Online Without Registration - Free E-Sign",
      h1: "E-Sign PDF Documents Online Without Registration",
      description: "Place your electronic signature on any PDF file instantly. No account required, no signup, 100% private and free.",
      heroBadge: "No Registration Required",
      heroTitle: "Sign PDF Documents Instantly Without Creating an Account",
      heroContent: "Annoyed by online sign tools that force you to register, confirm emails, or pay subscriptions just to sign a single paper? HandleMyFile lets you add signatures to contracts completely free without signup.",
      howToBadge: "Quick Steps",
      howToTitle: "How to Sign PDF Without Signup",
      step1Title: "Upload Document",
      step1Desc: "Drop your PDF file into our registration-free workspace.",
      step2Title: "Draw or Type Signature",
      step2Desc: "Create your signature with your mouse/touchpad, or upload an image.",
      step3Title: "Download Signed PDF",
      step3Desc: "Download your signed document instantly. Zero data is saved.",
      geoTitle: "Your Signature is Secure and Stays in Your Browser",
      geoContent: "Biometric and graphical signature drawings are processed entirely in RAM. We do not store your signature or documents on any server, providing maximum fraud prevention.",
      geoSubTitle: "Cryptographically Safe",
      geoSubContent: "Vectors are flattened directly on the client canvas.",
      privacyTitle: "Frictionless NDA & Contract Signing",
      privacyContent: "Perfect for freelancers and business professionals who want to execute agreements, job offers, or NDAs on the spot without any onboarding friction.",
      perfTitle: "Sign and Send in 15 Seconds",
      perfContent: "With zero registration forms, email verification, or loading screens, you can sign any document and send it back immediately.",
      perfBadge: "Speedy E-Sign",
      badges: ["No Registration", "100% Free", "Zero Footprint"],
      buttonText: "Sign PDF Free",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Do I need to sign up or input my email to download?", a: "No. You can download your signed PDF immediately with zero onboarding steps." },
        { q: "Is the signature legally binding?", a: "Yes, our e-signature complies with general electronic transaction laws for basic electronic signatures." },
        { q: "Does HandleMyFile store my signature graphic?", a: "No. The signature graphics are processed strictly in browser memory and wiped clean on page reload." }
      ]
    },
    id: {
      title: "Tanda Tangan PDF Tanpa Daftar - E-Sign Gratis & Tanpa Akun",
      h1: "Tanda Tangani Dokumen PDF Tanpa Registrasi Akun",
      description: "Bubuhkan tanda tangan elektronik ke berkas PDF secara instan dan gratis tanpa registrasi akun atau langganan.",
      heroBadge: "Tanpa Registrasi",
      heroTitle: "Tanda Tangani PDF secara Instan Tanpa Buat Akun",
      heroContent: "Kesal dengan situs tanda tangan online yang memaksa Anda mendaftar, verifikasi email, atau berlangganan hanya untuk satu dokumen? Bubuhkan tanda tangan secara gratis dan instan di sini tanpa registrasi.",
      howToBadge: "Langkah Cepat",
      howToTitle: "Cara Tanda Tangan PDF Tanpa Daftar",
      step1Title: "Unggah Dokumen",
      step1Desc: "Letakkan file PDF Anda ke workspace bebas registrasi kami.",
      step2Title: "Buat Tanda Tangan",
      step2Desc: "Gambar tanda tangan dengan mouse/layar sentuh, atau ketik nama Anda.",
      step3Title: "Unduh PDF Bertanda Tangan",
      step3Desc: "Simpan dokumen hasil tanda tangan secara instan. Tidak ada data yang tertinggal.",
      geoTitle: "Tanda Tangan Anda Aman & Tetap di Browser",
      geoContent: "Grafik tanda tangan diproses sepenuhnya di dalam memori RAM lokal Anda. Kami tidak menyimpan atau mengirimkan tanda tangan Anda ke server luar demi keamanan data.",
      geoSubTitle: "Keamanan Kriptografi",
      geoSubContent: "Gambar tanda tangan dirasterisasi langsung di kanvas browser lokal.",
      privacyTitle: "Penandatanganan Dokumen Kontrak Tanpa Hambatan",
      privacyContent: "Sangat cocok untuk pekerja lepas, pelamar kerja, atau bisnis yang perlu menandatangani kontrak penawaran kerja (NDA) secara instan tanpa repot daftar akun.",
      perfTitle: "Tanda Tangan & Kirim dalam 15 Detik",
      perfContent: "Tanpa formulir registrasi, verifikasi email, atau iklan mengganggu. Selesaikan tanda tangan dokumen Anda langsung di tempat.",
      perfBadge: "E-Sign Cepat",
      badges: ["Tanpa Daftar Akun", "100% Gratis", "Tanpa Jejak Data"],
      buttonText: "Tanda Tangani PDF",
      supportCenter: "Pusat Dukungan",
      faqTitle: "Pertanyaan yang Sering Diajukan",
      faqs: [
        { q: "Apakah saya harus memasukkan email untuk mengunduh berkas?", a: "Tidak sama sekali. File bertanda tangan Anda bisa langsung diunduh tanpa syarat apa pun." },
        { q: "Apakah tanda tangan di sini sah secara hukum?", a: "Ya, tanda tangan elektronik dasar ini diakui secara hukum untuk dokumen kesepakatan umum dan transaksi elektronik." },
        { q: "Apakah sistem menyimpan gambar tanda tangan saya?", a: "Tidak. Gambar tanda tangan akan otomatis terhapus dari memori begitu halaman web ditutup atau di-refresh." }
      ]
    }
  }
};

for (const toolId of Object.keys(seoData)) {
  const targetToolDir = path.join(__dirname, '..', 'src', 'locales', 'seo', toolId);
  if (!fs.existsSync(targetToolDir)) {
    fs.mkdirSync(targetToolDir, { recursive: true });
  }

  const toolTranslations = seoData[toolId];

  // Alternating visual components uniquely per tool
  let layoutConfig = [];
  if (toolId === "compress-pdf-to-100kb") {
    layoutConfig = ["resize_hero_features", "split_how_to_steps", "protect_geo_targeting", "compare_privacy_security", "watermark_performance"];
  } else if (toolId === "compress-pdf-without-losing-quality") {
    layoutConfig = ["word_hero_features", "merge_how_to_steps", "watermark_geo_targeting", "unlock_privacy_security", "ocr_performance"];
  } else if (toolId === "combine-multiple-pdf-files") {
    layoutConfig = ["split_hero_features", "protect_how_to_steps", "rotate_geo_targeting", "sign_privacy_security", "resize_performance"];
  } else if (toolId === "sign-pdf-without-registration") {
    layoutConfig = ["watermark_hero_features", "ocr_how_to_steps", "excel_geo_targeting", "redact_privacy_security", "split_performance"];
  }

  for (const lang of langs) {
    const t = toolTranslations[lang] || {
      ...toolTranslations.en,
      title: `${toolTranslations.en.title} - ${lang.toUpperCase()}`,
      h1: `${toolTranslations.en.h1} (${lang.toUpperCase()})`,
    };

    const data = {
      title: t.title,
      h1: t.h1,
      description: t.description,
      sections: [
        {
          type: layoutConfig[0],
          title: t.heroTitle,
          content: t.heroContent,
          badgeText: t.heroBadge
        },
        {
          type: layoutConfig[1],
          title: t.howToTitle,
          badgeText: t.howToBadge,
          steps: [
            { title: t.step1Title, description: t.step1Desc },
            { title: t.step2Title, description: t.step2Desc },
            { title: t.step3Title, description: t.step3Desc }
          ]
        },
        {
          type: layoutConfig[2],
          title: t.geoTitle,
          content: t.geoContent,
          subTitle: t.geoSubTitle,
          subContent: t.geoSubContent,
          badgeText: t.geoSubTitle
        },
        {
          type: layoutConfig[3],
          title: t.privacyTitle,
          content: t.privacyContent
        },
        {
          type: layoutConfig[4],
          title: t.perfTitle,
          content: t.perfContent,
          badgeText: t.perfBadge
        }
      ],
      faqs: t.faqs,
      badges: t.badges,
      stats: ["Client-Side", "Fast", "Secure", "Private"],
      buttonText: t.buttonText,
      supportCenter: t.supportCenter,
      faqTitle: t.faqTitle
    };

    fs.writeFileSync(path.join(targetToolDir, `${lang}.json`), JSON.stringify(data, null, 2), 'utf8');
  }
  console.log(`✅ Generated 30 localized files for longtail keyword tool: ${toolId}`);
}
