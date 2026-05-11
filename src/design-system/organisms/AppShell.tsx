"use client";

import type { Route } from "next";
import Link from "next/link";
import { Notice } from "@/design-system/molecules/Notice";
import { Button, ButtonLink } from "@/design-system/primitives/atoms/Button";

type AppShellNavItem = {
  href: Route;
  label: string;
};

export function AppShellFrame({
  children,
  userEmail,
  isAuthenticated,
  locale,
  mercureStatus,
  onToggleLocale,
  cookieBannerVisible,
  onAcceptCookies,
  onDeclineCookies,
  pwaBanner,
  navigationItems,
  loginHref,
  logoutAction,
  brandHref = "/",
  brandLabel = "App Front",
  localeToggleLabel,
}: {
  children: React.ReactNode;
  userEmail: string | null;
  isAuthenticated: boolean;
  locale: string;
  mercureStatus: string;
  onToggleLocale: () => void;
  cookieBannerVisible: boolean;
  onAcceptCookies: () => void;
  onDeclineCookies: () => void;
  pwaBanner?: React.ReactNode;
  navigationItems: AppShellNavItem[];
  loginHref: Route;
  logoutAction: string;
  brandHref?: Route;
  brandLabel?: string;
  localeToggleLabel: string;
}) {
  return (
    <>
      <header style={headerStyle}>
        <Link href={brandHref} style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>
          {brandLabel}
        </Link>
        <nav style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap" }}>
          {navigationItems.map((item) => (
            <ButtonLink key={item.href} href={item.href} tone="ghost">
              {item.label}
            </ButtonLink>
          ))}
          <button
            type="button"
            onClick={onToggleLocale}
            className="ui-ghost-toggle ui-focus-ring"
            style={ghostButtonStyle}
            aria-label={localeToggleLabel}
          >
            {locale.toUpperCase()}
          </button>
          {isAuthenticated ? (
            <>
              <span style={{ color: "var(--text-muted)", fontSize: ".92rem" }}>{userEmail}</span>
              <form action={logoutAction} method="post">
                <Button tone="secondary" type="submit">
                  Déconnexion
                </Button>
              </form>
            </>
          ) : (
            <ButtonLink href={loginHref} tone="secondary">
              Connexion
            </ButtonLink>
          )}
        </nav>
      </header>

      <div style={{ width: "min(var(--container), calc(100% - 2rem))", margin: "1rem auto 0" }}>
        <Notice>
          SSR auth actif, locale persistée, consentement cookies côté client, Mercure: <strong>{mercureStatus}</strong>
        </Notice>
      </div>

      {pwaBanner}

      <main>{children}</main>

      {cookieBannerVisible ? (
        <div style={cookieBannerStyle}>
          <span>Cette base inclut une bannière cookies simple pour analytics et tags futurs.</span>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            <Button onClick={onAcceptCookies}>Accepter</Button>
            <Button tone="secondary" onClick={onDeclineCookies}>
              Refuser
            </Button>
          </div>
        </div>
      ) : null}

      <footer style={footerStyle}>
        <span>Frontend générique, neutralisé et dockerisé.</span>
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
  borderRadius: "var(--radius-pill)",
  background: "transparent",
  padding: "var(--button-padding-compact)",
  cursor: "pointer",
  color: "var(--text)",
};
