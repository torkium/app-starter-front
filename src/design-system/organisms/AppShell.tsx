"use client";

import type { Route } from "next";
import Link from "next/link";
import { Notice } from "@/design-system/molecules/Notice";
import { Button } from "@/design-system/primitives/atoms/Button";
import { ButtonLink } from "@/design-system/primitives/atoms/ButtonLink";

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
  brandLabel = "My App",
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
          {isAuthenticated
            ? navigationItems.map((item) => (
                <ButtonLink key={item.href} href={item.href} tone="ghost">
                  {item.label}
                </ButtonLink>
              ))
            : null}
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
          Espace sécurisé, préférences synchronisées, temps réel: <strong>{mercureStatus}</strong>
        </Notice>
      </div>

      {pwaBanner}

      <main>{children}</main>

      {cookieBannerVisible ? (
        <div style={cookieOverlayStyle} role="presentation">
          <div style={cookieBannerStyle} role="region" aria-label="Préférences cookies">
            <div style={{ display: "grid", gap: ".25rem", minWidth: 0 }}>
              <strong>Préférences cookies</strong>
              <span style={{ color: "var(--auth-muted)" }}>My App utilise les cookies nécessaires au fonctionnement du compte et aux préférences.</span>
            </div>
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <Button onClick={onAcceptCookies}>Accepter</Button>
              <Button tone="secondary" onClick={onDeclineCookies}>
                Refuser
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <footer style={footerStyle}>
        <span>My App © 2026</span>
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

const cookieOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(24, 35, 29, 0.18)",
  zIndex: 60,
};

const cookieBannerStyle: React.CSSProperties = {
  position: "absolute",
  left: "max(1rem, env(safe-area-inset-left))",
  right: "max(1rem, env(safe-area-inset-right))",
  bottom: "max(1rem, env(safe-area-inset-bottom))",
  border: "1px solid rgba(255, 253, 248, 0.18)",
  borderRadius: "var(--radius-md)",
  background: "rgba(24, 35, 29, 0.96)",
  color: "var(--text-inverse)",
  boxShadow: "var(--shadow-lg)",
  padding: "1rem 1.25rem",
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  alignItems: "center",
  flexWrap: "wrap",
};

const ghostButtonStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-pill)",
  background: "transparent",
  padding: "var(--button-padding-compact)",
  cursor: "pointer",
  color: "var(--text)",
};
