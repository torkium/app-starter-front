export {};

declare global {
  interface Window {
    __STARTER_PUBLIC_CONFIG__?: {
      NEXT_PUBLIC_APP_NAME?: string;
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_MERCURE_URL?: string;
      NEXT_PUBLIC_MERCURE_DISABLED?: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
      NEXT_PUBLIC_MEDIA_BASE_URL?: string;
      NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL?: string;
      NEXT_PUBLIC_VAPID_PUBLIC_KEY?: string;
    };
  }
}
