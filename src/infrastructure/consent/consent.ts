import { CONSENT_COOKIE } from "@/infrastructure/auth/cookies";

export type ConsentChoice = "accepted" | "declined";

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) {
    return null;
  }
  const value = match.split("=")[1];
  return value === "accepted" || value === "declined" ? value : null;
}

export function writeConsent(choice: ConsentChoice): void {
  document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}
