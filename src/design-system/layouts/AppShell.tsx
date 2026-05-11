"use client";

import Link from "next/link";
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { useConsent } from "@/infrastructure/consent/ConsentContext";
import { useI18n } from "@/infrastructure/i18n/I18nContext";
import { useMercure } from "@/infrastructure/mercure/MercureProvider";
import { usePwa } from "@/infrastructure/pwa/PwaContext";
import { PwaInstallBanner } from "@/infrastructure/pwa/components/PwaInstallBanner";
import { Button, ButtonLink } from "@/design-system/components/Button";
import { Notice } from "@/design-system/components/Notice";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { locale, setLocale } = useI18n();
  const { consent, hydrated, setConsent } = useConsent();
  const { canInstall, dismissed, promptInstall, dismissPrompt } = usePwa();
  const { status } = useMercure();

  return (
    <>
      <header style={headerStyle}>
        <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>
          Starter Front
        </Link>
        <nav style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap" }}>
          <ButtonLink href="/dashboard" tone="ghost">
            Dashboard
          </ButtonLink>
          <ButtonLink href="/billing" tone="ghost">
            Billing
          </ButtonLink>
          <ButtonLink href="/media" tone="ghost">
            Media
          </ButtonLink>
          <ButtonLink href="/account" tone="ghost">
            Compte
          </ButtonLink>
          <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            style={ghostButtonStyle}
          >
            {locale.toUpperCase()}
          </button>
          {isAuthenticated ? (
            <>
              <span style={{ color: "var(--text-muted)", fontSize: ".92rem" }}>{user?.email}</span>
              <form action="/api/auth/logout" method="post">
                <Button tone="secondary" type="submit">
                  Déconnexion
                </Button>
              </form>
            </>
          ) : (
            <ButtonLink href="/login" tone="secondary">
              Connexion
            </ButtonLink>
          )}
        </nav>
      </header>

      <div style={{ width: "min(var(--container), calc(100% - 2rem))", margin: "1rem auto 0" }}>
        <Notice>
          SSR auth actif, locale persistée, consentement cookies côté client, Mercure: <strong>{status}</strong>
        </Notice>
      </div>

      <PwaInstallBanner
        canInstall={canInstall}
        dismissed={dismissed}
        onInstall={promptInstall}
        onDismiss={dismissPrompt}
      />

      <main>{children}</main>

      {hydrated && consent === null ? (
        <div style={cookieBannerStyle}>
          <span>Ce starter inclut une bannière cookies simple pour analytics et tags futurs.</span>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            <Button onClick={() => setConsent("accepted")}>Accepter</Button>
            <Button tone="secondary" onClick={() => setConsent("declined")}>
              Refuser
            </Button>
          </div>
        </div>
      ) : null}

      <footer style={footerStyle}>
        <span>Starter frontend générique, neutralisé, dockerisé.</span>
      </footer>
    </>
  );
}

const headerStyle: React.CSSProperties = {
  width: "min(var(--container), calc(100% - 2rem))",
  margin: "0 auto",
  padding: "1rem 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
};

const footerStyle: React.CSSProperties = {
  width: "min(var(--container), calc(100% - 2rem))",
  margin: "4rem auto 2rem",
  color: "var(--text-muted)",
  fontSize: ".92rem",
};

const cookieBannerStyle: React.CSSProperties = {
  position: "fixed",
  left: "1rem",
  right: "1rem",
  bottom: "1rem",
  background: "rgba(23, 32, 51, 0.96)",
  color: "white",
  borderRadius: "var(--radius-md)",
  padding: "1rem 1.25rem",
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  alignItems: "center",
  flexWrap: "wrap",
  zIndex: 20,
};

const ghostButtonStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "999px",
  background: "transparent",
  padding: ".65rem .9rem",
  cursor: "pointer",
};
