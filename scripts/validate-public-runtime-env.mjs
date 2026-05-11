const requiredUrlKeys = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL",
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

console.log("Public runtime env contract is valid");
