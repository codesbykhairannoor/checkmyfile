// src/context/AuthContext.tsx
// Global Firebase Auth & Subscription (Free vs Pro) Provider for HandleMyFile

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
  applyActionCode,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  type ActionCodeSettings,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase';
import type { UserProfile, AuthContextType } from '../types/auth';
import { getCurrentMonthKey } from '../utils/batchQuota';
import { isDisposableEmail } from '../utils/disposableEmailBlocker';
import { isValidLanguageCode } from '../i18n/languages';

export const FOUNDER_LIFETIME_EMAILS = ['erstaunenn@gmail.com'];

export const isFounderLifetimeEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return FOUNDER_LIFETIME_EMAILS.includes(email.trim().toLowerCase());
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const fetchOrCreateProfile = useCallback(async (firebaseUser: User): Promise<UserProfile> => {
    const monthKey = getCurrentMonthKey();
    const isFounder = isFounderLifetimeEmail(firebaseUser.email);

    const fallbackProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      plan: isFounder ? 'pro' : 'free',
      subscriptionStatus: isFounder ? 'active' : 'inactive',
      expiresAt: null,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      monthlyBatchesUsed: 0,
      monthlyBatchResetMonth: monthKey,
    };

    if (!db) {
      return fallbackProfile;
    }

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data() as UserProfile;
        let currentPlan = isFounder ? 'pro' : data.plan;
        let currentStatus = isFounder ? 'active' : data.subscriptionStatus;

        let batchesUsed = data.monthlyBatchesUsed || 0;
        let batchMonth = data.monthlyBatchResetMonth || monthKey;
        if (batchMonth !== monthKey) {
          batchesUsed = 0;
          batchMonth = monthKey;
        }

        try {
          localStorage.setItem(`hmf_batch_${firebaseUser.uid}_${monthKey}`, String(batchesUsed));
        } catch (_) { }

        if (isFounder) {
          currentPlan = 'pro';
          currentStatus = 'active';
          await updateDoc(userDocRef, {
            plan: 'pro',
            subscriptionStatus: 'active',
            expiresAt: null,
            lastLoginAt: Date.now(),
            monthlyBatchesUsed: 0,
            monthlyBatchResetMonth: batchMonth,
          });
        } else if (data.plan === 'pro' && data.expiresAt && Date.now() > data.expiresAt) {
          currentPlan = 'free';
          currentStatus = 'inactive';
          await updateDoc(userDocRef, {
            plan: 'free',
            subscriptionStatus: 'inactive',
            lastLoginAt: Date.now(),
            monthlyBatchesUsed: batchesUsed,
            monthlyBatchResetMonth: batchMonth,
          });
        } else {
          await updateDoc(userDocRef, {
            lastLoginAt: Date.now(),
            displayName: firebaseUser.displayName || data.displayName,
            photoURL: firebaseUser.photoURL || data.photoURL,
            monthlyBatchesUsed: batchesUsed,
            monthlyBatchResetMonth: batchMonth,
          });
        }

        return {
          ...data,
          plan: currentPlan,
          subscriptionStatus: currentStatus,
          expiresAt: isFounder ? null : data.expiresAt,
          lastLoginAt: Date.now(),
          monthlyBatchesUsed: batchesUsed,
          monthlyBatchResetMonth: batchMonth,
        };
      } else {
        await setDoc(userDocRef, fallbackProfile);
        return fallbackProfile;
      }
    } catch (firestoreError) {
      console.warn('Firestore profile sync failed or permission denied (using fallback profile):', firestoreError);
      return fallbackProfile;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const refreshed = await fetchOrCreateProfile(user);
      setProfile(refreshed);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  }, [user, fetchOrCreateProfile]);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    // Handle sign-in redirect result if popup was blocked
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          try {
            const userProfile = await fetchOrCreateProfile(result.user);
            setProfile(userProfile);
            setIsAuthModalOpen(false);
          } catch (e) {
            console.error('Error fetching profile from redirect result:', e);
          }
        }
      })
      .catch((err) => {
        if (err?.code !== 'auth/popup-closed-by-user') {
          console.error('Google Redirect Sign-In Error:', err);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAuthModalOpen(false);
        try {
          const userProfile = await fetchOrCreateProfile(currentUser);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchOrCreateProfile]);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userProfile = await fetchOrCreateProfile(result.user);
      setProfile(userProfile);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        return;
      }
      if (error?.code === 'auth/popup-blocked') {
        console.warn('Popup blocked by browser. Automatically falling back to signInWithRedirect...');
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    const userProfile = await fetchOrCreateProfile(result.user);
    setProfile(userProfile);
    setIsAuthModalOpen(false);
  };

  const sendVerificationEmail = async (targetUser?: User | null) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase belum dikonfigurasi.');
    }

    const userToVerify = targetUser || auth.currentUser || user;
    if (!userToVerify) {
      throw new Error('No user currently authenticated.');
    }

    // Set auth language to active UI language or English
    let activeLang = 'en';
    if (typeof window !== 'undefined') {
      const pathSeg = window.location.pathname.replace(/^\/+/, '').split('/')[0];
      if (pathSeg && isValidLanguageCode(pathSeg)) {
        activeLang = pathSeg;
      } else {
        activeLang = localStorage.getItem('hmf_user_lang') || 'en';
      }
    }
    auth.languageCode = activeLang;

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://handlemyfile.com';
    const actionCodeSettings: ActionCodeSettings = {
      // Directs strictly back to HandleMyFile to avoid mixing with other sites
      url: `${currentOrigin}/?mode=verifyEmail`,
      handleCodeInApp: true,
    };

    try {
      await sendEmailVerification(userToVerify, actionCodeSettings);
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-continue-uri') {
        // Fallback without actionCodeSettings if domain is not yet whitelisted in Firebase
        await sendEmailVerification(userToVerify);
      } else {
        throw err;
      }
    }
  };

  const verifyEmailWithCode = async (oobCode: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase belum dikonfigurasi.');
    }
    await applyActionCode(auth, oobCode);
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      await refreshProfile();
    }
  };

  const reloadUser = async () => {
    if (!auth?.currentUser) return null;
    await auth.currentUser.reload();
    setUser({ ...auth.currentUser });
    await refreshProfile();
    return auth.currentUser;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (isDisposableEmail(trimmedEmail)) {
      const err = new Error('Disposable / temporary email addresses are not permitted. Please use a valid email.');
      (err as any).code = 'auth/disposable-email-blocked';
      throw err;
    }

    const result = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    const userProfile = await fetchOrCreateProfile(result.user);
    setProfile(userProfile);

    // Automatically send verification email specifically for HandleMyFile
    try {
      await sendVerificationEmail(result.user);
    } catch (verifErr) {
      console.warn('Failed to send verification email on signup:', verifErr);
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://handlemyfile.com';

    try {
      const response = await fetch('/api/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), origin: currentOrigin }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const err = new Error(data.error || 'Failed to send password reset email');
        if (response.status === 404 && data.error?.includes('No account')) {
          (err as any).code = 'auth/user-not-found';
          throw err;
        } else if (response.status === 429) {
          (err as any).code = 'auth/too-many-requests';
          throw err;
        }

        // If serverless endpoint is not available (e.g., local vite dev without vercel api), fall back to client SDK
        if (response.status === 404 || response.status === 500) {
          console.warn('Custom branded reset API unavailable, falling back to Firebase client SDK...');
          const actionCodeSettings = {
            url: `${currentOrigin}/?mode=resetPassword`,
            handleCodeInApp: true,
          };
          await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
          return;
        }

        throw err;
      }
    } catch (apiError: any) {
      if (apiError?.code) throw apiError;
      console.warn('API reset password call failed, attempting fallback to client SDK:', apiError);
      const actionCodeSettings = {
        url: `${currentOrigin}/?mode=resetPassword`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
    }
  };

  const confirmNewPassword = async (oobCode: string, newPassword: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    await confirmPasswordReset(auth, oobCode, newPassword);
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const deleteAccount = async (passwordConfirmation?: string) => {
    if (!auth || !auth.currentUser) {
      throw new Error('No user currently authenticated.');
    }

    const currentUser = auth.currentUser;
    const uid = currentUser.uid;

    const performDeletion = async () => {
      // 1. Delete Firestore user document
      if (db) {
        try {
          await deleteDoc(doc(db, 'users', uid));
        } catch (e) {
          console.warn('Failed to delete user doc in Firestore:', e);
        }
      }

      // 2. Clear local storage records related to user across all 4 apps
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.includes(uid) || k.startsWith('hmf_batch_') || k.startsWith('hmf_crypto_audit_'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (_) {}

      // 3. Delete user account from Firebase Auth
      await deleteUser(currentUser);

      setUser(null);
      setProfile(null);
      setIsDeleteModalOpen(false);
    };

    try {
      await performDeletion();
    } catch (err: any) {
      if (err?.code === 'auth/requires-recent-login') {
        const isPasswordProvider = currentUser.providerData.some((p) => p.providerId === 'password');
        const isGoogleProvider = currentUser.providerData.some((p) => p.providerId === 'google.com');

        if (isPasswordProvider) {
          if (!passwordConfirmation) {
            const reauthErr = new Error('Password confirmation required.');
            (reauthErr as any).code = 'auth/requires-password-confirmation';
            throw reauthErr;
          }
          if (currentUser.email) {
            const credential = EmailAuthProvider.credential(currentUser.email, passwordConfirmation);
            await reauthenticateWithCredential(currentUser, credential);
            await performDeletion();
            return;
          }
        } else if (isGoogleProvider) {
          await reauthenticateWithPopup(currentUser, googleProvider);
          await performDeletion();
          return;
        }
      }
      throw err;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __openAuthModal?: () => void }).__openAuthModal = openAuthModal;
    }
  }, []);

  const isPro = Boolean(
    isFounderLifetimeEmail(user?.email) ||
    isFounderLifetimeEmail(profile?.email) ||
    (profile?.plan === 'pro' &&
      profile?.subscriptionStatus === 'active' &&
      (!profile.expiresAt || profile.expiresAt > Date.now()))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isPro,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        confirmNewPassword,
        sendVerificationEmail,
        verifyEmailWithCode,
        reloadUser,
        signOut,
        deleteAccount,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isDeleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
