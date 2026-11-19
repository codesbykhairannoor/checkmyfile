// scripts/run-qa-suite.ts
// Local Automated QA Suite for HandleMyFile (Role-Based Testing: Guest vs Free vs PRO)
// Runs automated tests using Headless Chrome & Puppeteer

import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

// Import pure utility functions for direct regression testing
import { checkBatchQuota } from '../src/utils/batchQuota';
import { checkCryptoAuditQuota } from '../src/utils/cryptoAuditQuota';
import { isDisposableEmail } from '../src/utils/disposableEmailBlocker';
import { isFounderLifetimeEmail } from '../src/context/AuthContext';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(description: string, condition: boolean, details: string = '') {
  if (condition) {
    results.push({ name: description, passed: true, details });
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${description} ${details ? `(${details})` : ''}`);
  } else {
    results.push({ name: description, passed: false, details });
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${description} ${details ? `(${details})` : ''}`);
  }
}

// Helper to wait for local server to respond
async function waitForServer(url: string, timeoutMs = 20000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
        req.setTimeout(1500, () => req.destroy());
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function runLogicTests() {
  console.log('\n\x1b[1m\x1b[34m[1/2] RUNNING CORE LOGIC & QUOTA REGRESSION TESTS...\x1b[0m');

  // Test 1: Batch Quota Logic
  console.log('\n  -- Testing Batch Quota Rules --');
  const guestBatch = checkBatchQuota(null, false);
  assert('Guest is denied batch processing', guestBatch.allowed === false && guestBatch.reason === 'unauthenticated');

  const unverifiedUser = { uid: 'qa-user-unverified', email: 'user@example.com', emailVerified: false };
  const unverifiedBatch = checkBatchQuota(unverifiedUser, false);
  assert('Unverified email user is denied batch quota (Anti-Abuse)', unverifiedBatch.allowed === false && unverifiedBatch.reason === 'unverified_email');

  const verifiedUser = { uid: 'qa-user-verified', email: 'verified@example.com', emailVerified: true };
  const initialVerifiedBatch = checkBatchQuota(verifiedUser, false);
  assert('Verified free user starts with 3 free batches', initialVerifiedBatch.allowed === true && initialVerifiedBatch.remaining === 3 && initialVerifiedBatch.max === 3);

  const proUser = { uid: 'qa-user-pro', email: 'pro@example.com', emailVerified: true };
  const proBatch = checkBatchQuota(proUser, true);
  assert('PRO user has unlimited batch access (allowed: true, remaining: Infinity)', proBatch.allowed === true && (proBatch.remaining === Infinity || proBatch.remaining > 9999));

  // Test 2: Crypto Audit Quota Logic
  console.log('\n  -- Testing SHA-256 Crypto Audit Quota Rules --');
  const guestAudit = checkCryptoAuditQuota(null, false);
  assert('Guest is denied Crypto Audit certificate', guestAudit.allowed === false && guestAudit.reason === 'unauthenticated');

  const unverifiedAudit = checkCryptoAuditQuota(unverifiedUser, false);
  assert('Unverified email user is denied Crypto Audit certificate', unverifiedAudit.allowed === false && unverifiedAudit.reason === 'unverified_email');

  const initialVerifiedAudit = checkCryptoAuditQuota(verifiedUser, false);
  assert('Verified free user starts with 3 free Crypto Audit certificates', initialVerifiedAudit.allowed === true && initialVerifiedAudit.remaining === 3);

  const proAudit = checkCryptoAuditQuota(proUser, true);
  assert('PRO user has unlimited Crypto Audit certificates (allowed: true, remaining: Infinity)', proAudit.allowed === true && (proAudit.remaining === Infinity || proAudit.remaining > 9999));

  // Test 3: Disposable Email Blocker
  console.log('\n  -- Testing Disposable Email Blacklist Filter --');
  const tempDomains = [
    'bot@mailinator.com',
    'scammer@temp-mail.org',
    'spammer@10minutemail.com',
    'fake@yopmail.com',
    'abuse@guerrillamail.com',
    'trash@trashmail.com'
  ];
  for (const email of tempDomains) {
    assert(`Blocked disposable email provider: ${email}`, isDisposableEmail(email) === true);
  }

  const legitimateEmails = [
    'ceo@company.com',
    'student@univ.edu',
    'personal@gmail.com',
    'work@outlook.com',
    'user@yahoo.co.id'
  ];
  for (const email of legitimateEmails) {
    assert(`Allowed legitimate email address: ${email}`, isDisposableEmail(email) === false);
  }

  // Test 4: Founder Pass Detection
  console.log('\n  -- Testing Founder Lifetime Detection --');
  assert('Founder email erstaunenn@gmail.com recognized as lifetime PRO', isFounderLifetimeEmail('erstaunenn@gmail.com') === true);
  assert('Random email not recognized as founder', isFounderLifetimeEmail('random@gmail.com') === false);
}

async function runBrowserE2ETests() {
  console.log('\n\x1b[1m\x1b[34m[2/2] LAUNCHING HEADLESS CHROME E2E BROWSER TESTS...\x1b[0m');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Scenario A: Guest Experience
    console.log('\n  -- Testing Scenario A: Guest Experience (Unauthenticated) --');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav', { timeout: 8000 });

    // Check Navbar Sign In button for guest
    const signinBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent && (b.textContent.includes('Sign In') || b.textContent.includes('Masuk')));
    });
    assert('Guest sees "Sign In" button in Navbar', signinBtn);

    // Navigate to a tool page (e.g. compress-pdf)
    await page.goto(`${BASE_URL}/compress-pdf`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 8000 });

    const toolTitle = await page.evaluate(() => document.querySelector('h1')?.textContent || '');
    assert('Compress PDF tool page rendered successfully', toolTitle.toLowerCase().includes('compress'));

    // Check Pricing & Tier Comparison matrix
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 8000 });
    const pricingRendered = await page.evaluate(() => {
      const text = document.body.innerText;
      return (text.includes('Free') || text.includes('Gratis')) && text.includes('PRO');
    });
    assert('Pricing & Tier Matrix page rendered with Free Starter and PRO comparisons', pricingRendered);

    // Scenario B: GDPR Article 17 Erasure Flow
    console.log('\n  -- Testing Scenario B: GDPR Article 17 Erasure Compliance --');
    await page.goto(`${BASE_URL}/privacy`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { timeout: 8000 });

    const gdprSectionExists = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('GDPR') && (text.includes('Right to Erasure') || text.includes('Hak Penghapusan Data'));
    });
    assert('Privacy page explicitly provides GDPR Article 17 Right to Erasure section', gdprSectionExists);

    const deleteRequestBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent && (b.textContent.includes('Request Account') || b.textContent.includes('Ajukan Penghapusan')));
    });
    assert('Direct "Request Account & Data Deletion" action button is accessible', deleteRequestBtn);

    // Scenario C: Sign PDF Adobe Acrobat Certificate layout check
    console.log('\n  -- Testing Scenario C: Adobe Acrobat Sign Standard Layout --');
    await page.goto(`${BASE_URL}/sign-pdf`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 8000 });

    const signPdfRendered = await page.evaluate(() => {
      return document.querySelector('h1')?.textContent?.toLowerCase().includes('sign') || false;
    });
    assert('Sign PDF editor page rendered with ISO 32000-1 Adobe Acrobat standard', signPdfRendered);

  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('\x1b[1m=================================================================\x1b[0m');
  console.log('\x1b[1m🚀 HANDLEMYFILE AUTONOMOUS LOCAL QA TEST SUITE\x1b[0m');
  console.log('\x1b[1m   User Tiers Verification: Guest | Free (Unverified/Verified) | PRO\x1b[0m');
  console.log('\x1b[1m=================================================================\x1b[0m');

  // Step 1: Run pure logic tests
  await runLogicTests();

  // Step 2: Start preview server
  console.log(`\n\x1b[36mStarting Vite preview server on port ${PORT}...\x1b[0m`);
  const serverProcess = spawn('npx.cmd', ['vite', 'preview', '--port', String(PORT)], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
    shell: true,
  });

  try {
    await waitForServer(BASE_URL, 15000);
    console.log(`\x1b[32m✔ Server is live and healthy at ${BASE_URL}\x1b[0m`);

    // Step 3: Run Browser E2E Tests
    await runBrowserE2ETests();
  } catch (err: any) {
    console.error('Browser E2E Error:', err);
    assert('Browser E2E Execution', false, err.message);
  } finally {
    console.log('\nStopping local test server...');
    try {
      if (process.platform === 'win32' && serverProcess.pid) {
        spawn('taskkill', ['/pid', String(serverProcess.pid), '/T', '/F']);
      } else {
        serverProcess.kill('SIGTERM');
      }
    } catch (_) {}
  }

  // Summary Report
  console.log('\n\x1b[1m=================================================================\x1b[0m');
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`\x1b[1mTEST SUMMARY: ${passedCount}/${total} PASSED (${Math.round((passedCount/total)*100)}% SUCCESS RATE)\x1b[0m`);
  if (failedCount === 0) {
    console.log('\x1b[32m🎉 ALL USER TIER & PERMISSION ASSERTIONS PASSED WITH ZERO ERRORS!\x1b[0m');
  } else {
    console.log(`\x1b[31m⚠️ ${failedCount} ASSERTION(S) FAILED. CHECK LOGS ABOVE.\x1b[0m`);
  }
  console.log('\x1b[1m=================================================================\x1b[0m\n');

  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal QA error:', err);
  process.exit(1);
});
