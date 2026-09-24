import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';

const KEY_FILE_PATH = path.join(process.cwd(), 'handlemyfile-7fa1ac58810e.json');
const CACHE_FILE_PATH = path.join(process.cwd(), 'scripts', 'google-indexed-cache.json');
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap-all.xml');

// Max URLs per daily run (Google Indexing API default quota is 200 per day)
const DAILY_LIMIT = 180;

let keyFile: any = null;
if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  try {
    keyFile = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } catch (e) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY env var:', e);
  }
} else if (fs.existsSync(KEY_FILE_PATH)) {
  keyFile = JSON.parse(fs.readFileSync(KEY_FILE_PATH, 'utf8'));
} else {
  const match = fs.readdirSync(process.cwd()).find(f => f.startsWith('handlemyfile-') && f.endsWith('.json'));
  if (match) {
    keyFile = JSON.parse(fs.readFileSync(path.join(process.cwd(), match), 'utf8'));
  }
}

if (!keyFile) {
  console.log('ℹ️ No Google Service Account key found (skipping Google Indexing API).');
  process.exit(0);
}

// Generate Google OAuth2 JWT Bearer token
function getGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const claimSet = Buffer.from(JSON.stringify({
      iss: keyFile.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    })).toString('base64url');

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(`${header}.${claimSet}`);
    const signature = sign.sign(keyFile.private_key, 'base64url');
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
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            reject(new Error(`Failed to obtain Google token: ${body}`));
          }
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

// Publish single URL to Google Indexing API
function publishUrl(token: string, url: string): Promise<{ success: boolean; status: number; body?: string }> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      url: url,
      type: 'URL_UPDATED'
    });

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
        if (res.statusCode === 200) {
          resolve({ success: true, status: res.statusCode });
        } else {
          resolve({ success: false, status: res.statusCode || 0, body });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, status: 0, body: err.message });
    });

    req.write(payload);
    req.end();
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runGoogleIndexing() {
  console.log('🔍 Initializing Google Indexing API submission...');

  // 1. Authenticate
  let token: string;
  try {
    token = await getGoogleAccessToken();
    console.log(`🔑 Authenticated as: ${keyFile.client_email}`);
  } catch (err: any) {
    console.error('❌ Failed to authenticate with Google API:', err.message);
    return;
  }

  // 2. Read sitemap-all.xml for URLs
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`❌ Sitemap file not found at: ${SITEMAP_PATH}`);
    return;
  }

  const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const locRegex = /<loc>(.*?)<\/loc>/g;
  const allUrls: string[] = [];
  let match;
  while ((match = locRegex.exec(sitemapXml)) !== null) {
    allUrls.push(match[1]);
  }

  console.log(`📋 Total URLs available in sitemap: ${allUrls.length}`);

  // 3. Load cache
  let cache: Record<string, { submittedAt: string; status: number }> = {};
  if (fs.existsSync(CACHE_FILE_PATH)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, 'utf8'));
    } catch (_) {
      cache = {};
    }
  }

  // 4. Sort URLs by priority:
  // - Root homepage and language homepages FIRST
  // - Major languages (en, id, es, fr, de, ja, pt, ru, zh, ar, hi) tools NEXT
  // - Other languages NEXT
  const priorityLangs = ['en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 'hi'];

  const unindexedUrls = allUrls.filter(u => {
    if (!cache[u]) return true;
    // Refresh URLs older than 21 days
    const daysOld = (Date.now() - new Date(cache[u].submittedAt).getTime()) / (1000 * 3600 * 24);
    return daysOld > 21;
  });

  unindexedUrls.sort((a, b) => {
    const isAHome = a === 'https://handlemyfile.com/' || /https:\/\/handlemyfile\.com\/[a-z]{2}$/.test(a);
    const isBHome = b === 'https://handlemyfile.com/' || /https:\/\/handlemyfile\.com\/[a-z]{2}$/.test(b);
    if (isAHome && !isBHome) return -1;
    if (!isAHome && isBHome) return 1;

    const aHasPriorityLang = priorityLangs.some(l => a.includes(`/${l}/`) || a.endsWith(`/${l}`));
    const bHasPriorityLang = priorityLangs.some(l => b.includes(`/${l}/`) || b.endsWith(`/${l}`));
    if (aHasPriorityLang && !bHasPriorityLang) return -1;
    if (!aHasPriorityLang && bHasPriorityLang) return 1;

    return 0;
  });

  const batch = unindexedUrls.slice(0, DAILY_LIMIT);
  console.log(`🎯 Submitting batch of ${batch.length} URLs (daily limit: ${DAILY_LIMIT})...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < batch.length; i++) {
    const url = batch[i];
    const res = await publishUrl(token, url);

    if (res.success) {
      successCount++;
      cache[url] = { submittedAt: new Date().toISOString(), status: 200 };
      process.stdout.write(`\r  [${i + 1}/${batch.length}] ✅ Indexed: ${url.replace('https://handlemyfile.com', '')}`);
    } else {
      failCount++;
      console.warn(`\n  [${i + 1}/${batch.length}] ⚠️ Failed (${res.status}): ${url} -> ${res.body}`);
      if (res.status === 429) {
        console.warn('  ⚠️ Hit daily quota limit (HTTP 429). Halting submission.');
        break;
      }
    }

    // Rate-limit safe delay (120ms between requests)
    await sleep(120);
  }

  // Save updated cache
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf8');

  console.log(`\n\n🎉 Google Indexing API Completed!`);
  console.log(`  - Successfully submitted: ${successCount}`);
  console.log(`  - Failed / Skipped: ${failCount}`);
  console.log(`  - Total URLs in cache: ${Object.keys(cache).length}/${allUrls.length}`);
}

runGoogleIndexing();
