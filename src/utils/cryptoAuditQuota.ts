// src/utils/cryptoAuditQuota.ts
// Handles 3-free-crypto-audit-certificates/month limit for authenticated free users and gates PRO access.

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const MAX_FREE_CRYPTO_AUDIT_PER_MONTH = 3;

export interface CryptoAuditQuotaStatus {
  allowed: boolean;
  reason: 'unauthenticated' | 'limit_reached' | 'ok';
  used: number;
  max: number;
  remaining: number;
}

export const getCurrentMonthKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getCryptoAuditUsage = (uid: string): number => {
  if (typeof window === 'undefined' || !uid) return 0;
  const monthKey = getCurrentMonthKey();
  const raw = localStorage.getItem(`hmf_crypto_audit_${uid}_${monthKey}`);
  if (!raw) return 0;
  const count = parseInt(raw, 10);
  return isNaN(count) ? 0 : count;
};

export const recordCryptoAuditUsage = async (uid: string): Promise<number> => {
  if (typeof window === 'undefined' || !uid) return 0;
  const monthKey = getCurrentMonthKey();
  const current = getCryptoAuditUsage(uid);
  const next = current + 1;
  localStorage.setItem(`hmf_crypto_audit_${uid}_${monthKey}`, String(next));

  try {
    window.dispatchEvent(new Event('crypto-audit-quota-updated'));
  } catch { }

  if (db) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        monthlyCryptoAuditUsed: next,
        monthlyCryptoAuditResetMonth: monthKey,
      });
    } catch (err) {
      console.warn('Firestore crypto audit quota sync warning:', err);
    }
  }

  return next;
};

export const checkCryptoAuditQuota = (user: any | null, isPro: boolean): CryptoAuditQuotaStatus => {
  const isFounder = Boolean(user?.email && user.email.toLowerCase().trim() === 'erstaunenn@gmail.com');
  if (isPro || isFounder) {
    return {
      allowed: true,
      reason: 'ok',
      used: 0,
      max: Infinity,
      remaining: Infinity,
    };
  }

  if (!user) {
    return {
      allowed: false,
      reason: 'unauthenticated',
      used: 0,
      max: MAX_FREE_CRYPTO_AUDIT_PER_MONTH,
      remaining: 0,
    };
  }

  const used = getCryptoAuditUsage(user.uid);
  const max = MAX_FREE_CRYPTO_AUDIT_PER_MONTH;
  const remaining = Math.max(0, max - used);
  const allowed = used < max;

  return {
    allowed,
    reason: allowed ? 'ok' : 'limit_reached',
    used,
    max,
    remaining,
  };
};
