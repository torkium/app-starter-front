import { Card } from "@/design-system/molecules/Card";

export function EmptyState({
  title,
  description,
  action,
  secondaryAction,
  icon,
  compact = false,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  icon?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div style={{ maxWidth: compact ? "480px" : "640px", margin: compact ? "0 auto" : "4rem auto", padding: "0 1rem" }}>
      <Card>
        <div style={{ display: "grid", justifyItems: "center", gap: ".85rem", textAlign: "center", padding: compact ? ".5rem" : "1.75rem .5rem" }}>
          {icon ? (
            <div style={{ display: "grid", placeItems: "center", width: "3rem", height: "3rem", borderRadius: "var(--radius-pill)", background: "var(--primary-soft)", color: "var(--primary-strong)" }}>
              {icon}
            </div>
          ) : null}
          <div>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: compact ? "1.35rem" : "1.8rem", lineHeight: 1.1 }}>{title}</h2>
            {description ? <p style={{ margin: ".65rem 0 0", color: "var(--text-muted)", lineHeight: 1.5 }}>{description}</p> : null}
          </div>
          {action || secondaryAction ? (
            <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap", marginTop: ".35rem" }}>
              {action}
              {secondaryAction}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
