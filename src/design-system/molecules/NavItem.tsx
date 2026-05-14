"use client";

import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type CommonItemProps = {
  label: React.ReactNode;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

type InternalNavItemProps = CommonItemProps & {
  href: Route;
  external?: false;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type ExternalNavItemProps = CommonItemProps & {
  href: string;
  external: true;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type ButtonNavItemProps = CommonItemProps & {
  href?: never;
  external?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type NavItemProps = InternalNavItemProps | ExternalNavItemProps | ButtonNavItemProps;

export type ListItemProps = CommonItemProps & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const itemStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: ".75rem",
  border: "1px solid transparent",
  borderRadius: "var(--radius-sm)",
  padding: ".75rem",
  color: "var(--text)",
  textAlign: "left",
  textDecoration: "none",
};

export function NavItem({ active = false, disabled = false, className, style, ...props }: NavItemProps) {
  const mergedStyle = getMergedStyle(active, disabled, style);

  if ("href" in props && props.href) {
    const { href, external, onClick, ...contentProps } = props;
    if (external) {
      return (
        <a
          href={href}
          aria-current={active ? "page" : undefined}
          aria-disabled={disabled || undefined}
          className={cn("ui-focus-ring", className)}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }

            onClick?.(event);
          }}
          style={mergedStyle}
          tabIndex={disabled ? -1 : undefined}
        >
          <ItemContent {...contentProps} active={active} />
        </a>
      );
    }

    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        className={cn("ui-focus-ring", className)}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
        style={mergedStyle}
        tabIndex={disabled ? -1 : undefined}
      >
        <ItemContent {...contentProps} active={active} />
      </Link>
    );
  }

  const { onClick, ...contentProps } = props;
  const buttonOnClick = onClick as React.MouseEventHandler<HTMLButtonElement> | undefined;

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      className={cn("ui-focus-ring", className)}
      onClick={buttonOnClick}
      style={{ ...mergedStyle, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <ItemContent {...contentProps} active={active} />
    </button>
  );
}

export function ListItem({ onClick, active = false, disabled = false, className, style, ...props }: ListItemProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      className={cn("ui-focus-ring", className)}
      onClick={onClick}
      style={{ ...getMergedStyle(active, disabled, style), cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <ItemContent {...props} active={active} />
    </button>
  );
}

function getMergedStyle(active: boolean, disabled: boolean, style?: React.CSSProperties): React.CSSProperties {
  return {
    ...itemStyle,
    background: active ? "var(--primary-soft)" : "transparent",
    borderColor: active ? "var(--border-strong)" : "transparent",
    opacity: disabled ? 0.58 : undefined,
    ...style,
  };
}

function ItemContent({ label, description, leading, trailing, active }: CommonItemProps) {
  return (
    <>
      {leading ? <span aria-hidden="true" style={{ flex: "0 0 auto", color: active ? "var(--primary-strong)" : "var(--text-muted)" }}>{leading}</span> : null}
      <span style={{ display: "grid", gap: ".15rem", minWidth: 0, flex: "1 1 auto" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: active ? 700 : 600 }}>{label}</span>
        {description ? <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: ".84rem" }}>{description}</span> : null}
      </span>
      {trailing ? <span style={{ flex: "0 0 auto", color: "var(--text-muted)", fontSize: ".84rem" }}>{trailing}</span> : null}
    </>
  );
}
