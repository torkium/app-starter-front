"use client";

import { AuthProvider } from "@/infrastructure/auth/AuthContext";
import { ConsentProvider } from "@/infrastructure/consent/ConsentContext";
import { I18nProvider } from "@/infrastructure/i18n/I18nContext";
import { MercureProvider } from "@/infrastructure/mercure/MercureProvider";
import { PwaProvider } from "@/infrastructure/pwa/PwaContext";
import type { Locale } from "@/infrastructure/i18n/messages";
import type { AuthenticatedUser } from "@/shared/types/auth";

export function AppProviders({
  children,
  initialUser,
  initialLocale,
}: {
  children: React.ReactNode;
  initialUser: AuthenticatedUser | null;
  initialLocale: Locale;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <AuthProvider initialUser={initialUser}>
        <ConsentProvider>
          <PwaProvider>
            <MercureProvider>{children}</MercureProvider>
          </PwaProvider>
        </ConsentProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
