const fallbackApiBaseUrl = "http://back:8080/api";

function readPublicRuntimeValue(key: keyof NonNullable<Window["__STARTER_PUBLIC_CONFIG__"]>): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.__STARTER_PUBLIC_CONFIG__?.[key];
}

function readPublicValue(key: keyof NonNullable<Window["__STARTER_PUBLIC_CONFIG__"]>, fallback: string): string {
  return readPublicRuntimeValue(key) ?? process.env[key] ?? fallback;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  API_BASE_URL: process.env.API_BASE_URL ?? fallbackApiBaseUrl,
  API_LOGIN_PATH: process.env.API_LOGIN_PATH ?? "/auth/login",
  API_REGISTER_PATH: process.env.API_REGISTER_PATH ?? "/auth/register",
  API_FORGOT_PASSWORD_PATH: process.env.API_FORGOT_PASSWORD_PATH ?? "/auth/forgot-password",
  API_RESET_PASSWORD_PATH: process.env.API_RESET_PASSWORD_PATH ?? "/auth/reset-password",
  API_VERIFY_EMAIL_PATH: process.env.API_VERIFY_EMAIL_PATH ?? "/auth/confirm-email",
  API_CONFIRM_EMAIL_CHANGE_PATH: process.env.API_CONFIRM_EMAIL_CHANGE_PATH ?? "/account/change-email/confirm",
  API_REFRESH_PATH: process.env.API_REFRESH_PATH ?? "/auth/refresh",
  API_ME_PATH: process.env.API_ME_PATH ?? "/account/me",
  API_BILLING_PLANS_PATH: process.env.API_BILLING_PLANS_PATH ?? "/billing/plans",
  API_BILLING_SUBSCRIPTION_PATH: process.env.API_BILLING_SUBSCRIPTION_PATH ?? "/billing/subscription",
  API_BILLING_CHECKOUT_PATH: process.env.API_BILLING_CHECKOUT_PATH ?? "/billing/checkout",
  API_MEDIA_UPLOAD_PREPARE_PATH: process.env.API_MEDIA_UPLOAD_PREPARE_PATH ?? "/media/uploads",
  API_MEDIA_UPLOAD_COMPLETE_PATH: process.env.API_MEDIA_UPLOAD_COMPLETE_PATH ?? "/media/uploads/complete",
  API_MEDIA_LIBRARY_PATH: process.env.API_MEDIA_LIBRARY_PATH ?? "/media/assets",
  API_PUSH_SUBSCRIPTIONS_PATH: process.env.API_PUSH_SUBSCRIPTIONS_PATH ?? "/notifications/push/subscriptions",
  get NEXT_PUBLIC_APP_NAME() {
    return readPublicValue("NEXT_PUBLIC_APP_NAME", process.env.NEXT_PUBLIC_APP_NAME ?? "App Front");
  },
  get NEXT_PUBLIC_APP_URL() {
    return readPublicValue("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
  },
  get NEXT_PUBLIC_MERCURE_URL() {
    return readPublicValue("NEXT_PUBLIC_MERCURE_URL", "");
  },
  get NEXT_PUBLIC_MERCURE_DISABLED() {
    return readPublicValue("NEXT_PUBLIC_MERCURE_DISABLED", "false");
  },
  get NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY() {
    return readPublicValue("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "");
  },
  get NEXT_PUBLIC_MEDIA_BASE_URL() {
    return readPublicValue("NEXT_PUBLIC_MEDIA_BASE_URL", "");
  },
  get NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL() {
    return readPublicValue("NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL", "");
  },
  get NEXT_PUBLIC_VAPID_PUBLIC_KEY() {
    return readPublicValue("NEXT_PUBLIC_VAPID_PUBLIC_KEY", "");
  },
};

export const isProduction = env.NODE_ENV === "production";
