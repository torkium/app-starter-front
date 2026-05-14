import { cn } from "@/shared/utils/cn";

type CardTone = "default" | "accent" | "success" | "warning" | "danger";
type CardPadding = "none" | "sm" | "md" | "lg";

const toneStyles: Record<CardTone, React.CSSProperties> = {
  default: {},
  accent: { background: "linear-gradient(135deg, var(--surface-strong), var(--primary-soft))" },
  success: { borderColor: "rgba(2, 122, 72, 0.28)" },
  warning: { borderColor: "rgba(181, 71, 8, 0.3)" },
  danger: { borderColor: "rgba(180, 35, 24, 0.28)" },
};

const paddingStyles: Record<CardPadding, string> = {
  none: "0",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
};

export type CardProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  media?: React.ReactNode;
  tone?: CardTone;
  padding?: CardPadding;
  selected?: boolean;
};

export function Card({
  title,
  eyebrow,
  description,
  actions,
  footer,
  media,
  children,
  tone = "default",
  padding = "md",
  selected = false,
  className,
  style,
  ...props
}: CardProps) {
  const hasHeader = eyebrow || title || description || actions;

  return (
    <article
      {...props}
      className={cn("ui-card", className)}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: paddingStyles[padding],
        boxShadow: "var(--shadow)",
        backdropFilter: "blur(16px)",
        display: "grid",
        gap: children || footer ? "1rem" : 0,
        minWidth: 0,
        outline: selected ? "3px solid var(--focus-ring)" : undefined,
        outlineOffset: selected ? "2px" : undefined,
        ...toneStyles[tone],
        ...style,
      }}
    >
      {media ? (
        <div style={{ margin: padding === "none" ? 0 : `-${paddingStyles[padding]} -${paddingStyles[padding]} 0` }}>
          {media}
        </div>
      ) : null}
      {hasHeader ? (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap", minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            {eyebrow ? (
              <p style={{ margin: "0 0 .35rem", color: "var(--primary-strong)", fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase" }}>
                {eyebrow}
              </p>
            ) : null}
            {title ? <h3 style={{ margin: 0, fontFamily: "var(--font-display)", lineHeight: 1.15, overflowWrap: "anywhere" }}>{title}</h3> : null}
            {description ? <p style={{ margin: title ? ".5rem 0 0" : 0, color: "var(--text-muted)", lineHeight: 1.5, overflowWrap: "anywhere" }}>{description}</p> : null}
          </div>
          {actions ? <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "end" }}>{actions}</div> : null}
        </div>
      ) : null}
      {children ? <div style={{ minWidth: 0 }}>{children}</div> : null}
      {footer ? (
        <div style={{ borderTop: children ? "1px solid var(--border)" : undefined, paddingTop: children ? "1rem" : undefined, color: "var(--primary-strong)", fontWeight: 600 }}>
          {footer}
        </div>
      ) : null}
    </article>
  );
}
