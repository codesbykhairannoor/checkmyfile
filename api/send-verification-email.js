// api/send-verification-email.js
// Serverless Custom Branded Email Verification Endpoint for HandleMyFile
// Generates oobCode via Google Identity Toolkit REST API and sends a direct branded email via Resend (0% HelpMyIMG traces)

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function base64url(obj) {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT env:', e);
    }
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      project_id: process.env.FIREBASE_PROJECT_ID || 'thismyown',
    };
  }

  // Local file search in root directory for local dev
  try {
    const rootDir = process.cwd();
    const files = fs.readdirSync(rootDir);
    const candidate = files.find(
      (f) =>
        (f.includes('thismyown') || f.includes('firebase-adminsdk')) &&
        f.endsWith('.json')
    );
    if (candidate) {
      return JSON.parse(fs.readFileSync(path.join(rootDir, candidate), 'utf8'));
    }
  } catch (err) {
    // Silent in production
  }

  return null;
}

async function getGoogleAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/firebase',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const signInput = `${base64url(header)}.${base64url(claim)}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signInput);
  const signature = signer
    .sign(serviceAccount.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signInput}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Failed to obtain Google access token');
  }

  return tokenData.access_token;
}

async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on?.('data', (chunk) => {
      data += chunk;
    });
    req.on?.('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
    if (!req.on) {
      resolve({});
    }
  });
}

function sendJson(res, statusCode, payload) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  return res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      res.setHeader?.('Access-Control-Allow-Origin', '*');
      res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await parseRequestBody(req);
    const email = body.email;
    const origin = body.origin;
    const lang = body.lang || 'en';

    if (!email || typeof email !== 'string') {
      return sendJson(res, 400, { error: 'Valid email is required' });
    }

    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
      console.error('Service account not found');
      return sendJson(res, 500, { error: 'Firebase Admin credentials not found' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      return sendJson(res, 500, { error: 'Email service is not configured' });
    }

    // 1. Get Google OAuth access token
    const accessToken = await getGoogleAccessToken(serviceAccount);

    // 2. Request email verification code from Firebase Identity Toolkit API
    const projectId = serviceAccount.project_id || 'thismyown';
    const oobRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:sendOobCode`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          requestType: 'VERIFY_EMAIL',
          email: email.trim(),
          returnOobLink: true,
        }),
      }
    );

    const oobData = await oobRes.json();
    if (!oobRes.ok || !oobData.oobCode) {
      console.error('Failed to generate verification code:', oobData);
      return sendJson(res, oobRes.status || 400, {
        error: oobData.error?.message || 'Failed to generate verification link',
      });
    }

    const targetOrigin = origin ? origin.replace(/\/+$/, '') : 'https://handlemyfile.com';
    const apiKey =
      (oobData.oobLink && new URL(oobData.oobLink).searchParams.get('apiKey')) ||
      process.env.VITE_FIREBASE_API_KEY ||
      '';

    // Direct in-app link to HandleMyFile with verification params (NEVER firebaseapp domain)
    const directHandleMyFileLink = `${targetOrigin}/?mode=verifyEmail&oobCode=${oobData.oobCode}&apiKey=${apiKey}`;

    const isId = lang === 'id';
    const subject = isId
      ? 'Verifikasi Alamat Email Anda - HandleMyFile'
      : 'Verify your email address - HandleMyFile';

    const emailHtml = `
<!DOCTYPE html>
<html lang="${isId ? 'id' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 48px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); text-align: left;">
          
          <!-- Logo & Brand Header -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <img src="https://handlemyfile.com/favicon.png" alt="HandleMyFile" width="36" height="36" style="display: block; width: 36px; height: 36px; border-radius: 8px; object-fit: contain;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 19px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">HandleMy<span style="color: #e11d48;">File</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom: 12px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.2px;">
                ${isId ? 'Verifikasi Alamat Email Anda' : 'Verify your email address'}
              </h1>
            </td>
          </tr>

          <!-- Body Copy -->
          <tr>
            <td style="padding-bottom: 28px; font-size: 14px; line-height: 1.6; color: #475569;">
              ${isId
                ? 'Terima kasih telah mendaftar di <strong>HandleMyFile</strong>. Klik tombol di bawah ini untuk memverifikasi alamat email Anda dan mengaktifkan kuota 3x gratis bulanan Anda.'
                : 'Thank you for registering on <strong>HandleMyFile</strong>. Click the button below to verify your email address and activate your 3x monthly free quotas.'}
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: #e11d48;">
                    <a href="${directHandleMyFileLink}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px; background-color: #e11d48; letter-spacing: -0.1px;">
                      ${isId ? 'Verifikasi Email Sekarang' : 'Verify Email Address'}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback Link -->
          <tr>
            <td style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; line-height: 1.6; color: #64748b;">
              ${isId ? 'Jika tombol tidak berfungsi, salin dan tempel tautan ini ke browser Anda:' : "If the button doesn't work, copy and paste this link into your browser:"}
              <br>
              <a href="${directHandleMyFileLink}" style="color: #e11d48; word-break: break-all; text-decoration: underline;">
                ${directHandleMyFileLink}
              </a>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding-top: 16px; font-size: 12px; line-height: 1.5; color: #94a3b8;">
              ${isId
                ? 'Jika Anda tidak membuat akun di HandleMyFile, Anda dapat mengabaikan email ini dengan aman.'
                : "If you did not create an account on HandleMyFile, you can safely ignore this email."}
            </td>
          </tr>
        </table>

        <!-- Subtle Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; margin-top: 24px; text-align: center;">
          <tr>
            <td style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
              HandleMyFile — 100% Private, Client-Side Document Tools
              <br>
              <a href="https://handlemyfile.com" style="color: #64748b; text-decoration: none;">handlemyfile.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'HandleMyFile <onboarding@resend.dev>',
        to: [email.trim()],
        subject: subject,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();
    if (!resendResponse.ok) {
      console.error('Resend error:', resendData);
      return sendJson(res, resendResponse.status, {
        error: resendData.message || 'Failed to send email via Resend',
      });
    }

    return sendJson(res, 200, { success: true, id: resendData.id });
  } catch (error) {
    console.error('Error generating verification link:', error);
    return sendJson(res, 500, { error: error.message || 'Internal server error' });
  }
}
