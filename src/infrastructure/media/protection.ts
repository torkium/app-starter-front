import { env } from "@/infrastructure/env/env";

function normalizeOrigin(input: string): string | null {
  if (!input) {
    return null;
  }

  try {
    return new URL(input).origin;
  } catch {
    return null;
  }
}

const allowedOrigins = [normalizeOrigin(env.NEXT_PUBLIC_MEDIA_BASE_URL), normalizeOrigin(env.NEXT_PUBLIC_APP_URL)].filter(
  (value): value is string => Boolean(value),
);

export function isTrustedMediaUrl(input?: string): boolean {
  if (!input) {
    return false;
  }

  if (input.startsWith("blob:")) {
    return true;
  }

  if (input.startsWith("/")) {
    return input.startsWith("/api/") || input.startsWith("/media/");
  }

  try {
    const url = new URL(input);
    return allowedOrigins.includes(url.origin);
  } catch {
    return false;
  }
}

export function getSafeMediaUrl(input?: string): string | undefined {
  return isTrustedMediaUrl(input) ? input : undefined;
}
