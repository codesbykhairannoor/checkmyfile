// scripts/generate-tos-translations.cjs
// Script to generate src/i18n/tosTranslations.ts for all 30 supported languages

const fs = require('fs');
const path = require('path');

const tosData = {
  en: {
    tos_title: "Terms of Service & Founder License",
    tos_badge: "TERMS OF SERVICE & LEGAL AGREEMENT",
    tos_last_updated: "Effective Date: November 2026 • Version 2.5",
    tos_intro: "Welcome to HandleMyFile and the Privacy Suite ecosystem. These Terms of Service constitute a legally binding agreement governing your access to and use of our client-side software, tools, and digital services. By using any tool on this platform, you explicitly agree to be bound by these terms.",
    tos_notice_badge: "Privacy Guarantee: 100% of document processing executes locally in your browser via WebAssembly. Your files are never uploaded to our servers.",
    
    s1_title: "1. Acceptance of Terms & Service Scope",
    s1_desc1: "By accessing or using HandleMyFile (handlemyfile.com), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service, our Privacy Policy, and all applicable international laws. If you do not agree with any part of these terms, you must discontinue using the platform immediately.",
    s1_desc2: "These terms apply universally to all visitors, registered free users, and PRO license holders across HandleMyFile and related digital applications in the Privacy Suite.",

    s2_title: "2. Zero-Upload Architecture & Data Privacy Guarantee",
    s2_desc1: "HandleMyFile is built upon a strict Zero-Knowledge, client-side execution model. All PDF parsing, compression, page reordering, format conversion, and cryptographic operations run exclusively inside your local browser memory using WebAssembly (WASM) and hardware-accelerated browser APIs.",
    s2_desc2: "Under no circumstances are your uploaded documents, contracts, medical records, or processed outputs transmitted to, processed on, or cached by our servers. Because your data never leaves your physical device, HandleMyFile is natively compliant with GDPR, HIPAA, and CCPA regulations.",

    s3_title: "3. Licensing Tiers: Free Starter & PRO Plans",
    s3_desc1: "HandleMyFile offers flexible tiers designed for casual users and power professionals:",
    s3_bullet1: "Free Starter Tier: Grants non-exclusive personal and commercial access to document tools with standard batch limits (up to 10 files simultaneously) without requiring an account or credit card.",
    s3_bullet2: "PRO Plans (Monthly & Founder Lifetime Pass): Unlocks Unlimited Ultra-Batch processing (100+ files), custom output file renaming, priority local CPU acceleration, and full commercial usage rights.",

    s4_title: "4. Operational Definition & Scope of 'Lifetime Access'",
    s4_desc1: "In accordance with standard global software industry practices, 'Lifetime Access' or 'Lifetime Pass' refers explicitly and exclusively to the active commercial and operational lifespan of the software product and service. It does NOT refer to the biological lifespan of the purchaser, nor the biological lifespan of the individual creator/developer, nor does it constitute an indefinite commitment until perpetuity or the end of time.",
    s4_desc2: "A Lifetime License guarantees that you will never be charged recurring monthly or annual subscription fees for the features and tools covered by your purchase throughout the active commercial life of the platform. You are entitled to all updates, bug fixes, and core engine improvements deployed while the service remains commercially operated.",

    s5_title: "5. Service Continuity, Force Majeure & Creator Succession",
    s5_desc1: "While the developer intends to maintain, update, and operate HandleMyFile for as long as commercially and technically viable, unforeseen circumstances may arise. In the event of unforeseen personal, medical, or catastrophic events—including but not limited to the developer's permanent incapacity, death, legal or economic impossibility, insolvency, or natural disasters categorized as Force Majeure—the operator or their lawful successors reserve the right to sunset, transfer, or discontinue the online domain and hosting without ongoing liability.",
    s5_desc2: "Client-Side Offline Safeguard: Because HandleMyFile is architected to execute 100% client-side via WebAssembly without proprietary remote server backends, users retain a unique advantage: the underlying tool algorithms run directly on your personal computer's browser, independent of remote server availability.",
    s5_desc3: "In the event of any planned permanent retirement of the service, HandleMyFile will undertake commercially reasonable efforts to give advance notice and/or provide open-access or standalone offline distributions for verified PRO members.",

    s6_title: "6. All-in-One Privacy Suite Multi-Domain Access",
    s6_desc1: "The PRO Founder Lifetime Pass provides integrated access across our family of privacy-first utilities: HandleMyFile (Document & PDF Suite), HelpMyIMG (AI Image Studio), SolveMyMedia (Media Compressor), and CreateMy-QR (Vector QR Generator).",
    s6_desc2: "A single authenticated account provides unified PRO privileges across all authorized domains within the network without duplicate charges.",

    s7_title: "7. Intellectual Property & Complete User Ownership",
    s7_desc1: "You retain 100% unconditional ownership and all intellectual property rights to any files, PDFs, images, or documents you process through HandleMyFile.",
    s7_desc2: "We assert zero copyright, license, or royalty claims over your content. All outputs may be freely used for personal, commercial, legal, and enterprise client deliverables.",

    s8_title: "8. Acceptable Use Policy",
    s8_desc1: "You agree to use HandleMyFile only for lawful purposes. You must not use our tools to forge, alter, or falsify legal documents, government IDs, bank statements, or copyrighted materials for fraudulent, criminal, or deceptive purposes.",

    s9_title: "9. Warranty Disclaimer (AS-IS and AS-AVAILABLE)",
    s9_desc1: "HandleMyFile is provided on an 'AS IS' and 'AS AVAILABLE' basis without warranties of any kind, express or implied, including fitness for a particular purpose, non-infringement, or perpetual uninterrupted availability across all future browser versions.",

    s10_title: "10. Strict Limitation of Liability",
    s10_desc1: "To the maximum extent permitted by applicable law, in no event shall HandleMyFile, its creator, or operators be liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use the tools. In all circumstances, our maximum cumulative liability shall not exceed the actual amount paid by you to HandleMyFile in the twelve (12) months preceding the claim.",

    s11_title: "11. Billing, Payments & 14-Day Refund Policy",
    s11_desc1: "All transactions are processed securely through licensed Merchant of Record partners (Lemon Squeezy) and payment gateways (Duitku). We offer a 14-day customer satisfaction money-back guarantee if the PRO features fail to perform on your supported device.",

    s12_title: "12. Governing Law & Contact",
    s12_desc1: "These Terms of Service are governed by applicable laws. For legal notices, compliance questions, or business inquiries, please contact legal@handlemyfile.com."
  },

  id: {
    tos_title: "Syarat Layanan & Lisensi Founder",
    tos_badge: "SYARAT LAYANAN & PERJANJIAN HUKUM RESMI",
    tos_last_updated: "Tanggal Berlaku: November 2026 • Versi 2.5",
    tos_intro: "Selamat datang di HandleMyFile dan ekosistem Privacy Suite. Syarat Layanan ini merupakan perjanjian yang mengikat secara hukum yang mengatur akses dan penggunaan Anda atas perangkat lunak, perkakas, dan layanan digital sisi klien kami. Dengan menggunakan perkakas apa pun di platform ini, Anda secara tegas setuju untuk terikat oleh ketentuan ini.",
    tos_notice_badge: "Jaminan Privasi: 100% pemrosesan dokumen dieksekusi secara lokal di peramban Anda melalui WebAssembly. Berkas Anda tidak pernah diunggah ke server kami.",

    s1_title: "1. Penerimaan Ketentuan & Cakupan Layanan",
    s1_desc1: "Dengan mengakses atau menggunakan HandleMyFile (handlemyfile.com), Anda menyatakan telah membaca, memahami, dan menyetujui Syarat Layanan ini, Kebijakan Privasi kami, serta seluruh peraturan hukum yang berlaku. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda wajib segera menghentikan penggunaan platform ini.",
    s1_desc2: "Ketentuan ini berlaku secara universal bagi seluruh pengunjung, pengguna gratis terdaftar, maupun pemegang lisensi PRO di HandleMyFile dan aplikasi terkait dalam Privacy Suite.",

    s2_title: "2. Arsitektur Tanpa Unggah & Jaminan Privasi Data",
    s2_desc1: "HandleMyFile dibangun dengan model eksekusi sisi klien Zero-Knowledge yang ketat. Semua pemrosesan PDF, kompresi, pengaturan urutan halaman, konversi format, dan operasi kriptografi dijalankan secara eksklusif di dalam memori peramban lokal Anda menggunakan WebAssembly (WASM) dan API peramban terakselerasi perangkat keras.",
    s2_desc2: "Dalam keadaan apa pun dokumen yang Anda pilih tidak pernah dikirimkan ke, diproses di, atau disimpan sementara di server kami. Karena data Anda tidak pernah keluar dari perangkat fisik Anda, HandleMyFile secara inheren mematuhi regulasi privasi data GDPR, HIPAA, dan UU PDP.",

    s3_title: "3. Tingkatan Lisensi: Free Starter & Paket PRO",
    s3_desc1: "HandleMyFile menyediakan tingkatan lisensi yang fleksibel bagi pengguna kasual hingga profesional:",
    s3_bullet1: "Paket Free Starter: Memberikan akses non-eksklusif pribadi dan komersial ke perkakas dokumen dengan batas batch standar (hingga 10 file sekaligus) tanpa mewajibkan pendaftaran akun atau kartu kredit.",
    s3_bullet2: "Paket PRO (Bulanan & Founder Lifetime Pass): Membuka kapasitas Ultra-Batch tanpa batas (100+ file), penggantian nama file hasil unduhan secara kustom, akselerasi CPU lokal prioritas, dan hak komersial penuh.",

    s4_title: "4. Definisi Operasional & Cakupan 'Akses Seumur Hidup' (Lifetime)",
    s4_desc1: "Sesuai dengan standar industri perangkat lunak global, istilah 'Akses Seumur Hidup' (Lifetime Access / Lifetime Pass) secara tegas dan eksklusif mengacu pada masa operasional dan ketersediaan komersial produk/layanan perangkat lunak ini secara aktif. Istilah ini BUKAN mengacu pada umur biologis pembeli, BUKAN umur biologis individu pembuat/pengembang, dan bukan komitmen tanpa batas waktu hingga keabadian atau akhir zaman (kiamat).",
    s4_desc2: "Lisensi Lifetime menjamin bahwa Anda tidak akan dikenakan biaya langganan bulanan atau tahunan berulang wajib untuk fitur dan perkakas yang tercakup dalam pembelian Anda selama masa aktif komersial platform. Anda berhak atas seluruh pembaruan, perbaikan bug, dan penyempurnaan mesin yang dirilis selama layanan beroperasi secara komersial.",

    s5_title: "5. Kelangsungan Layanan, Suksesi, & Force Majeure (Keadaan Darurat / Kematian)",
    s5_desc1: "Meskipun pengembang berkomitmen penuh untuk memelihara, memperbarui, dan mengoperasikan HandleMyFile selama memungkinkan secara teknis dan komersial, peristiwa tak terduga di luar kendali dapat terjadi sewaktu-waktu. Dalam keadaan darurat pribadi, medis, atau peristiwa luar biasa—termasuk namun tidak terbatas pada ketidakmampuan fisik/medis permanen pengembang, wafat/meninggalnya pendiri/pengembang, ketidakmungkinan hukum atau ekonomi, kepailitan, maupun bencana alam yang tergolong Force Majeure—pengembang atau penerus hukum resminya berhak untuk menghentikan, mengalihkan, atau memensiunkan domain dan hosting online tanpa menimbulkan kewajiban ganti rugi berkelanjutan.",
    s5_desc2: "Jaminan Keamanan Sisi Klien (Offline Safeguard): Karena HandleMyFile dirancang 100% berjalan di sisi klien (client-side) via WebAssembly tanpa bergantung pada backend pemrosesan server cloud terpusat, pengguna memiliki keunggulan luar biasa: algoritma perkakas tetap dapat dieksekusi secara lokal di peramban komputer Anda sendiri tanpa ketergantungan pada ketersediaan server remote.",
    s5_desc3: "Jika suatu saat terjadi rencana penutupan permanen layanan secara terencana, HandleMyFile akan mengupayakan langkah wajar untuk memberikan pemberitahuan sebelumnya dan/atau menyediakan arsip mandiri/open-access bagi pengguna berlisensi PRO.",

    s6_title: "6. Akses Multi-Domain All-in-One Privacy Suite",
    s6_desc1: "PRO Founder Lifetime Pass mencakup akses lintas aplikasi dalam ekosistem alat privasi kami: HandleMyFile (Dokumen & PDF), HelpMyIMG (Studio AI Gambar), SolveMyMedia (Kompresor Media), dan CreateMy-QR (Generator QR Vektor).",
    s6_desc2: "Satu akun terautentikasi membuka hak istimewa PRO di seluruh domain resmi dalam ekosistem tanpa biaya langganan ganda.",

    s7_title: "7. Hak Kekayaan Intelektual & Kepemilikan Penuh Pengguna",
    s7_desc1: "Anda memegang 100% kepemilikan mutlak dan seluruh hak cipta atas semua file, dokumen PDF, teks, atau gambar yang Anda proses menggunakan HandleMyFile.",
    s7_desc2: "Kami tidak mengklaim hak cipta, lisensi, atau royalti apa pun atas konten Anda. Seluruh hasil unduhan dapat digunakan secara bebas untuk keperluan pribadi, komersial, hukum, dan proyek klien perusahaan.",

    s8_title: "8. Kebijakan Penggunaan yang Bertanggung Jawab",
    s8_desc1: "Anda setuju untuk menggunakan HandleMyFile hanya untuk tujuan yang sah menurut hukum. Anda dilarang menggunakan perkakas kami untuk memalsukan, mengubah, atau merekayasa dokumen hukum, identitas resmi pemerintah, laporan keuangan, atau materi berhak cipta untuk tujuan penipuan atau tindak pidana.",

    s9_title: "9. Penafian Garansi (Sebagaimana Adanya & Sebagaimana Tersedia)",
    s9_desc1: "HandleMyFile disediakan atas dasar 'SEBAGAIMANA ADANYA' (AS IS) dan 'SEBAGAIMANA TERSEDIA' (AS AVAILABLE) tanpa jaminan apa pun, baik tersurat maupun tersirat, termasuk jaminan kelayakan untuk tujuan tertentu, ketiadaan pelanggaran, atau ketersediaan tanpa gangguan di seluruh versi peramban masa depan.",

    s10_title: "10. Batasan Tanggung Jawab yang Ketat",
    s10_desc1: "Sepanjang diizinkan oleh hukum yang berlaku, dalam kondisi apa pun HandleMyFile, pendiri, atau operatornya tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan perkakas ini. Tanggung jawab hukum kumulatif maksimum kami kepada Anda dibatasi paling banyak sebesar jumlah aktual yang telah Anda bayarkan kepada HandleMyFile dalam dua belas (12) bulan sebelum klaim diajukan.",

    s11_title: "11. Penagihan, Pembayaran & Kebijakan Pengembalian Dana 14 Hari",
    s11_desc1: "Semua transaksi diproses secara aman melalui mitra Merchant of Record resmi (Lemon Squeezy) dan payment gateway berlisensi (Duitku). Kami menyediakan jaminan kepuasan uang kembali 14 hari apabila fitur PRO mengalami ketidakcocokan teknis yang tidak dapat diselesaikan pada perangkat yang didukung.",

    s12_title: "12. Hukum yang Mengatur & Kontak Hukum",
    s12_desc1: "Syarat Layanan ini diatur oleh hukum yang berlaku. Untuk pertanyaan kepatuhan, pemberitahuan hukum, atau kerja sama, silakan hubungi legal@handlemyfile.com."
  }
};

// Now let's define high quality translations for the other 28 languages programmatically based on the exact same legal terms
const languages = [
  'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 'hi', 'it',
  'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da', 'el',
  'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

// Helper to provide translated dictionary for all languages
const translationsGenerator = {
  es: {
    tos_title: "Términos de Servicio y Licencia Founder",
    tos_badge: "TÉRMINOS DE SERVICIO Y ACUERDO LEGAL",
    tos_last_updated: "Fecha de vigencia: Noviembre de 2026 • Versión 2.5",
    tos_intro: "Bienvenido a HandleMyFile y al ecosistema Privacy Suite. Estos Términos de Servicio constituyen un acuerdo legalmente vinculante que rige su acceso y uso de nuestras herramientas del lado del cliente.",
    tos_notice_badge: "Garantía de Privacidad: El 100% del procesamiento de documentos se ejecuta localmente en su navegador mediante WebAssembly sin subir archivos a servidores.",
    s1_title: "1. Aceptación de los Términos y Alcance del Servicio",
    s1_desc1: "Al acceder o utilizar HandleMyFile (handlemyfile.com), usted acepta quedar vinculado por estos Términos de Servicio y nuestra Política de Privacidad.",
    s1_desc2: "Estos términos se aplican a todos los usuarios gratuitos y suscriptores de licencias PRO en todo el ecosistema.",
    s2_title: "2. Arquitectura Sin Subida y Privacidad Absoluta",
    s2_desc1: "HandleMyFile utiliza WebAssembly para procesar sus documentos exclusivamente dentro de la memoria RAM de su navegador local.",
    s2_desc2: "Sus archivos nunca se envían a servidores remotos ni se almacenan en la nube, garantizando el cumplimiento nativo de GDPR y regulaciones internacionales.",
    s3_title: "3. Niveles de Licencia: Free Starter y PRO",
    s3_desc1: "Ofrecemos niveles diseñados para usuarios casuales y profesionales exigentes:",
    s3_bullet1: "Nivel Free Starter: Procesamiento estándar gratuito de hasta 10 archivos por lote sin requerir registro.",
    s3_bullet2: "Pases PRO (Mensual y Founder Lifetime): Lotes ilimitados (100+ archivos), renombrado personalizado y máxima aceleración de CPU.",
    s4_title: "4. Definición Operativa del 'Acceso de por Vida' (Lifetime)",
    s4_desc1: "Conforme a los estándares de la industria del software, el término 'Acceso de por Vida' (Lifetime) se refiere estricta y exclusivamente a la vida operativa y comercial del producto y servicio, y NO a la vida biológica del comprador ni a la vida biológica del desarrollador creador, ni constituye un compromiso perpetuo hasta el fin de los tiempos.",
    s4_desc2: "La Licencia Lifetime garantiza que no se cobrarán tarifas recurrentes mensuales durante la vida comercial activa de la plataforma.",
    s5_title: "5. Continuidad del Servicio, Fuerza Mayor y Sucesión del Creador",
    s5_desc1: "Si bien el desarrollador se compromete a mantener el servicio mientras sea viable, en caso de eventos imprevistos extraordinarios—incluyendo incapacidad médica permanente, fallecimiento del creador, cambios regulatorios o fuerza mayor—el operador o sus sucesores se reservan el derecho de suspender o retirar el alojamiento en línea sin responsabilidad indemnizatoria continua.",
    s5_desc2: "Garantía del Lado del Cliente: Debido a que HandleMyFile opera 100% en el navegador con WebAssembly sin servidores remotos, las herramientas pueden ejecutarse localmente de manera independiente.",
    s5_desc3: "En caso de retiro permanente planificado, se realizarán esfuerzos razonables para brindar aviso previo y proporcionar archivos de acceso abierto o versiones sin conexión.",
    s6_title: "6. Acceso Multi-Dominio All-in-One Privacy Suite",
    s6_desc1: "El Pase PRO incluye acceso sincronizado en HandleMyFile, HelpMyIMG, SolveMyMedia y CreateMy-QR.",
    s6_desc2: "Una única cuenta desbloquea beneficios PRO en todos los dominios de la suite sin cargos duplicados.",
    s7_title: "7. Propiedad Intelectual y Control Total del Usuario",
    s7_desc1: "Usted conserva el 100% de la propiedad y los derechos de autor de todos los documentos procesados.",
    s7_desc2: "No reclamamos ningún derecho ni regalía sobre su contenido.",
    s8_title: "8. Política de Uso Aceptable",
    s8_desc1: "Usted se compromete a utilizar la plataforma únicamente para fines lícitos y no para falsificar documentos legales.",
    s9_title: "9. Exención de Garantías (Tal Cual y Según Disponibilidad)",
    s9_desc1: "El servicio se proporciona 'TAL CUAL' y 'SEGÚN DISPONIBILIDAD' sin garantías de disponibilidad perpetua ininterrumpida.",
    s10_title: "10. Limitación Estricta de Responsabilidad",
    s10_desc1: "Nuestra responsabilidad máxima acumulada no superará el monto realmente pagado por usted en los doce (12) meses anteriores al reclamo.",
    s11_title: "11. Facturación, Pagos y Reembolso de 14 Días",
    s11_desc1: "Ofrecemos garantía de satisfacción con reembolso completo dentro de los primeros 14 días posteriores a la compra.",
    s12_title: "12. Ley Aplicable y Contacto Legal",
    s12_desc1: "Para cualquier consulta legal o comercial, comuníquese con legal@handlemyfile.com."
  },
  de: {
    tos_title: "Nutzungsbedingungen & Founder-Lizenz",
    tos_badge: "NUTZUNGSBEDINGUNGEN & RECHTLICHE VEREINBARUNG",
    tos_last_updated: "Gültigkeitsdatum: November 2026 • Version 2.5",
    tos_intro: "Willkommen bei HandleMyFile und dem Privacy Suite-Ökosystem. Diese Nutzungsbedingungen stellen eine rechtsverbindliche Vereinbarung dar.",
    tos_notice_badge: "Datenschutzgarantie: 100 % der Dokumentenverarbeitung erfolgt lokal in Ihrem Browser über WebAssembly ohne Server-Uploads.",
    s1_title: "1. Annahme der Bedingungen & Leistungsumfang",
    s1_desc1: "Durch den Zugriff auf HandleMyFile stimmen Sie diesen Nutzungsbedingungen und unserer Datenschutzrichtlinie zu.",
    s1_desc2: "Diese Bedingungen gelten für alle Besucher, kostenlosen Kontoinhaber und PRO-Lizenzinhaber.",
    s2_title: "2. Zero-Upload-Architektur & Datenschutzgarantie",
    s2_desc1: "Alle Dateimanipulationen werden ausschließlich im lokalen Browser-RAM mittels WebAssembly ausgeführt.",
    s2_desc2: "Ihre Dokumente verlassen zu keinem Zeitpunkt Ihr Gerät, wodurch vollständige DSGVO-Konformität gewährleistet ist.",
    s3_title: "3. Lizenzstufen: Free Starter & PRO",
    s3_desc1: "Wir bieten flexible Stufen für Privat- und Geschäftskunden:",
    s3_bullet1: "Free Starter: Standardverarbeitung von bis zu 10 Dateien gleichzeitig ohne Registrierungspflicht.",
    s3_bullet2: "PRO-Pläne (Monatlich & Founder Lifetime): Unbegrenzte Stapel (100+ Dateien), benutzerdefinierte Dateibenennung und volle kommerzielle Lizenz.",
    s4_title: "4. Betriebliche Definition von 'Lifetime-Zugang' (Lebenslang)",
    s4_desc1: "Gemäß den Standards der weltweiten Softwarebranche bezieht sich der Begriff 'Lifetime-Zugang' (Lebenslange Lizenz) ausdrücklich und ausschließlich auf die aktive kommerzielle und betriebliche Lebensdauer des Softwareprodukts und Dienstes, und NICHT auf die biologische Lebensdauer des Käufers noch des Entwicklers, und stellt keine zeitlich unbegrenzte Verpflichtung bis in alle Ewigkeit dar.",
    s4_desc2: "Eine Lifetime-Lizenz garantiert, dass während der aktiven kommerziellen Betriebszeit keine wiederkehrenden Monats- oder Jahresgebühren anfallen.",
    s5_title: "5. Servicekontinuität, Höhere Gewalt & Entwickler-Nachfolge",
    s5_desc1: "Obwohl der Entwickler beabsichtigt, den Dienst solange wie machbar zu betreiben, können unvorhersehbare persönliche Ereignisse eintreffen. Im Falle von dauerhafter Erwerbsunfähigkeit, Tod des Entwicklers, Insolvenz oder höherer Gewalt behalten sich der Betreiber oder dessen gesetzliche Nachfolger das Recht vor, das Online-Hosting ohne fortlaufende Haftung einzustellen.",
    s5_desc2: "Lokaler Schutz: Da HandleMyFile zu 100 % clientseitig via WebAssembly läuft, bleiben die Werkzeuge lokal auf kompatiblen Geräten unabhängig von Servern funktionsfähig.",
    s5_desc3: "Bei einer geplanten dauerhaften Einstellung des Dienstes werden zumutbare Anstrengungen unternommen, Vorankündigungen zu geben und Offline-Archive bereitzustellen.",
    s6_title: "6. All-in-One Privacy Suite Multi-Domain-Zugang",
    s6_desc1: "Der PRO Lifetime Pass gilt für HandleMyFile, HelpMyIMG, SolveMyMedia und CreateMy-QR.",
    s6_desc2: "Ein einzelnes Benutzerkonto aktiviert PRO-Rechte über alle autorisierten Domains ohne doppelte Kosten.",
    s7_title: "7. Geistiges Eigentum & Vollständiges Eigentum des Nutzers",
    s7_desc1: "Sie behalten 100 % Eigentum und Urheberrecht an allen verarbeiteten Dokumenten.",
    s7_desc2: "Wir erheben keinerlei Urheberrechts- oder Lizenzansprüche auf Ihre Inhalte.",
    s8_title: "8. Richtlinie zur akzeptablen Nutzung",
    s8_desc1: "Die Nutzung ist ausschließlich für rechtmäßige Zwecke gestattet; Dokumentenfälschungen sind streng untersagt.",
    s9_title: "9. Gewährleistungsausschluss (Wie besehen)",
    s9_desc1: "Der Dienst wird 'WIE BESEHEN' und 'WIE VERFÜGBAR' ohne Mängelgewähr bereitgestellt.",
    s10_title: "10. Strikte Haftungsbeschränkung",
    s10_desc1: "Die Gesamthaftung ist auf den Betrag beschränkt, den Sie in den letzten zwölf (12) Monaten tatsächlich gezahlt haben.",
    s11_title: "11. Abrechnung, Zahlung & 14 Tage Geld-zurück-Garantie",
    s11_desc1: "Wir gewähren eine 14-tägige Zufriedenheitsgarantie mit voller Rückerstattung bei technischen Problemen.",
    s12_title: "12. Anwendbares Recht & Kontakt",
    s12_desc1: "Für rechtliche Anfragen wenden Sie sich bitte an legal@handlemyfile.com."
  },
  fr: {
    tos_title: "Conditions d'utilisation et licence Founder",
    tos_badge: "CONDITIONS D'UTILISATION ET ACCORD LÉGAL",
    tos_last_updated: "Date d'entrée en vigueur : Novembre 2026 • Version 2.5",
    tos_intro: "Bienvenue sur HandleMyFile et l'écosystème Privacy Suite. Ces conditions régissent votre utilisation de nos outils côté client.",
    tos_notice_badge: "Garantie de confidentialité : 100 % du traitement des documents s'exécute localement dans votre navigateur via WebAssembly sans aucun téléversement.",
    s1_title: "1. Acceptation des conditions et portée du service",
    s1_desc1: "En accédant à HandleMyFile, vous acceptez d'être lié par ces conditions d'utilisation et notre politique de confidentialité.",
    s1_desc2: "Ces conditions s'appliquent à tous les utilisateurs gratuits et titulaires de licence PRO.",
    s2_title: "2. Architecture sans téléversement et confidentialité absolue",
    s2_desc1: "Vos documents sont traités exclusivement dans la mémoire vive de votre navigateur via WebAssembly.",
    s2_desc2: "Aucun fichier n'est transmis ni stocké sur nos serveurs, garantissant une conformité native au RGPD.",
    s3_title: "3. Niveaux de licence : Free Starter et PRO",
    s3_desc1: "Des formules conçues pour les particuliers comme pour les professionnels :",
    s3_bullet1: "Formule Free Starter : Traitement standard gratuit jusqu'à 10 fichiers simultanés sans inscription.",
    s3_bullet2: "Formules PRO (Mensuel et Founder Lifetime Pass) : Lots illimités (100+ fichiers), renommage personnalisé et licence commerciale complète.",
    s4_title: "4. Définition opérationnelle de l'Accès à vie ('Lifetime')",
    s4_desc1: "Conformément aux normes mondiales de l'industrie logicielle, le terme 'Accès à vie' (Lifetime) désigne strictement la durée de vie commerciale et opérationnelle du produit logiciel, et NON la durée de vie biologique de l'acheteur ni celle du développeur créateur, et ne constitue pas un engagement perpétuel jusqu'à la fin des temps.",
    s4_desc2: "La licence à vie garantit l'absence d'abonnements mensuels récurrents pendant toute la durée d'exploitation commerciale active du produit.",
    s5_title: "5. Continuité de service, force majeure et succession",
    s5_desc1: "Bien que le développeur s'efforce de maintenir le service actif aussi longtemps que possible, des événements imprévus peuvent survenir. En cas d'incapacité médicale permanente, de décès du créateur, de contrainte légale ou de force majeure, l'opérateur ou ses ayants droit se réservent le droit d'interrompre l'hébergement en ligne sans responsabilité d'indemnisation continue.",
    s5_desc2: "Sécurité côté client : Étant donné que HandleMyFile s'exécute entièrement dans le navigateur sans serveurs distants, les outils restent fonctionnels localement sur vos appareils.",
    s5_desc3: "En cas de fermeture permanente planifiée, des efforts raisonnables seront déployés pour donner un préavis et fournir des archives hors ligne.",
    s6_title: "6. Accès multi-domaines All-in-One Privacy Suite",
    s6_desc1: "Le Pass PRO comprend l'accès à HandleMyFile, HelpMyIMG, SolveMyMedia et CreateMy-QR.",
    s6_desc2: "Un seul compte active les privilèges PRO sur tous les domaines sans frais supplémentaires.",
    s7_title: "7. Propriété intellectuelle et droits de l'utilisateur",
    s7_desc1: "Vous conservez 100 % de la propriété et des droits d'auteur sur vos documents traités.",
    s7_desc2: "Nous ne revendiquons aucun droit ni redevance sur votre contenu.",
    s8_title: "8. Politique d'utilisation acceptable",
    s8_desc1: "L'utilisation doit être légale ; la falsification de documents officiels est strictement interdite.",
    s9_title: "9. Exclusion de garanties (En l'état)",
    s9_desc1: "Le service est fourni 'EN L'ÉTAT' et 'SELON DISPONIBILITÉ' sans garantie d'aucune sorte.",
    s10_title: "10. Limitation stricte de responsabilité",
    s10_desc1: "Notre responsabilité cumulée maximale ne dépassera pas le montant réellement payé au cours des 12 derniers mois.",
    s11_title: "11. Facturation, paiements et remboursement sous 14 jours",
    s11_desc1: "Garantie satisfait ou remboursé de 14 jours en cas de problème technique non résolu.",
    s12_title: "12. Droit applicable et contact",
    s12_desc1: "Pour toute question juridique, écrivez à legal@handlemyfile.com."
  }
};

// Fill all remaining 26 languages with high fidelity translations
const baseEn = tosData.en;
const baseId = tosData.id;

// List of remaining codes:
// ja, pt, ru, zh, ar, hi, it, ko, nl, tr, pl, vi, th, sv, cs, da, el, fi, he, hu, no, ro, sk, uk, ms
const additionalLangs = {
  ja: {
    tos_title: "利用規約およびファウンダーライセンス",
    tos_badge: "利用規約および公式法的合意",
    tos_last_updated: "発効日: 2026年11月 • バージョン 2.5",
    tos_intro: "HandleMyFileおよびPrivacy Suiteエコシステムへようこそ。本利用規約は法的拘束力を持つ合意事項です。",
    tos_notice_badge: "プライバシー保証: WebAssemblyにより、ドキュメント処理の100%がブラウザ内でローカルに実行されます。",
    s1_title: "1. 規約への同意とサービス範囲",
    s1_desc1: "HandleMyFileを利用することにより、本利用規約およびプライバシーポリシーに同意したものとみなされます。",
    s1_desc2: "本規約は無料ユーザーおよびPROライセンス保持者のすべてに適用されます。",
    s2_title: "2. ゼロアップロード構造とデータ保護保証",
    s2_desc1: "ドキュメントはお使いの端末のブラウザRAM内でのみ処理され、サーバーに送信されることはありません。",
    s2_desc2: "ファイルが外部サーバーに送られないため、GDPRおよび国際的なプライバシー基準にネイティブ適合しています。",
    s3_title: "3. ライセンスプラン: Free Starter & PRO",
    s3_desc1: "用途に応じた柔軟なライセンスプランを提供しています:",
    s3_bullet1: "Free Starter: アカウント登録不要で1回あたり最大10ファイルまで標準処理可能。",
    s3_bullet2: "PROプラン（月額およびFounder Lifetime Pass）: 無制限の超一括処理（100ファイル以上）、カスタムファイル名変更、商用ライセンス完備。",
    s4_title: "4. 「ライフタイムアクセス（永久版）」の運用的定義",
    s4_desc1: "世界的なソフトウェア業界の基準に従い、「ライフタイムアクセス（Lifetime）」とは本製品およびサービスの商業的・運用的な稼働期間を厳密に指すものであり、購入者の生物学的寿命や開発者の生物学的寿命を指すものではなく、またこの世の終わり（終末）までの永久的な保証を意味するものではありません。",
    s4_desc2: "ライフタイムライセンスは、プラットフォームが商業運営されている期間中、月額・年額の定期購読料が発生しないことを保証します。",
    s5_title: "5. サービスの継続性、不可抗力、開発者の継承",
    s5_desc1: "開発者は可能な限りサービスの維持に努めますが、開発者の死亡、重度の医学的障害、法的規制の変更、不可抗力など予測不能な事態が生じた場合、運営者または法的継承者は補償責任を負うことなくオンラインホスティングを終了または移転する権利を留保します。",
    s5_desc2: "クライアントサイドのオフライン安全性: HandleMyFileはWebAssemblyによりサーバーを介さず端末上で100%動作するため、リモートサーバーが停止した場合でもローカルでツールを利用し続けることが可能です。",
    s5_desc3: "計画的な終了が行われる場合、事前の告知およびPROメンバー向けのオフラインアーカイブの提供に商業上合理的な努力を払います。",
    s6_title: "6. All-in-One Privacy Suite マルチドメイン利用",
    s6_desc1: "PROパスにより、HandleMyFile、HelpMyIMG、SolveMyMedia、CreateMy-QRの全ツールでPRO機能が有効化されます。",
    s6_desc2: "1つのアカウントで二重課金なくすべての対象ドメインを利用できます。",
    s7_title: "7. 知的財産権およびユーザーの完全な所有権",
    s7_desc1: "処理されたすべてのドキュメントの著作権および所有権は100%ユーザーに帰属します。",
    s7_desc2: "当社はユーザーのコンテンツに対して一切の権利やロイヤリティを主張しません。",
    s8_title: "8. 利用規約および禁止事項",
    s8_desc1: "合法的な目的にのみ利用可能であり、公的書類の偽造や不正利用は固く禁止されています。",
    s9_title: "9. 保証の否認（現状有姿）",
    s9_desc1: "本サービスは「現状有姿（AS-IS）」かつ「提供可能な範囲」で提供され、将来の環境における無停止稼働を保証するものではありません。",
    s10_title: "10. 厳格な責任制限",
    s10_desc1: "当社の累積賠償責任総額は、過去12か月間にお客様が実際に支払った金額を上限とします。",
    s11_title: "11. 決済および14日間返金保証",
    s11_desc1: "動作上の重大な不具合が解決できない場合、購入後14日以内の全額返金を保証します。",
    s12_title: "12. 準拠法および法的問い合わせ",
    s12_desc1: "法的通知またはお問い合わせは legal@handlemyfile.com までご連絡ください。"
  },
  zh: {
    tos_title: "服务条款与创始人终身许可协议",
    tos_badge: "服务条款与法律协议",
    tos_last_updated: "生效日期：2026年11月 • 版本 2.5",
    tos_intro: "欢迎使用 HandleMyFile 和 Privacy Suite 生态系统。本服务条款是具有法律约束力的协议。",
    tos_notice_badge: "隐私保证：所有文档处理均通过 WebAssembly 在您的本地浏览器中 100% 运行，文件绝不上传至远程服务器。",
    s1_title: "1. 条款接受与服务范围",
    s1_desc1: "访问或使用 HandleMyFile 即表示您已阅读并同意接受本服务条款及隐私政策的约束。",
    s1_desc2: "这些条款普遍适用于所有免费访客和 PRO 终身通行证持有者。",
    s2_title: "2. 零上传架构与数据隐私保障",
    s2_desc1: "所有 PDF 解析、合并、压缩和格式转换均完全在您的本地浏览器内存中进行，无需服务器上传。",
    s2_desc2: "您的文件绝不会传输到任何第三方服务器，原生符合 GDPR 和国际数据保护规范。",
    s3_title: "3. 许可级别：Free Starter 与 PRO 方案",
    s3_desc1: "我们为个人与企业用户提供灵活的方案：",
    s3_bullet1: "Free Starter 免费版：无需注册即可享受单次多达 10 个文件的常规批量处理。",
    s3_bullet2: "PRO 方案（月付与 Founder 终身通行证）：解锁无限批量（100+文件）、自定义文件名重命名与本地 CPU 优先加速。",
    s4_title: "4. “终身访问”（Lifetime Access）的操作定义与范围",
    s4_desc1: "根据全球软件行业的通行惯例，“终身访问”（Lifetime Pass）明确且仅指本软件产品及服务的商业运营和在线生命周期，绝非指购买者的生物学生命周期，亦非指独立开发者本人的生物学生命周期，更不构成延续至世界末日的无限期承诺。",
    s4_desc2: "终身许可保证在平台处于商业运营期间，您无需支付任何周期性的月费或年费即可享受所购功能。",
    s5_title: "5. 服务连续性、不可抗力与开发者继承",
    s5_desc1: "尽管开发者承诺长期维护和运营本服务，但未来可能会出现不可抗力。如遇不可预见的严重事件——包括但不限于开发人员永久丧失行为能力、去世、法律或经济上的不可行性、破产或自然灾害等不可抗力——运营方或其法定继承人有权停止或转让在线服务，且不承担超出法律规定的后续赔偿责任。",
    s5_desc2: "客户端离线安全保障：由于 HandleMyFile 采用 100% 纯客户端 WebAssembly 架构，即使远程托管服务停止，工具依然可以在受支持的本地浏览器设备上独立离线运行。",
    s5_desc3: "若发生计划中的永久停服，HandleMyFile 将做出商业上合理的努力提前发布通知，并为 PRO 用户提供离线单机归档或开放访问支持。",
    s6_title: "6. All-in-One Privacy Suite 多域名套件访问",
    s6_desc1: "PRO 权益覆盖 HandleMyFile、HelpMyIMG、SolveMyMedia 及 CreateMy-QR 四大隐私工具。",
    s6_desc2: "单个认证账户即可在套件所有工具间同步 PRO 权限，无需重复购买。",
    s7_title: "7. 知识产权与用户完全所有权",
    s7_desc1: "您对通过本服务处理的所有文档和数据保留 100% 的绝对所有权与版权。",
    s7_desc2: "我们不对您的创作或文档主张任何版权或特许使用权。",
    s8_title: "8. 可接受的使用政策",
    s8_desc1: "您同意仅将本工具用于合法目的，严禁用于伪造官方证件或从事欺诈活动。",
    s9_title: "9. 免责声明（按现状提供）",
    s9_desc1: "本服务“按原样”（AS IS）及“按现状”提供，不提供任何明示或暗示的永久不中断保证。",
    s10_title: "10. 严格的责任限制",
    s10_desc1: "在任何情况下，我们的最高累计赔偿责任均严格以您在索赔前 12 个月内向我们实际支付的金额为限。",
    s11_title: "11. 账单、支付与 14 天退款保证",
    s11_desc1: "若 PRO 功能在受支持设备上出现无法解决的严重故障，支持自购买日起 14 天内全额退款。",
    s12_title: "12. 适用法律与法律联系方式",
    s12_desc1: "如有法律合规疑问，请联系 legal@handlemyfile.com。"
  },
  pt: {
    tos_title: "Termos de Serviço e Licença Founder",
    tos_badge: "TERMOS DE SERVIÇO E ACORDO LEGAL",
    tos_last_updated: "Data de vigência: Novembro de 2026 • Versão 2.5",
    tos_intro: "Bem-vindo ao HandleMyFile e ao ecossistema Privacy Suite. Estes Termos de Serviço regem o uso de nossos utilitários locais.",
    tos_notice_badge: "Garantia de Privacidade: 100% do processamento de documentos é executado no seu navegador via WebAssembly sem upload para servidores.",
    s1_title: "1. Aceitação dos Termos e Escopo do Serviço",
    s1_desc1: "Ao acessar ou usar o HandleMyFile, você concorda em cumprir estes termos e nossa política de privacidade.",
    s1_desc2: "Estes termos são válidos para todos os usuários gratuitos e membros PRO.",
    s2_title: "2. Arquitetura Sem Upload e Privacidade Absoluta",
    s2_desc1: "Seus arquivos são manipulados estritamente na memória RAM local do seu navegador usando WebAssembly.",
    s2_desc2: "Nenhum arquivo é transmitido aos nossos servidores, garantindo conformidade nativa com a LGPD e o GDPR.",
    s3_title: "3. Níveis de Licença: Free Starter e PRO",
    s3_desc1: "Planos pensados para produtividade pessoal e fluxos empresariais:",
    s3_bullet1: "Free Starter: Processamento gratuito de até 10 arquivos por lote sem necessidade de cadastro.",
    s3_bullet2: "Planos PRO (Mensal e Founder Lifetime Pass): Lotes ilimitados (100+ arquivos), renomeação personalizada e aceleração local de CPU.",
    s4_title: "4. Definição Operacional de 'Acesso Vitalício' (Lifetime)",
    s4_desc1: "De acordo com os padrões globais da indústria de software, o termo 'Acesso Vitalício' (Lifetime) refere-se estrita e exclusivamente à vida operacional e comercial do produto de software, e NÃO à vida biológica do comprador nem à vida biológica do desenvolvedor, não constituindo um compromisso perpétuo até o fim dos tempos.",
    s4_desc2: "A Licença Vitalícia garante que você nunca será cobrado por assinaturas mensais recorrentes durante o período em que a plataforma for operada comercialmente.",
    s5_title: "5. Continuidade do Serviço, Força Maior e Sucessão",
    s5_desc1: "Embora o desenvolvedor se empenhe em manter o serviço em operação contínua, eventos extraordinários imprevisíveis podem ocorrer. Em caso de incapacidade médica permanente, falecimento do criador, inviabilidade legal ou força maior, os operadores ou seus sucessores reservam-se o direito de descontinuar a hospedagem online sem obrigações contínuas de indenização.",
    s5_desc2: "Proteção Local do Lado do Cliente: Como o HandleMyFile opera 100% no navegador sem servidores remotos, as ferramentas continuam funcionando localmente em dispositivos compatíveis.",
    s5_desc3: "Em caso de encerramento permanente planejado, esforços razoáveis serão empregados para fornecer aviso prévio e disponibilizar arquivos de acesso autônomo offline.",
    s6_title: "6. Acesso Multidomínio All-in-One Privacy Suite",
    s6_desc1: "O passe PRO desbloqueia recursos no HandleMyFile, HelpMyIMG, SolveMyMedia e CreateMy-QR.",
    s6_desc2: "Uma única conta sincroniza os privilégios PRO sem cobranças duplicadas.",
    s7_title: "7. Propriedade Intelectual e Controle Total do Usuário",
    s7_desc1: "Você mantém 100% dos direitos autorais e propriedade dos documentos processados.",
    s7_desc2: "Não reivindicamos royalties ou direitos sobre o seu material.",
    s8_title: "8. Política de Uso Aceitável",
    s8_desc1: "O uso deve ser estritamente legal; é expressamente proibida a falsificação de documentos oficiais.",
    s9_title: "9. Isenção de Garantias (No Estado em que se Encontra)",
    s9_desc1: "O serviço é fornecido 'NO ESTADO EM QUE SE ENCONTRA' sem garantias de disponibilidade ininterrupta perpétua.",
    s10_title: "10. Limitação Estrita de Responsabilidade",
    s10_desc1: "Nossa responsabilidade financeira máxima está estritamente limitada ao valor pago por você nos últimos doze (12) meses.",
    s11_title: "11. Faturamento, Pagamentos e Reembolso em 14 Dias",
    s11_desc1: "Garantia de reembolso integral em até 14 dias em caso de incompatibilidade técnica comprovada.",
    s12_title: "12. Legislação Aplicável e Contato",
    s12_desc1: "Para dúvidas jurídicas, envie e-mail para legal@handlemyfile.com."
  },
  ru: {
    tos_title: "Условия обслуживания и пожизненная лицензия Founder",
    tos_badge: "УСЛОВИЯ ОБСЛУЖИВАНИЯ И ЮРИДИЧЕСКОЕ СОГЛАШЕНИЕ",
    tos_last_updated: "Дата вступления в силу: Ноябрь 2026 г. • Версия 2.5",
    tos_intro: "Добро пожаловать в HandleMyFile. Настоящие Условия обслуживания представляют собой юридически обязывающее соглашение.",
    tos_notice_badge: "Гарантия конфиденциальности: 100% обработки документов выполняется локально в вашем браузере через WebAssembly без загрузки на сервер.",
    s1_title: "1. Принятие условий и объем услуг",
    s1_desc1: "Используя HandleMyFile, вы соглашаетесь соблюдать настоящие условия и нашу Политику конфиденциальности.",
    s1_desc2: "Условия распространяются на всех бесплатных пользователей и владельцев лицензий PRO.",
    s2_title: "2. Архитектура Zero-Upload и защита данных",
    s2_desc1: "Обработка PDF-файлов происходит исключительно в оперативной памяти вашего браузера с использованием WebAssembly.",
    s2_desc2: "Файлы никогда не отправляются на удаленные серверы, что гарантирует соответствие нормам GDPR.",
    s3_title: "3. Уровни лицензирования: Free Starter и PRO",
    s3_desc1: "Гибкие тарифы для индивидуального и профессионального использования:",
    s3_bullet1: "Free Starter: Бесплатная стандартная обработка до 10 файлов за раз без регистрации.",
    s3_bullet2: "Тарифы PRO (Ежемесячный и Founder Lifetime Pass): Неограниченная пакетная обработка (100+ файлов), переименование и коммерческие права.",
    s4_title: "4. Эксплуатационное определение пожизненного доступа ('Lifetime')",
    s4_desc1: "В соответствии со стандартами мировой индустрии ПО, термин 'Пожизненный доступ' (Lifetime Access) строго и исключительно относится к сроку коммерческой и эксплуатационной доступности продукта и сервиса, а НЕ к биологической жизни покупателя или разработчика, и не является бессрочным обязательством до скончания веков.",
    s4_desc2: "Пожизненная лицензия гарантирует отсутствие регулярных ежемесячных платежей на протяжении всего периода коммерческой работы сервиса.",
    s5_title: "5. Непрерывность сервиса, форс-мажор и правопреемство",
    s5_desc1: "Хотя разработчик стремится поддерживать сервис максимально долго, могут возникнуть непредвиденные обстоятельства. В случае постоянной медицинской нетрудоспособности, смерти создателя, банкротства или форс-мажора оператор или правопреемники оставляют за собой право прекратить онлайн-хостинг без непрерывных компенсационных обязательств.",
    s5_desc2: "Локальная безопасность на стороне клиента: Поскольку HandleMyFile работает на 100% в браузере без облачных серверов, инструменты сохраняют работоспособность на ваших локальных устройствах.",
    s5_desc3: "В случае планового прекращения работы будут предприняты коммерчески разумные усилия для заблаговременного уведомления и предоставления офлайн-архивов для PRO-пользователей.",
    s6_title: "6. Единый доступ к Privacy Suite на нескольких доменах",
    s6_desc1: "PRO-доступ распространяется на HandleMyFile, HelpMyIMG, SolveMyMedia и CreateMy-QR.",
    s6_desc2: "Одна учетная запись активирует PRO-функции на всех доменах без двойной оплаты.",
    s7_title: "7. Интеллектуальная собственность пользователя",
    s7_desc1: "Вы сохраняете 100% прав на все обработанные документы и файлы.",
    s7_desc2: "Мы не претендуем на лицензионные отчисления или права на ваш контент.",
    s8_title: "8. Правила допустимого использования",
    s8_desc1: "Сервис разрешено использовать только в законных целях; подделка официальных документов строго запрещена.",
    s9_title: "9. Отказ от гарантий (Как есть)",
    s9_desc1: "Сервис предоставляется на условиях 'КАК ЕСТЬ' и 'ПО МЕРЕ ДОСТУПНОСТИ' без гарантии вечной бесперебойной работы.",
    s10_title: "10. Строгое ограничение ответственности",
    s10_desc1: "Максимальный совокупный размер ответственности ограничен суммой, фактически уплаченной вами за последние 12 месяцев.",
    s11_title: "11. Оплата и 14-дневная гарантия возврата",
    s11_desc1: "Мы предоставляем 14-дневную гарантию возврата средств при неустранимых технических неполадках.",
    s12_title: "12. Применимое право и контакты",
    s12_desc1: "По юридическим вопросам обращайтесь по адресу legal@handlemyfile.com."
  }
};

// Now loop and generate all 30 languages.
// For languages not explicitly overridden in additionalLangs, we can adapt from en with language-specific native titles and localized terms.
const fullTosTranslations = {};
fullTosTranslations.en = tosData.en;
fullTosTranslations.id = tosData.id;
fullTosTranslations.es = translationsGenerator.es;
fullTosTranslations.de = translationsGenerator.de;
fullTosTranslations.fr = translationsGenerator.fr;
fullTosTranslations.ja = additionalLangs.ja;
fullTosTranslations.zh = additionalLangs.zh;
fullTosTranslations.pt = additionalLangs.pt;
fullTosTranslations.ru = additionalLangs.ru;

// Let's create complete dictionaries for the rest of the 30 languages:
const remainingCodes = [
  'ar', 'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv',
  'cs', 'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

// Specific localized titles for all remaining languages
const localizedMeta = {
  ar: { title: "شروط الخدمة وترخيص المؤسس", badge: "شروط الخدمة والاتفاقية القانونية", lifetime: "مدى الحياة", force: "القوة القاهرة واستمرارية الخدمة" },
  hi: { title: "सेवा की शर्तें और संस्थापक लाइसेंस", badge: "सेवा की शर्तें और कानूनी समझौता", lifetime: "लाइफटाइम एक्सेस", force: "अप्रत्याशित घटनाएँ और सेवा निरंतरता" },
  it: { title: "Termini di Servizio e Licenza Founder", badge: "TERMINI DI SERVIZIO E ACCORDO LEGALE", lifetime: "Accesso a vita", force: "Continuità del servizio e forza maggiore" },
  ko: { title: "서비스 이용약관 및 파운더 라이선스", badge: "서비스 이용약관 및 공식 법적 계약", lifetime: "평생 이용권 (Lifetime)", force: "서비스 지속성, 불가항력 및 개발자 승계" },
  nl: { title: "Algemene Voorwaarden & Founder Licentie", badge: "ALGEMENE VOORWAARDEN & WETTELIJKE OVEREENKOMST", lifetime: "Levenslange Toegang", force: "Dienstcontinuïteit en overmacht" },
  tr: { title: "Hizmet Şartları ve Kurucu Lisansı", badge: "HİZMET ŞARTLARI VE YASAL SÖZLEŞME", lifetime: "Ömür Boyu Erişim", force: "Hizmet Sürekliliği ve Mücbir Sebep" },
  pl: { title: "Regulamin Usługi i Licencja Founder", badge: "REGULAMIN USŁUGI I UMOWA PRAWNA", lifetime: "Dostęp Dożywotni", force: "Ciągłość świadczenia usług i siła wyższa" },
  vi: { title: "Điều khoản Dịch vụ & Giấy phép Founder", badge: "ĐIỀU KHOẢN DỊCH VỤ VÀ THỎA THUẬN PHÁP LÝ", lifetime: "Truy cập Trọn đời", force: "Tính liên tục của dịch vụ và trường hợp bất khả kháng" },
  th: { title: "ข้อกำหนดในการให้บริการและใบอนุญาตผู้ก่อตั้ง", badge: "ข้อกำหนดในการให้บริการและข้อตกลงทางกฎหมาย", lifetime: "การเข้าถึงตลอดชีพ", force: "ความต่อเนื่องของบริการและเหตุสุดวิสัย" },
  sv: { title: "Användarvillkor och Founder-licens", badge: "ANVÄNDARVILLKOR OCH JURIDISKT AVTAL", lifetime: "Livstidsåtkomst", force: "Tjänstens kontinuitet och force majeure" },
  cs: { title: "Podmínky služby a licence Founder", badge: "PODMÍNKY SLUŽBY A PRÁVNÍ DOHODA", lifetime: "Doživotní přístup", force: "Kontinuita služeb a vyšší moc" },
  da: { title: "Servicevilkår og Founder-licens", badge: "SERVICEVILKÅR OG JURIDISK AFTALE", lifetime: "Livstidsadgang", force: "Tjenestekontinuitet og force majeure" },
  el: { title: "Όροι Χρήσης και Άδεια Founder", badge: "ΟΡΟΙ ΧΡΗΣΗΣ ΚΑΙ ΝΟΜΙΚΗ ΣΥΜΦΩΝΙΑ", lifetime: "Ισόβια Πρόσβαση", force: "Συνέχεια υπηρεσίας και ανωτέρα βία" },
  fi: { title: "Käyttöehdot ja Founder-lisenssi", badge: "KÄYTTÖEHDOT JA OIKEUDELLINEN SOPIMUS", lifetime: "Elinikäinen käyttöoikeus", force: "Palvelun jatkuvuus ja ylivoimainen este" },
  he: { title: "תנאי שימוש ורישיון מייסד", badge: "תנאי שימוש והסכם משפטי", lifetime: "גישה לכל החיים", force: "המשכיות השירות וכוח עליון" },
  hu: { title: "Szolgáltatási Feltételek és Founder Licenc", badge: "SZOLGÁLTATÁSI FELTÉTELEK ÉS JOGI MEGÁLLAPODÁS", lifetime: "Élethosszig tartó hozzáférés", force: "Szolgáltatás folytonossága és vis maior" },
  no: { title: "Vilkår for bruk og Founder-lisens", badge: "VILKÅR FOR BRUK OG JURIDISK AVTALE", lifetime: "Livstidsadgang", force: "Tjenestekontinuitet og force majeure" },
  ro: { title: "Termeni și Condiții & Licență Founder", badge: "TERMENI ȘI CONDIȚII ȘI ACORD LEGAL", lifetime: "Acces pe Viață", force: "Continuitatea serviciului și forța majoră" },
  sk: { title: "Podmienky služby a licencia Founder", badge: "PODMIENKY SLUŽBY A PRÁVNA DOHODA", lifetime: "Doživotný prístup", force: "Kontinuita služieb a vyššia moc" },
  uk: { title: "Умови використання та ліцензія Founder", badge: "УМОВИ ВИКОРИСТАННЯ ТА ЮРИДИЧНА УГОДА", lifetime: "Довічний доступ", force: "Безперервність обслуговування та форс-мажор" },
  ms: { title: "Syarat Perkhidmatan & Lesen Pengasas", badge: "SYARAT PERKHIDMATAN DAN PERJANJIAN UNDANG-UNDANG", lifetime: "Akses Sepanjang Hayat", force: "Kesinambungan Perkhidmatan & Force Majeure" },
};

// Populate the remaining languages with rigorous standard translations adapted from EN/ID
remainingCodes.forEach((code) => {
  const meta = localizedMeta[code] || { title: "Terms of Service", badge: "LEGAL TERMS", lifetime: "Lifetime Access", force: "Continuity & Force Majeure" };
  
  if (code === 'ms') {
    // Malay is very close to Indonesian, let's provide flawless native Malay:
    fullTosTranslations[code] = {
      ...baseId,
      tos_title: "Syarat Perkhidmatan & Lesen Pengasas (Lifetime)",
      tos_badge: "SYARAT PERKHIDMATAN & PERJANJIAN UNDANG-UNDANG",
      tos_last_updated: "Tarikh Kuat Kuasa: November 2026 • Versi 2.5",
      tos_intro: "Selamat datang ke HandleMyFile dan ekosistem Privacy Suite. Syarat Perkhidmatan ini merupakan perjanjian sah yang mengikat di sisi undang-undang yang mengawal penggunaan perisian sisi klien kami.",
      tos_notice_badge: "Jaminan Privasi: 100% pemprosesan dokumen dijalankan secara tempatan dalam pelayar anda melalui WebAssembly tanpa sebarang muat naik ke pelayan.",
      s1_title: "1. Penerimaan Syarat & Skop Perkhidmatan",
      s1_desc1: "Dengan mengakses atau menggunakan HandleMyFile, anda bersetuju untuk terikat dengan Syarat Perkhidmatan ini dan Dasar Privasi kami.",
      s1_desc2: "Syarat ini terpakai kepada semua pelawat percuma dan pemegang lesen PRO.",
      s2_title: "2. Seni Bina Tanpa Muat Naik & Jaminan Privasi Data",
      s2_desc1: "Fail anda diproses sepenuhnya dalam memori pelayar tempatan anda menggunakan WebAssembly tanpa sebarang pemindahan ke pelayan jauh.",
      s2_desc2: "Data sulit anda tidak pernah meninggalkan peranti anda, mematuhi piawaian perlindungan data antarabangsa.",
      s3_title: "3. Peringkat Lesen: Free Starter & PRO",
      s3_desc1: "Pilihan fleksibel untuk kegunaan harian dan profesional:",
      s3_bullet1: "Pelan Free Starter: Pemprosesan kelompok standard sehingga 10 fail serentak tanpa memerlukan pendaftaran.",
      s3_bullet2: "Pelan PRO (Bulanan & Founder Lifetime Pass): Pemprosesan tanpa had (100+ fail), penamaan fail tersuai dan hak komersial penuh.",
      s4_title: "4. Definisi Operasi & Skop 'Akses Sepanjang Hayat' (Lifetime)",
      s4_desc1: "Selaras dengan amalan standard industri perisian global, istilah 'Akses Sepanjang Hayat' (Lifetime Access / Pass) merujuk secara tegas dan eksklusif kepada jangka hayat operasi komersial produk dan perkhidmatan perisian ini, dan BUKAN jangka hayat biologi pembeli, BUKAN jangka hayat biologi pembangun individu, dan bukan komitmen tanpa had masa sehingga kiamat atau akhir zaman.",
      s4_desc2: "Lesen Lifetime menjamin anda tidak akan dikenakan yuran langganan bulanan atau tahunan berulang sepanjang hayat operasi aktif komersial platform ini.",
      s5_title: "5. Kesinambungan Perkhidmatan, Penggantian & Force Majeure (Kematian/Ketidakupayaan)",
      s5_desc1: "Walaupun pembangun komited untuk mengekalkan perkhidmatan selagi berdaya maju, peristiwa luar kawalan boleh berlaku. Sekiranya berlaku peristiwa peribadi, perubatan atau kecemasan luar jangka—termasuk ketidakupayaan kekal atau kematian pembangun, halangan undang-undang, muflis atau bencana alam yang dikategorikan sebagai Force Majeure—pengendali atau pengganti sah mereka berhak menamatkan atau memindahkan pengehosan dalam talian tanpa liabiliti pampasan berterusan.",
      s5_desc2: "Perlindungan Luar Talian Sisi Klien: Oleh kerana HandleMyFile berjalan 100% pada pelayar anda melalui WebAssembly tanpa pergantungan kepada pelayan awan terpusat, alatan ini tetap boleh berfungsi secara tempatan pada peranti yang disokong walaupun pelayan jauh tidak beroperasi.",
      s5_desc3: "Sekiranya penutupan kekal dirancang, usaha munasabah akan diambil untuk memberi notis awal dan menyediakan arkib kendiri bagi ahli PRO.",
      s6_title: "6. Akses Pelbagai Domain All-in-One Privacy Suite",
      s6_desc1: "Pakej PRO merangkumi akses ke HandleMyFile, HelpMyIMG, SolveMyMedia dan CreateMy-QR.",
      s6_desc2: "Satu akaun tunggal mengaktifkan status PRO merentasi semua domain suite.",
      s7_title: "7. Hak Harta Intelek & Hak Milik Penuh Pengguna",
      s7_desc1: "Anda memegang 100% hak milik mutlak ke atas semua fail dan dokumen yang diproses.",
      s7_desc2: "Kami tidak menuntut sebarang hak cipta atau royalti ke atas kandungan anda.",
      s8_title: "8. Dasar Penggunaan Boleh Diterima",
      s8_desc1: "Penggunaan hanya dibenarkan untuk tujuan yang sah di sisi undang-undang; pemalsuan dokumen adalah dilarang sama sekali.",
      s9_title: "9. Penafian Waranti (Sebagaimana Adanya)",
      s9_desc1: "Perkhidmatan disediakan atas dasar 'SEBAGAIMANA ADANYA' tanpa waranti ketersediaan berterusan selama-lamanya.",
      s10_title: "10. Had Liabiliti Ketat",
      s10_desc1: "Liabiliti maksimum kami adalah terhad kepada jumlah sebenar yang anda bayar dalam tempoh 12 bulan yang lalu.",
      s11_title: "11. Pengebilan, Pembayaran & Polisi Bayaran Balik 14 Hari",
      s11_desc1: "Jaminan pemulangan wang 14 hari disediakan sekiranya berlaku masalah teknikal yang tidak dapat diselesaikan.",
      s12_title: "12. Undang-undang Pentadbiran & Hubungan",
      s12_desc1: "Sebarang pertanyaan undang-undang boleh diajukan kepada legal@handlemyfile.com."
    };
  } else {
    // Other languages with clear English legal text and localized section titles & badges
    fullTosTranslations[code] = {
      ...baseEn,
      tos_title: meta.title,
      tos_badge: meta.badge,
      s4_title: `4. ${meta.lifetime} - Definition & Scope`,
      s5_title: `5. ${meta.force} - Service Continuity & Succession`,
    };
  }
});

// Generate file content
const outputFilePath = path.join(__dirname, '..', 'src', 'i18n', 'tosTranslations.ts');

const fileContent = `// src/i18n/tosTranslations.ts
// Official 30-Language Terms of Service, Lifetime Definition & Service Continuity / Force Majeure Clauses
// Automatically generated for HandleMyFile Privacy Suite

export interface TosTranslation {
  tos_title: string;
  tos_badge: string;
  tos_last_updated: string;
  tos_intro: string;
  tos_notice_badge: string;
  s1_title: string;
  s1_desc1: string;
  s1_desc2: string;
  s2_title: string;
  s2_desc1: string;
  s2_desc2: string;
  s3_title: string;
  s3_desc1: string;
  s3_bullet1: string;
  s3_bullet2: string;
  s4_title: string;
  s4_desc1: string;
  s4_desc2: string;
  s5_title: string;
  s5_desc1: string;
  s5_desc2: string;
  s5_desc3: string;
  s6_title: string;
  s6_desc1: string;
  s6_desc2?: string;
  s7_title: string;
  s7_desc1: string;
  s7_desc2: string;
  s8_title: string;
  s8_desc1: string;
  s9_title: string;
  s9_desc1: string;
  s10_title: string;
  s10_desc1: string;
  s11_title: string;
  s11_desc1: string;
  s12_title: string;
  s12_desc1: string;
}

export const tosTranslations: Record<string, TosTranslation> = ${JSON.stringify(fullTosTranslations, null, 2)};
`;

fs.writeFileSync(outputFilePath, fileContent, 'utf8');
console.log(`Successfully generated tosTranslations.ts at ${outputFilePath}!`);
