const puppeteer = require('puppeteer');

(async () => {
  console.log('🤖 Menjalankan Simulasi Googlebot (Tanpa JavaScript)...');
  
  // 1. Launch browser
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 2. Set User-Agent sebagai Googlebot agar simulasi lebih akurat
  await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');

  // 3. MATIKAN JAVASCRIPT (Ini poin krusial untuk ngetes SSG SEO)
  // Kalau HTML-nya kosong (SPA biasa), maka bot cuma dapet <div id="root"></div>
  // Kalau SSG kita berhasil, bot bakal dapet full artikel H1 dan Meta Tags.
  await page.setJavaScriptEnabled(false);

  // 4. Kunjungi halaman lokal yang baru di-build (atau live)
  // Kita coba ke URL bahasa Spanyol (Comprimir PDF)
  const path = require('path');
  const filePath = path.join(__dirname, '..', 'dist', 'es', 'comprimir-pdf', 'index.html');
  const url = 'file://' + filePath.replace(/\\/g, '/');
  console.log(`📡 Crawling URL: ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // 5. Ambil data spesifik dari HTML
    const title = await page.title();
    const metaDesc = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'TIDAK DITEMUKAN');
    const h1 = await page.$eval('h1', el => el.innerText).catch(() => 'TIDAK DITEMUKAN');
    const rootContentLength = await page.$eval('#root', el => el.innerHTML.length).catch(() => 0);
    const faqCount = await page.$$eval('h3[itemprop="name"]', els => els.length);

    console.log('\n=======================================');
    console.log('✅ HASIL CRAWLING BOT (JS DISABLED)');
    console.log('=======================================');
    console.log(`📌 Title Tab : ${title}`);
    console.log(`📌 Meta Desc : ${metaDesc}`);
    console.log(`📌 H1 Header : ${h1}`);
    console.log(`📌 Jumlah FAQ: ${faqCount} Pertanyaan Ditemukan`);
    console.log(`📌 Ukuran DOM: ${rootContentLength} karakter di dalam <div id="root">`);
    
    if (rootContentLength > 100) {
      console.log('\n🔥 KESIMPULAN: BOT NERIMA HTML FULL! (Bukan JS Kosong)');
      console.log('Googlebot bisa ngebaca seluruh artikel bahasa Spanyol lo dengan sempurna.');
    } else {
      console.log('\n❌ KESIMPULAN: GAGAL. Bot cuma dapet HTML Kosong.');
    }
    
  } catch (err) {
    console.error('\n❌ Error: Pastikan lo udah jalanin "npm run preview" di terminal lain ya buat ngetes lokal!', err.message);
  } finally {
    await browser.close();
  }
})();
