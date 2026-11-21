// src/utils/ocrExcelQuota.ts
// Handles 3-free-trials/month limit for authenticated free users and gates PRO access to OCR -> Excel (.xlsx).
// Firebase Firestore is the authoritative source of truth.

import type { UserProfile } from '../types/auth';

export const MAX_FREE_OCR_EXCEL_PER_MONTH = 3;

export interface OcrExcelQuotaStatus {
  allowed: boolean;
  reason: 'unauthenticated' | 'unverified_email' | 'limit_reached' | 'ok';
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

export const getOcrExcelUsage = (uid: string, profile?: UserProfile | null): number => {
  const monthKey = getCurrentMonthKey();

  // 1. Authoritative Firestore profile check
  if (profile && profile.uid === uid) {
    if (profile.monthlyOcrExcelResetMonth === monthKey) {
      return profile.monthlyOcrExcelUsed || 0;
    }
    return 0;
  }

  // 2. Fallback to cached value in localStorage
  if (typeof window === 'undefined' || !uid) return 0;
  const raw = localStorage.getItem(`hmf_ocr_excel_${uid}_${monthKey}`);
  if (!raw) return 0;
  const count = parseInt(raw, 10);
  return isNaN(count) ? 0 : count;
};

export const recordOcrExcelUsage = async (uid: string): Promise<number> => {
  if (typeof window === 'undefined' || !uid) return 0;
  const monthKey = getCurrentMonthKey();

  let next = getOcrExcelUsage(uid) + 1;

  // Direct authoritative update to Firestore (lazy-loaded)
  try {
    const [{ getFirebaseClient }, { doc, getDoc, updateDoc }] = await Promise.all([
      import('../config/firebase'),
      import('firebase/firestore'),
    ]);
    const { db } = await getFirebaseClient();
    if (db) {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const firestoreMonth = data.monthlyOcrExcelResetMonth;
        const firestoreUsed = firestoreMonth === monthKey ? (data.monthlyOcrExcelUsed || 0) : 0;
        next = firestoreUsed + 1;
        await updateDoc(userRef, {
          monthlyOcrExcelUsed: next,
          monthlyOcrExcelResetMonth: monthKey,
        });
      }
    }
  } catch (err) {
    console.warn('Firestore OCR Excel quota sync warning:', err);
  }

  localStorage.setItem(`hmf_ocr_excel_${uid}_${monthKey}`, String(next));

  try {
    window.dispatchEvent(new Event('ocr-excel-quota-updated'));
  } catch { }

  return next;
};

export const checkOcrExcelQuota = (user: any | null, isPro: boolean, profile?: UserProfile | null): OcrExcelQuotaStatus => {
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
      max: MAX_FREE_OCR_EXCEL_PER_MONTH,
      remaining: 0,
    };
  }

  // Anti-abuse: manual email accounts must verify their email to unlock free quota
  if (!user.emailVerified) {
    return {
      allowed: false,
      reason: 'unverified_email',
      used: 0,
      max: MAX_FREE_OCR_EXCEL_PER_MONTH,
      remaining: 0,
    };
  }

  const used = getOcrExcelUsage(user.uid, profile);
  const max = MAX_FREE_OCR_EXCEL_PER_MONTH;
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
