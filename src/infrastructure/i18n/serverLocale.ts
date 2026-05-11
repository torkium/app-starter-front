import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/infrastructure/auth/cookies";
import type { Locale } from "@/infrastructure/i18n/messages";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const locale = jar.get(LOCALE_COOKIE)?.value;
  return locale === "en" ? "en" : "fr";
}
