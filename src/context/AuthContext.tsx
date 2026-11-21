// src/context/AuthContext.tsx
// Global Firebase Auth & Subscription (Free vs Pro) Provider for HandleMyFile
// Engineered with lazy Firebase SDK loading so unauthenticated visitors & crawlers download 0 KB of Firebase/Firestore.

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ActionCodeSettings, User } from 'firebase/auth';
import { isFirebaseConfigured, getFirebaseClient } from '../config/firebase';
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

const AUTH_SESSION_HINT_KEY = 'hmf_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);

  const authListenerBoundRef = useRef(false);
  const authInitPromiseRef = useRef<Promise<void> | null>(null);
  const unsubAuthRef = useRef<(() => void) | null>(null);
  const unsubSnapshotRef = useRef<(() => void) | null>(null);

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
      monthlyCryptoAuditUsed: 0,
      monthlyCryptoAuditResetMonth: monthKey,
      monthlyOcrExcelUsed: 0,
      monthlyOcrExcelResetMonth: monthKey,
    };

    const { db } = await getFirebaseClient();
    if (!db) {
      return fallbackProfile;
    }

    try {
      const { doc, getDoc, setDoc, updateDoc } = await import('firebase/firestore');
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

        let cryptoAuditUsed = data.monthlyCryptoAuditUsed || 0;
        let cryptoMonth = data.monthlyCryptoAuditResetMonth || monthKey;
        if (cryptoMonth !== monthKey) {
          cryptoAuditUsed = 0;
          cryptoMonth = monthKey;
        }

        let ocrExcelUsed = data.monthlyOcrExcelUsed || 0;
        let ocrMonth = data.monthlyOcrExcelResetMonth || monthKey;
        if (ocrMonth !== monthKey) {
          ocrExcelUsed = 0;
          ocrMonth = monthKey;
        }

        try {
          localStorage.setItem(`hmf_batch_${firebaseUser.uid}_${monthKey}`, String(batchesUsed));
          localStorage.setItem(`hmf_crypto_audit_${firebaseUser.uid}_${monthKey}`, String(cryptoAuditUsed));
          localStorage.setItem(`hmf_ocr_excel_${firebaseUser.uid}_${monthKey}`, String(ocrExcelUsed));
        } catch (_) { }

        const updates: any = {
          lastLoginAt: Date.now(),
          displayName: firebaseUser.displayName || data.displayName,
          photoURL: firebaseUser.photoURL || data.photoURL,
          monthlyBatchesUsed: isFounder ? 0 : batchesUsed,
          monthlyBatchResetMonth: batchMonth,
          monthlyCryptoAuditUsed: isFounder ? 0 : cryptoAuditUsed,
          monthlyCryptoAuditResetMonth: cryptoMonth,
          monthlyOcrExcelUsed: isFounder ? 0 : ocrExcelUsed,
          monthlyOcrExcelResetMonth: ocrMonth,
        };

        if (isFounder) {
          currentPlan = 'pro';
          currentStatus = 'active';
          updates.plan = 'pro';
          updates.subscriptionStatus = 'active';
          updates.expiresAt = null;
        } else if (data.plan === 'pro' && data.expiresAt && Date.now() > data.expiresAt) {
          currentPlan = 'free';
          currentStatus = 'inactive';
          updates.plan = 'free';
          updates.subscriptionStatus = 'inactive';
        }

        await updateDoc(userDocRef, updates);

        return {
          ...data,
          plan: currentPlan,
          subscriptionStatus: currentStatus,
          expiresAt: isFounder ? null : data.expiresAt,
          lastLoginAt: Date.now(),
          monthlyBatchesUsed: isFounder ? 0 : batchesUsed,
          monthlyBatchResetMonth: batchMonth,
          monthlyCryptoAuditUsed: isFounder ? 0 : cryptoAuditUsed,
          monthlyCryptoAuditResetMonth: cryptoMonth,
          monthlyOcrExcelUsed: isFounder ? 0 : ocrExcelUsed,
          monthlyOcrExcelResetMonth: monthKey,
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

  const ensureFirebaseSubscribed = useCallback(async () => {
    if (authListenerBoundRef.current) return;
    if (authInitPromiseRef.current) return authInitPromiseRef.current;

    authInitPromiseRef.current = (async () => {
      if (!isFirebaseConfigured) {
        setLoading(false);
        return;
      }

      const { auth, db } = await getFirebaseClient();
      if (!auth) {
        setLoading(false);
        return;
      }

      const [{ getRedirectResult, onAuthStateChanged }, { doc, onSnapshot }] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
      ]);

      // Handle sign-in redirect result if popup was blocked
      getRedirectResult(auth)
        .then(async (result) => {
          if (result?.user) {
            try {
              localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
            } catch (_) { }
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

      unsubAuthRef.current = onAuthStateChanged(auth, async (currentUser) => {
        if (unsubSnapshotRef.current) {
          unsubSnapshotRef.current();
          unsubSnapshotRef.current = null;
        }

        setUser(currentUser);
        if (currentUser) {
          try {
            localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
          } catch (_) { }
          if (currentUser.emailVerified) {
            setIsAuthModalOpen(false);
          }
          try {
            const userProfile = await fetchOrCreateProfile(currentUser);
            setProfile(userProfile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }

          if (db) {
            try {
              const userDocRef = doc(db, 'users', currentUser.uid);
              unsubSnapshotRef.current = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                  const data = docSnap.data() as UserProfile;
                  const monthKey = getCurrentMonthKey();
                  const isFounder = isFounderLifetimeEmail(currentUser.email);

                  const batchesUsed = data.monthlyBatchResetMonth === monthKey ? (data.monthlyBatchesUsed || 0) : 0;
                  const cryptoAuditUsed = data.monthlyCryptoAuditResetMonth === monthKey ? (data.monthlyCryptoAuditUsed || 0) : 0;
                  const ocrExcelUsed = data.monthlyOcrExcelResetMonth === monthKey ? (data.monthlyOcrExcelUsed || 0) : 0;

                  try {
                    localStorage.setItem(`hmf_batch_${currentUser.uid}_${monthKey}`, String(batchesUsed));
                    localStorage.setItem(`hmf_crypto_audit_${currentUser.uid}_${monthKey}`, String(cryptoAuditUsed));
                    localStorage.setItem(`hmf_ocr_excel_${currentUser.uid}_${monthKey}`, String(ocrExcelUsed));
                  } catch (_) { }

                  setProfile((prev) => ({
                    ...(prev || data),
                    ...data,
                    plan: isFounder ? 'pro' : data.plan,
                    subscriptionStatus: isFounder ? 'active' : data.subscriptionStatus,
                    monthlyBatchesUsed: isFounder ? 0 : batchesUsed,
                    monthlyBatchResetMonth: monthKey,
                    monthlyCryptoAuditUsed: isFounder ? 0 : cryptoAuditUsed,
                    monthlyCryptoAuditResetMonth: monthKey,
                    monthlyOcrExcelUsed: isFounder ? 0 : ocrExcelUsed,
                    monthlyOcrExcelResetMonth: monthKey,
                  }));

                  window.dispatchEvent(new Event('batch-quota-updated'));
                  window.dispatchEvent(new Event('crypto-audit-quota-updated'));
                  window.dispatchEvent(new Event('ocr-excel-quota-updated'));
                }
              }, (err) => {
                console.warn('Firestore onSnapshot listener error:', err);
              });
            } catch (e) {
              console.warn('Failed to attach onSnapshot:', e);
            }
          }
        } else {
          try {
            localStorage.removeItem(AUTH_SESSION_HINT_KEY);
          } catch (_) { }
          setProfile(null);
        }
        setLoading(false);
      });

      authListenerBoundRef.current = true;
    })();

    return authInitPromiseRef.current;
  }, [fetchOrCreateProfile]);

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
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const detectExistingSession = async () => {
      try {
        const search = typeof window !== 'undefined' ? window.location.search : '';
        const hasAuthActionQuery = search.includes('mode=') || search.includes('oobCode=');
        const hasHint = localStorage.getItem(AUTH_SESSION_HINT_KEY) === '1';

        if (hasAuthActionQuery || hasHint) {
          await ensureFirebaseSubscribed();
          return;
        }

        // Fast native IndexedDB check (0 KB Firebase loaded for clean guests & crawlers)
        if (typeof indexedDB !== 'undefined' && typeof indexedDB.databases === 'function') {
          const dbs = await indexedDB.databases().catch(() => []);
          if (!cancelled && Array.isArray(dbs) && dbs.some((d) => d.name === 'firebaseLocalStorageDb')) {
            await ensureFirebaseSubscribed();
            return;
          }
        }
      } catch (_) {
        // Ignore detection errors
      }
      if (!cancelled) {
        setLoading(false);
      }
    };

    detectExistingSession();

    return () => {
      cancelled = true;
      if (unsubAuthRef.current) {
        unsubAuthRef.current();
        unsubAuthRef.current = null;
      }
      if (unsubSnapshotRef.current) {
        unsubSnapshotRef.current();
        unsubSnapshotRef.current = null;
      }
    };
  }, [ensureFirebaseSubscribed]);

  const signInWithGoogle = async () => {
    await ensureFirebaseSubscribed();
    const { auth, googleProvider } = await getFirebaseClient();
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const { signInWithPopup, signInWithRedirect } = await import('firebase/auth');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      try {
        localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
      } catch (_) { }
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
    await ensureFirebaseSubscribed();
    const { auth } = await getFirebaseClient();
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    try {
      localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
    } catch (_) { }
    const userProfile = await fetchOrCreateProfile(result.user);
    setProfile(userProfile);
    setIsAuthModalOpen(false);
  };

  const sendVerificationEmail = async (targetUser?: User | null) => {
    await ensureFirebaseSubscribed();
    const { auth } = await getFirebaseClient();
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase belum dikonfigurasi.');
    }

    const userToVerify = targetUser || auth.currentUser || user;
    if (!userToVerify) {
      throw new Error('No user currently authenticated.');
    }

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

    if (userToVerify.email) {
      try {
        const response = await fetch('/api/send-verification-email/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userToVerify.email.trim(),
            origin: currentOrigin,
            lang: activeLang,
          }),
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          if (data.success) {
            return;
          }
        }
      } catch (apiErr) {
        console.warn('API send verification email call failed, trying client SDK fallback:', apiErr);
      }
    }

    const { sendEmailVerification } = await import('firebase/auth');
    const actionCodeSettings: ActionCodeSettings = {
      url: `${currentOrigin}/?mode=verifyEmail`,
      handleCodeInApp: true,
    };

    try {
      await sendEmailVerification(userToVerify, actionCodeSettings);
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-continue-uri') {
        await sendEmailVerification(userToVerify);
      } else {
        throw err;
      }
    }
  };

  const verifyEmailWithCode = async (oobCode: string) => {
    await ensureFirebaseSubscribed();
    const { auth } = await getFirebaseClient();
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase belum dikonfigurasi.');
    }
    const { applyActionCode } = await import('firebase/auth');
    await applyActionCode(auth, oobCode);
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      await refreshProfile();
    }
  };

  const reloadUser = async () => {
    await ensureFirebaseSubscribed();
    const { auth } = await getFirebaseClient();
    if (!auth?.currentUser) return null;
    await auth.currentUser.reload();
    setUser({ ...auth.currentUser });
    await refreshProfile();
    return auth.currentUser;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await ensureFirebaseSubscribed();
    const { auth } = await getFirebaseClient();
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

    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const result = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    try {
      localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
    } catch (_) { }
    const userProfile = await fetchOrCreateProfile(result.user);
    setProfile(userProfile);
    setIsAuthModalOpen(true);

    try {
      await sendVerificationEmail(result.user);
    } catch (verifErr) {
      console.warn('Failed to send verification email on signup:', verifErr);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await ensureFirebaseSubscribed();
    const { auth } = await getFirebaseClient();
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://handlemyfile.com';
    const { sendPasswordResetEmail } = await import('firebase/auth');

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
    await ensureFirebaseSubscribed();
    const { auth } = await getFirebaseClient();
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const { confirmPasswordReset } = await import('firebase/auth');
    await confirmPasswordReset(auth, oobCode, newPassword);
  };

  const signOut = async () => {
    const { auth } = await getFirebaseClient();
    if (!auth) return;
    try {
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      await firebaseSignOut(auth);
      try {
        localStorage.removeItem(AUTH_SESSION_HINT_KEY);
      } catch (_) { }
      setUser(null);
      setProfile(null);
      window.dispatchEvent(new Event('batch-quota-updated'));
      window.dispatchEvent(new Event('crypto-audit-quota-updated'));
      window.dispatchEvent(new Event('ocr-excel-quota-updated'));
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const openAuthModal = () => {
    ensureFirebaseSubscribed();
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openDeleteModal = () => {
    ensureFirebaseSubscribed();
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openChangePasswordModal = () => {
    ensureFirebaseSubscribed();
    setIsChangePasswordModalOpen(true);
  };
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  const openLogoutConfirmModal = () => setIsLogoutConfirmOpen(true);
  const closeLogoutConfirmModal = () => setIsLogoutConfirmOpen(false);

  const deleteAccount = async (passwordConfirmation?: string) => {
    await ensureFirebaseSubscribed();
    const { auth, db, googleProvider } = await getFirebaseClient();
    if (!auth || !auth.currentUser) {
      throw new Error('No user currently authenticated.');
    }

    const [{ EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, deleteUser }, { doc, deleteDoc }] =
      await Promise.all([import('firebase/auth'), import('firebase/firestore')]);

    const currentUser = auth.currentUser;
    const uid = currentUser.uid;
    const isPasswordProvider = currentUser.providerData.some((p) => p.providerId === 'password');

    if (isPasswordProvider && passwordConfirmation && currentUser.email) {
      const credential = EmailAuthProvider.credential(currentUser.email, passwordConfirmation);
      await reauthenticateWithCredential(currentUser, credential);
    }

    const performDeletion = async () => {
      if (db) {
        try {
          await deleteDoc(doc(db, 'users', uid));
        } catch (e) {
          console.warn('Failed to delete user doc in Firestore:', e);
        }
      }

      try {
        localStorage.removeItem(AUTH_SESSION_HINT_KEY);
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.includes(uid) || k.startsWith('hmf_batch_') || k.startsWith('hmf_crypto_audit_') || k.startsWith('hmf_ocr_excel_'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (_) { }

      await deleteUser(currentUser);

      setUser(null);
      setProfile(null);
      setIsDeleteModalOpen(false);
    };

    try {
      await performDeletion();
    } catch (err: any) {
      if (err?.code === 'auth/requires-recent-login') {
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
        } else if (isGoogleProvider && googleProvider) {
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
  });

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
        isChangePasswordModalOpen,
        openChangePasswordModal,
        closeChangePasswordModal,
        isLogoutConfirmOpen,
        openLogoutConfirmModal,
        closeLogoutConfirmModal,
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
