import { existsSync, readFileSync } from "node:fs";

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    if (process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = valueParts.join("=").replace(/^['"]|['"]$/g, "");
  }
}

loadEnvFile(".env");

const requiredUrlKeys = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL",
];

const serverPathKeys = [
  "API_LOGIN_PATH",
  "API_REGISTER_PATH",
  "API_FORGOT_PASSWORD_PATH",
  "API_RESET_PASSWORD_PATH",
  "API_VERIFY_EMAIL_PATH",
  "API_CONFIRM_EMAIL_CHANGE_PATH",
  "API_REFRESH_PATH",
  "API_ME_PATH",
  "API_BILLING_PLANS_PATH",
  "API_BILLING_SUBSCRIPTION_PATH",
  "API_BILLING_CHECKOUT_PATH",
  "API_BILLING_HISTORY_PATH",
  "API_MEDIA_UPLOAD_PREPARE_PATH",
  "API_MEDIA_UPLOAD_COMPLETE_PATH",
  "API_MEDIA_LIBRARY_PATH",
  "API_PUSH_SUBSCRIPTIONS_PATH",
];

function ensureNonEmptyString(key) {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`Variable manquante: ${key}`);
  }
}

function ensureAbsoluteUrl(key) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Variable manquante: ${key}`);
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Variable ${key} invalide: URL absolue attendue, recu "${value}"`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`Variable ${key} invalide: protocole HTTP(S) attendu, recu "${parsed.protocol}"`);
  }
}

function ensureAbsoluteHttpUrlValue(key, value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Variable ${key} invalide: URL absolue attendue, recu "${value}"`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`Variable ${key} invalide: protocole HTTP(S) attendu, recu "${parsed.protocol}"`);
  }
}

function ensureAbsoluteUrlWhenPresent(key) {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    return;
  }

  ensureAbsoluteHttpUrlValue(key, value);
}

function ensurePathWhenConfigured(key) {
  const value = process.env[key];
  if (value === undefined) {
    return;
  }

  if (value.trim() === "") {
    throw new Error(`Variable manquante: ${key}`);
  }

  if (!value.startsWith("/")) {
    throw new Error(`Variable ${key} invalide: chemin absolu attendu, recu "${value}"`);
  }
}

for (const key of requiredUrlKeys) {
  ensureAbsoluteUrl(key);
}

ensureNonEmptyString("NEXT_PUBLIC_APP_NAME");

const mercureDisabled = process.env.NEXT_PUBLIC_MERCURE_DISABLED;
if (!["true", "false"].includes(mercureDisabled ?? "")) {
  throw new Error("Variable NEXT_PUBLIC_MERCURE_DISABLED invalide: 'true' ou 'false' attendu");
}

if (mercureDisabled === "false") {
  ensureAbsoluteUrl("NEXT_PUBLIC_MERCURE_URL");
}

if (process.env.NEXT_PUBLIC_MEDIA_BASE_URL) {
  ensureAbsoluteUrl("NEXT_PUBLIC_MEDIA_BASE_URL");
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
if (stripeKey !== "" && !/^pk_(test|live)_/.test(stripeKey)) {
  throw new Error("Variable NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY invalide");
}

const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
if (vapidKey !== "" && vapidKey.length < 16) {
  throw new Error("Variable NEXT_PUBLIC_VAPID_PUBLIC_KEY invalide: valeur trop courte");
}

if (process.env.NODE_ENV === "production" || process.env.MY_APP_VALIDATE_SERVER_ENV === "1") {
  ensureNonEmptyString("API_BASE_URL");
  ensureAbsoluteUrlWhenPresent("API_BASE_URL");
}

for (const key of serverPathKeys) {
  ensurePathWhenConfigured(key);
}

console.log("Public runtime env contract is valid");
