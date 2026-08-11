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

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log('Pinging IndexNow API...');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`✅ Success! Pinged IndexNow API. Status: ${res.statusCode}`);
      console.log(`All ${urlList.length} URLs have been submitted for immediate indexing by Bing/Yandex.`);
    } else {
      console.error(`❌ Failed to ping IndexNow API. Status: ${res.statusCode}`);
      console.error(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error pinging IndexNow API: ${e.message}`);
});

req.write(payload);
req.end();
