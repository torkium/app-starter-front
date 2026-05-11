"use client";

import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type ButtonTone = "primary" | "secondary" | "ghost";

const baseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: ".5rem",
  borderRadius: "999px",
  padding: ".85rem 1.25rem",
  border: "1px solid transparent",
  fontWeight: 600,
  transition: ".2s ease",
  cursor: "pointer",
};

function getToneStyle(tone: ButtonTone = "primary"): React.CSSProperties {
  if (tone === "secondary") {
    return {
      background: "var(--surface)",
      color: "var(--text)",
      borderColor: "var(--border)",
    };
  }
  if (tone === "ghost") {
    return {
      background: "transparent",
      color: "var(--text)",
      borderColor: "var(--border)",
    };
  }
  return {
    background: "var(--primary)",
    color: "white",
  };
}

export function Button({
  children,
  tone = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone }) {
  return (
    <button {...props} style={{ ...baseStyle, ...getToneStyle(tone), ...props.style }}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  href: Route;
  tone?: ButtonTone;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(className)}
      style={{ ...baseStyle, ...getToneStyle(tone) }}
    >
      {children}
    </Link>
  );
}
