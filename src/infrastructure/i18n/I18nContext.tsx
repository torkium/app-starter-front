"use client";

import { createContext, useContext, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE } from "@/infrastructure/auth/cookies";
import { messages, type Locale } from "@/infrastructure/i18n/messages";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (namespace: keyof typeof messages.fr, key: keyof typeof messages.fr.common) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: initialLocale,
      setLocale: (locale) => {
        document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
        startTransition(() => router.refresh());
      },
      t: (namespace, key) => messages[initialLocale][namespace][key],
    }),
    [initialLocale, router],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n doit être utilisé dans I18nProvider");
  }
  return context;
}
