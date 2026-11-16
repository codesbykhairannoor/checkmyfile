// src/utils/lemonSqueezy.ts
// Helper untuk mengarahkan pengguna ke Lemon Squeezy Checkout dengan metadata user

export interface CheckoutUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
}

export const getLemonSqueezyCheckoutUrl = (user?: CheckoutUser | null): string => {
  const defaultBuyUrl = 'https://thismyown.lemonsqueezy.com/checkout/buy/bd84d992-e4ed-4d88-a5ff-f1ab944f5815';
  const buyUrl = import.meta.env.VITE_LEMONSQUEEZY_LIFETIME_BUY_URL || defaultBuyUrl;

  try {
    const url = new URL(buyUrl);
    if (user?.email) {
      url.searchParams.set('checkout[email]', user.email);
    }
    if (user?.displayName) {
      url.searchParams.set('checkout[name]', user.displayName);
    }
    if (user?.uid) {
      url.searchParams.set('checkout[custom][user_id]', user.uid);
    }
    return url.toString();
  } catch (err) {
    console.error('Error generating checkout URL:', err);
    return buyUrl;
  }
};

export const redirectToLemonSqueezy = (user?: CheckoutUser | null): void => {
  const targetUrl = getLemonSqueezyCheckoutUrl(user);
  if (typeof window !== 'undefined') {
    window.location.href = targetUrl;
  }
};
