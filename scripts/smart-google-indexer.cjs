const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const path = require('path');

const KEY_FILE = path.join(__dirname, '..', 'handlemyfile-7fa1ac58810e.json');
const CACHE_FILE = path.join(__dirname, 'google-indexed-cache.json');

if (!fs.existsSync(KEY_FILE)) {
  console.error('❌ Service Account key not found:', KEY_FILE);
  process.exit(1);
}

const keyData = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));

// Generate Google OAuth2 JWT Bearer token
function getGoogleAccessToken() {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const claimSet = Buffer.from(JSON.stringify({
      iss: keyData.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    })).toString('base64url');

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(`${header}.${claimSet}`);
    const signature = sign.sign(keyData.private_key, 'base64url');
    const jwt = `${header}.${claimSet}.${signature}`;

    const postData = `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${encodeURIComponent(jwt)}`;

    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.access_token) resolve(json.access_token);
          else reject(new Error('Failed to get token: ' + body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function publishUrl(token, url, type = 'URL_UPDATED') {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ url, type });
    const req = https.request('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          success: res.statusCode === 200,
          status: res.statusCode || 0,
          body
        });
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, status: 0, body: err.message });
    });

    req.write(payload);
    req.end();
  });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 INITIALIZING SMART GOOGLE INDEXING ENGINE (ENTERPRISE SURGICAL ACCELERATOR)');
  console.log(`👤 Authenticating as: ${keyData.client_email}`);

  let token;
  try {
    token = await getGoogleAccessToken();
    console.log('✅ Google OAuth2 Token acquired successfully!\n');
  } catch (err) {
    console.error('❌ Authentication failed:', err.message);
    process.exit(1);
  }

  // Load existing cache
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    } catch (_) {
      cache = {};
    }
  }

  // 1. SURGICAL SEED PRIORITY LIST (URL_UPDATED)
  // Highest commercial intent & newly revamped tools
  const prioritySeedUrls = [
    'https://handlemyfile.com/',
    'https://handlemyfile.com/id',
    'https://handlemyfile.com/pdf-to-word',
    'https://handlemyfile.com/id/pdf-ke-word',
    'https://handlemyfile.com/pdf-to-word-without-losing-formatting',
    'https://handlemyfile.com/id/pdf-ke-word-tanpa-kehilangan-format',
    'https://handlemyfile.com/merge-pdf',
    'https://handlemyfile.com/id/gabungkan-pdf',
    'https://handlemyfile.com/compress-pdf',
    'https://handlemyfile.com/id/kompres-pdf',
    'https://handlemyfile.com/split-pdf',
    'https://handlemyfile.com/id/pisahkan-pdf',
    'https://handlemyfile.com/edit-pdf',
    'https://handlemyfile.com/id/edit-pdf',
    'https://handlemyfile.com/sign-pdf',
    'https://handlemyfile.com/id/tanda-tangani-pdf',
    'https://handlemyfile.com/ocr-pdf',
    'https://handlemyfile.com/id/ocr-pdf',
    'https://handlemyfile.com/excel-to-pdf',
    'https://handlemyfile.com/image-to-pdf'
  ];

  console.log(`📡 [PHASE 1] Pushing ${prioritySeedUrls.length} Cornerstone URLs via URL_UPDATED...`);

  let updatedSuccess = 0;
  let updatedFailed = 0;

  for (let i = 0; i < prioritySeedUrls.length; i++) {
    const url = prioritySeedUrls[i];
    process.stdout.write(`  [${i + 1}/${prioritySeedUrls.length}] Publishing: ${url.replace('https://handlemyfile.com', '')}... `);

    const res = await publishUrl(token, url, 'URL_UPDATED');
    if (res.success) {
      updatedSuccess++;
      cache[url] = {
        last_notified_at: new Date().toISOString(),
        notification_type: 'URL_UPDATED',
        http_status: 200
      };
      console.log('✅ OK (HTTP 200)');
    } else {
      updatedFailed++;
      console.log(`⚠️ FAILED (${res.status}): ${res.body}`);
    }

    await sleep(150); // safe pacing
  }

  // 2. 404 PURGE MECHANICS (URL_DELETED)
  // Historical dead/broken URLs reported in GSC to clear the crawl queue
  const deadUrlsToPurge = [
    'https://handlemyfile.com/ja/pdf-',
    'https://handlemyfile.com/ar/-csv',
    'https://handlemyfile.com/th/pdf-to-image',
    'https://handlemyfile.com/ru/remove-pdf',
    'https://handlemyfile.com/it/pdf-to-image',
    'https://handlemyfile.com/th/protect-pdf',
    'https://handlemyfile.com/it/edit-pdf',
    'https://handlemyfile.com/tr/sayfa-numaralar',
    'https://handlemyfile.com/tr/pptden-pdfye',
    'https://handlemyfile.com/vi/pdf-to-word',
    'https://handlemyfile.com/el/prostasia-pdf',
    'https://handlemyfile.com/fi/txt-pdf',
    'https://handlemyfile.com/he/pdf-ppt',
    'https://handlemyfile.com/uk/stisnuti-pdf',
    'https://handlemyfile.com/ru/pdf-v-word',
    'https://handlemyfile.com/sk/zmeni-vekos-pdf',
    'https://handlemyfile.com/ja/-pdf',
    'https://handlemyfile.com/vi/pdf-thang-xm',
    'https://handlemyfile.com/ro/pdf-n-tonuri-de-gri',
    'https://handlemyfile.com/th/pdf-'
  ];

  console.log(`\n🧹 [PHASE 2] Purging ${deadUrlsToPurge.length} Dead/404 URLs via URL_DELETED...`);

  let deletedSuccess = 0;
  let deletedFailed = 0;

  for (let i = 0; i < deadUrlsToPurge.length; i++) {
    const url = deadUrlsToPurge[i];
    process.stdout.write(`  [${i + 1}/${deadUrlsToPurge.length}] Purging: ${url.replace('https://handlemyfile.com', '')}... `);

    const res = await publishUrl(token, url, 'URL_DELETED');
    if (res.success) {
      deletedSuccess++;
      cache[url] = {
        last_notified_at: new Date().toISOString(),
        notification_type: 'URL_DELETED',
        http_status: 200
      };
      console.log('✅ PURGED (HTTP 200)');
    } else {
      deletedFailed++;
      console.log(`⚠️ FAILED (${res.status}): ${res.body}`);
    }

    await sleep(150); // safe pacing
  }

  // Save updated state cache
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('🎉 GOOGLE INDEXING API SURGICAL RUN SUMMARY:');
  console.log(`  • URL_UPDATED Priority Injections : ${updatedSuccess} Successful (${updatedFailed} failed)`);
  console.log(`  • URL_DELETED Queue Purges        : ${deletedSuccess} Successful (${deletedFailed} failed)`);
  console.log(`  • Total Active Cached Records     : ${Object.keys(cache).length}`);
  console.log('  • Next Step: Googlebot will inspect updated seeds within hours!');
  console.log('════════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
