// src/utils/batchQuota.ts
// Handles 3-free-batches/month limit for authenticated free users and gates batch processing.

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const MAX_FREE_BATCHES_PER_MONTH = 3;

export interface BatchQuotaStatus {
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

export const getBatchUsage = (uid: string): number => {
  if (typeof window === 'undefined' || !uid) return 0;
  const monthKey = getCurrentMonthKey();
  const raw = localStorage.getItem(`hmf_batch_${uid}_${monthKey}`);
  if (!raw) return 0;
  const count = parseInt(raw, 10);
  return isNaN(count) ? 0 : count;
};

export const recordBatchUsage = async (uid: string): Promise<number> => {
  if (typeof window === 'undefined' || !uid) return 0;
  const monthKey = getCurrentMonthKey();
  const current = getBatchUsage(uid);
  const next = current + 1;
  localStorage.setItem(`hmf_batch_${uid}_${monthKey}`, String(next));

  // Trigger UI event for reactive status updates
  try {
    window.dispatchEvent(new Event('batch-quota-updated'));
  } catch (_) {}

  // Sync with Firestore in background if available
  if (db) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        monthlyBatchesUsed: next,
        monthlyBatchResetMonth: monthKey,
      });
    } catch (err) {
      console.warn('Firestore batch quota sync warning:', err);
    }
  }

  return next;
};

export const checkBatchQuota = (user: any | null, isPro: boolean): BatchQuotaStatus => {
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
      max: MAX_FREE_BATCHES_PER_MONTH,
      remaining: 0,
    };
  }

  const used = getBatchUsage(user.uid);
  const max = MAX_FREE_BATCHES_PER_MONTH;
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
