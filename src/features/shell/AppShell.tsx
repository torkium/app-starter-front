"use client";

import type { Route } from "next";
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { useConsent } from "@/infrastructure/consent/ConsentContext";
import { useI18n } from "@/infrastructure/i18n/I18nContext";
import { useMercure } from "@/infrastructure/mercure/MercureProvider";
import { PwaInstallBanner } from "@/infrastructure/pwa/components/PwaInstallBanner";
import { usePwa } from "@/infrastructure/pwa/PwaContext";
import { AppShellFrame } from "@/design-system/organisms/AppShell";

const shellNavigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/billing", label: "Billing" },
  { href: "/media", label: "Media" },
  { href: "/account", label: "Compte" },
] satisfies ReadonlyArray<{ href: Route; label: string }>;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { locale, setLocale } = useI18n();
  const { consent, hydrated, setConsent } = useConsent();
  const { canInstall, dismissed, promptInstall, dismissPrompt } = usePwa();
  const { status } = useMercure();

  return (
    <AppShellFrame
      userEmail={user?.email ?? null}
      isAuthenticated={isAuthenticated}
      locale={locale}
      mercureStatus={status}
      onToggleLocale={() => setLocale(locale === "fr" ? "en" : "fr")}
      cookieBannerVisible={hydrated && consent === null}
      onAcceptCookies={() => setConsent("accepted")}
      onDeclineCookies={() => setConsent("declined")}
      navigationItems={[...shellNavigationItems]}
      loginHref="/login"
      logoutAction="/api/auth/logout"
      localeToggleLabel={locale === "fr" ? "Changer la langue en anglais" : "Switch language to French"}
      pwaBanner={
        <PwaInstallBanner
          canInstall={canInstall}
          dismissed={dismissed}
          onInstall={promptInstall}
          onDismiss={dismissPrompt}
        />
      }
    >
      {children}
    </AppShellFrame>
  );
}
