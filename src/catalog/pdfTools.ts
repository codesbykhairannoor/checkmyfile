import type { ToolDefinition } from './types';
import { generateSlugsForId, defaultFaqs } from './types';

export const pdfTools: ToolDefinition[] = [
  {
    id: 'merge-pdf',
    category: 'pdf',
    iconName: 'Combine',
    slugs: generateSlugsForId('merge-pdf', {
      en: 'merge-pdf',
      id: 'gabung-pdf',
      es: 'unir-pdf',
      fr: 'fusionner-pdf',
      de: 'pdf-zusammenfuehren',
      ja: 'pdf-ketsugou',
      pt: 'juntar-pdf',
      ru: 'obedenit-pdf',
      zh: 'hebing-pdf',
      ar: 'damj-pdf',
      hi: 'pdf-jode',
      it: 'unisci-pdf',
      ko: 'pdf-byeonghap',
      nl: 'pdf-samenvoegen',
      tr: 'pdf-birlestir',
      pl: 'polacz-pdf',
      vi: 'ghep-pdf',
      th: 'ruam-pdf',
      sv: 'sla-ihop-pdf',
      cs: 'sloucit-pdf',
      da: 'flet-pdf',
      el: 'synchoneysi-pdf',
      fi: 'yhdista-pdf',
      he: 'mizug-pdf',
      hu: 'pdf-egyesites',
      no: 'sla-sammen-pdf',
      ro: 'imbinare-pdf',
      sk: 'spojit-pdf',
      uk: 'obyednaty-pdf',
      ms: 'gabung-pdf-online',
    }),
    seo: {
      en: {
        title: 'Free Online PDF Merger - Combine PDF Files Locally | Zero Upload',
        h1: 'Merge PDF Files Instantly in Your Browser',
        description: 'Combine multiple PDF files into a single document using pure client-side WebAssembly. No file uploads, 100% privacy guaranteed, zero limits.',
        faqs: defaultFaqs('Merge PDF', 'en'),
      },
      id: {
        title: 'Gabung PDF Online Gratis - Satukan File PDF Tanpa Unggah Server',
        h1: 'Gabungkan Berkas PDF Instan di Dalam Peramban',
        description: 'Satukan beberapa file PDF menjadi satu dokumen berurutan dengan teknologi WebAssembly lokal. Tanpa batasan kuota, 100% privat dan aman.',
        faqs: defaultFaqs('Gabung PDF', 'id'),
      },
      es: {
        title: 'Unir PDF Gratis Online - Combinar Archivos sin Subir al Servidor',
        h1: 'Combina Archivos PDF al Instante en tu Navegador',
        description: 'Une varios archivos PDF en un solo documento usando WebAssembly en el cliente. Sin subidas, 100% privado y sin límites.',
        faqs: defaultFaqs('Unir PDF', 'es'),
      },
    },
  },
  {
    id: 'combine-multiple-pdf-files',
    category: 'pdf',
    iconName: 'Combine',
    slugs: generateSlugsForId('combine-multiple-pdf-files', {
      en: 'combine-multiple-pdf-files',
      id: 'gabung-beberapa-file-pdf',
      es: 'combinar-multiples-archivos-pdf',
      fr: 'fusionner-plusieurs-fichiers-pdf',
      de: 'mehrere-pdf-dateien-zusammenfuehren',
      ja: 'pdf-ketsugou-multi',
      pt: 'juntar-multiplos-pdfs',
      ru: 'obedinit-neskolko-pdf',
      zh: 'hebing-duoge-pdf',
      ar: 'damj-milafat-pdf-mutadida',
      hi: 'pdf-jode-multi',
      it: 'unisci-piu-pdf',
      ko: 'pdf-byeonghap-multi',
      nl: 'pdf-samenvoegen-multi',
      tr: 'pdf-birlestir-multi',
      pl: 'polacz-wiele-pdf',
      vi: 'ghep-nhieu-pdf',
      th: 'ruam-lai-pdf',
      sv: 'sla-ihop-flera-pdf',
      cs: 'sloucit-vice-pdf',
      da: 'flet-flere-pdf',
      el: 'synchoneysi-polla-pdf',
      fi: 'yhdista-useita-pdf',
      he: 'mizug-multi-pdf',
      hu: 'pdf-egyesites-multi',
      no: 'sla-sammen-flere-pdf',
      ro: 'imbinare-multiple-pdf',
      sk: 'spojit-viac-pdf',
      uk: 'obyednaty-kilka-pdf',
      ms: 'gabung-banyak-pdf',
    }),
    seo: {
      en: {
        title: 'Combine Multiple PDF Files',
        h1: 'Combine Multiple PDF Files Online (Free & Client-Side)',
        description: 'Merge and combine multiple PDF files into one single document. Instant local processing, 100% private, no limit.',
        faqs: defaultFaqs('Combine Multiple PDF Files', 'en'),
      },
      id: {
        title: 'Gabung Beberapa File PDF',
        h1: 'Gabungkan Beberapa File PDF secara Instan',
        description: 'Satukan banyak berkas PDF menjadi satu file secara lokal di dalam browser Anda tanpa perlu mengunggah ke server internet.',
        faqs: defaultFaqs('Gabung Beberapa File PDF', 'id'),
      },
    },
  },
  {
    id: 'edit-pdf',
    category: 'pdf',
    iconName: 'PenTool',
    slugs: generateSlugsForId('edit-pdf', {
      en: 'edit-pdf',
      id: 'edit-pdf',
      es: 'editar-pdf',
      fr: 'modifier-pdf',
      de: 'pdf-bearbeiten',
    }),
    seo: {
      en: {
        title: 'Free Online PDF Editor - Add Text & Images Locally | Zero Upload',
        h1: 'Edit PDF Documents Directly in Your Browser',
        description: 'A fully client-side interactive PDF Editor. Add text, overlay images, and manipulate PDFs locally with 100% privacy and zero uploads.',
        faqs: defaultFaqs('Edit PDF', 'en'),
      },
      id: {
        title: 'Edit PDF Online Gratis - Tambah Teks & Gambar Tanpa Unggah Server',
        h1: 'Edit Dokumen PDF Secara Interaktif di Dalam Peramban',
        description: 'Editor PDF interaktif client-side seutuhnya. Tambahkan teks, sisipkan gambar, dan manipulasi PDF Anda secara lokal dengan jaminan privasi 100%.',
        faqs: defaultFaqs('Edit PDF', 'id'),
      },
    },
  },
  {
    id: 'split-pdf',
    category: 'pdf',
    iconName: 'Scissors',
    slugs: generateSlugsForId('split-pdf', {
      en: 'split-pdf',
      id: 'pisah-pdf',
      es: 'dividir-pdf',
      fr: 'diviser-pdf',
      de: 'pdf-teilen',
    }),
    seo: {
      en: {
        title: 'Split PDF Online - Extract Pages Separately | Client-Side Privacy',
        h1: 'Split PDF Documents & Extract Specific Pages',
        description: 'Separate one or more PDF pages into independent PDF files or a ZIP archive locally. Fast, secure, and 100% browser-based.',
        faqs: defaultFaqs('Split PDF', 'en'),
      },
      id: {
        title: 'Pisah PDF Online Gratis - Ekstrak Halaman PDF Tanpa Unggah',
        h1: 'Pisahkan Dokumen PDF & Ekstrak Halaman Pilihan',
        description: 'Ambil halaman tertentu atau pisahkan rentang halaman PDF menjadi file terpisah secara lokal di peramban Anda dengan privasi penuh.',
        faqs: defaultFaqs('Pisah PDF', 'id'),
      },
      es: {
        title: 'Dividir PDF Online Gratis - Extraer Páginas de Forma Privada',
        h1: 'Divide Documentos PDF y Extrae Páginas Específicas',
        description: 'Separa páginas de PDF en archivos independientes o en un archivo ZIP directamente en tu navegador sin subir nada a internet.',
        faqs: defaultFaqs('Dividir PDF', 'es'),
      },
    },
  },
  {
    id: 'rotate-pdf',
    category: 'pdf',
    iconName: 'RotateCw',
    slugs: generateSlugsForId('rotate-pdf', {
      en: 'rotate-pdf',
      id: 'rotasi-pdf',
      es: 'rotar-pdf',
      fr: 'pivoter-pdf',
    }),
    seo: {
      en: {
        title: 'Rotate PDF Pages Online - Turn PDF 90/180/270 Degrees Locally',
        h1: 'Rotate PDF Pages & Fix Orientation',
        description: 'Rotate individual pages or all pages in your PDF document locally in seconds. Zero uploads required.',
        faqs: defaultFaqs('Rotate PDF', 'en'),
      },
      id: {
        title: 'Rotasi PDF Online Gratis - Putar Halaman PDF 90° atau 180°',
        h1: 'Putar Halaman PDF & Perbaiki Orientasi Dokumen',
        description: 'Putar halaman PDF yang terbalik atau miring secara permanen langsung di dalam peramban dengan cepat dan aman.',
        faqs: defaultFaqs('Rotasi PDF', 'id'),
      },
    },
  },

  {
    id: 'page-numbers',
    category: 'pdf',
    iconName: 'Hash',
    slugs: generateSlugsForId('page-numbers', {
      en: 'page-numbers',
      id: 'nomor-halaman-pdf',
      es: 'numeros-de-pagina-pdf',
    }),
    seo: {
      en: {
        title: 'Add Page Numbers to PDF - Custom Header & Footer Locally',
        h1: 'Insert Page Numbers into PDF Documents',
        description: 'Easily add clean, customizable page numbers to your PDF header or footer with full styling control in your browser.',
        faqs: defaultFaqs('Page Numbers', 'en'),
      },
      id: {
        title: 'Tambah Nomor Halaman PDF Online - Kustomisasi Header & Footer',
        h1: 'Sisipkan Nomor Halaman Rapi ke Dokumen PDF',
        description: 'Beri nomor halaman otomatis pada bagian atas atau bawah dokumen PDF Anda secara lokal dengan mudah dan cepat.',
        faqs: defaultFaqs('Nomor Halaman PDF', 'id'),
      },
    },
  },
  {
    id: 'watermark-pdf',
    category: 'pdf',
    iconName: 'Stamp',
    slugs: generateSlugsForId('watermark-pdf', {
      en: 'watermark-pdf',
      id: 'tanda-air-pdf',
      es: 'marca-de-agua-pdf',
    }),
    seo: {
      en: {
        title: 'Add Watermark to PDF - Stamp Custom Text or Image Locally',
        h1: 'Stamp Custom Text or Image Watermarks onto PDF',
        description: 'Protect your intellectual property by stamping transparent text or image watermarks across your PDF pages offline.',
        faqs: defaultFaqs('Watermark PDF', 'en'),
      },
      id: {
        title: 'Beri Tanda Air (Watermark) PDF Online - Stempel Teks / Gambar',
        h1: 'Tambahkan Stempel Tanda Air Transparan ke PDF',
        description: 'Lindungi hak cipta dokumen Anda dengan menyematkan tanda air teks kustom di seluruh halaman PDF secara privat.',
        faqs: defaultFaqs('Tanda Air PDF', 'id'),
      },
    },
  },
  {
    id: 'remove-pdf',
    category: 'pdf',
    iconName: 'Trash2',
    slugs: generateSlugsForId('remove-pdf', {
      en: 'remove-pages-pdf',
      id: 'hapus-halaman-pdf',
    }),
    seo: {
      en: {
        title: 'Remove PDF Pages Online - Delete Pages from PDF Locally',
        h1: 'Remove Pages from PDF Instantly',
        description: 'Delete unwanted pages from your PDF file securely inside your browser.',
        faqs: defaultFaqs('Remove PDF Pages', 'en'),
      },
      id: {
        title: 'Hapus Halaman PDF Online - Hapus Page PDF Gratis Tanpa Server',
        h1: 'Hapus Halaman PDF dengan Cepat & Aman',
        description: 'Pilih dan hapus halaman yang tidak diinginkan dari dokumen PDF Anda secara lokal.',
        faqs: defaultFaqs('Hapus Halaman PDF', 'id'),
      },
    },
  },
  {
    id: 'organize-pdf',
    category: 'pdf',
    iconName: 'LayoutList',
    slugs: generateSlugsForId('organize-pdf', {
      en: 'organize-pdf',
      id: 'sisip-halaman-pdf',
    }),
    seo: {
      en: {
        title: 'Organize PDF Online - Insert Pages into PDF Locally',
        h1: 'Insert Pages into PDF Precisely',
        description: 'Insert another PDF file at a specific page index securely inside your browser.',
        faqs: defaultFaqs('Organize PDF', 'en'),
      },
      id: {
        title: 'Sisipkan Halaman PDF Online - Extract & Insert Page PDF',
        h1: 'Sisipkan Halaman PDF di Posisi Spesifik',
        description: 'Sisipkan dokumen PDF tambahan ke halaman tertentu pada PDF utama Anda tanpa batasan.',
        faqs: defaultFaqs('Sisip Halaman PDF', 'id'),
      },
    },
  },
  {
    id: 'reorder-pdf-pages-drag-and-drop',
    category: 'pdf',
    iconName: 'LayoutList',
    slugs: generateSlugsForId('reorder-pdf-pages-drag-and-drop', {
      en: 'reorder-pdf-pages-drag-and-drop',
      id: 'menyusun-ulang-halaman-pdf-seret-dan-lepas',
      es: 'reordenar-p-ginas-pdf-arrastrar-y-soltar',
      fr: 'r-organiser-les-pages-pdf-par-glisser-d-poser',
      de: 'ordnen-sie-pdf-seiten-per-drag-drop-neu-an',
      ja: 'reorder-pdf-pages-drag-and-drop',
      pt: 'reordenar-p-ginas-pdf-arrastar-e-soltar',
      ru: 'reorder-pdf-pages-drag-and-drop',
      zh: 'reorder-pdf-pages-drag-and-drop',
      ar: 'reorder-pdf-pages-drag-and-drop',
      it: 'riordinare-le-pagine-pdf-trascinandole',
      ko: 'reorder-pdf-pages-drag-and-drop',
      nl: 'pdf-pagina-s-opnieuw-ordenen-slepen-en-neerzetten',
      tr: 'pdf-sayfalar-n-s-r-kleyip-b-rakarak-yeniden-s-ralama',
      pl: 'zmie-kolejno-stron-pdf-przeci-gnij-i-upu',
      vi: 's-p-x-p-l-i-c-c-trang-pdf-b-ng-c-ch-k-o-v-th',
      th: 'reorder-pdf-pages-drag-and-drop',
      sv: 'ndra-ordning-p-pdf-sidor-dra-och-sl-pp',
      cs: 'zm-nit-po-ad-str-nek-pdf-p-eta-en-m',
      da: 'omarranger-pdf-sider-tr-k-og-slip',
      el: 'reorder-pdf-pages-drag-and-drop',
      fi: 'j-rjest-pdf-sivut-uudelleen-vet-m-ll-ja-pudottamalla',
      he: 'reorder-pdf-pages-drag-and-drop',
      hu: 'pdf-oldalak-trendez-se-fogd-s-vidd',
      no: 'omorganisere-pdf-sider-dra-og-slipp',
      ro: 'reordona-i-paginile-pdf-prin-glisare-i-plasare',
      sk: 'zmeni-poradie-str-nok-pdf-drag-and-drop',
      uk: 'reorder-pdf-pages-drag-and-drop',
      ms: 'susun-semula-halaman-pdf-seret-dan-lepas',
    }),
    seo: {
      en: {
        title: 'Reorder PDF Pages Drag and Drop Free',
        h1: 'Reorder PDF Pages Easily with Drag and Drop',
        description: 'Organize and reorder pages in your PDF document visually by dragging and dropping thumbnails. 100% free and local.',
        faqs: defaultFaqs('Reorder PDF Pages', 'en'),
      },
      id: {
        title: 'Susun Ulang Halaman PDF Seret dan Lepas',
        h1: 'Urutkan Ulang Halaman PDF dengan Drag & Drop',
        description: 'Atur ulang urutan halaman PDF Anda secara visual hanya dengan seret dan lepas (drag & drop) thumbnail halaman di browser Anda.',
        faqs: defaultFaqs('Susun Ulang PDF', 'id'),
      },
    },
  },
  {
    id: 'sign-pdf',
    category: 'pdf',
    iconName: 'PenTool',
    slugs: generateSlugsForId('sign-pdf', { en: 'sign-pdf', id: 'ttd-pdf', es: 'firmar-pdf', fr: 'signer-pdf', de: 'pdf-unterschreiben', pt: 'assinar-pdf', it: 'firma-pdf', nl: 'pdf-ondertekenen' }),
    seo: {
      en: {
        title: 'Sign PDF Online - Add Electronic Signature to PDF',
        h1: 'E-Sign PDF Documents Locally',
        description: 'Draw, upload, or generate an electronic signature and add it to your PDF.',
        faqs: defaultFaqs('Sign PDF', 'en'),
      },
      id: {
        title: 'Tanda Tangan PDF Online - E-Sign PDF Gratis & Privat',
        h1: 'Bubuhkan Tanda Tangan Elektronik ke PDF',
        description: 'Gambar, ketik, atau unggah tanda tangan elektronik Anda dan letakkan di dokumen PDF secara lokal.',
        faqs: defaultFaqs('Tanda Tangan PDF', 'id'),
      },
    },
  },
  {
    id: 'sign-pdf-without-registration',
    category: 'pdf',
    iconName: 'PenTool',
    slugs: generateSlugsForId('sign-pdf-without-registration', {
      en: 'sign-pdf-without-registration',
      id: 'ttd-pdf-tanpa-daftar',
      es: 'firmar-pdf-sin-registro',
      fr: 'signer-pdf-sans-inscription',
      de: 'pdf-unterschreiben-ohne-registrierung',
      pt: 'assinar-pdf-sem-registro',
      it: 'firma-pdf-senza-registrazione',
      nl: 'pdf-ondertekenen-zonder-registratie',
      ja: 'touroku-nashi-de-pdf-ni-shomei',
      ru: 'podpisat-pdf-bez-registracii',
      zh: 'mianzhuce-qianming-pdf',
      ar: 'tawqia-pdf-bidun-tasjil',
      hi: 'bina-registration-pdf-sign-kare',
      ko: 'gaipeopsi-pdf-seomyeong',
      tr: 'kayitsiz-pdf-imzala',
      pl: 'podpisz-pdf-bez-rejestracji',
      vi: 'ky-pdf-khong-can-dang-ky',
      th: 'sen-pdf-doi-mai-tong-long-thabian',
      sv: 'signera-pdf-utan-registrering',
      cs: 'podepsat-pdf-bez-registrace',
      da: 'underskriv-pdf-uden-registrering',
      el: 'ypografi-pdf-xoris-eggrafi',
      fi: 'allekirjoita-pdf-ilman-rekisteroitymista',
      he: 'chatima-al-pdf-lelo-harshama',
      hu: 'pdf-alairas-regisztracio-nelkul',
      no: 'signer-pdf-uten-registrering',
      ro: 'semneaza-pdf-fara-inregistrare',
      sk: 'podpisat-pdf-bez-registracie',
      uk: 'pidpysaty-pdf-bez-reyestraciyi',
      ms: 'tandatangan-pdf-tanpa-pendaftaran',
    }),
    seo: {
      en: {
        title: 'Sign PDF Online Without Registration',
        h1: 'E-Sign PDF Documents Online Without Registration',
        description: 'Place your electronic signature on any PDF file instantly. No account required, no signup, 100% private and free.',
        faqs: defaultFaqs('Sign PDF Without Registration', 'en'),
      },
      id: {
        title: 'Tanda Tangan PDF Tanpa Daftar',
        h1: 'Tanda Tangani Dokumen PDF Tanpa Registrasi Akun',
        description: 'Bubuhkan tanda tangan elektronik ke berkas PDF secara instan dan gratis tanpa registrasi akun atau langganan.',
        faqs: defaultFaqs('Tanda Tangan PDF Tanpa Daftar', 'id'),
      },
    },
  },
  {
    id: 'protect-pdf',
    category: 'pdf',
    iconName: 'Lock',
    slugs: generateSlugsForId('protect-pdf', { en: 'protect-pdf', id: 'kunci-pdf', es: 'proteger-pdf', fr: 'proteger-pdf', de: 'pdf-schuetzen', pt: 'proteger-pdf', it: 'proteggi-pdf', nl: 'pdf-beveiligen' }),
    seo: {
      en: {
        title: 'Protect PDF Online - Password Protect PDF Locally',
        h1: 'Encrypt & Password Protect PDF Documents',
        description: 'Secure your PDF files with AES-256 encryption and password protection locally in your browser.',
        faqs: defaultFaqs('Protect PDF', 'en'),
      },
      id: {
        title: 'Kunci PDF Online - Enkripsi PDF & Beri Kata Sandi Secara Lokal',
        h1: 'Amankan Dokumen PDF dengan Kata Sandi',
        description: 'Lindungi file PDF Anda dari akses tidak sah dengan enkripsi AES-256 tingkat tinggi langsung di peramban Anda.',
        faqs: defaultFaqs('Kunci PDF', 'id'),
      },
    },
  },
  {
    id: 'unlock-pdf',
    category: 'pdf',
    iconName: 'Unlock',
    slugs: generateSlugsForId('unlock-pdf', { en: 'unlock-pdf', id: 'buka-kunci-pdf', es: 'desbloquear-pdf', fr: 'deverrouiller-pdf', de: 'pdf-entsperren', pt: 'desbloquear-pdf', it: 'sblocca-pdf', nl: 'pdf-ontgrendelen' }),
    seo: {
      en: {
        title: 'Unlock PDF Online - Remove PDF Password Locally',
        h1: 'Unlock Password Protected PDF Documents',
        description: 'Remove password and encryption from your PDF files instantly in your browser.',
        faqs: defaultFaqs('Unlock PDF', 'en'),
      },
      id: {
        title: 'Buka Kunci PDF Online - Hapus Kata Sandi PDF Gratis',
        h1: 'Buka File PDF yang Dikunci Kata Sandi',
        description: 'Hapus pengaman dan kata sandi dari dokumen PDF Anda secara instan dengan privasi terjamin 100%.',
        faqs: defaultFaqs('Buka Kunci PDF', 'id'),
      },
    },
  },
  {
    id: 'remove-pdf-password-without-password',
    category: 'pdf',
    iconName: 'Unlock',
    slugs: generateSlugsForId('remove-pdf-password-without-password', {
      en: 'remove-pdf-password-without-password',
      id: 'hapus-kata-sandi-pdf-tanpa-kata-sandi',
      es: 'eliminar-contrase-a-de-pdf-sin-contrase-a',
      fr: 'supprimer-le-mot-de-passe-pdf-sans-mot-de-passe',
      de: 'pdf-passwort-ohne-passwort-entfernen',
      ja: 'remove-pdf-password-without-password',
      pt: 'remover-senha-do-pdf-sem-senha',
      ru: 'remove-pdf-password-without-password',
      zh: 'remove-pdf-password-without-password',
      ar: 'remove-pdf-password-without-password',
      it: 'rimuovere-la-password-pdf-senza-password',
      ko: 'remove-pdf-password-without-password',
      nl: 'verwijder-pdf-wachtwoord-zonder-wachtwoord',
      tr: 'ifre-olmadan-pdf-ifresini-kald-r',
      pl: 'usu-has-o-pdf-bez-has-a',
      vi: 'x-a-m-t-kh-u-pdf-kh-ng-c-n-m-t-kh-u',
      th: 'remove-pdf-password-without-password',
      sv: 'ta-bort-pdf-l-senord-utan-l-senord',
      cs: 'odstranit-heslo-pdf-bez-hesla',
      da: 'fjern-pdf-adgangskode-uden-adgangskode',
      el: 'remove-pdf-password-without-password',
      fi: 'poista-pdf-salasana-ilman-salasanaa',
      he: 'remove-pdf-password-without-password',
      hu: 'pdf-jelsz-elt-vol-t-sa-jelsz-n-lk-l',
      no: 'fjern-pdf-passord-uten-passord',
      ro: 'elimina-i-parola-pdf-f-r-parol',
      sk: 'odstr-ni-heslo-pdf-bez-hesla',
      uk: 'remove-pdf-password-without-password',
      ms: 'keluarkan-kata-laluan-pdf-tanpa-kata-laluan',
    }),
    seo: {
      en: {
        title: 'Remove PDF Password Without Password',
        h1: 'Remove Password from PDF Without Password',
        description: 'Remove password protection from your PDF files without needing the original password using our advanced unlock tool.',
        faqs: defaultFaqs('Remove PDF Password', 'en'),
      },
      id: {
        title: 'Hapus Kata Sandi PDF Tanpa Kata Sandi',
        h1: 'Hapus Kata Sandi dari PDF Tanpa Kata Sandi',
        description: 'Buka proteksi dokumen PDF Anda yang terkunci meskipun Anda lupa kata sandinya dengan fitur penghapusan canggih kami.',
        faqs: defaultFaqs('Hapus Kata Sandi PDF', 'id'),
      },
    },
  },
  {
    id: 'crop-pdf',
    category: 'pdf',
    iconName: 'Crop',
    slugs: generateSlugsForId('crop-pdf', {
      en: 'crop-pdf',
      id: 'potong-margin-pdf',
    }),
    seo: {
      en: {
        title: 'Crop PDF Online - Remove Margins from PDF Locally',
        h1: 'Crop PDF Pages Instantly',
        description: 'Remove white margins or cut PDF pages to a specific size locally in your browser.',
        faqs: defaultFaqs('Crop PDF', 'en'),
      },
      id: {
        title: 'Potong Margin PDF Online - Crop Halaman PDF Gratis',
        h1: 'Potong Margin & Area Halaman PDF',
        description: 'Pangkas pinggiran putih pada jurnal atau dokumen PDF Anda agar lebih nyaman dibaca di tablet atau HP.',
        faqs: defaultFaqs('Crop PDF', 'id'),
      },
    },
  },
  {
    id: 'extract-images-pdf',
    category: 'pdf',
    iconName: 'Images',
    slugs: generateSlugsForId('extract-images-pdf', {
      en: 'extract-images-from-pdf',
      id: 'ambil-gambar-dari-pdf',
    }),
    seo: {
      en: {
        title: 'Extract Images from PDF - Save All Pictures from PDF',
        h1: 'Extract Images & Photos from PDF',
        description: 'Instantly scan your PDF and extract all embedded images as high-quality JPG/PNG files locally.',
        faqs: defaultFaqs('Extract Images', 'en'),
      },
      id: {
        title: 'Ambil Gambar dari PDF Online - Ekstrak Foto dari PDF',
        h1: 'Ekstrak Seluruh Gambar dari PDF',
        description: 'Ambil dan simpan semua foto, grafik, atau logo dari dokumen PDF Anda menjadi file gambar terpisah (ZIP).',
        faqs: defaultFaqs('Ekstrak Gambar', 'id'),
      },
    },
  },
  {
    id: 'grayscale-pdf',
    category: 'pdf',
    iconName: 'Contrast',
    slugs: generateSlugsForId('grayscale-pdf', {
      en: 'convert-pdf-to-grayscale',
      id: 'ubah-pdf-jadi-hitam-putih',
    }),
    seo: {
      en: {
        title: 'Convert PDF to Grayscale - Black and White PDF Online',
        h1: 'Make PDF Black and White',
        description: 'Convert colored PDF documents to grayscale instantly in your browser to save printing ink.',
        faqs: defaultFaqs('Grayscale PDF', 'en'),
      },
      id: {
        title: 'Ubah PDF Jadi Hitam Putih - Grayscale PDF Gratis',
        h1: 'Ubah PDF Berwarna Menjadi Hitam Putih',
        description: 'Konversi dokumen berwarna Anda menjadi PDF hitam putih (grayscale) secara privat untuk menghemat tinta cetak.',
        faqs: defaultFaqs('Grayscale PDF', 'id'),
      },
    },
  },
  {
    id: 'crop-pdf-margins',
    category: 'pdf',
    iconName: 'Crop',
    slugs: generateSlugsForId('crop-pdf-margins', { en: 'crop-pdf-margins', id: 'potong-margin-pdf', es: 'recortar-m-rgenes-de-pdf', fr: 'recadrer-les-marges-du-pdf', de: 'pdf-r-nder-zuschneiden', ja: 'pdf', pt: 'cortar-margens-do-pdf', ru: 'pdf', zh: 'pdf', ar: 'pdf', hi: '', it: 'ritagliare-i-margini-del-pdf', ko: 'pdf-여백-자르기', nl: 'pdf-marges-bijsnijden', tr: 'pdf-kenar-bo-luklar-n-k-rp', pl: 'przytnij-marginesy-pdf', vi: 'c-t-l-pdf', th: 'pdf', sv: 'besk-r-pdf-marginaler', cs: 'o-znout-okraje-pdf', da: 'besk-r-pdf-margener', el: 'pdf', fi: 'rajaa-pdf-reunukset', he: 'pdf', hu: 'v-gja-le-a-pdf-marg-kat', no: 'beskj-re-pdf-marginer', ro: 'decupa-i-marginile-pdf', sk: 'oreza-okraje-pdf', uk: 'pdf', ms: 'pangkas-pdf-margin',}),
    seo: {
        id: {
          title: 'Pangkas Margin Putih dari Halaman PDF Gratis',
          h1: 'Pangkas Margin PDF dengan Mudah',
          description: 'Hapus margin putih yang mengganggu dari dokumen PDF Anda untuk pengalaman membaca yang lebih baik.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'id'),
        },
        es: {
          title: 'Recortar márgenes blancos de páginas PDF gratis',
          h1: 'Recorta los márgenes de un PDF fácilmente',
          description: 'Elimine los molestos márgenes blancos de sus documentos PDF para una mejor experiencia de lectura.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'es'),
        },
        fr: {
          title: 'Recadrer les marges blanches des pages PDF gratuitement',
          h1: 'Recadrez facilement les marges du PDF',
          description: 'Supprimez les marges blanches gênantes de vos documents PDF pour une meilleure expérience de lecture.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'fr'),
        },
        de: {
          title: 'Weiße Ränder von PDF-Seiten kostenlos zuschneiden',
          h1: 'PDF-Ränder einfach zuschneiden',
          description: 'Entfernen Sie störende weiße Ränder aus Ihren PDF-Dokumenten für ein besseres Leseerlebnis.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'de'),
        },
        ja: {
          title: 'PDFページから白い余白を無料でトリミング',
          h1: 'PDFの余白を簡単にトリミング',
          description: 'PDF ドキュメントから煩わしい白い余白を削除して、読みやすさを向上させます。',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'ja'),
        },
        pt: {
          title: 'Cortar margens brancas de páginas PDF gratuitamente',
          h1: 'Corte facilmente as margens do PDF',
          description: 'Remova as irritantes margens brancas dos seus documentos PDF para uma melhor experiência de leitura.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'pt'),
        },
        ru: {
          title: 'Обрезать белые поля на страницах PDF бесплатно',
          h1: 'Легко обрезайте поля PDF',
          description: 'Удалите раздражающие белые поля из PDF-документов, чтобы чтение было удобнее.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'ru'),
        },
        zh: {
          title: '免费从 PDF 页面裁剪白边',
          h1: '轻松裁剪 PDF 边距',
          description: '删除 PDF 文档中烦人的白边，以获得更好的阅读体验。',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'zh'),
        },
        ar: {
          title: 'قص الهوامش البيضاء من صفحات PDF مجانًا',
          h1: 'قص هوامش PDF بسهولة',
          description: 'قم بإزالة الهوامش البيضاء المزعجة من مستندات PDF الخاصة بك للحصول على تجربة قراءة أفضل.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'ar'),
        },
        hi: {
          title: 'पीडीएफ पेजों से सफेद मार्जिन को निःशुल्क काटें',
          h1: 'आसानी से पीडीएफ मार्जिन क्रॉप करें',
          description: 'बेहतर पढ़ने के अनुभव के लिए अपने पीडीएफ दस्तावेजों से कष्टप्रद सफेद हाशिए हटा दें।',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'hi'),
        },
        it: {
          title: 'Ritaglia gratuitamente i margini bianchi dalle pagine PDF',
          h1: 'Ritaglia facilmente i margini dei PDF',
          description: 'Rimuovi i fastidiosi margini bianchi dai tuoi documenti PDF per un\'esperienza di lettura migliore.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'it'),
        },
        ko: {
          title: 'PDF 페이지에서 무료로 흰색 여백 자르기',
          h1: 'PDF 여백을 쉽게 자르기',
          description: '더 나은 읽기 환경을 위해 PDF 문서에서 성가신 흰색 여백을 제거하십시오.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'ko'),
        },
        nl: {
          title: 'Witte marges bijsnijden van PDF-pagina\'s Gratis',
          h1: 'Snijd eenvoudig PDF-marges bij',
          description: 'Verwijder vervelende witte marges uit uw PDF-documenten voor een betere leeservaring.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'nl'),
        },
        tr: {
          title: 'PDF Sayfalarından Beyaz Kenar Boşluklarını Ücretsiz Kırp',
          h1: 'PDF Kenar Boşluklarını Kolayca Kırpın',
          description: 'Daha iyi bir okuma deneyimi için PDF belgelerinizdeki can sıkıcı beyaz kenar boşluklarını kaldırın.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'tr'),
        },
        pl: {
          title: 'Przytnij białe marginesy ze stron PDF za darmo',
          h1: 'Łatwe przycinanie marginesów PDF',
          description: 'Usuń irytujące białe marginesy z dokumentów PDF, aby zapewnić sobie lepsze wrażenia podczas czytania.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'pl'),
        },
        vi: {
          title: 'Cắt lề trắng từ các trang PDF miễn phí',
          h1: 'Cắt lề PDF dễ dàng',
          description: 'Loại bỏ các lề trắng khó chịu khỏi tài liệu PDF của bạn để có trải nghiệm đọc tốt hơn.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'vi'),
        },
        th: {
          title: 'ครอบตัดขอบสีขาวจากหน้า PDF ฟรี',
          h1: 'ครอบตัดระยะขอบ PDF ได้อย่างง่ายดาย',
          description: 'ลบขอบสีขาวที่น่ารำคาญออกจากเอกสาร PDF ของคุณเพื่อประสบการณ์การอ่านที่ดียิ่งขึ้น',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'th'),
        },
        sv: {
          title: 'Beskär vita marginaler från PDF-sidor gratis',
          h1: 'Beskär PDF-marginaler enkelt',
          description: 'Ta bort irriterande vita marginaler från dina PDF-dokument för en bättre läsupplevelse.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'sv'),
        },
        cs: {
          title: 'Oříznout bílé okraje ze stránek PDF zdarma',
          h1: 'Snadno ořízněte okraje PDF',
          description: 'Odstraňte nepříjemné bílé okraje z dokumentů PDF pro lepší zážitek ze čtení.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'cs'),
        },
        da: {
          title: 'Beskær hvide marginer fra PDF-sider gratis',
          h1: 'Beskær nemt PDF-margener',
          description: 'Fjern irriterende hvide margener fra dine PDF-dokumenter for en bedre læseoplevelse.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'da'),
        },
        el: {
          title: 'Περικοπή λευκών περιθωρίων από σελίδες PDF Δωρεάν',
          h1: 'Εύκολη περικοπή περιθωρίων PDF',
          description: 'Αφαιρέστε τα ενοχλητικά λευκά περιθώρια από τα έγγραφα PDF σας για καλύτερη εμπειρία ανάγνωσης.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'el'),
        },
        fi: {
          title: 'Rajaa valkoisia marginaaleja PDF-sivuilta ilmaiseksi',
          h1: 'Rajaa PDF-reunuksia helposti',
          description: 'Poista ärsyttävät valkoiset marginaalit PDF-dokumenteistasi parantaaksesi lukukokemusta.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'fi'),
        },
        he: {
          title: 'חיתוך שוליים לבנים מדפי PDF בחינם',
          h1: 'חיתוך שולי PDF בקלות',
          description: 'הסר שוליים לבנים מעצבנים ממסמכי ה-PDF שלך לחוויית קריאה טובה יותר.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'he'),
        },
        hu: {
          title: 'Fehér margók levágása PDF-oldalakról ingyenes',
          h1: 'Könnyen vágja le a PDF-margókat',
          description: 'A jobb olvasási élmény érdekében távolítsa el a bosszantó fehér margókat PDF-dokumentumaiból.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'hu'),
        },
        no: {
          title: 'Beskjær hvite marger fra PDF-sider gratis',
          h1: 'Beskjær PDF-marger enkelt',
          description: 'Fjern irriterende hvite marger fra PDF-dokumentene dine for en bedre leseopplevelse.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'no'),
        },
        ro: {
          title: 'Decupați marjele albe din paginile PDF gratuit',
          h1: 'Decupați cu ușurință marjele PDF',
          description: 'Eliminați marginile albe enervante din documentele PDF pentru o experiență de citire mai bună.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'ro'),
        },
        sk: {
          title: 'Orezať biele okraje zo stránok PDF zadarmo',
          h1: 'Jednoduché orezanie okrajov PDF',
          description: 'Odstráňte nepríjemné biele okraje z dokumentov PDF, aby ste si mohli lepšie čítať.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'sk'),
        },
        uk: {
          title: 'Обрізати білі поля зі сторінок PDF безкоштовно',
          h1: 'Легко обрізайте поля PDF',
          description: 'Видаліть надокучливі білі поля з PDF-документів для кращого читання.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'uk'),
        },
        ms: {
          title: 'Pangkas Margin Putih daripada Halaman PDF Percuma',
          h1: 'Pangkas Margin PDF Dengan Mudah',
          description: 'Alih keluar jidar putih yang menjengkelkan daripada dokumen PDF anda untuk pengalaman membaca yang lebih baik.',
          faqs: defaultFaqs('Crop PDF Margins Easily', 'ms'),
        },
      en: {
        title: 'Crop White Margins from PDF Pages Free',
        h1: 'Crop PDF Margins Easily',
        description: 'Remove annoying white margins from your PDF documents for a better reading experience.',
        faqs: defaultFaqs('Crop Margins', 'en'),
      }
    }
  },
  {
    id: 'grayscale-pdf-for-printing',
    category: 'pdf',
    iconName: 'Contrast',
    slugs: generateSlugsForId('grayscale-pdf-for-printing', { en: 'grayscale-pdf-for-printing', id: 'pdf-skala-abu-abu-untuk-dicetak', es: 'pdf-en-escala-de-grises-para-imprimir', fr: 'pdf-en-niveaux-de-gris-pour-l-impression', de: 'graustufen-pdf-zum-drucken', ja: 'pdf', pt: 'pdf-em-escala-de-cinza-para-impress-o', ru: 'pdf', zh: 'pdf', ar: 'pdf', hi: '', it: 'pdf-in-scala-di-grigi-per-la-stampa', ko: '인쇄용-그레이스케일-pdf', nl: 'grijswaarden-pdf-voor-afdrukken', tr: 'yazd-rmak-i-in-gri-tonlamal-pdf', pl: 'pdf-w-skali-szaro-ci-do-druku', vi: 'pdf-thang-x-m-in', th: 'pdf', sv: 'gr-skala-pdf-f-r-utskrift', cs: 'pdf-ve-stupn-ch-edi-pro-tisk', da: 'gr-toner-pdf-til-udskrivning', el: 'pdf', fi: 'harmaas-vyinen-pdf-tulostukseen', he: 'pdf', hu: 'sz-rke-rnyalatos-pdf-nyomtat-shoz', no: 'gr-toner-pdf-for-utskrift', ro: 'pdf-n-tonuri-de-gri-pentru-imprimare', sk: 'pdf-v-odtie-och-sivej-na-tla', uk: 'pdf', ms: 'pdf-skala-kelabu-untuk-dicetak',}),
    seo: {
        id: {
          title: 'Konversi PDF Berwarna ke Skala Abu-abu untuk Pencetakan',
          h1: 'PDF skala abu-abu untuk Pencetakan',
          description: 'Ubah dokumen PDF berwarna menjadi hitam putih secara instan untuk menghemat tinta cetak.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'id'),
        },
        es: {
          title: 'Convierta PDF en color a escala de grises para imprimir',
          h1: 'PDF en escala de grises para imprimir',
          description: 'Convierta documentos PDF en color a blanco y negro al instante para ahorrar tinta de impresión.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'es'),
        },
        fr: {
          title: 'Convertir un PDF couleur en niveaux de gris pour l\'impression',
          h1: 'PDF en niveaux de gris pour l\'impression',
          description: 'Convertissez instantanément des documents PDF couleur en noir et blanc pour économiser l\'encre d\'impression.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'fr'),
        },
        de: {
          title: 'Konvertieren Sie Farb-PDFs zum Drucken in Graustufen',
          h1: 'Graustufen-PDF zum Drucken',
          description: 'Wandeln Sie farbige PDF-Dokumente sofort in Schwarzweiß um, um Drucktinte zu sparen.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'de'),
        },
        ja: {
          title: 'カラー PDF を印刷用にグレースケールに変換する',
          h1: '印刷用のグレースケール PDF',
          description: 'カラーの PDF ドキュメントを即座に白黒に変換して、印刷インクを節約します。',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'ja'),
        },
        pt: {
          title: 'Converter PDF colorido em escala de cinza para impressão',
          h1: 'PDF em escala de cinza para impressão',
          description: 'Converta documentos PDF coloridos em preto e branco instantaneamente para economizar tinta de impressão.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'pt'),
        },
        ru: {
          title: 'Преобразование цветного PDF в оттенки серого для печати',
          h1: 'PDF в оттенках серого для печати',
          description: 'Мгновенно конвертируйте цветные PDF-документы в черно-белые, чтобы сэкономить печатную краску.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'ru'),
        },
        zh: {
          title: '将彩色 PDF 转换为灰度以进行打印',
          h1: '用于打印的灰度 PDF',
          description: '立即将彩色 PDF 文档转换为黑白文档，以节省印刷墨水。',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'zh'),
        },
        ar: {
          title: 'تحويل ملف PDF الملون إلى تدرج الرمادي للطباعة',
          h1: 'تدرج الرمادي PDF للطباعة',
          description: 'قم بتحويل مستندات PDF الملونة إلى الأبيض والأسود على الفور لتوفير حبر الطباعة.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'ar'),
        },
        hi: {
          title: 'मुद्रण के लिए रंगीन पीडीएफ को ग्रेस्केल में बदलें',
          h1: 'मुद्रण के लिए ग्रेस्केल पीडीएफ',
          description: 'मुद्रण स्याही बचाने के लिए रंगीन पीडीएफ दस्तावेज़ों को तुरंत काले और सफेद में बदलें।',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'hi'),
        },
        it: {
          title: 'Converti PDF a colori in scala di grigi per la stampa',
          h1: 'PDF in scala di grigi per la stampa',
          description: 'Converti istantaneamente documenti PDF a colori in bianco e nero per risparmiare inchiostro di stampa.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'it'),
        },
        ko: {
          title: '인쇄를 위해 컬러 PDF를 그레이스케일로 변환',
          h1: '인쇄용 그레이스케일 PDF',
          description: '컬러 PDF 문서를 즉시 흑백으로 변환하여 인쇄 잉크를 절약하세요.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'ko'),
        },
        nl: {
          title: 'Converteer kleuren-PDF naar grijswaarden voor afdrukken',
          h1: 'Grijswaarden PDF voor afdrukken',
          description: 'Converteer gekleurde PDF-documenten onmiddellijk naar zwart-wit om drukinkt te besparen.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'nl'),
        },
        tr: {
          title: 'Yazdırma için Renkli PDF\'yi Gri Tonlamaya Dönüştürme',
          h1: 'Yazdırma için Gri Tonlamalı PDF',
          description: 'Baskı mürekkebinden tasarruf etmek için renkli PDF belgelerini anında siyah beyaza dönüştürün.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'tr'),
        },
        pl: {
          title: 'Konwertuj kolorowy plik PDF na skalę szarości w celu drukowania',
          h1: 'PDF w skali szarości do druku',
          description: 'Błyskawicznie konwertuj kolorowe dokumenty PDF na czarno-białe, aby oszczędzać atrament drukarski.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'pl'),
        },
        vi: {
          title: 'Chuyển đổi PDF màu sang thang độ xám để in',
          h1: 'PDF thang độ xám để in',
          description: 'Chuyển đổi tài liệu PDF màu sang đen trắng ngay lập tức để tiết kiệm mực in.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'vi'),
        },
        th: {
          title: 'แปลง PDF สีเป็นระดับสีเทาสำหรับการพิมพ์',
          h1: 'PDF ระดับสีเทาสำหรับการพิมพ์',
          description: 'แปลงเอกสาร PDF สีเป็นขาวดำทันทีเพื่อประหยัดหมึกพิมพ์',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'th'),
        },
        sv: {
          title: 'Konvertera färg PDF till gråskala för utskrift',
          h1: 'Gråskala PDF för utskrift',
          description: 'Konvertera färgade PDF-dokument till svartvitt direkt för att spara tryckfärg.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'sv'),
        },
        cs: {
          title: 'Převést barevné PDF na stupně šedi pro tisk',
          h1: 'PDF ve stupních šedi pro tisk',
          description: 'Okamžitě převádějte barevné dokumenty PDF na černobílé, abyste ušetřili tiskový inkoust.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'cs'),
        },
        da: {
          title: 'Konverter farve PDF til gråtoner til udskrivning',
          h1: 'Gråtoner PDF til udskrivning',
          description: 'Konverter farvede PDF-dokumenter til sort/hvid øjeblikkeligt for at spare trykfarve.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'da'),
        },
        el: {
          title: 'Μετατροπή έγχρωμου PDF σε κλίμακα του γκρι για εκτύπωση',
          h1: 'PDF σε κλίμακα του γκρι για εκτύπωση',
          description: 'Μετατρέψτε έγχρωμα έγγραφα PDF σε ασπρόμαυρα άμεσα για εξοικονόμηση μελάνης εκτύπωσης.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'el'),
        },
        fi: {
          title: 'Muunna värillinen PDF harmaasävyiksi tulostamista varten',
          h1: 'Harmaasävy PDF tulostukseen',
          description: 'Muunna värilliset PDF-asiakirjat mustavalkoisiksi välittömästi tulostusmusteen säästämiseksi.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'fi'),
        },
        he: {
          title: 'המר PDF צבעוני לגווני אפור להדפסה',
          h1: 'PDF בגווני אפור להדפסה',
          description: 'המר מסמכי PDF צבעוניים לשחור ולבן באופן מיידי כדי לחסוך בדיו להדפסה.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'he'),
        },
        hu: {
          title: 'Színes PDF konvertálása szürkeárnyalatossá nyomtatáshoz',
          h1: 'Szürkeárnyalatos PDF nyomtatáshoz',
          description: 'A nyomdafesték megtakarítása érdekében azonnal konvertálja a színes PDF dokumentumokat fekete-fehérré.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'hu'),
        },
        no: {
          title: 'Konverter farge-PDF til gråtoner for utskrift',
          h1: 'Gråtoner PDF for utskrift',
          description: 'Konverter fargede PDF-dokumenter til svart-hvitt umiddelbart for å spare utskriftsblekk.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'no'),
        },
        ro: {
          title: 'Convertiți PDF color în tonuri de gri pentru imprimare',
          h1: 'PDF în tonuri de gri pentru imprimare',
          description: 'Convertiți instantaneu documentele PDF colorate în alb-negru pentru a economisi cerneala de imprimare.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'ro'),
        },
        sk: {
          title: 'Previesť farebné PDF do odtieňov sivej na tlač',
          h1: 'PDF v odtieňoch sivej na tlač',
          description: 'Okamžite konvertujte farebné dokumenty PDF na čiernobiele, aby ste ušetrili tlačový atrament.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'sk'),
        },
        uk: {
          title: 'Перетворюйте кольоровий PDF у відтінки сірого для друку',
          h1: 'Відтінки сірого PDF для друку',
          description: 'Миттєво перетворюйте кольорові документи PDF на чорно-білі, щоб заощадити друкарське чорнило.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'uk'),
        },
        ms: {
          title: 'Tukar PDF Warna kepada Skala Kelabu untuk Pencetakan',
          h1: 'PDF Skala Kelabu untuk Pencetakan',
          description: 'Tukar dokumen PDF berwarna kepada hitam dan putih serta-merta untuk menjimatkan dakwat percetakan.',
          faqs: defaultFaqs('Grayscale PDF for Printing', 'ms'),
        },
      en: {
        title: 'Convert Color PDF to Grayscale for Printing',
        h1: 'Grayscale PDF for Printing',
        description: 'Convert colored PDF documents to black and white instantly to save printing ink.',
        faqs: defaultFaqs('Grayscale PDF', 'en'),
      }
    }
  },
  {
    id: 'remove-pdf-author-metadata',
    category: 'pdf',
    iconName: 'Eraser',
    slugs: generateSlugsForId('remove-pdf-author-metadata', { en: 'remove-pdf-author-metadata', id: 'hapus-metadata-penulis-pdf', es: 'eliminar-metadatos-del-autor-en-pdf', fr: 'supprimer-les-m-tadonn-es-de-l-auteur-du-pdf', de: 'entfernen-sie-die-metadaten-des-pdf-autors', ja: 'pdf', pt: 'remover-metadados-do-autor-do-pdf', ru: 'pdf', zh: 'pdf', ar: 'pdf', hi: '', it: 'rimuovere-i-metadati-dell-autore-del-pdf', ko: 'pdf-작성자-메타데이터-제거', nl: 'verwijder-de-metadata-van-de-pdf-auteur', tr: 'pdf-yazar-meta-verilerini-kald-r', pl: 'usu-metadane-autora-pliku-pdf', vi: 'x-a-si-u-d-li-u-t-c-gi-pdf', th: 'pdf', sv: 'ta-bort-pdf-f-rfattarens-metadata', cs: 'odstranit-metadata-autora-pdf', da: 'fjerne-pdf-forfatter-metadata', el: 'pdf', fi: 'poista-pdf-kirjoittajan-metatiedot', he: 'pdf', hu: 't-vol-tsa-el-a-pdf-szerz-metaadatait', no: 'fjern-pdf-forfattermetadata', ro: 'elimina-metadatele-autorului-pdf', sk: 'odstr-ni-metad-ta-autora-pdf', uk: 'pdf', ms: 'alih-keluar-metadata-pengarang-pdf',}),
    seo: {
        id: {
          title: 'Hapus Nama Penulis dan Metadata Tersembunyi dari PDF',
          h1: 'Sanitasi Metadata PDF',
          description: 'Hapus nama penulis, tanggal pembuatan, dan jejak perangkat lunak tersembunyi dengan aman dari PDF Anda.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'id'),
        },
        es: {
          title: 'Eliminar el nombre del autor y los metadatos ocultos del PDF',
          h1: 'Desinfectar metadatos PDF',
          description: 'Elimine de forma segura los nombres de los autores, las fechas de creación y las huellas de software ocultas de sus archivos PDF.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'es'),
        },
        fr: {
          title: 'Supprimer le nom de l\'auteur et les métadonnées masquées du PDF',
          h1: 'Désinfecter les métadonnées PDF',
          description: 'Supprimez en toute sécurité les noms d’auteurs, les dates de création et les empreintes logicielles cachées de vos PDF.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'fr'),
        },
        de: {
          title: 'Entfernen Sie den Autorennamen und versteckte Metadaten aus PDF',
          h1: 'Bereinigen Sie PDF-Metadaten',
          description: 'Entfernen Sie Autorennamen, Erstellungsdaten und versteckte Software-Footprints sicher aus Ihren PDFs.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'de'),
        },
        ja: {
          title: 'PDF から作成者名と非表示のメタデータを削除する',
          h1: 'PDF メタデータをサニタイズする',
          description: 'PDF から作成者名、作成日、非表示のソフトウェア フットプリントを安全に削除します。',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'ja'),
        },
        pt: {
          title: 'Remova o nome do autor e os metadados ocultos do PDF',
          h1: 'Limpe metadados de PDF',
          description: 'Remova com segurança nomes de autores, datas de criação e pegadas de software ocultas de seus PDFs.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'pt'),
        },
        ru: {
          title: 'Удалить имя автора и скрытые метаданные из PDF',
          h1: 'Очистка метаданных PDF',
          description: 'Надежно удалите имена авторов, даты создания и скрытые следы программного обеспечения из ваших PDF-файлов.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'ru'),
        },
        zh: {
          title: '从 PDF 中删除作者姓名和隐藏元数据',
          h1: '清理 PDF 元数据',
          description: '从 PDF 中安全地删除作者姓名、创建日期和隐藏的软件足迹。',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'zh'),
        },
        ar: {
          title: 'إزالة اسم المؤلف والبيانات التعريفية المخفية من PDF',
          h1: 'تطهير البيانات التعريفية لملف PDF',
          description: 'قم بإزالة أسماء المؤلفين وتواريخ الإنشاء وآثار البرامج المخفية بشكل آمن من ملفات PDF الخاصة بك.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'ar'),
        },
        hi: {
          title: 'पीडीएफ से लेखक का नाम और छिपा हुआ मेटाडेटा हटाएं',
          h1: 'पीडीएफ मेटाडेटा को स्वच्छ करें',
          description: 'अपने पीडीएफ़ से लेखक के नाम, निर्माण तिथियाँ और छिपे हुए सॉफ़्टवेयर फ़ुटप्रिंट को सुरक्षित रूप से हटा दें।',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'hi'),
        },
        it: {
          title: 'Rimuovi il nome dell\'autore e i metadati nascosti dal PDF',
          h1: 'Disinfetta i metadati dei PDF',
          description: 'Rimuovi in ​​modo sicuro i nomi degli autori, le date di creazione e le tracce di software nascoste dai tuoi PDF.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'it'),
        },
        ko: {
          title: 'PDF에서 작성자 이름 및 숨겨진 메타데이터 제거',
          h1: 'PDF 메타데이터 삭제',
          description: 'PDF에서 작성자 이름, 작성 날짜 및 숨겨진 소프트웨어 발자국을 안전하게 제거하세요.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'ko'),
        },
        nl: {
          title: 'Verwijder de auteursnaam en verborgen metadata uit PDF',
          h1: 'PDF-metagegevens opschonen',
          description: 'Verwijder veilig auteursnamen, aanmaakdatums en verborgen software-footprints uit uw PDF\'s.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'nl'),
        },
        tr: {
          title: 'Yazar Adını ve Gizli Meta Verileri PDF\'den Kaldır',
          h1: 'PDF Meta Verilerini Temizleyin',
          description: 'Yazar adlarını, oluşturulma tarihlerini ve gizli yazılım ayak izlerini PDF\'lerinizden güvenli bir şekilde kaldırın.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'tr'),
        },
        pl: {
          title: 'Usuń nazwę autora i ukryte metadane z pliku PDF',
          h1: 'Oczyść metadane PDF',
          description: 'Bezpiecznie usuwaj nazwiska autorów, daty utworzenia i ukryte ślady oprogramowania z plików PDF.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'pl'),
        },
        vi: {
          title: 'Xóa tên tác giả và siêu dữ liệu ẩn khỏi PDF',
          h1: 'Vệ sinh siêu dữ liệu PDF',
          description: 'Xóa tên tác giả, ngày tạo và dấu chân phần mềm ẩn khỏi tệp PDF của bạn một cách an toàn.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'vi'),
        },
        th: {
          title: 'ลบชื่อผู้แต่งและข้อมูลเมตาที่ซ่อนอยู่ออกจาก PDF',
          h1: 'ฆ่าเชื้อข้อมูลเมตา PDF',
          description: 'ลบชื่อผู้เขียน วันที่สร้าง และรอยเท้าซอฟต์แวร์ที่ซ่อนอยู่ออกจาก PDF ของคุณอย่างปลอดภัย',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'th'),
        },
        sv: {
          title: 'Ta bort författarens namn och dolda metadata från PDF',
          h1: 'Rensa PDF-metadata',
          description: 'Ta bort författarnamn, skapandedatum och dolda programvaruavtryck från dina PDF-filer på ett säkert sätt.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'sv'),
        },
        cs: {
          title: 'Odebrat jméno autora a skrytá metadata z PDF',
          h1: 'Dezinfikujte metadata PDF',
          description: 'Bezpečně odstraňte ze svých PDF jména autorů, data vytvoření a skryté stopy softwaru.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'cs'),
        },
        da: {
          title: 'Fjern forfatternavn og skjulte metadata fra PDF',
          h1: 'Rengør PDF-metadata',
          description: 'Fjern sikkert forfatternavne, oprettelsesdatoer og skjulte softwarefodspor fra dine PDF\'er.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'da'),
        },
        el: {
          title: 'Καταργήστε το όνομα του συγγραφέα και τα κρυφά μεταδεδομένα από το PDF',
          h1: 'Εξυγίανση μεταδεδομένων PDF',
          description: 'Καταργήστε με ασφάλεια τα ονόματα των δημιουργών, τις ημερομηνίες δημιουργίας και τα κρυφά αποτυπώματα λογισμικού από τα PDF σας.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'el'),
        },
        fi: {
          title: 'Poista tekijän nimi ja piilotetut metatiedot PDF-tiedostosta',
          h1: 'Puhdista PDF-metatiedot',
          description: 'Poista turvallisesti tekijöiden nimet, luontipäivämäärät ja piilotetut ohjelmistojalanjäljet ​​PDF-tiedostoistasi.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'fi'),
        },
        he: {
          title: 'הסר את שם המחבר ומטא נתונים מוסתרים מ-PDF',
          h1: 'ניקוי מטא נתונים של PDF',
          description: 'הסר באופן מאובטח שמות מחברים, תאריכי יצירה וטביעות רגליים נסתרות של תוכנה מקובצי ה-PDF שלך.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'he'),
        },
        hu: {
          title: 'Távolítsa el a szerző nevét és a rejtett metaadatokat a PDF-ből',
          h1: 'A PDF-metaadatok megtisztítása',
          description: 'Biztonságosan távolítsa el a szerzők neveit, a létrehozási dátumokat és a rejtett szoftverlábnyomokat a PDF-ekből.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'hu'),
        },
        no: {
          title: 'Fjern forfatternavn og skjulte metadata fra PDF',
          h1: 'Renser PDF-metadata',
          description: 'Fjern forfatternavn, opprettelsesdatoer og skjulte programvarefootprints på en sikker måte fra PDF-ene dine.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'no'),
        },
        ro: {
          title: 'Eliminați numele autorului și metadatele ascunse din PDF',
          h1: 'Dezinfectează metadatele PDF',
          description: 'Eliminați în siguranță numele autorilor, datele de creație și amprentele software ascunse din PDF-urile dvs.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'ro'),
        },
        sk: {
          title: 'Odstráňte meno autora a skryté metadáta z PDF',
          h1: 'Dezinfikujte metadáta PDF',
          description: 'Bezpečne odstráňte mená autorov, dátumy vytvorenia a skryté stopy softvéru zo svojich súborov PDF.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'sk'),
        },
        uk: {
          title: 'Видаліть ім’я автора та приховані метадані з PDF',
          h1: 'Очистити метадані PDF',
          description: 'Надійно видаліть зі своїх PDF-файлів імена авторів, дати створення та приховані сліди програмного забезпечення.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'uk'),
        },
        ms: {
          title: 'Alih keluar Nama Pengarang dan Metadata Tersembunyi daripada PDF',
          h1: 'Bersihkan Metadata PDF',
          description: 'Alih keluar nama pengarang, tarikh penciptaan dan jejak perisian tersembunyi dengan selamat daripada PDF anda.',
          faqs: defaultFaqs('Sanitize PDF Metadata', 'ms'),
        },
      en: {
        title: 'Remove Author Name and Hidden Metadata from PDF',
        h1: 'Sanitize PDF Metadata',
        description: 'Securely remove author names, creation dates, and hidden software footprints from your PDFs.',
        faqs: defaultFaqs('Remove Metadata', 'en'),
      }
    }
  },
  {
    id: 'extract-high-res-images-pdf',
    category: 'pdf',
    iconName: 'Images',
    slugs: generateSlugsForId('extract-high-res-images-pdf', { en: 'extract-high-res-images-pdf', id: 'ekstrak-gambar-resolusi-tinggi-pdf', es: 'extraer-im-genes-de-alta-resoluci-n-pdf', fr: 'extraire-des-images-haute-r-solution-pdf', de: 'extrahieren-sie-hochaufl-sende-bilder-im-pdf-format', ja: 'pdf', pt: 'extrair-imagens-em-alta-resolu-o-pdf', ru: 'pdf', zh: 'pdf', ar: 'pdf', hi: '', it: 'estrarre-immagini-ad-alta-risoluzione-pdf', ko: '고해상도-이미지-pdf-추출', nl: 'extract-hoge-resolutie-afbeeldingen-pdf', tr: 'y-ksek-z-n-rl-kl-g-r-nt-leri-pdf-olarak-kar-n', pl: 'wyodr-bnij-obrazy-pdf-w-wysokiej-rozdzielczo-ci', vi: 'tr-ch-xu-t-h-nh-nh-ph-n-gi-i-cao-pdf', th: 'pdf', sv: 'extrahera-h-guppl-sta-bilder-pdf', cs: 'extrahovat-obr-zky-ve-vysok-m-rozli-en-pdf', da: 'udtr-k-billeder-i-h-j-opl-sning-pdf', el: 'pdf', fi: 'purkaa-korkearesoluutioisia-kuvia-pdf', he: 'pdf', hu: 'nagy-felbont-s-k-pek-kibont-sa-pdf-ben', no: 'trekke-ut-h-yoppl-selige-bilder-pdf', ro: 'extrage-imagini-de-nalt-rezolu-ie-pdf', sk: 'extrahova-obr-zky-vo-vysokom-rozl-en-pdf', uk: 'pdf', ms: 'ekstrak-imej-resolusi-tinggi-pdf',}),
    seo: {
        id: {
          title: 'Ekstrak Gambar Resolusi Tinggi dari PDF Gratis',
          h1: 'Ekstrak Gambar PDF dalam Kualitas Tinggi',
          description: 'Unduh dan simpan foto dan grafik yang disematkan dari PDF Anda dalam resolusi tinggi asli.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'id'),
        },
        es: {
          title: 'Extraiga imágenes de alta resolución de PDF gratis',
          h1: 'Extraiga imágenes PDF en alta calidad',
          description: 'Descargue y guarde fotografías y gráficos incrustados desde su PDF en alta resolución original.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'es'),
        },
        fr: {
          title: 'Extraire gratuitement des images haute résolution à partir d\'un PDF',
          h1: 'Extraire des images PDF en haute qualité',
          description: 'Téléchargez et enregistrez les photos et graphiques intégrés à partir de votre PDF en haute résolution originale.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'fr'),
        },
        de: {
          title: 'Extrahieren Sie hochauflösende Bilder kostenlos aus PDF',
          h1: 'Extrahieren Sie PDF-Bilder in hoher Qualität',
          description: 'Laden Sie eingebettete Fotos und Grafiken aus Ihrem PDF in hoher Originalauflösung herunter und speichern Sie sie.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'de'),
        },
        ja: {
          title: 'PDFから高解像度画像を無料で抽出',
          h1: 'PDF画像を高品質で抽出',
          description: 'PDF から埋め込まれた写真やグラフィックを元の高解像度でダウンロードして保存します。',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'ja'),
        },
        pt: {
          title: 'Extraia imagens de alta resolução de PDF gratuitamente',
          h1: 'Extraia imagens PDF em alta qualidade',
          description: 'Baixe e salve fotos e gráficos incorporados do seu PDF em alta resolução original.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'pt'),
        },
        ru: {
          title: 'Извлекайте изображения высокого разрешения из PDF бесплатно',
          h1: 'Извлечение PDF-изображений в высоком качестве',
          description: 'Загрузите и сохраните встроенные фотографии и графику из PDF-файла в исходном высоком разрешении.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'ru'),
        },
        zh: {
          title: '免费从 PDF 中提取高分辨率图像',
          h1: '提取高质量的 PDF 图像',
          description: '以原始高分辨率从 PDF 下载并保存嵌入的照片和图形。',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'zh'),
        },
        ar: {
          title: 'استخراج صور عالية الدقة من ملف PDF مجانًا',
          h1: 'استخراج صور PDF بجودة عالية',
          description: 'قم بتنزيل الصور والرسومات المضمنة وحفظها من ملف PDF الخاص بك بدقة أصلية عالية.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'ar'),
        },
        hi: {
          title: 'पीडीएफ से निःशुल्क उच्च रिजोल्यूशन छवियाँ निकालें',
          h1: 'उच्च गुणवत्ता में पीडीएफ छवियाँ निकालें',
          description: 'अपने पीडीएफ से एम्बेडेड फ़ोटो और ग्राफ़िक्स को मूल उच्च रिज़ॉल्यूशन में डाउनलोड करें और सहेजें।',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'hi'),
        },
        it: {
          title: 'Estrai immagini ad alta risoluzione da PDF gratuitamente',
          h1: 'Estrai immagini PDF in alta qualità',
          description: 'Scarica e salva foto e grafica incorporati dal tuo PDF nell\'alta risoluzione originale.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'it'),
        },
        ko: {
          title: 'PDF에서 고해상도 이미지를 무료로 추출하세요',
          h1: '고품질로 PDF 이미지 추출',
          description: 'PDF에 포함된 사진과 그래픽을 원본 고해상도로 다운로드하고 저장하세요.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'ko'),
        },
        nl: {
          title: 'Extraheer afbeeldingen met hoge resolutie uit PDF Gratis',
          h1: 'Extraheer PDF-afbeeldingen in hoge kwaliteit',
          description: 'Download en bewaar ingesloten foto\'s en afbeeldingen uit uw PDF in originele hoge resolutie.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'nl'),
        },
        tr: {
          title: 'PDF\'den Yüksek Çözünürlüklü Görüntüleri Ücretsiz Çıkarın',
          h1: 'PDF Görüntülerini Yüksek Kalitede Çıkarın',
          description: 'Gömülü fotoğrafları ve grafikleri PDF\'nizden orijinal yüksek çözünürlükte indirin ve kaydedin.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'tr'),
        },
        pl: {
          title: 'Wyodrębnij obrazy w wysokiej rozdzielczości z plików PDF za darmo',
          h1: 'Wyodrębnij obrazy PDF w wysokiej jakości',
          description: 'Pobieraj i zapisuj osadzone zdjęcia i grafikę z pliku PDF w oryginalnej wysokiej rozdzielczości.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'pl'),
        },
        vi: {
          title: 'Trích xuất hình ảnh có độ phân giải cao từ PDF miễn phí',
          h1: 'Trích xuất hình ảnh PDF ở chất lượng cao',
          description: 'Tải xuống và lưu ảnh và đồ họa nhúng từ tệp PDF của bạn ở độ phân giải cao gốc.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'vi'),
        },
        th: {
          title: 'แยกรูปภาพความละเอียดสูงจาก PDF ฟรี',
          h1: 'แยกรูปภาพ PDF ด้วยคุณภาพสูง',
          description: 'ดาวน์โหลดและบันทึกภาพถ่ายและกราฟิกที่ฝังไว้จาก PDF ของคุณในความละเอียดสูงต้นฉบับ',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'th'),
        },
        sv: {
          title: 'Extrahera högupplösta bilder från PDF gratis',
          h1: 'Extrahera PDF-bilder i hög kvalitet',
          description: 'Ladda ner och spara inbäddade foton och grafik från din PDF i högupplöst original.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'sv'),
        },
        cs: {
          title: 'Extrahujte obrázky ve vysokém rozlišení z PDF zdarma',
          h1: 'Extrahujte obrázky PDF ve vysoké kvalitě',
          description: 'Stáhněte si a uložte vložené fotografie a grafiku z vašeho PDF v původním vysokém rozlišení.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'cs'),
        },
        da: {
          title: 'Uddrag billeder i høj opløsning fra PDF gratis',
          h1: 'Uddrag PDF-billeder i høj kvalitet',
          description: 'Download og gem indlejrede fotos og grafik fra din PDF i original høj opløsning.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'da'),
        },
        el: {
          title: 'Εξαγωγή εικόνων υψηλής ανάλυσης από PDF Δωρεάν',
          h1: 'Εξαγωγή εικόνων PDF σε υψηλή ποιότητα',
          description: 'Λήψη και αποθήκευση ενσωματωμένων φωτογραφιών και γραφικών από το PDF σας σε αρχική υψηλή ανάλυση.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'el'),
        },
        fi: {
          title: 'Pura korkearesoluutioisia kuvia PDF-tiedostosta ilmaiseksi',
          h1: 'Pura PDF-kuvia korkealaatuisina',
          description: 'Lataa ja tallenna upotettuja valokuvia ja grafiikkaa PDF-tiedostosta alkuperäisellä korkearesoluutiolla.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'fi'),
        },
        he: {
          title: 'חלץ תמונות ברזולוציה גבוהה מ-PDF בחינם',
          h1: 'חלץ תמונות PDF באיכות גבוהה',
          description: 'הורד ושמור תמונות וגרפיקה משובצות מ-PDF שלך ברזולוציה גבוהה מקורית.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'he'),
        },
        hu: {
          title: 'Nagy felbontású képek kibontása PDF-ből ingyenes',
          h1: 'Kiváló minőségű PDF-képek kibontása',
          description: 'Töltse le és mentse a beágyazott fényképeket és grafikákat PDF-ből eredeti nagy felbontásban.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'hu'),
        },
        no: {
          title: 'Pakk ut høyoppløselige bilder fra PDF gratis',
          h1: 'Pakk ut PDF-bilder i høy kvalitet',
          description: 'Last ned og lagre innebygde bilder og grafikk fra PDF-en din i original høy oppløsning.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'no'),
        },
        ro: {
          title: 'Extrage gratuit imagini de înaltă rezoluție din PDF',
          h1: 'Extrageți imagini PDF la calitate înaltă',
          description: 'Descărcați și salvați fotografiile și graficele încorporate din PDF la rezoluție înaltă originală.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'ro'),
        },
        sk: {
          title: 'Extrahujte obrázky vo vysokom rozlíšení z PDF zadarmo',
          h1: 'Extrahujte obrázky PDF vo vysokej kvalite',
          description: 'Stiahnite si a uložte vložené fotografie a grafiku z vášho PDF v pôvodnom vysokom rozlíšení.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'sk'),
        },
        uk: {
          title: 'Витягуйте зображення високої роздільної здатності з PDF безкоштовно',
          h1: 'Видобуйте PDF-зображення високої якості',
          description: 'Завантажте та збережіть вбудовані фотографії та графіку з PDF-файлу в оригінальній високій роздільній здатності.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'uk'),
        },
        ms: {
          title: 'Ekstrak Imej Resolusi Tinggi daripada PDF Percuma',
          h1: 'Ekstrak Imej PDF dalam Kualiti Tinggi',
          description: 'Muat turun dan simpan foto dan grafik terbenam daripada PDF anda dalam resolusi tinggi asal.',
          faqs: defaultFaqs('Extract PDF Images in High Quality', 'ms'),
        },
      en: {
        title: 'Extract High Resolution Images from PDF Free',
        h1: 'Extract PDF Images in High Quality',
        description: 'Download and save embedded photos and graphics from your PDF in original high resolution.',
        faqs: defaultFaqs('Extract Images', 'en'),
      }
    }
  },
  {
    id: 'compare-pdf-files-visually',
    category: 'pdf',
    iconName: 'Scale',
    slugs: generateSlugsForId('compare-pdf-files-visually', { en: 'compare-pdf-files-visually', id: 'bandingkan-file-pdf-secara-visual', es: 'comparar-archivos-pdf-visualmente', fr: 'comparer-visuellement-les-fichiers-pdf', de: 'vergleichen-sie-pdf-dateien-visuell', ja: 'pdf', pt: 'compare-arquivos-pdf-visualmente', ru: 'pdf-', zh: 'pdf', ar: 'pdf', hi: '', it: 'confrontare-visivamente-i-file-pdf', ko: 'pdf-파일을-시각적으로-비교', nl: 'vergelijk-pdf-bestanden-visueel', tr: 'pdf-dosyalar-n-g-rsel-olarak-kar-la-t-r-n', pl: 'wizualnie-por-wnaj-pliki-pdf', vi: 'so-s-nh-file-pdf-m-t-c-ch-tr-c-quan', th: 'pdf', sv: 'j-mf-ra-pdf-filer-visuellt', cs: 'porovnejte-soubory-pdf-vizu-ln', da: 'sammenligne-pdf-filer-visuelt', el: 'pdf', fi: 'vertaa-pdf-tiedostoja-visuaalisesti', he: 'pdf', hu: 'pdf-f-jlok-vizu-lis-sszehasonl-t-sa', no: 'sammenligne-pdf-filer-visuelt', ro: 'compara-i-vizual-fi-ierele-pdf', sk: 'vizu-lne-porovn-va-s-bory-pdf', uk: 'pdf', ms: 'bandingkan-fail-pdf-secara-visual',}),
    seo: {
        id: {
          title: 'Bandingkan Dua File PDF untuk Perbedaan Visual',
          h1: 'Bandingkan PDF secara visual',
          description: 'Unggah dua dokumen PDF dan sorot perbedaan piksel yang tepat di antara keduanya secara lokal.',
          faqs: defaultFaqs('Visually Compare PDFs', 'id'),
        },
        es: {
          title: 'Compare dos archivos PDF para detectar diferencias visuales',
          h1: 'Comparar visualmente archivos PDF',
          description: 'Cargue dos documentos PDF y resalte las diferencias exactas de píxeles entre ellos localmente.',
          faqs: defaultFaqs('Visually Compare PDFs', 'es'),
        },
        fr: {
          title: 'Comparez deux fichiers PDF pour les différences visuelles',
          h1: 'Comparez visuellement les PDF',
          description: 'Téléchargez deux documents PDF et mettez en évidence les différences exactes en pixels entre eux localement.',
          faqs: defaultFaqs('Visually Compare PDFs', 'fr'),
        },
        de: {
          title: 'Vergleichen Sie zwei PDF-Dateien auf visuelle Unterschiede',
          h1: 'Vergleichen Sie PDFs visuell',
          description: 'Laden Sie zwei PDF-Dokumente hoch und markieren Sie die genauen Pixelunterschiede zwischen ihnen lokal.',
          faqs: defaultFaqs('Visually Compare PDFs', 'de'),
        },
        ja: {
          title: '2 つの PDF ファイルを比較して視覚的な違いを確認する',
          h1: 'PDF を視覚的に比較する',
          description: '2 つの PDF ドキュメントをアップロードし、それらの間の正確なピクセルの違いをローカルで強調表示します。',
          faqs: defaultFaqs('Visually Compare PDFs', 'ja'),
        },
        pt: {
          title: 'Compare dois arquivos PDF para diferenças visuais',
          h1: 'Compare PDFs visualmente',
          description: 'Carregue dois documentos PDF e destaque localmente as diferenças exatas de pixels entre eles.',
          faqs: defaultFaqs('Visually Compare PDFs', 'pt'),
        },
        ru: {
          title: 'Сравните два PDF-файла на предмет визуальных различий',
          h1: 'Визуальное сравнение PDF-файлов',
          description: 'Загрузите два PDF-документа и локально выделите точные различия в пикселях между ними.',
          faqs: defaultFaqs('Visually Compare PDFs', 'ru'),
        },
        zh: {
          title: '比较两个 PDF 文件的视觉差异',
          h1: '直观地比较 PDF',
          description: '上传两个 PDF 文档并在本地突出显示它们之间的确切像素差异。',
          faqs: defaultFaqs('Visually Compare PDFs', 'zh'),
        },
        ar: {
          title: 'قارن بين ملفين PDF للاختلافات المرئية',
          h1: 'قارن بصريا ملفات PDF',
          description: 'قم بتحميل مستندين بتنسيق PDF وقم بتمييز اختلافات البكسل الدقيقة بينهما محليًا.',
          faqs: defaultFaqs('Visually Compare PDFs', 'ar'),
        },
        hi: {
          title: 'दृश्य अंतर के लिए दो पीडीएफ फाइलों की तुलना करें',
          h1: 'पीडीएफ़ की दृष्टिगत तुलना करें',
          description: 'दो पीडीएफ दस्तावेज़ अपलोड करें और स्थानीय स्तर पर उनके बीच सटीक पिक्सेल अंतर को उजागर करें।',
          faqs: defaultFaqs('Visually Compare PDFs', 'hi'),
        },
        it: {
          title: 'Confronta due file PDF per le differenze visive',
          h1: 'Confronta visivamente i PDF',
          description: 'Carica due documenti PDF ed evidenzia localmente le esatte differenze di pixel tra loro.',
          faqs: defaultFaqs('Visually Compare PDFs', 'it'),
        },
        ko: {
          title: '두 개의 PDF 파일을 비교하여 시각적 차이를 확인하세요',
          h1: 'PDF를 시각적으로 비교',
          description: '두 개의 PDF 문서를 업로드하고 로컬에서 두 문서 간의 정확한 픽셀 차이를 강조표시하세요.',
          faqs: defaultFaqs('Visually Compare PDFs', 'ko'),
        },
        nl: {
          title: 'Vergelijk twee PDF-bestanden op visuele verschillen',
          h1: 'PDF\'s visueel vergelijken',
          description: 'Upload twee PDF-documenten en markeer lokaal de exacte pixelverschillen daartussen.',
          faqs: defaultFaqs('Visually Compare PDFs', 'nl'),
        },
        tr: {
          title: 'Görsel Farklılıklar Açısından İki PDF Dosyasını Karşılaştırın',
          h1: 'PDF\'leri Görsel Olarak Karşılaştırın',
          description: 'İki PDF belgesi yükleyin ve aralarındaki tam piksel farklarını yerel olarak vurgulayın.',
          faqs: defaultFaqs('Visually Compare PDFs', 'tr'),
        },
        pl: {
          title: 'Porównaj dwa pliki PDF pod kątem różnic wizualnych',
          h1: 'Wizualnie porównaj pliki PDF',
          description: 'Prześlij dwa dokumenty PDF i zaznacz lokalnie dokładne różnice w pikselach między nimi.',
          faqs: defaultFaqs('Visually Compare PDFs', 'pl'),
        },
        vi: {
          title: 'So sánh hai tệp PDF để tìm sự khác biệt trực quan',
          h1: 'So sánh trực quan các tệp PDF',
          description: 'Tải lên hai tài liệu PDF và làm nổi bật sự khác biệt chính xác về pixel giữa chúng cục bộ.',
          faqs: defaultFaqs('Visually Compare PDFs', 'vi'),
        },
        th: {
          title: 'เปรียบเทียบไฟล์ PDF สองไฟล์เพื่อดูความแตกต่างทางสายตา',
          h1: 'เปรียบเทียบ PDF ด้วยสายตา',
          description: 'อัปโหลดเอกสาร PDF สองฉบับและเน้นความแตกต่างพิกเซลที่แน่นอนระหว่างเอกสารเหล่านั้นในเครื่อง',
          faqs: defaultFaqs('Visually Compare PDFs', 'th'),
        },
        sv: {
          title: 'Jämför två PDF-filer för visuella skillnader',
          h1: 'Jämför PDF-filer visuellt',
          description: 'Ladda upp två PDF-dokument och markera de exakta pixelskillnaderna mellan dem lokalt.',
          faqs: defaultFaqs('Visually Compare PDFs', 'sv'),
        },
        cs: {
          title: 'Porovnejte dva soubory PDF pro vizuální rozdíly',
          h1: 'Vizuálně porovnejte soubory PDF',
          description: 'Nahrajte dva dokumenty PDF a lokálně zvýrazněte přesné rozdíly v pixelech mezi nimi.',
          faqs: defaultFaqs('Visually Compare PDFs', 'cs'),
        },
        da: {
          title: 'Sammenlign to PDF-filer for visuelle forskelle',
          h1: 'Visuel sammenligning af PDF-filer',
          description: 'Upload to PDF-dokumenter, og fremhæv de nøjagtige pixelforskelle mellem dem lokalt.',
          faqs: defaultFaqs('Visually Compare PDFs', 'da'),
        },
        el: {
          title: 'Συγκρίνετε δύο αρχεία PDF για οπτικές διαφορές',
          h1: 'Οπτική σύγκριση αρχείων PDF',
          description: 'Μεταφορτώστε δύο έγγραφα PDF και επισημάνετε τοπικά τις ακριβείς διαφορές pixel μεταξύ τους.',
          faqs: defaultFaqs('Visually Compare PDFs', 'el'),
        },
        fi: {
          title: 'Vertaa kahta PDF-tiedostoa visuaalisten erojen löytämiseksi',
          h1: 'Vertaa PDF-tiedostoja visuaalisesti',
          description: 'Lataa kaksi PDF-dokumenttia ja korosta niiden väliset tarkat pikselierot paikallisesti.',
          faqs: defaultFaqs('Visually Compare PDFs', 'fi'),
        },
        he: {
          title: 'השווה שני קבצי PDF עבור הבדלים חזותיים',
          h1: 'השווה ויזואלית קובצי PDF',
          description: 'העלה שני מסמכי PDF והדגש את הבדלי הפיקסלים המדויקים ביניהם באופן מקומי.',
          faqs: defaultFaqs('Visually Compare PDFs', 'he'),
        },
        hu: {
          title: 'Hasonlítson össze két PDF-fájlt a vizuális különbségekért',
          h1: 'PDF-ek vizuális összehasonlítása',
          description: 'Töltsön fel két PDF dokumentumot, és helyileg emelje ki a köztük lévő pontos pixelkülönbségeket.',
          faqs: defaultFaqs('Visually Compare PDFs', 'hu'),
        },
        no: {
          title: 'Sammenlign to PDF-filer for visuelle forskjeller',
          h1: 'Sammenlign PDF-filer visuelt',
          description: 'Last opp to PDF-dokumenter og fremhev de nøyaktige pikselforskjellene mellom dem lokalt.',
          faqs: defaultFaqs('Visually Compare PDFs', 'no'),
        },
        ro: {
          title: 'Comparați două fișiere PDF pentru diferențe vizuale',
          h1: 'Comparați vizual PDF-urile',
          description: 'Încărcați două documente PDF și evidențiați diferențele exacte de pixeli dintre ele la nivel local.',
          faqs: defaultFaqs('Visually Compare PDFs', 'ro'),
        },
        sk: {
          title: 'Porovnajte dva súbory PDF pre vizuálne rozdiely',
          h1: 'Vizuálne porovnajte súbory PDF',
          description: 'Nahrajte dva dokumenty PDF a lokálne zvýraznite presné rozdiely v pixeloch medzi nimi.',
          faqs: defaultFaqs('Visually Compare PDFs', 'sk'),
        },
        uk: {
          title: 'Порівняйте два PDF-файли на візуальні відмінності',
          h1: 'Візуальне порівняння PDF-файлів',
          description: 'Завантажте два PDF-документи та виділіть точну різницю в пікселях між ними локально.',
          faqs: defaultFaqs('Visually Compare PDFs', 'uk'),
        },
        ms: {
          title: 'Bandingkan Dua Fail PDF untuk Perbezaan Visual',
          h1: 'Bandingkan PDF secara Visual',
          description: 'Muat naik dua dokumen PDF dan serlahkan perbezaan piksel yang tepat antara mereka secara tempatan.',
          faqs: defaultFaqs('Visually Compare PDFs', 'ms'),
        },
      en: {
        title: 'Compare Two PDF Files for Visual Differences',
        h1: 'Visually Compare PDFs',
        description: 'Upload two PDF documents and highlight the exact pixel differences between them locally.',
        faqs: defaultFaqs('Compare PDF', 'en'),
      }
    }
  },
    {
          id: 'compress-pdf-to-100kb',
          category: 'pdf',
          iconName: 'Minimize',
          slugs: generateSlugsForId('compress-pdf-to-100kb', {
            en: 'compress-pdf-to-100kb',
            zh: 'compress-pdf-to-100kb',
            pt: 'compactar-pdf-para-100kb',
            ja: 'pdf-100kb',
            de: 'pdf-auf-100-kb-komprimieren',
            es: 'comprimir-pdf-a-100kb',
            ar: 'pdf-100',
            ru: 'pdf-100',
            id: 'kompres-pdf-menjadi-100kb',
            fr: 'compresser-le-pdf-100-ko',
            hi: '100kb',
            tr: 'pdf-yi-100kb-ye-s-k-t-r',
            pl: 'skompresuj-pdf-do-100kb',
            th: 'pdf-100kb',
            it: 'comprimere-pdf-a-100kb',
            sv: 'komprimera-pdf-till-100kb',
            vi: 'n-n-pdf-xu-ng-100kb',
            ko: 'pdf-100kb',
            cs: 'komprimovat-pdf-na-100-kb',
            nl: 'comprimeer-pdf-naar-100-kb',
            ro: 'comprima-pdf-la-100-kb',
            hu: 't-m-r-tse-a-pdf-et-100-kb-ra',
            sk: 'komprimova-pdf-na-100-kb',
            fi: 'pakkaa-pdf-100-kb',
            da: 'komprimere-pdf-til-100kb',
            no: 'komprimere-pdf-til-100kb',
            he: 'pdf-100kb',
            ms: 'mampatkan-pdf-kepada-100kb',
            el: 'pdf-100-kb',
            uk: 'pdf-100'
          }),
          seo: {
            en: {
            title: 'Compress PDF to 100KB Free Online | No Uploads',
            h1: 'Compress PDF to 100KB Without Losing Quality',
            description: 'Shrink your PDF files down to 100KB or less directly in your browser. Perfect for email attachments and fast sharing. 100% private.',
            faqs: defaultFaqs('compress-pdf-to-100kb', 'en')
          },
            zh: {
              title: 'Compress PDF to 100KB Free Online | No Uploads',
              h1: 'Compress PDF to 100KB Without Losing Quality',
              description: 'Shrink your PDF files down to 100KB or less directly in your browser. Perfect for email attachments and fast sharing. 100% private.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'zh')
            },
            pt: {
              title: 'Compactar PDF para 100 KB grátis online | Sem envios',
              h1: 'Compacte PDF em 100 KB sem perder qualidade',
              description: 'Reduza seus arquivos PDF para 100 KB ou menos diretamente em seu navegador. Perfeito para anexos de e-mail e compartilhamento rápido. 100% privado.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'pt')
            },
            ja: {
              title: 'PDFをオンラインで無料で100KBに圧縮 | アップロードはありません',
              h1: '品質を損なうことなくPDFを100KBに圧縮',
              description: 'ブラウザで PDF ファイルを直接 100KB 以下に縮小します。 電子メールの添付や高速共有に最適です。 100%プライベートです。',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'ja')
            },
            de: {
              title: 'PDF kostenlos online auf 100 KB komprimieren | Keine Uploads',
              h1: 'Komprimieren Sie PDF auf 100 KB, ohne an Qualität zu verlieren',
              description: 'Verkleinern Sie Ihre PDF-Dateien direkt in Ihrem Browser auf 100 KB oder weniger. Perfekt für E-Mail-Anhänge und schnelles Teilen. 100 % privat.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'de')
            },
            es: {
              title: 'Comprima PDF a 100 KB gratis en línea | Sin cargas',
              h1: 'Comprime PDF a 100 KB sin perder calidad',
              description: 'Reduzca sus archivos PDF a 100 KB o menos directamente en su navegador. Perfecto para archivos adjuntos de correo electrónico y para compartir rápidamente. 100% privado.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'es')
            },
            ar: {
              title: 'ضغط ملف PDF إلى 100 كيلو بايت مجانًا عبر الإنترنت | لا تحميلات',
              h1: 'ضغط ملف PDF إلى 100 كيلو بايت دون فقدان الجودة',
              description: 'قم بتقليص حجم ملفات PDF الخاصة بك إلى 100 كيلو بايت أو أقل مباشرةً في متصفحك. مثالي لمرفقات البريد الإلكتروني والمشاركة السريعة. خاص 100%.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'ar')
            },
            ru: {
              title: 'Сжать PDF до 100 КБ бесплатно в Интернете | Нет загрузок',
              h1: 'Сжимайте PDF до 100 КБ без потери качества',
              description: 'Уменьшите размер PDF-файлов до 100 КБ или меньше прямо в браузере. Идеально подходит для вложений в электронную почту и быстрого обмена. 100% приват.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'ru')
            },
            id: {
              title: 'Kompres PDF ke 100KB Online Gratis | Tidak Ada Unggahan',
              h1: 'Kompres PDF hingga 100KB Tanpa Kehilangan Kualitas',
              description: 'Kecilkan file PDF Anda hingga 100KB atau kurang langsung di browser Anda. Sempurna untuk lampiran email dan berbagi cepat. 100% pribadi.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'id')
            },
            fr: {
              title: 'Compresser un PDF à 100 Ko gratuitement en ligne | Aucun téléchargement',
              h1: 'Compresser le PDF à 100 Ko sans perte de qualité',
              description: 'Réduisez vos fichiers PDF à 100 Ko ou moins directement dans votre navigateur. Parfait pour les pièces jointes aux e-mails et le partage rapide. 100% privé.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'fr')
            },
            hi: {
              title: 'पीडीएफ को 100KB तक निःशुल्क ऑनलाइन कंप्रेस करें | कोई अपलोड नहीं',
              h1: 'गुणवत्ता खोए बिना पीडीएफ को 100KB तक संपीड़ित करें',
              description: 'सीधे अपने ब्राउज़र में अपनी पीडीएफ फाइलों को 100KB या उससे कम करें। ईमेल अनुलग्नकों और तेज़ साझाकरण के लिए बिल्कुल सही। 100% निजी.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'hi')
            },
            tr: {
              title: 'PDF\'yi 100KB\'ye Ücretsiz Çevrimiçi Olarak Sıkıştırın | Yükleme Yok',
              h1: 'Kaliteyi Kaybetmeden PDF\'yi 100 KB\'ye Sıkıştırın',
              description: 'PDF dosyalarınızı doğrudan tarayıcınızda 100 KB veya daha azına kadar küçültün. E-posta ekleri ve hızlı paylaşım için mükemmeldir. %100 özel.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'tr')
            },
            pl: {
              title: 'Kompresuj plik PDF do 100 KB bezpłatnie online | Brak przesłanych plików',
              h1: 'Kompresuj plik PDF do 100 KB bez utraty jakości',
              description: 'Zmniejsz pliki PDF do 100 KB lub mniej bezpośrednio w przeglądarce. Idealny do załączników do wiadomości e-mail i szybkiego udostępniania. 100% prywatności.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'pl')
            },
            th: {
              title: 'บีบอัด PDF เป็น 100KB ออนไลน์ฟรี | ไม่มีการอัพโหลด',
              h1: 'บีบอัด PDF เป็น 100KB โดยไม่สูญเสียคุณภาพ',
              description: 'ย่อขนาดไฟล์ PDF ของคุณลงเหลือ 100KB หรือน้อยกว่านั้นในเบราว์เซอร์ของคุณโดยตรง เหมาะสำหรับแนบไฟล์อีเมลและการแชร์ที่รวดเร็ว ส่วนตัว 100%',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'th')
            },
            it: {
              title: 'Comprimi PDF in 100KB online gratuitamente | Nessun caricamento',
              h1: 'Comprimi PDF a 100KB senza perdere la qualità',
              description: 'Riduci i tuoi file PDF fino a 100KB o meno direttamente nel tuo browser. Perfetto per allegati e-mail e condivisione rapida. 100% privato.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'it')
            },
            sv: {
              title: 'Komprimera PDF till 100 KB gratis online | Inga uppladdningar',
              h1: 'Komprimera PDF till 100KB utan att förlora kvalitet',
              description: 'Förminska dina PDF-filer till 100 KB eller mindre direkt i din webbläsare. Perfekt för e-postbilagor och snabb delning. 100% privat.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'sv')
            },
            vi: {
              title: 'Nén PDF thành 100KB trực tuyến miễn phí | Không tải lên',
              h1: 'Nén PDF thành 100KB mà không làm giảm chất lượng',
              description: 'Thu nhỏ tệp PDF của bạn xuống còn 100KB hoặc ít hơn trực tiếp trong trình duyệt của bạn. Hoàn hảo cho việc đính kèm email và chia sẻ nhanh chóng. 100% riêng tư.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'vi')
            },
            ko: {
              title: '온라인에서 무료로 PDF를 100KB로 압축 | 업로드 없음',
              h1: '품질 저하 없이 PDF를 100KB로 압축',
              description: '브라우저에서 PDF 파일을 100KB 이하로 직접 축소하세요. 이메일 첨부 및 빠른 공유에 적합합니다. 100% 비공개입니다.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'ko')
            },
            cs: {
              title: 'Komprimujte PDF na 100 kB online zdarma | Žádné nahrávání',
              h1: 'Komprimujte PDF na 100 kB bez ztráty kvality',
              description: 'Zmenšete své soubory PDF na 100 kB nebo méně přímo ve vašem prohlížeči. Ideální pro e-mailové přílohy a rychlé sdílení. 100% soukromé.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'cs')
            },
            nl: {
              title: 'Comprimeer PDF naar 100 KB Gratis online | Geen uploads',
              h1: 'Comprimeer PDF tot 100 KB zonder kwaliteitsverlies',
              description: 'Verklein uw PDF-bestanden rechtstreeks in uw browser tot 100 KB of minder. Perfect voor e-mailbijlagen en snel delen. 100% privé.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'nl')
            },
            ro: {
              title: 'Comprimați PDF la 100KB gratuit online | Fără încărcări',
              h1: 'Comprimați PDF la 100 KB fără a pierde calitatea',
              description: 'Reduceți fișierele PDF până la 100 KB sau mai puțin direct în browser. Perfect pentru atașamentele de e-mail și partajarea rapidă. 100% privat.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'ro')
            },
            hu: {
              title: 'PDF tömörítése 100 KB-ra, ingyenes online | Nincs feltöltés',
              h1: 'A PDF tömörítése 100 KB-ra a minőség elvesztése nélkül',
              description: 'Csökkentse PDF-fájljait 100 KB-ra vagy kevesebbre közvetlenül a böngészőben. Tökéletes e-mail mellékletekhez és gyors megosztáshoz. 100% privát.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'hu')
            },
            sk: {
              title: 'Komprimujte PDF na 100 kB online zadarmo | Žiadne nahrávania',
              h1: 'Komprimujte PDF na 100 kB bez straty kvality',
              description: 'Zmenšite svoje PDF súbory na 100 kB alebo menej priamo vo vašom prehliadači. Ideálne pre e-mailové prílohy a rýchle zdieľanie. 100% súkromné.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'sk')
            },
            fi: {
              title: 'Pakkaa PDF 100 kilotavuun ilmaiseksi verkossa | Ei latauksia',
              h1: 'Pakkaa PDF 100 kilotavuun menettämättä laatua',
              description: 'Pienennä PDF-tiedostosi 100 kilotavuun tai pienempään suoraan selaimessasi. Täydellinen sähköpostin liitteisiin ja nopeaan jakamiseen. 100% yksityinen.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'fi')
            },
            da: {
              title: 'Komprimer PDF til 100 KB gratis online | Ingen uploads',
              h1: 'Komprimer PDF til 100KB uden at miste kvalitet',
              description: 'Formindsk dine PDF-filer til 100KB eller mindre direkte i din browser. Perfekt til vedhæftede filer i e-mail og hurtig deling. 100% privat.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'da')
            },
            no: {
              title: 'Komprimer PDF til 100 KB gratis online | Ingen opplastinger',
              h1: 'Komprimer PDF til 100KB uten å miste kvalitet',
              description: 'Krymp PDF-filene dine ned til 100 KB eller mindre direkte i nettleseren din. Perfekt for e-postvedlegg og rask deling. 100% privat.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'no')
            },
            he: {
              title: 'דחוס PDF ל-100KB בחינם באינטרנט | אין העלאות',
              h1: 'דחוס PDF ל-100KB מבלי לאבד איכות',
              description: 'כווץ את קובצי ה-PDF שלך עד ל-100KB או פחות ישירות בדפדפן שלך. מושלם עבור קבצים מצורפים לדוא"ל ושיתוף מהיר. 100% פרטי.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'he')
            },
            ms: {
              title: 'Mampatkan PDF kepada 100KB Percuma Dalam Talian | Tiada Muat Naik',
              h1: 'Mampatkan PDF kepada 100KB Tanpa Kehilangan Kualiti',
              description: 'Kecilkan fail PDF anda kepada 100KB atau kurang terus dalam penyemak imbas anda. Sesuai untuk lampiran e-mel dan perkongsian pantas. 100% persendirian.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'ms')
            },
            el: {
              title: 'Συμπίεση PDF σε 100 KB Δωρεάν Online | Δεν υπάρχουν μεταφορτώσεις',
              h1: 'Συμπιέστε το PDF στα 100 KB χωρίς απώλεια ποιότητας',
              description: 'Μειώστε τα αρχεία PDF σας σε 100 KB ή λιγότερο απευθείας στο πρόγραμμα περιήγησής σας. Ιδανικό για συνημμένα email και γρήγορη κοινή χρήση. 100% ιδιωτικό.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'el')
            },
            uk: {
              title: 'Стисніть PDF до 100 КБ безкоштовно онлайн | Немає завантажень',
              h1: 'Стисніть PDF до 100 КБ без втрати якості',
              description: 'Зменште PDF-файли до 100 КБ або менше безпосередньо у браузері. Ідеально підходить для вкладень електронної пошти та швидкого обміну. 100% приватний.',
              faqs: defaultFaqs('compress-pdf-to-100kb', 'uk')
            }
          }
        },
    {
          id: 'merge-pdf-files-offline',
          category: 'pdf',
          iconName: 'Combine',
          slugs: generateSlugsForId('merge-pdf-files-offline', {
            en: 'merge-pdf-files-offline',
            zh: 'merge-pdf-files-offline',
            ja: 'pdf',
            ru: 'pdf',
            id: 'menggabungkan-file-pdf-secara-offline',
            fr: 'fusionner-des-fichiers-pdf-hors-ligne',
            pt: 'mesclar-arquivos-pdf-off-line',
            de: 'pdf-dateien-offline-zusammenf-hren',
            es: 'fusionar-archivos-pdf-sin-conexi-n',
            ar: 'pdf',
            vi: 'h-p-nh-t-c-c-t-p-tin-pdf-ngo-i-tuy-n',
            cs: 'slou-it-soubory-pdf-offline',
            hi: 'merge-pdf-files-offline-hi',
            tr: 'pdf-dosyalar-n-evrimd-birle-tirme',
            pl: 'scalaj-pliki-pdf-w-trybie-offline',
            ko: 'pdf',
            sv: 'sl-samman-pdf-filer-offline',
            th: 'pdf',
            nl: 'pdf-bestanden-offline-samenvoegen',
            it: 'unisci-file-pdf-offline',
            da: 'flette-pdf-filer-offline',
            ro: 'mbina-fi-ierele-pdf-offline',
            he: 'pdf',
            el: 'pdf',
            no: 'sl-sammen-pdf-filer-offline',
            uk: 'pdf',
            hu: 'pdf-f-jlok-egyes-t-se-offline-m-dban',
            fi: 'yhdist-pdf-tiedostoja-offline-tilassa',
            ms: 'gabungkan-fail-pdf-di-luar-talian',
            sk: 'zl-i-s-bory-pdf-offline'
          }),
          seo: {
            en: {
            title: 'Merge PDF Files Offline Free | 100% Secure',
            h1: 'Merge Your PDFs Offline in the Browser',
            description: 'Combine multiple highly sensitive PDF documents without an internet connection. Works fully offline after loading.',
            faqs: defaultFaqs('merge-pdf-files-offline', 'en')
          },
            zh: {
              title: 'Merge PDF Files Offline Free | 100% Secure',
              h1: 'Merge Your PDFs Offline in the Browser',
              description: 'Combine multiple highly sensitive PDF documents without an internet connection. Works fully offline after loading.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'zh')
            },
            ja: {
              title: 'PDF ファイルをオフラインで無料で結合 | 100%安全',
              h1: 'ブラウザでオフラインで PDF を結合する',
              description: 'インターネット接続なしで、複数の機密性の高い PDF ドキュメントを結合します。 ロード後は完全にオフラインで動作します。',
              faqs: defaultFaqs('merge-pdf-files-offline', 'ja')
            },
            ru: {
              title: 'Объединение PDF-файлов в автономном режиме бесплатно | 100% безопасность',
              h1: 'Объедините свои PDF-файлы в автономном режиме в браузере',
              description: 'Объединяйте несколько конфиденциальных PDF-документов без подключения к Интернету. Работает полностью в автономном режиме после загрузки.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'ru')
            },
            id: {
              title: 'Gabungkan File PDF Offline Gratis | 100% Aman',
              h1: 'Gabungkan PDF Anda Secara Offline di Browser',
              description: 'Gabungkan beberapa dokumen PDF yang sangat sensitif tanpa koneksi internet. Bekerja sepenuhnya offline setelah memuat.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'id')
            },
            fr: {
              title: 'Fusionner des fichiers PDF hors ligne gratuitement | 100% sécurisé',
              h1: 'Fusionnez vos PDF hors ligne dans le navigateur',
              description: 'Combinez plusieurs documents PDF hautement sensibles sans connexion Internet. Fonctionne entièrement hors ligne après le chargement.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'fr')
            },
            pt: {
              title: 'Mesclar arquivos PDF off-line gratuitamente | 100% seguro',
              h1: 'Mesclar seus PDFs off-line no navegador',
              description: 'Combine vários documentos PDF altamente confidenciais sem conexão com a Internet. Funciona totalmente offline após o carregamento.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'pt')
            },
            de: {
              title: 'PDF-Dateien offline kostenlos zusammenführen | 100 % sicher',
              h1: 'Führen Sie Ihre PDFs offline im Browser zusammen',
              description: 'Kombinieren Sie mehrere hochsensible PDF-Dokumente ohne Internetverbindung. Funktioniert nach dem Laden vollständig offline.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'de')
            },
            es: {
              title: 'Fusionar archivos PDF sin conexión gratis | 100% seguro',
              h1: 'Combine sus archivos PDF sin conexión en el navegador',
              description: 'Combine varios documentos PDF altamente confidenciales sin conexión a Internet. Funciona completamente sin conexión después de la carga.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'es')
            },
            ar: {
              title: 'دمج ملفات PDF دون اتصال بالإنترنت مجانًا | آمن بنسبة 100%',
              h1: 'دمج ملفات PDF الخاصة بك دون اتصال بالإنترنت في المتصفح',
              description: 'اجمع بين عدة مستندات PDF حساسة للغاية دون الاتصال بالإنترنت. يعمل دون اتصال بالإنترنت بشكل كامل بعد التحميل.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'ar')
            },
            vi: {
              title: 'Hợp nhất các tệp PDF ngoại tuyến miễn phí | An toàn 100%',
              h1: 'Hợp nhất các tệp PDF của bạn ngoại tuyến trong trình duyệt',
              description: 'Kết hợp nhiều tài liệu PDF có độ nhạy cao mà không cần kết nối internet. Hoạt động hoàn toàn ngoại tuyến sau khi tải.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'vi')
            },
            cs: {
              title: 'Sloučit soubory PDF offline zdarma | 100% bezpečné',
              h1: 'Sloučení souborů PDF offline v prohlížeči',
              description: 'Kombinujte více vysoce citlivých dokumentů PDF bez připojení k internetu. Po načtení funguje plně offline.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'cs')
            },
            hi: {
              title: 'पीडीएफ फाइलों को ऑफलाइन नि:शुल्क मर्ज करें | 100% सुरक्षित',
              h1: 'अपनी पीडीएफ़ को ब्राउज़र में ऑफ़लाइन मर्ज करें',
              description: 'बिना इंटरनेट कनेक्शन के अनेक अत्यधिक संवेदनशील पीडीएफ दस्तावेज़ों को संयोजित करें। लोड होने के बाद पूरी तरह ऑफ़लाइन काम करता है।',
              faqs: defaultFaqs('merge-pdf-files-offline', 'hi')
            },
            tr: {
              title: 'PDF Dosyalarını Çevrimdışı Ücretsiz Birleştir | %100 Güvenli',
              h1: 'Tarayıcıda PDF\'lerinizi Çevrimdışı Birleştirin',
              description: 'Çok sayıda son derece hassas PDF belgesini internet bağlantısı olmadan birleştirin. Yüklemeden sonra tamamen çevrimdışı çalışır.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'tr')
            },
            pl: {
              title: 'Scal pliki PDF w trybie offline za darmo | 100% bezpieczeństwa',
              h1: 'Scal swoje pliki PDF offline w przeglądarce',
              description: 'Łącz wiele bardzo poufnych dokumentów PDF bez połączenia z Internetem. Działa całkowicie offline po załadowaniu.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'pl')
            },
            ko: {
              title: '무료로 PDF 파일을 오프라인으로 병합 | 100% 안전함',
              h1: '브라우저에서 오프라인으로 PDF를 병합하세요',
              description: '인터넷 연결 없이 여러 개의 매우 민감한 PDF 문서를 결합합니다. 로드 후 완전히 오프라인으로 작동합니다.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'ko')
            },
            sv: {
              title: 'Slå samman PDF-filer offline gratis | 100 % säker',
              h1: 'Slå samman dina PDF-filer offline i webbläsaren',
              description: 'Kombinera flera mycket känsliga PDF-dokument utan internetanslutning. Fungerar helt offline efter laddning.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'sv')
            },
            th: {
              title: 'รวมไฟล์ PDF ออฟไลน์ฟรี | ปลอดภัย 100%',
              h1: 'รวม PDF ของคุณแบบออฟไลน์ในเบราว์เซอร์',
              description: 'รวมเอกสาร PDF ที่มีความไวสูงหลายชุดโดยไม่ต้องเชื่อมต่ออินเทอร์เน็ต ทำงานแบบออฟไลน์ได้อย่างสมบูรณ์หลังจากโหลด',
              faqs: defaultFaqs('merge-pdf-files-offline', 'th')
            },
            nl: {
              title: 'Voeg PDF-bestanden offline gratis samen | 100% veilig',
              h1: 'Voeg uw PDF\'s offline samen in de browser',
              description: 'Combineer meerdere zeer gevoelige PDF-documenten zonder internetverbinding. Werkt volledig offline na het laden.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'nl')
            },
            it: {
              title: 'Unisci file PDF offline gratuitamente | Sicuro al 100%.',
              h1: 'Unisci i tuoi PDF offline nel browser',
              description: 'Combina più documenti PDF altamente sensibili senza una connessione Internet. Funziona completamente offline dopo il caricamento.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'it')
            },
            da: {
              title: 'Flet PDF-filer offline gratis | 100 % sikker',
              h1: 'Flet dine PDF\'er offline i browseren',
              description: 'Kombiner flere meget følsomme PDF-dokumenter uden internetforbindelse. Fungerer fuldt offline efter indlæsning.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'da')
            },
            ro: {
              title: 'Îmbinați fișiere PDF offline gratuit | 100% sigur',
              h1: 'Îmbinați fișierele PDF offline în browser',
              description: 'Combinați mai multe documente PDF foarte sensibile fără o conexiune la internet. Funcționează complet offline după încărcare.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'ro')
            },
            he: {
              title: 'מיזוג קבצי PDF לא מקוון חינם | 100% מאובטח',
              h1: 'מיזוג קובצי PDF במצב לא מקוון בדפדפן',
              description: 'שלב מספר מסמכי PDF רגישים במיוחד ללא חיבור לאינטרנט. עובד במצב לא מקוון לחלוטין לאחר טעינה.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'he')
            },
            el: {
              title: 'Συγχώνευση αρχείων PDF χωρίς σύνδεση Δωρεάν | 100% ασφαλής',
              h1: 'Συγχωνεύστε τα PDF σας εκτός σύνδεσης στο πρόγραμμα περιήγησης',
              description: 'Συνδυάστε πολλά εξαιρετικά ευαίσθητα έγγραφα PDF χωρίς σύνδεση στο διαδίκτυο. Λειτουργεί πλήρως εκτός σύνδεσης μετά τη φόρτωση.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'el')
            },
            no: {
              title: 'Slå sammen PDF-filer frakoblet Gratis | 100 % sikker',
              h1: 'Slå sammen PDF-filene dine frakoblet i nettleseren',
              description: 'Kombiner flere svært sensitive PDF-dokumenter uten internettforbindelse. Fungerer helt offline etter lasting.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'no')
            },
            uk: {
              title: 'Об’єднайте PDF-файли офлайн безкоштовно | 100% безпечний',
              h1: 'Об’єднайте свої PDF-файли офлайн у браузері',
              description: 'Об’єднайте кілька дуже конфіденційних PDF-документів без підключення до Інтернету. Працює повністю в автономному режимі після завантаження.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'uk')
            },
            hu: {
              title: 'PDF-fájlok egyesítése offline állapotban ingyenes | 100%-os biztonság',
              h1: 'Egyesítse PDF-fájljait offline módban a böngészőben',
              description: 'Kombináljon több rendkívül érzékeny PDF-dokumentumot internetkapcsolat nélkül. Betöltés után teljesen offline módban működik.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'hu')
            },
            fi: {
              title: 'Yhdistä PDF-tiedostoja offline-tilassa Ilmainen | 100 % turvallinen',
              h1: 'Yhdistä PDF-tiedostosi offline-tilassa selaimessa',
              description: 'Yhdistä useita erittäin arkaluonteisia PDF-dokumentteja ilman Internet-yhteyttä. Toimii täysin offline-tilassa latauksen jälkeen.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'fi')
            },
            ms: {
              title: 'Gabungkan Fail PDF Luar Talian Percuma | 100% Selamat',
              h1: 'Gabungkan PDF Anda Luar Talian dalam Penyemak Imbas',
              description: 'Gabungkan berbilang dokumen PDF yang sangat sensitif tanpa sambungan internet. Berfungsi sepenuhnya di luar talian selepas dimuatkan.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'ms')
            },
            sk: {
              title: 'Zlúčiť súbory PDF offline zadarmo | 100% bezpečné',
              h1: 'Zlúčte svoje súbory PDF v režime offline v prehliadači',
              description: 'Kombinujte viacero vysoko citlivých dokumentov PDF bez internetového pripojenia. Po načítaní funguje plne offline.',
              faqs: defaultFaqs('merge-pdf-files-offline', 'sk')
            }
          }
        },
    {
          id: 'convert-scanned-pdf-to-text',
          category: 'pdf',
          iconName: 'FileText',
          slugs: generateSlugsForId('convert-scanned-pdf-to-text', {
            en: 'convert-scanned-pdf-to-text',
            zh: 'convert-scanned-pdf-to-text',
            ja: 'pdf',
            ru: 'pdf',
            pt: 'converter-pdf-digitalizado-em-texto',
            fr: 'convertir-un-pdf-num-ris-en-texte',
            id: 'mengonversi-pindaian-pdf-menjadi-teks',
            ar: 'convert-scanned-pdf-to-text-ar',
            es: 'convertir-pdf-escaneado-a-texto',
            de: 'konvertieren-sie-gescannte-pdfs-in-text',
            ko: 'pdf',
            nl: 'gescande-pdf-naar-tekst-converteren',
            th: 'pdf',
            cs: 'p-ev-st-naskenovan-pdf-na-text',
            vi: 'chuy-n-i-pdf-c-qu-t-th-nh-v-n-b-n',
            hi: 'convert-scanned-pdf-to-text-hi',
            it: 'convertire-pdf-scansionati-in-testo',
            tr: 'taranan-pdf-yi-metne-d-n-t-r',
            sv: 'konvertera-skannade-pdf-till-text',
            pl: 'konwertuj-zeskanowany-plik-pdf-na-tekst',
            fi: 'muunna-skannattu-pdf-tekstiksi',
            el: 'pdf',
            no: 'konvertere-skannet-pdf-til-tekst',
            ms: 'menukar-pdf-yang-diimbas-kepada-teks',
            uk: 'pdf',
            da: 'konvertere-scannet-pdf-til-tekst',
            he: 'pdf',
            ro: 'converti-pdf-ul-scanat-n-text',
            hu: 'konvert-lja-a-beolvasott-pdf-et-sz-vegg',
            sk: 'previes-naskenovan-pdf-na-text'
          }),
          seo: {
            en: {
            title: 'Convert Scanned PDF to Searchable Text | Free OCR',
            h1: 'Turn Scanned PDFs into Editable Text',
            description: 'Use advanced browser-based OCR to extract text from scanned images and unsearchable PDFs. 100% free and private.',
            faqs: defaultFaqs('convert-scanned-pdf-to-text', 'en')
          },
            zh: {
              title: 'Convert Scanned PDF to Searchable Text | Free OCR',
              h1: 'Turn Scanned PDFs into Editable Text',
              description: 'Use advanced browser-based OCR to extract text from scanned images and unsearchable PDFs. 100% free and private.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'zh')
            },
            ja: {
              title: 'スキャンした PDF を検索可能なテキストに変換 | 無料のOCR',
              h1: 'スキャンした PDF を編集可能なテキストに変換する',
              description: '高度なブラウザベースの OCR を使用して、スキャンされた画像や検索不可能な PDF からテキストを抽出します。 完全に無料でプライベートです。',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'ja')
            },
            ru: {
              title: 'Преобразование отсканированного PDF в текст с возможностью поиска | Бесплатное распознавание текста',
              h1: 'Превратите отсканированные PDF-файлы в редактируемый текст',
              description: 'Используйте расширенное распознавание текста на базе браузера для извлечения текста из отсканированных изображений и PDF-файлов, недоступных для поиска. 100% бесплатно и конфиденциально.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'ru')
            },
            pt: {
              title: 'Converter PDF digitalizado em texto pesquisável | OCR grátis',
              h1: 'Transforme PDFs digitalizados em texto editável',
              description: 'Use OCR avançado baseado em navegador para extrair texto de imagens digitalizadas e PDFs não pesquisáveis. 100% gratuito e privado.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'pt')
            },
            fr: {
              title: 'Convertir un PDF numérisé en texte consultable | ROC gratuite',
              h1: 'Transformez les PDF numérisés en texte modifiable',
              description: 'Utilisez l\'OCR avancé basé sur un navigateur pour extraire le texte des images numérisées et des PDF impossibles à rechercher. 100% gratuit et privé.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'fr')
            },
            id: {
              title: 'Konversikan PDF yang Dipindai ke Teks yang Dapat Dicari | OCR gratis',
              h1: 'Ubah PDF yang Dipindai menjadi Teks yang Dapat Diedit',
              description: 'Gunakan OCR berbasis browser tingkat lanjut untuk mengekstrak teks dari gambar yang dipindai dan PDF yang tidak dapat dicari. 100% gratis dan pribadi.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'id')
            },
            ar: {
              title: 'تحويل ملف PDF الممسوح ضوئيًا إلى نص قابل للبحث | التعرف الضوئي على الحروف مجانًا',
              h1: 'تحويل ملفات PDF الممسوحة ضوئيًا إلى نص قابل للتحرير',
              description: 'استخدم تقنية التعرف الضوئي على الحروف (OCR) المتقدمة المستندة إلى المستعرض لاستخراج النص من الصور الممسوحة ضوئيًا وملفات PDF غير القابلة للبحث. 100% مجاني وخاص.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'ar')
            },
            es: {
              title: 'Convierta PDF escaneado en texto con capacidad de búsqueda | OCR gratuito',
              h1: 'Convierta archivos PDF escaneados en texto editable',
              description: 'Utilice OCR avanzado basado en navegador para extraer texto de imágenes escaneadas y archivos PDF que no se pueden buscar. 100% gratis y privado.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'es')
            },
            de: {
              title: 'Konvertieren Sie gescannte PDFs in durchsuchbaren Text | Kostenlose OCR',
              h1: 'Verwandeln Sie gescannte PDFs in bearbeitbaren Text',
              description: 'Verwenden Sie erweiterte browserbasierte OCR, um Text aus gescannten Bildern und nicht durchsuchbaren PDFs zu extrahieren. 100 % kostenlos und privat.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'de')
            },
            ko: {
              title: '스캔한 PDF를 검색 가능한 텍스트로 변환 | 무료 OCR',
              h1: '스캔한 PDF를 편집 가능한 텍스트로 변환',
              description: '고급 브라우저 기반 OCR을 사용하여 스캔한 이미지와 검색할 수 없는 PDF에서 텍스트를 추출합니다. 100% 무료이며 비공개입니다.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'ko')
            },
            nl: {
              title: 'Gescande PDF converteren naar doorzoekbare tekst | Gratis OCR',
              h1: 'Zet gescande PDF\'s om in bewerkbare tekst',
              description: 'Gebruik geavanceerde browsergebaseerde OCR om tekst uit gescande afbeeldingen en ondoorzoekbare PDF\'s te extraheren. 100% gratis en privé.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'nl')
            },
            th: {
              title: 'แปลง PDF ที่สแกนเป็นข้อความที่ค้นหาได้ | โอซีอาร์ฟรี',
              h1: 'เปลี่ยน PDF ที่สแกนเป็นข้อความที่แก้ไขได้',
              description: 'ใช้ OCR บนเบราว์เซอร์ขั้นสูงเพื่อแยกข้อความจากรูปภาพที่สแกนและ PDF ที่ไม่สามารถค้นหาได้ ฟรี 100% และเป็นส่วนตัว',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'th')
            },
            cs: {
              title: 'Převést naskenované PDF na prohledávatelný text | OCR zdarma',
              h1: 'Přeměňte naskenované soubory PDF na upravitelný text',
              description: 'Použijte pokročilé OCR založené na prohlížeči k extrahování textu z naskenovaných obrázků a souborů PDF, které nelze prohledávat. 100% zdarma a soukromé.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'cs')
            },
            vi: {
              title: 'Chuyển đổi PDF được quét thành văn bản có thể tìm kiếm | OCR miễn phí',
              h1: 'Biến các tệp PDF được quét thành văn bản có thể chỉnh sửa',
              description: 'Sử dụng OCR dựa trên trình duyệt nâng cao để trích xuất văn bản từ hình ảnh được quét và các tệp PDF không thể tìm kiếm. 100% miễn phí và riêng tư.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'vi')
            },
            hi: {
              title: 'स्कैन किए गए पीडीएफ को खोजने योग्य टेक्स्ट में बदलें | मुफ़्त ओसीआर',
              h1: 'स्कैन की गई पीडीएफ़ को संपादन योग्य टेक्स्ट में बदलें',
              description: 'स्कैन की गई छवियों और न खोजी जा सकने वाली पीडीएफ़ से पाठ निकालने के लिए उन्नत ब्राउज़र-आधारित ओसीआर का उपयोग करें। 100% मुफ़्त और निजी।',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'hi')
            },
            it: {
              title: 'Converti PDF scansionato in testo ricercabile | OCR gratuito',
              h1: 'Trasforma i PDF scansionati in testo modificabile',
              description: 'Utilizza l\'OCR avanzato basato su browser per estrarre testo da immagini scansionate e PDF non ricercabili. 100% gratuito e privato.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'it')
            },
            tr: {
              title: 'Taranan PDF\'yi Aranabilir Metne Dönüştürme | Ücretsiz OCR',
              h1: 'Taranmış PDF\'leri Düzenlenebilir Metne Dönüştürün',
              description: 'Taranmış görüntülerden ve aranamayan PDF\'lerden metin çıkarmak için gelişmiş tarayıcı tabanlı OCR\'yi kullanın. %100 ücretsiz ve özel.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'tr')
            },
            sv: {
              title: 'Konvertera skannad PDF till sökbar text | Gratis OCR',
              h1: 'Förvandla skannade PDF-filer till redigerbar text',
              description: 'Använd avancerad webbläsarbaserad OCR för att extrahera text från skannade bilder och osökbara PDF-filer. 100 % gratis och privat.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'sv')
            },
            pl: {
              title: 'Konwertuj zeskanowany plik PDF na tekst z możliwością wyszukiwania | Bezpłatny OCR',
              h1: 'Zamień zeskanowane pliki PDF w edytowalny tekst',
              description: 'Użyj zaawansowanego OCR opartego na przeglądarce, aby wyodrębnić tekst ze zeskanowanych obrazów i nieprzeszukiwalnych plików PDF. 100% darmowy i prywatny.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'pl')
            },
            fi: {
              title: 'Muunna skannattu PDF haettavaksi tekstiksi | Ilmainen OCR',
              h1: 'Muuta skannatut PDF-tiedostot muokattavaksi tekstiksi',
              description: 'Käytä kehittynyttä selainpohjaista tekstintunnistusta tekstin poimimiseen skannatuista kuvista ja PDF-tiedostoista, joita ei voi hakea. 100% ilmainen ja yksityinen.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'fi')
            },
            el: {
              title: 'Μετατροπή σαρωμένου PDF σε κείμενο με δυνατότητα αναζήτησης | Δωρεάν OCR',
              h1: 'Μετατρέψτε τα σαρωμένα PDF σε επεξεργάσιμο κείμενο',
              description: 'Χρησιμοποιήστε προηγμένο OCR που βασίζεται σε πρόγραμμα περιήγησης για να εξαγάγετε κείμενο από σαρωμένες εικόνες και αρχεία PDF που δεν μπορούν να αναζητηθούν. 100% δωρεάν και ιδιωτικό.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'el')
            },
            no: {
              title: 'Konverter skannet PDF til søkbar tekst | Gratis OCR',
              h1: 'Gjør skannede PDF-er til redigerbar tekst',
              description: 'Bruk avansert nettleserbasert OCR for å trekke ut tekst fra skannede bilder og usøkbare PDF-filer. 100 % gratis og privat.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'no')
            },
            ms: {
              title: 'Tukar PDF yang Diimbas kepada Teks Boleh Dicari | OCR percuma',
              h1: 'Tukar PDF yang Diimbas kepada Teks Boleh Diedit',
              description: 'Gunakan OCR berasaskan pelayar lanjutan untuk mengekstrak teks daripada imej yang diimbas dan PDF yang tidak boleh dicari. 100% percuma dan peribadi.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'ms')
            },
            uk: {
              title: 'Перетворення відсканованого PDF-файлу на текст із можливістю пошуку | Безкоштовне OCR',
              h1: 'Перетворіть відскановані PDF-файли на редагований текст',
              description: 'Використовуйте вдосконалене оптичне розпізнавання тексту на основі браузера, щоб видобувати текст із відсканованих зображень і PDF-файлів, у яких неможливо шукати. 100% безкоштовно та приватно.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'uk')
            },
            da: {
              title: 'Konverter scannet PDF til søgbar tekst | Gratis OCR',
              h1: 'Gør scannede PDF\'er til redigerbar tekst',
              description: 'Brug avanceret browserbaseret OCR til at udtrække tekst fra scannede billeder og usøgelige PDF-filer. 100 % gratis og privat.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'da')
            },
            he: {
              title: 'המרת PDF סרוק לטקסט הניתן לחיפוש | OCR בחינם',
              h1: 'הפוך קובצי PDF סרוקים לטקסט הניתן לעריכה',
              description: 'השתמש ב-OCR מתקדם מבוסס דפדפן כדי לחלץ טקסט מתמונות סרוקות ומקובצי PDF בלתי ניתנים לחיפוש. 100% חינם ופרטי.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'he')
            },
            ro: {
              title: 'Convertiți PDF scanat în text care poate fi căutat | OCR gratuit',
              h1: 'Transformați PDF-urile scanate în text editabil',
              description: 'Utilizați OCR avansat bazat pe browser pentru a extrage text din imaginile scanate și din PDF-uri care nu pot fi căutate. 100% gratuit și privat.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'ro')
            },
            hu: {
              title: 'A beolvasott PDF konvertálása kereshető szöveggé | Ingyenes OCR',
              h1: 'A beolvasott PDF-fájlokat szerkeszthető szöveggé alakíthatja',
              description: 'Használjon fejlett böngészőalapú OCR-t a beolvasott képekből és a nem kereshető PDF-fájlokból történő szöveg kivonásához. 100% ingyenes és privát.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'hu')
            },
            sk: {
              title: 'Previesť naskenované PDF na vyhľadávateľný text | OCR zadarmo',
              h1: 'Premeňte naskenované súbory PDF na upraviteľný text',
              description: 'Použite pokročilé OCR založené na prehliadači na extrahovanie textu z naskenovaných obrázkov a nevyhľadateľných súborov PDF. 100% zadarmo a súkromne.',
              faqs: defaultFaqs('convert-scanned-pdf-to-text', 'sk')
            }
          }
        },
    {
          id: 'add-page-numbers-to-pdf-free',
          category: 'pdf',
          iconName: 'ListOrdered',
          slugs: generateSlugsForId('add-page-numbers-to-pdf-free', {
            en: 'add-page-numbers-to-pdf-free',
            zh: 'add-page-numbers-to-pdf-free',
            ja: 'pdf',
            fr: 'ajouter-des-num-ros-de-page-au-pdf-gratuitement',
            id: 'tambahkan-nomor-halaman-ke-pdf-gratis',
            pt: 'adicionar-n-meros-de-p-gina-ao-pdf-gratuitamente',
            de: 'seitenzahlen-kostenlos-zum-pdf-hinzuf-gen',
            ar: 'pdf',
            es: 'agregar-n-meros-de-p-gina-a-pdf-gratis',
            ru: 'pdf',
            it: 'aggiungi-numeri-di-pagina-al-pdf-gratuitamente',
            ko: 'pdf',
            nl: 'paginanummers-toevoegen-aan-pdf-gratis',
            pl: 'dodaj-numery-stron-do-pliku-pdf-za-darmo',
            tr: 'pdf-ye-cretsiz-sayfa-numaralar-ekleme',
            hi: 'add-page-numbers-to-pdf-free-hi',
            th: 'pdf',
            vi: 'th-m-s-trang-v-o-pdf-mi-n-ph',
            sv: 'l-gg-till-sidnummer-till-pdf-gratis',
            cs: 'p-idat-sla-str-nek-do-pdf-zdarma',
            el: 'pdf',
            sk: 'prida-sla-str-n-do-pdf-zadarmo',
            hu: 'oldalsz-mok-hozz-ad-sa-a-pdf-hez-ingyenes',
            da: 'tilf-j-sidetal-til-pdf-gratis',
            ro: 'ad-uga-i-numere-de-pagini-la-pdf-gratuit',
            fi: 'lis-sivunumerot-pdf-tiedostoon-ilmaiseksi',
            no: 'legg-til-sidetall-til-pdf-gratis',
            uk: 'pdf',
            he: 'pdf',
            ms: 'tambah-nombor-halaman-ke-pdf-percuma'
          }),
          seo: {
            en: {
            title: 'Add Page Numbers to PDF Free | No Limits',
            h1: 'Insert Page Numbers into PDF Documents',
            description: 'Easily paginate your PDF files. Add customizable page numbers to headers or footers instantly for free.',
            faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'en')
          },
            zh: {
              title: 'Add Page Numbers to PDF Free | No Limits',
              h1: 'Insert Page Numbers into PDF Documents',
              description: 'Easily paginate your PDF files. Add customizable page numbers to headers or footers instantly for free.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'zh')
            },
            ja: {
              title: 'PDF にページ番号を無料で追加 | 制限なし',
              h1: 'PDF ドキュメントにページ番号を挿入する',
              description: 'PDF ファイルのページネーションを簡単に行えます。 カスタマイズ可能なページ番号をヘッダーまたはフッターに無料ですぐに追加できます。',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'ja')
            },
            fr: {
              title: 'Ajouter des numéros de page au PDF gratuitement | Aucune limite',
              h1: 'Insérer des numéros de page dans des documents PDF',
              description: 'Paginez facilement vos fichiers PDF. Ajoutez instantanément et gratuitement des numéros de page personnalisables aux en-têtes ou aux pieds de page.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'fr')
            },
            id: {
              title: 'Tambahkan Nomor Halaman ke PDF Gratis | Tanpa Batas',
              h1: 'Masukkan Nomor Halaman ke dalam Dokumen PDF',
              description: 'Buat halaman file PDF Anda dengan mudah. Tambahkan nomor halaman yang dapat disesuaikan ke header atau footer secara instan dan gratis.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'id')
            },
            pt: {
              title: 'Adicione números de página ao PDF gratuitamente | Sem Limites',
              h1: 'Insira números de página em documentos PDF',
              description: 'Pagine facilmente seus arquivos PDF. Adicione números de página personalizáveis ​​a cabeçalhos ou rodapés instantaneamente e gratuitamente.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'pt')
            },
            de: {
              title: 'Seitenzahlen zu PDF kostenlos hinzufügen | Keine Grenzen',
              h1: 'Fügen Sie Seitenzahlen in PDF-Dokumente ein',
              description: 'Paginieren Sie Ihre PDF-Dateien ganz einfach. Fügen Sie sofort und kostenlos anpassbare Seitenzahlen zu Kopf- oder Fußzeilen hinzu.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'de')
            },
            ar: {
              title: 'إضافة أرقام الصفحات إلى PDF مجانًا | لا حدود',
              h1: 'إدراج أرقام الصفحات في مستندات PDF',
              description: 'قم بترقيم ملفات PDF الخاصة بك بسهولة. أضف أرقام صفحات قابلة للتخصيص إلى الرؤوس أو التذييلات على الفور مجانًا.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'ar')
            },
            es: {
              title: 'Agregue números de página a PDF gratis | Sin límites',
              h1: 'Insertar números de página en documentos PDF',
              description: 'Pagina fácilmente tus archivos PDF. Agregue números de página personalizables a encabezados o pies de página al instante y de forma gratuita.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'es')
            },
            ru: {
              title: 'Добавить номера страниц в PDF бесплатно | Без ограничений',
              h1: 'Вставка номеров страниц в PDF-документы',
              description: 'Легко разбивайте PDF-файлы на страницы. Добавляйте настраиваемые номера страниц в верхние или нижние колонтитулы мгновенно и бесплатно.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'ru')
            },
            it: {
              title: 'Aggiungi numeri di pagina al PDF gratuitamente | Nessun limite',
              h1: 'Inserisci i numeri di pagina nei documenti PDF',
              description: 'Impagina facilmente i tuoi file PDF. Aggiungi istantaneamente e gratuitamente numeri di pagina personalizzabili alle intestazioni o ai piè di pagina.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'it')
            },
            ko: {
              title: '무료로 PDF에 페이지 번호 추가 | 제한 없음',
              h1: 'PDF 문서에 페이지 번호 삽입',
              description: 'PDF 파일의 페이지를 쉽게 매깁니다. 머리글이나 바닥글에 사용자 정의 가능한 페이지 번호를 무료로 즉시 추가하세요.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'ko')
            },
            nl: {
              title: 'Paginanummers toevoegen aan PDF Gratis | Geen grenzen',
              h1: 'Paginanummers invoegen in PDF-documenten',
              description: 'Pagineer eenvoudig uw PDF-bestanden. Voeg direct gratis aanpasbare paginanummers toe aan kop- en voetteksten.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'nl')
            },
            pl: {
              title: 'Dodaj numery stron do pliku PDF za darmo | Bez ograniczeń',
              h1: 'Wstaw numery stron do dokumentów PDF',
              description: 'Z łatwością podziel na strony swoje pliki PDF. Natychmiast i bezpłatnie dodawaj konfigurowalne numery stron do nagłówków i stopek.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'pl')
            },
            tr: {
              title: 'PDF\'ye Ücretsiz Sayfa Numaraları Ekleme | Sınır Yok',
              h1: 'PDF Belgelerine Sayfa Numaraları Ekleme',
              description: 'PDF dosyalarınızı kolayca sayfalandırın. Üstbilgilere veya altbilgilere anında ücretsiz olarak özelleştirilebilir sayfa numaraları ekleyin.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'tr')
            },
            hi: {
              title: 'पीडीएफ में पेज नंबर निःशुल्क जोड़ें | असीम',
              h1: 'पीडीएफ दस्तावेजों में पेज नंबर डालें',
              description: 'अपनी पीडीएफ फाइलों को आसानी से पेजिनेट करें। शीर्षलेखों या पादलेखों में तुरंत निःशुल्क अनुकूलन योग्य पृष्ठ संख्याएँ जोड़ें।',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'hi')
            },
            th: {
              title: 'เพิ่มหมายเลขหน้าเป็น PDF ฟรี | ไม่มีขีดจำกัด',
              h1: 'แทรกหมายเลขหน้าลงในเอกสาร PDF',
              description: 'แบ่งหน้าไฟล์ PDF ของคุณได้อย่างง่ายดาย เพิ่มหมายเลขหน้าที่ปรับแต่งได้ที่ส่วนหัวหรือส่วนท้ายทันทีฟรี',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'th')
            },
            vi: {
              title: 'Thêm số trang vào PDF miễn phí | Không giới hạn',
              h1: 'Chèn số trang vào tài liệu PDF',
              description: 'Dễ dàng phân trang các tập tin PDF của bạn. Thêm số trang có thể tùy chỉnh vào đầu trang hoặc chân trang ngay lập tức miễn phí.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'vi')
            },
            sv: {
              title: 'Lägg till sidnummer till PDF Gratis | Inga gränser',
              h1: 'Infoga sidnummer i PDF-dokument',
              description: 'Sida in dina PDF-filer enkelt. Lägg till anpassningsbara sidnummer i sidhuvuden eller sidfötter direkt gratis.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'sv')
            },
            cs: {
              title: 'Přidat čísla stránek do PDF zdarma | Žádné limity',
              h1: 'Vkládání čísel stránek do dokumentů PDF',
              description: 'Snadno stránkujte své soubory PDF. Přidejte přizpůsobitelná čísla stránek do záhlaví nebo zápatí okamžitě a zdarma.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'cs')
            },
            el: {
              title: 'Προσθήκη αριθμών σελίδων σε PDF Δωρεάν | Χωρίς Όρια',
              h1: 'Εισαγάγετε αριθμούς σελίδων σε έγγραφα PDF',
              description: 'Πραγματοποιήστε σελιδοποίηση των αρχείων PDF σας εύκολα. Προσθέστε προσαρμόσιμους αριθμούς σελίδων σε κεφαλίδες ή υποσέλιδα άμεσα δωρεάν.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'el')
            },
            sk: {
              title: 'Pridať čísla strán do PDF zadarmo | Žiadne limity',
              h1: 'Vložte čísla strán do dokumentov PDF',
              description: 'Jednoducho stránkujte svoje súbory PDF. Pridajte prispôsobiteľné čísla strán do hlavičky alebo päty okamžite zadarmo.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'sk')
            },
            hu: {
              title: 'Oldalszámok hozzáadása PDF-hez Ingyenes | Nincsenek határok',
              h1: 'Oldalszámok beszúrása PDF dokumentumokba',
              description: 'Könnyen lapozhatja PDF fájljait. Adjon testreszabható oldalszámokat a fejlécekhez vagy láblécekhez azonnal, ingyenesen.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'hu')
            },
            da: {
              title: 'Tilføj sidetal til PDF Gratis | Ingen grænser',
              h1: 'Indsæt sidetal i PDF-dokumenter',
              description: 'Paginér nemt dine PDF-filer. Tilføj sidetal, der kan tilpasses, til sidehoveder eller sidefødder med det samme gratis.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'da')
            },
            ro: {
              title: 'Adăugați numere de pagină în PDF gratuit | Fără Limite',
              h1: 'Inserați numere de pagină în documentele PDF',
              description: 'Paginați cu ușurință fișierele PDF. Adăugați gratuit numere de pagină personalizabile la anteturi sau subsoluri.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'ro')
            },
            fi: {
              title: 'Lisää sivunumeroita PDF-tiedostoon ilmaiseksi | Ei rajoja',
              h1: 'Lisää sivunumerot PDF-dokumentteihin',
              description: 'Sivuttele PDF-tiedostosi helposti. Lisää mukautettavat sivunumerot ylä- tai alatunnisteisiin välittömästi ilmaiseksi.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'fi')
            },
            no: {
              title: 'Legg til sidetall til PDF Gratis | Ingen grenser',
              h1: 'Sett inn sidetall i PDF-dokumenter',
              description: 'Paginerer enkelt PDF-filene dine. Legg til sidetall som kan tilpasses til topp- eller bunntekster umiddelbart gratis.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'no')
            },
            uk: {
              title: 'Безкоштовно додайте номери сторінок до PDF | Без обмежень',
              h1: 'Вставте номери сторінок у документи PDF',
              description: 'Легко розбивайте PDF-файли на сторінки. Безкоштовно миттєво додайте настроювані номери сторінок до колонтитулів.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'uk')
            },
            he: {
              title: 'הוסף מספרי עמודים ל-PDF חינם | אין גבולות',
              h1: 'הכנס מספרי עמודים למסמכי PDF',
              description: 'עימוד בקלות את קובצי ה-PDF שלך. הוסף מספרי עמודים הניתנים להתאמה אישית לכותרות עליונות או תחתונות באופן מיידי בחינם.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'he')
            },
            ms: {
              title: 'Tambah Nombor Halaman ke PDF Percuma | Tiada Had',
              h1: 'Masukkan Nombor Halaman ke dalam Dokumen PDF',
              description: 'Buka penomboran fail PDF anda dengan mudah. Tambahkan nombor halaman yang boleh disesuaikan pada pengepala atau pengaki serta-merta secara percuma.',
              faqs: defaultFaqs('add-page-numbers-to-pdf-free', 'ms')
            }
          }
        },
    {
          id: 'remove-pdf-watermark-online',
          category: 'pdf',
          iconName: 'Eraser',
          slugs: generateSlugsForId('remove-pdf-watermark-online', {
            en: 'remove-pdf-watermark-online',
            zh: 'remove-pdf-watermark-online',
            fr: 'supprimer-le-filigrane-pdf-en-ligne',
            pt: 'remover-marca-d-gua-de-pdf-on-line',
            ja: 'pdf',
            es: 'eliminar-marca-de-agua-de-pdf-en-l-nea',
            de: 'pdf-wasserzeichen-online-entfernen',
            id: 'hapus-tanda-air-pdf-online',
            ru: 'pdf',
            ar: 'pdf',
            vi: 'x-a-h-nh-m-pdf-tr-c-tuy-n',
            ko: 'pdf',
            sv: 'ta-bort-pdf-vattenst-mpel-online',
            it: 'rimuovere-la-filigrana-dal-pdf-online',
            th: 'pdf',
            cs: 'odstranit-vodoznak-pdf-online',
            tr: 'pdf-filigran-n-evrimi-i-kald-r',
            nl: 'verwijder-pdf-watermerk-online',
            pl: 'usu-znak-wodny-pdf-online',
            hi: 'remove-pdf-watermark-online-hi',
            el: 'pdf',
            sk: 'odstr-ni-vodoznak-pdf-online',
            he: 'pdf',
            hu: 'pdf-v-zjel-elt-vol-t-sa-online',
            ms: 'buang-tera-air-pdf-dalam-talian',
            no: 'fjern-pdf-vannmerke-online',
            da: 'fjern-pdf-vandm-rke-online',
            uk: 'pdf',
            ro: 'elimina-i-filigranul-pdf-online',
            fi: 'poista-pdf-vesileima-verkossa'
          }),
          seo: {
            en: {
            title: 'Remove PDF Watermark Online Free | Clean PDFs',
            h1: 'Remove Watermarks from PDF Files Safely',
            description: 'Redact or remove intrusive watermarks from your PDF documents. Fully private, browser-based watermark removal tool.',
            faqs: defaultFaqs('remove-pdf-watermark-online', 'en')
          },
            zh: {
              title: 'Remove PDF Watermark Online Free | Clean PDFs',
              h1: 'Remove Watermarks from PDF Files Safely',
              description: 'Redact or remove intrusive watermarks from your PDF documents. Fully private, browser-based watermark removal tool.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'zh')
            },
            fr: {
              title: 'Supprimer le filigrane PDF en ligne gratuitement | Nettoyer les PDF',
              h1: 'Supprimez les filigranes des fichiers PDF en toute sécurité',
              description: 'Rédigez ou supprimez les filigranes intrusifs de vos documents PDF. Outil de suppression de filigrane entièrement privé, basé sur un navigateur.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'fr')
            },
            pt: {
              title: 'Remover marca d\'água de PDF online gratuitamente | Limpar PDFs',
              h1: 'Remova marcas d\'água de arquivos PDF com segurança',
              description: 'Edite ou remova marcas d\'água intrusivas de seus documentos PDF. Ferramenta de remoção de marca d\'água totalmente privada baseada em navegador.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'pt')
            },
            ja: {
              title: 'PDF透かしをオンラインで無料で削除 | クリーンな PDF',
              h1: 'PDF ファイルからウォーターマークを安全に削除する',
              description: 'PDF ドキュメントから邪魔な透かしを編集または削除します。 完全にプライベートなブラウザベースのウォーターマーク除去ツール。',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'ja')
            },
            es: {
              title: 'Eliminar marca de agua de PDF en línea gratis | Limpiar archivos PDF',
              h1: 'Eliminar marcas de agua de archivos PDF de forma segura',
              description: 'Redacte o elimine marcas de agua intrusivas de sus documentos PDF. Herramienta de eliminación de marcas de agua totalmente privada y basada en navegador.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'es')
            },
            de: {
              title: 'PDF-Wasserzeichen online kostenlos entfernen | Saubere PDFs',
              h1: 'Entfernen Sie Wasserzeichen sicher aus PDF-Dateien',
              description: 'Schwärzen oder entfernen Sie störende Wasserzeichen aus Ihren PDF-Dokumenten. Vollständig privates, browserbasiertes Tool zum Entfernen von Wasserzeichen.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'de')
            },
            id: {
              title: 'Hapus Tanda Air PDF Online Gratis | Bersihkan PDF',
              h1: 'Hapus Tanda Air dari File PDF dengan Aman',
              description: 'Sunting atau hapus tanda air yang mengganggu dari dokumen PDF Anda. Alat penghapus tanda air berbasis browser yang sepenuhnya pribadi.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'id')
            },
            ru: {
              title: 'Удалить водяной знак PDF онлайн бесплатно | Очистить PDF-файлы',
              h1: 'Безопасное удаление водяных знаков из PDF-файлов',
              description: 'Отредактируйте или удалите навязчивые водяные знаки из ваших PDF-документов. Полностью конфиденциальный инструмент для удаления водяных знаков на основе браузера.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'ru')
            },
            ar: {
              title: 'إزالة العلامة المائية لملف PDF عبر الإنترنت مجانًا | تنظيف ملفات PDF',
              h1: 'إزالة العلامات المائية من ملفات PDF بأمان',
              description: 'قم بتنقيح العلامات المائية المتطفلة أو إزالتها من مستندات PDF الخاصة بك. أداة إزالة العلامات المائية الخاصة بالكامل والمعتمدة على المتصفح.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'ar')
            },
            vi: {
              title: 'Xóa hình mờ PDF trực tuyến miễn phí | Làm sạch các tệp PDF',
              h1: 'Xóa hình mờ khỏi tệp PDF một cách an toàn',
              description: 'Biên tập lại hoặc xóa hình mờ xâm nhập khỏi tài liệu PDF của bạn. Công cụ xóa hình mờ hoàn toàn riêng tư, dựa trên trình duyệt.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'vi')
            },
            ko: {
              title: 'PDF 워터마크를 온라인으로 무료로 제거하세요 | PDF 정리',
              h1: 'PDF 파일에서 워터마크를 안전하게 제거하세요',
              description: 'PDF 문서에서 방해가 되는 워터마크를 수정하거나 제거하세요. 완전 비공개 브라우저 기반 워터마크 제거 도구입니다.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'ko')
            },
            sv: {
              title: 'Ta bort PDF Watermark Online Gratis | Rengör PDF-filer',
              h1: 'Ta bort vattenstämplar från PDF-filer på ett säkert sätt',
              description: 'Redigera eller ta bort påträngande vattenstämplar från dina PDF-dokument. Helt privat, webbläsarbaserat verktyg för borttagning av vattenstämplar.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'sv')
            },
            it: {
              title: 'Rimuovi filigrana PDF online gratuitamente | PDF puliti',
              h1: 'Rimuovi filigrane dai file PDF in modo sicuro',
              description: 'Redisci o rimuovi filigrane invadenti dai tuoi documenti PDF. Strumento di rimozione filigrana completamente privato e basato su browser.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'it')
            },
            th: {
              title: 'ลบลายน้ำ PDF ออนไลน์ฟรี | ทำความสะอาด PDF',
              h1: 'ลบลายน้ำออกจากไฟล์ PDF อย่างปลอดภัย',
              description: 'แก้ไขหรือลบลายน้ำที่ล่วงล้ำออกจากเอกสาร PDF ของคุณ เครื่องมือลบลายน้ำแบบส่วนตัวบนเบราว์เซอร์',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'th')
            },
            cs: {
              title: 'Odebrat PDF vodoznak online zdarma | Čisté PDF',
              h1: 'Odstraňte vodoznaky ze souborů PDF bezpečně',
              description: 'Upravte nebo odstraňte rušivé vodoznaky z dokumentů PDF. Plně soukromý nástroj pro odstranění vodoznaku založený na prohlížeči.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'cs')
            },
            tr: {
              title: 'PDF Filigranını Çevrimiçi Ücretsiz Kaldırma | PDF\'leri temizle',
              h1: 'Filigranları PDF Dosyalarından Güvenle Kaldırın',
              description: 'PDF belgelerinizdeki izinsiz filigranları düzenleyin veya kaldırın. Tamamen özel, tarayıcı tabanlı filigran kaldırma aracı.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'tr')
            },
            nl: {
              title: 'PDF-watermerk online gratis verwijderen | Schone PDF\'s',
              h1: 'Verwijder watermerken veilig uit PDF-bestanden',
              description: 'Bewerk of verwijder opdringerige watermerken uit uw PDF-documenten. Volledig privé, browsergebaseerd hulpmiddel voor het verwijderen van watermerken.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'nl')
            },
            pl: {
              title: 'Usuń znak wodny PDF online za darmo | Wyczyść pliki PDF',
              h1: 'Bezpiecznie usuwaj znaki wodne z plików PDF',
              description: 'Zredaguj lub usuń uciążliwe znaki wodne z dokumentów PDF. W pełni prywatne narzędzie do usuwania znaków wodnych oparte na przeglądarce.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'pl')
            },
            hi: {
              title: 'पीडीएफ वॉटरमार्क ऑनलाइन नि:शुल्क हटाएं | पीडीएफ साफ़ करें',
              h1: 'पीडीएफ फाइलों से वॉटरमार्क सुरक्षित रूप से हटाएं',
              description: 'अपने पीडीएफ दस्तावेजों से घुसपैठिए वॉटरमार्क को सुधारें या हटाएं। पूरी तरह से निजी, ब्राउज़र-आधारित वॉटरमार्क हटाने वाला उपकरण।',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'hi')
            },
            el: {
              title: 'Κατάργηση PDF Watermark Online Δωρεάν | Καθαρίστε αρχεία PDF',
              h1: 'Αφαιρέστε τα υδατογραφήματα από τα αρχεία PDF με ασφάλεια',
              description: 'Διορθώστε ή αφαιρέστε τα παρεμβατικά υδατογραφήματα από τα έγγραφά σας PDF. Πλήρως ιδιωτικό εργαλείο αφαίρεσης υδατογραφήματος που βασίζεται σε πρόγραμμα περιήγησης.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'el')
            },
            sk: {
              title: 'Odstrániť PDF vodoznak online zadarmo | Čisté súbory PDF',
              h1: 'Bezpečne odstráňte vodoznaky zo súborov PDF',
              description: 'Upravte alebo odstráňte rušivé vodoznaky z dokumentov PDF. Úplne súkromný nástroj na odstránenie vodoznaku založený na prehliadači.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'sk')
            },
            he: {
              title: 'הסר סימן מים PDF באינטרנט בחינם | קובצי PDF נקיים',
              h1: 'הסר סימני מים מקבצי PDF בצורה בטוחה',
              description: 'ערוך או הסר סימני מים פולשניים ממסמכי ה-PDF שלך. כלי להסרת סימני מים פרטי לחלוטין, מבוסס דפדפן.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'he')
            },
            hu: {
              title: 'PDF vízjel eltávolítása online ingyenes | Tisztítsa meg a PDF-eket',
              h1: 'Távolítsa el biztonságosan a vízjeleket a PDF-fájlokból',
              description: 'Változtassa meg vagy távolítsa el a tolakodó vízjeleket PDF-dokumentumaiból. Teljesen privát, böngésző alapú vízjeleltávolító eszköz.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'hu')
            },
            ms: {
              title: 'Buang Tera Air PDF Percuma Dalam Talian | Bersihkan PDF',
              h1: 'Alih Keluar Tera Air daripada Fail PDF dengan Selamat',
              description: 'Sunting atau alih keluar tera air yang mengganggu daripada dokumen PDF anda. Alat penyingkiran tera air berasaskan pelayar peribadi sepenuhnya.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'ms')
            },
            no: {
              title: 'Fjern PDF Watermark Online Gratis | Rengjør PDF-filer',
              h1: 'Fjern vannmerker fra PDF-filer trygt',
              description: 'Rediger eller fjern påtrengende vannmerker fra PDF-dokumentene dine. Helt privat, nettleserbasert verktøy for fjerning av vannmerker.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'no')
            },
            da: {
              title: 'Fjern PDF Vandmærke Online Gratis | Rens PDF-filer',
              h1: 'Fjern vandmærker fra PDF-filer sikkert',
              description: 'Rediger eller fjern påtrængende vandmærker fra dine PDF-dokumenter. Fuldstændig privat, browserbaseret værktøj til fjernelse af vandmærker.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'da')
            },
            uk: {
              title: 'Видалити водяний знак PDF онлайн безкоштовно | Чисті PDF-файли',
              h1: 'Безпечно видаліть водяні знаки з PDF-файлів',
              description: 'Відредагуйте або видаліть нав’язливі водяні знаки з документів PDF. Повністю приватний інструмент для видалення водяних знаків у браузері.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'uk')
            },
            ro: {
              title: 'Eliminați filigranul PDF online gratuit | Curățați fișierele PDF',
              h1: 'Eliminați în siguranță filigranele din fișierele PDF',
              description: 'Redactați sau eliminați filigranele intruzive din documentele PDF. Instrument complet privat, bazat pe browser pentru eliminarea filigranelor.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'ro')
            },
            fi: {
              title: 'Poista PDF Watermark Online Ilmainen | Puhtaat PDF-tiedostot',
              h1: 'Poista vesileimat PDF-tiedostoista turvallisesti',
              description: 'Muokkaa tai poista häiritseviä vesileimoja PDF-dokumenteistasi. Täysin yksityinen selainpohjainen vesileiman poistotyökalu.',
              faqs: defaultFaqs('remove-pdf-watermark-online', 'fi')
            }
          }
        }
];

export const advancedPdfTools: ToolDefinition[] = [
  {
    id: 'scan-to-pdf',
    category: 'pdf',
    iconName: 'ScanLine',
    slugs: generateSlugsForId('scan-to-pdf', {
      en: 'scan-to-pdf',
      id: 'scan-ke-pdf',
    }),
    seo: {
      en: {
        title: 'Scan to PDF - Make PDF Uneditable & Rasterize Online',
        h1: 'Scan PDF to Make it Uneditable',
        description: 'Rasterize your PDF documents into flat images inside a PDF. Prevents copy-pasting and editing securely in your browser.',
        faqs: defaultFaqs('Scan to PDF', 'en'),
      },
      id: {
        title: 'Scan ke PDF - Jadikan PDF Permanen Anti Edit Online',
        h1: 'Ubah PDF Menjadi Gambar (Rasterize)',
        description: 'Jadikan dokumen PDF Anda permanen dan anti-edit. Sistem akan mengubah teks menjadi gambar rata yang tidak bisa disalin.',
        faqs: defaultFaqs('Scan ke PDF', 'id'),
      },
    },
  },
  {
    id: 'remove-pdf-metadata',
    category: 'pdf',
    iconName: 'Eraser',
    slugs: generateSlugsForId('remove-pdf-metadata', { en: 'remove-pdf-metadata', id: 'hapus-metadata-pdf', es: 'eliminar-metadatos-pdf', fr: 'supprimer-metadonnees-pdf', de: 'pdf-metadaten-entfernen', pt: 'remover-metadados-pdf', it: 'rimuovi-metadati-pdf', nl: 'pdf-metadata-verwijderen' }),
    seo: {
      en: {
        title: 'Remove PDF Metadata - Sanitize Properties Online',
        h1: 'Clean and Sanitize PDF Metadata',
        description: 'Remove author, creator, and other hidden digital footprint properties from your PDF files offline for better privacy.',
        faqs: defaultFaqs('Remove PDF Metadata', 'en'),
      },
      id: {
        title: 'Hapus Metadata PDF - Bersihkan Jejak Digital Dokumen',
        h1: 'Hapus Properti dan Metadata PDF',
        description: 'Bersihkan nama pembuat, tanggal, dan jejak digital tersembunyi lainnya dari file PDF Anda secara privat di peramban.',
        faqs: defaultFaqs('Hapus Metadata PDF', 'id'),
      },
    },
  },
  {
    id: 'compare-pdf',
    category: 'pdf',
    iconName: 'Scale',
    slugs: generateSlugsForId('compare-pdf', {
      en: 'compare-pdf',
      id: 'bandingkan-pdf',
    }),
    seo: {
      en: {
        title: 'Compare PDF - Find Differences Between Two PDFs',
        h1: 'Compare Two PDF Documents Visually',
        description: 'Upload two PDF files and highlight the visual differences between them pixel-by-pixel locally.',
        faqs: defaultFaqs('Compare PDF', 'en'),
      },
      id: {
        title: 'Bandingkan PDF - Cari Perbedaan 2 Dokumen PDF',
        h1: 'Bandingkan 2 File PDF Secara Visual',
        description: 'Cari tahu perubahan dan perbedaan antara dua versi dokumen PDF. Sorotan piksel merah akan menunjukkan bagian yang berbeda.',
        faqs: defaultFaqs('Bandingkan PDF', 'id'),
      },
    },
  },
  {
    id: 'redact-pdf',
    category: 'pdf',
    iconName: 'EyeOff',
    slugs: generateSlugsForId('redact-pdf', { en: 'redact-pdf', id: 'sensor-pdf', es: 'redactar-pdf', fr: 'masquer-pdf', de: 'pdf-schwaerzen', pt: 'redigir-pdf', it: 'oscura-pdf', nl: 'pdf-redigeren' }),
    seo: {
      en: {
        title: 'Redact PDF - Securely Blackout Text and Images',
        h1: 'Securely Blackout Sensitive PDF Content',
        description: 'Draw redaction boxes over private information. The redacted pages are fully rasterized to permanently destroy the hidden text.',
        faqs: defaultFaqs('Redact PDF', 'en'),
      },
      id: {
        title: 'Sensor PDF - Hitamkan Teks Rahasia Secara Permanen',
        h1: 'Sensor Informasi Sensitif di Dokumen PDF',
        description: 'Hitamkan NIK, nama, atau nominal rahasia di PDF. Kami menggunakan teknik rasterisasi untuk menjamin teks asli hancur permanen.',
        faqs: defaultFaqs('Sensor PDF', 'id'),
      },
    },
  },
  {
    id: 'reverse-pdf',
    category: 'pdf',
    iconName: 'ArrowDownUp',
    slugs: generateSlugsForId('reverse-pdf', {
      en: 'reverse-pdf',
      id: 'balik-urutan-pdf',
    }),
    seo: {
      en: {
        title: 'Reverse PDF Pages - Change PDF Page Order Backwards',
        h1: 'Reverse the Page Order of Your PDF',
        description: 'Instantly reverse the sequence of pages in your PDF document from last to first securely in your browser.',
        faqs: defaultFaqs('Reverse PDF', 'en'),
      },
      id: {
        title: 'Balik Urutan Halaman PDF - Balik PDF dari Belakang',
        h1: 'Balikkan Urutan Halaman PDF Anda',
        description: 'Balik urutan halaman PDF Anda dari halaman terakhir menjadi yang pertama dalam hitungan detik secara lokal.',
        faqs: defaultFaqs('Balik Urutan PDF', 'id'),
      },
    },
  },
  {
    id: 'resize-pdf',
    category: 'pdf',
    iconName: 'Maximize',
    slugs: generateSlugsForId('resize-pdf', {
      en: 'resize-pdf',
      id: 'ubah-ukuran-pdf',
    }),
    seo: {
      en: {
        title: 'Resize PDF Pages - Change PDF Page Size and Margins',
        h1: 'Change the Size and Margins of PDF Pages',
        description: 'Resize your PDF pages to standard sizes like A4 or Letter, add margins, and perfectly center your content.',
        faqs: defaultFaqs('Resize PDF', 'en'),
      },
      id: {
        title: 'Ubah Ukuran Kertas PDF & Tambah Margin',
        h1: 'Ubah Ukuran Kertas PDF Anda (A4, F4, Letter)',
        description: 'Ubah ukuran halaman PDF Anda ke standar A4/Letter, tambah batas margin putih, dan pusatkan konten tanpa memotong isi.',
        faqs: defaultFaqs('Ubah Ukuran PDF', 'id'),
      },
    },
  }
];

pdfTools.push(...advancedPdfTools);
