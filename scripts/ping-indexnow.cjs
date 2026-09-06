const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = 'handlemyfile.com';
const KEY = '26d2a045532940ecb861781068259022';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Read sitemap.xml to get all URLs
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('sitemap.xml not found! Run npm run build first.');
  process.exit(1);
}

console.log('Reading sitemap.xml...');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Extract URLs using a simple regex
const urlRegex = /<loc>(.*?)<\/loc>/g;
const urlList = [];
let match;
while ((match = urlRegex.exec(sitemapContent)) !== null) {
  urlList.push(match[1]);
}

if (urlList.length === 0) {
  console.error('No URLs found in sitemap.xml!');
  process.exit(1);
}

console.log(`Found ${urlList.length} URLs in sitemap.xml.`);

// Prepare IndexNow payload
const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
});

// Helper to ping an IndexNow endpoint
function pingEndpoint(hostname) {
  return new Promise((resolve) => {
    const options = {
      hostname: hostname,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    console.log(`Pinging ${hostname}...`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ [${hostname}] Success! Status: ${res.statusCode}`);
          resolve({ success: true, host: hostname, status: res.statusCode });
        } else {
          console.warn(`⚠️ [${hostname}] Responded with status ${res.statusCode}: ${data}`);
          resolve({ success: false, host: hostname, status: res.statusCode });
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ [${hostname}] Error: ${e.message}`);
      resolve({ success: false, host: hostname, error: e.message });
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log(`Submitting ${urlList.length} URLs to Bing & IndexNow engines...`);
  await pingEndpoint('www.bing.com');
  await pingEndpoint('api.indexnow.org');
}

run();
