"use client";

import type { Route } from "next";
import Link from "next/link";
import { NavItem } from "@/design-system/molecules/NavItem";

export type SidebarShellNavItem = {
  id?: string;
  href: Route;
  label: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  trailing?: React.ReactNode;
};

export type SidebarShellProps = {
  brandHref?: Route;
  brandLabel?: React.ReactNode;
  productLabel?: React.ReactNode;
  brandIcon?: React.ReactNode;
  navigationItems: SidebarShellNavItem[];
  children: React.ReactNode;
  aside?: React.ReactNode;
};

export function SidebarShell({
  brandHref = "/",
  brandLabel = "My App",
  productLabel = "Workspace",
  brandIcon,
  navigationItems,
  children,
  aside,
}: SidebarShellProps) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--text)" }}>
      <a className="ui-skip-link" href="#main-content">
        Aller au contenu
      </a>
      <div className="ui-sidebar-shell">
        <aside
          className="ui-sidebar-shell__aside"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            borderRight: "1px solid var(--border)",
            background: "var(--surface-strong)",
            padding: "1.75rem 1.25rem",
          }}
        >
          <Link href={brandHref} style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <span
              aria-hidden="true"
              style={{
                display: "grid",
                width: "2.25rem",
                height: "2.25rem",
                placeItems: "center",
                borderRadius: "var(--radius-md)",
                background: "var(--primary)",
                color: "var(--primary-contrast)",
                fontWeight: 700,
              }}
            >
              {brandIcon ?? "A"}
            </span>
            <span style={{ display: "grid", lineHeight: 1.1 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.12rem", fontWeight: 700 }}>{brandLabel}</span>
              <span style={{ color: "var(--text-muted)", fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase" }}>{productLabel}</span>
            </span>
          </Link>

          <nav className="ui-sidebar-shell__nav" aria-label="Navigation principale">
            {navigationItems.map((item, index) => (
              <NavItem
                key={item.id ?? `${item.href}-${index}`}
                href={item.href}
                active={item.active}
                label={item.label}
                leading={item.icon}
                trailing={item.trailing}
              />
            ))}
          </nav>

          {aside ? <div style={{ marginTop: "auto" }}>{aside}</div> : null}
        </aside>
        <main id="main-content" className="ui-sidebar-shell__main" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
