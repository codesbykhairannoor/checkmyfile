const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = 'handlemyfile.com';
const KEY = '26d2a045532940ecb861781068259022';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Read sitemap-all.xml or sitemap.xml to get all URLs
let sitemapPath = path.join(__dirname, '..', 'public', 'sitemap-all.xml');
if (!fs.existsSync(sitemapPath)) {
  sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
}

if (!fs.existsSync(sitemapPath)) {
  console.error('sitemap.xml not found! Run npm run build first.');
  process.exit(1);
}

console.log(`Reading sitemap from ${path.basename(sitemapPath)}...`);
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const urlRegex = /<loc>(.*?)<\/loc>/g;
const urlList = [];
let match;
while ((match = urlRegex.exec(sitemapContent)) !== null) {
  // Only include handlemyfile.com web pages, exclude sitemap files themselves
  if (!match[1].endsWith('.xml')) {
    urlList.push(match[1]);
  }
}

if (urlList.length === 0) {
  console.error('No valid URLs found in sitemap!');
  process.exit(1);
}

console.log(`Found ${urlList.length} unique URLs to ping across search engines.`);

const ENDPOINTS = [
  'api.indexnow.org',
  'www.bing.com',
  'yandex.com',
  'search.seznam.cz'
];

function pingIndexNow(hostname, batchUrls) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: batchUrls
    });

    const options = {
      hostname: hostname,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`  ✅ [${hostname}] Batch (${batchUrls.length} URLs) Accepted (Status: ${res.statusCode})`);
          resolve({ success: true, host: hostname, status: res.statusCode });
        } else {
          console.warn(`  ⚠️ [${hostname}] Responded with status ${res.statusCode}: ${data}`);
          resolve({ success: false, host: hostname, status: res.statusCode });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`  ⏱️ [${hostname}] Request timed out.`);
      resolve({ success: false, host: hostname, error: 'Timeout' });
    });

    req.on('error', (e) => {
      console.error(`  ❌ [${hostname}] Error: ${e.message}`);
      resolve({ success: false, host: hostname, error: e.message });
    });

    req.write(payload);
    req.end();
  });
}

function pingSitemapUrl(pingUrl) {
  return new Promise((resolve) => {
    https.get(pingUrl, { timeout: 8000 }, (res) => {
      console.log(`  🌐 Pinged: ${pingUrl} (Status: ${res.statusCode})`);
      resolve(true);
    }).on('error', (e) => {
      console.warn(`  ⚠️ Ping error: ${pingUrl} -> ${e.message}`);
      resolve(false);
    });
  });
}

async function run() {
  console.log(`\n📡 Submitting ${urlList.length} URLs via IndexNow Protocol...`);

  // Split into chunks of 500 URLs (IndexNow recommended max batch)
  const CHUNK_SIZE = 500;
  for (let i = 0; i < urlList.length; i += CHUNK_SIZE) {
    const chunk = urlList.slice(i, i + CHUNK_SIZE);
    console.log(`\n📦 Dispatching Batch ${Math.floor(i / CHUNK_SIZE) + 1} (${chunk.length} URLs)...`);

    for (const endpoint of ENDPOINTS) {
      await pingIndexNow(endpoint, chunk);
    }
  }

  // Ping Google & Bing sitemaps
  console.log(`\n🔔 Pinging search engine sitemap submission endpoints...`);
  await pingSitemapUrl(`https://www.google.com/ping?sitemap=https://${HOST}/sitemap-index.xml`);
  await pingSitemapUrl(`https://www.google.com/ping?sitemap=https://${HOST}/sitemap.xml`);
  await pingSitemapUrl(`https://www.bing.com/ping?sitemap=https://${HOST}/sitemap-index.xml`);

  console.log(`\n✨ All search engine discovery pings completed!`);
}

run();
