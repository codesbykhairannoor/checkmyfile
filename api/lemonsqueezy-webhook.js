// api/lemonsqueezy-webhook.js
// Serverless Webhook Endpoint for Lemon Squeezy -> Firestore PRO Sync
// Updates users/{userId} in Firestore with plan: 'pro', subscriptionStatus: 'active', suiteAccess: 'all_access'

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
    // Ignore in production
  }

  return null;
}

async function getGoogleAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase',
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

async function getRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return JSON.stringify(req.body);
  }
  return new Promise((resolve) => {
    let data = '';
    req.on?.('data', (chunk) => {
      data += chunk;
    });
    req.on?.('end', () => {
      resolve(data);
    });
    if (!req.on) {
      resolve('');
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
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers?.['x-signature'] || '';
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    // Verify signature if secret is configured
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signatureBuffer = Buffer.from(signature, 'utf8');

      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        return sendJson(res, 401, { error: 'Invalid webhook signature' });
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || {};
    const attributes = payload.data?.attributes || {};
    const userId = customData.user_id;
    const customerEmail = attributes.user_email || attributes.customer_email;
    const orderStatus = attributes.status;

    console.log(`[LemonSqueezy Webhook] Event: ${eventName}, User: ${userId || customerEmail}, Status: ${orderStatus}`);

    // Check if event signifies a successful payment or subscription activation
    const isSuccess =
      eventName === 'order_created' ||
      eventName === 'subscription_created' ||
      eventName === 'subscription_payment_success';

    if (isSuccess && (orderStatus === 'paid' || orderStatus === 'active' || !orderStatus)) {
      const serviceAccount = getServiceAccount();

      if (serviceAccount && userId) {
        const accessToken = await getGoogleAccessToken(serviceAccount);
        const projectId = serviceAccount.project_id || 'thismyown';

        // Update Firestore users/{userId} document
        const updateUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}?updateMask.fieldPaths=plan&updateMask.fieldPaths=subscriptionStatus&updateMask.fieldPaths=suiteAccess`;

        await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            fields: {
              plan: { stringValue: 'pro' },
              subscriptionStatus: { stringValue: 'active' },
              suiteAccess: { stringValue: 'all_access' },
            },
          }),
        });

        console.log(`[LemonSqueezy Webhook] Successfully activated PRO status for user ${userId}`);
      }
    }

    return sendJson(res, 200, { success: true });
  } catch (err) {
    console.error('[LemonSqueezy Webhook Error]:', err);
    return sendJson(res, 500, { error: err.message });
  }
}
