// src/config/firebase.ts
// Lazy initializer for Firebase App, Authentication, and Firestore Database
// Keeping top-level free of firebase/* imports prevents ~750 KB from landing on unauthenticated initial page loads.

import type { FirebaseApp } from 'firebase/app';
import type { Auth, GoogleAuthProvider } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const env = (typeof import.meta !== 'undefined' && (import.meta as any)?.env) || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

export interface FirebaseClient {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  googleProvider: GoogleAuthProvider | null;
}

let clientPromise: Promise<FirebaseClient> | null = null;
let cachedClient: FirebaseClient | null = null;

export const getFirebaseClient = async (): Promise<FirebaseClient> => {
  if (cachedClient) return cachedClient;
  if (!isFirebaseConfigured) {
    cachedClient = { app: null, auth: null, db: null, googleProvider: null };
    return cachedClient;
  }
  if (!clientPromise) {
    clientPromise = (async () => {
      try {
        const [{ initializeApp, getApps }, { getAuth, GoogleAuthProvider }, { getFirestore }] = await Promise.all([
          import('firebase/app'),
          import('firebase/auth'),
          import('firebase/firestore'),
        ]);
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const auth = getAuth(app);
        const db = getFirestore(app);
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        cachedClient = { app, auth, db, googleProvider };
        return cachedClient;
      } catch (error) {
        console.error('Firebase initialization error:', error);
        clientPromise = null;
        return { app: null, auth: null, db: null, googleProvider: null };
      }
    })();
  }
  return clientPromise;
};
