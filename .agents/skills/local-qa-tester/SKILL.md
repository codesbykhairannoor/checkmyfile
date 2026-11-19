---
name: local-qa-tester
description: >-
  Autonomous local QA testing standard for HandleMyFile inspired by Playwright (microsoft/playwright),
  Cypress (cypress-io/cypress), and Midscene AI (web-infra-dev/midscene). Executes automated headless
  Chrome browser and pure logic test suites to rigorously verify Guest, Free Starter, and PRO tier access controls,
  anti-abuse filters, GDPR deletion, and all PDF tools with zero external CI/CD dependencies.
---

# Local QA Testing Standard (Playwright & Midscene Architecture)

Autonomous QA testing harness designed to run 100% locally on Windows using Google Chrome in headless mode (`C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`) and Node.js/tsx.

Inspired by industry-leading open-source testing architectures:
1. **Playwright** (`microsoft/playwright`) — Multi-role browser contexts (Guest, Unverified Free, Verified Free, PRO) with isolated storage states.
2. **Midscene AI** (`web-infra-dev/midscene`) — Multimodal semantic UI assertions without brittle CSS selectors.
3. **Cypress Role-Based Testing** (`cypress-io/cypress`) — Session management and permission boundary gating.

---

## 1. Test Execution Commands

To execute the autonomous QA suite locally without remote GitHub Actions:

```bash
# Run complete QA suite (Core Logic + Headless Chrome E2E)
npm run test:qa

# Or run directly via tsx
npx tsx scripts/run-qa-suite.ts
```

---

## 2. Tested Feature Matrix & User Roles

| Feature / Permission | Guest (Unauthenticated) | Free Starter (Unverified) | Free Starter (Verified) | PRO Lifetime / Monthly |
| :--- | :---: | :---: | :---: | :---: |
| **Single Document Tools** (30+ PDF tools) | Free Unlimited | Free Unlimited | Free Unlimited | Free Unlimited |
| **Batch Processing** (>1 file) | ❌ Denied (Auth Gate) | ❌ Denied (Verify Gate) | ✅ 3 Batches / month | ✅ Unlimited ($\infty$) |
| **SHA-256 Crypto Audit Trail** | ❌ Denied (Auth Gate) | ❌ Denied (Verify Gate) | ✅ 3 Audits / month | ✅ Unlimited ($\infty$) |
| **Custom File Naming** | 🔒 Locked | 🔒 Locked | 🔒 Locked | ✅ Unlocked |
| **Disposable Email Filter** | N/A | ❌ Auto-blocked | N/A | N/A |
| **Founder Pass** (`erstaunenn@gmail.com`) | N/A | N/A | N/A | 👑 Automatic Lifetime PRO |
| **GDPR Right to Erasure** | N/A | ✅ Accessible | ✅ Accessible | ✅ Accessible (4 Apps) |

---

## 3. Core Test Scenarios

### Scenario 1: Quota Engine Regression
- Validates `checkBatchQuota()` and `checkCryptoAuditQuota()` against state changes.
- Ensures month key resets (`YYYY-MM`) compute deterministically.
- Verifies anti-abuse rules block zero-verification accounts from exhausting free serverless resources.

### Scenario 2: Anti-Abuse Disposable Email Blacklist
- Tests blacklist matching against known ephemeral inbox services (`mailinator.com`, `temp-mail.org`, `10minutemail.com`, `guerrillamail.com`, `yopmail.com`, `trashmail.com`).
- Validates white-listing of legitimate corporate, educational, and consumer providers (`company.com`, `univ.edu`, `gmail.com`, `outlook.com`, `yahoo.co.id`).

### Scenario 3: Headless Chrome E2E Suite
- Spawns local preview server on `http://localhost:4173`.
- Drives real Chrome engine (`headless: true`) through DOM navigation.
- Tests navigation to critical tools:
  - `/compress-pdf`
  - `/merge-pdf`
  - `/sign-pdf` (ISO 32000-1 Adobe Acrobat compliant canvas)
  - `/privacy` (GDPR Article 17 Erasure compliance)
  - `/pricing` (Tier Matrix verification)
- Enforces zero regression across desktop and mobile layouts.
