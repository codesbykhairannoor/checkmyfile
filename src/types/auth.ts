// src/types/auth.ts
// Definisi tipe data profil pengguna dan status langganan SaaS

export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'past_due' | 'cancelled';
export type BillingInterval = 'lifetime' | 'monthly' | 'yearly';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  billingInterval?: BillingInterval | null;
  subscriptionId?: string | null;
  customerId?: string | null;
  suiteAccess?: string | null; // e.g. 'all_access'
  expiresAt?: number | null; // Timestamp millisecond
  createdAt: number;
  lastLoginAt: number;
  monthlyBatchesUsed?: number;
  monthlyBatchResetMonth?: string;
}

export interface AuthContextType {
  user: any | null; // Firebase User
  profile: UserProfile | null;
  loading: boolean;
  isPro: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  confirmNewPassword: (oobCode: string, newPassword: string) => Promise<void>;
  sendVerificationEmail: (targetUser?: any) => Promise<void>;
  verifyEmailWithCode: (oobCode: string) => Promise<void>;
  reloadUser: () => Promise<any>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  refreshProfile: () => Promise<void>;
}
