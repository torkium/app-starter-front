type NoticeTone = "info" | "success" | "warning" | "danger";

export function Notice({
  tone = "info",
  title,
  action,
  icon,
  live,
  children,
}: {
  tone?: NoticeTone;
  title?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  live?: boolean;
  children: React.ReactNode;
}) {
  const toneMap = {
    info: { background: "var(--notice-info-background)", color: "var(--text)", role: "status", live: "polite" },
    success: { background: "var(--notice-success-background)", color: "var(--success)", role: "status", live: "polite" },
    warning: { background: "var(--notice-warning-background)", color: "var(--warning)", role: "alert", live: "assertive" },
    danger: { background: "var(--notice-danger-background)", color: "var(--danger)", role: "alert", live: "assertive" },
  } as const;
  const semantics = toneMap[tone];
  const liveRole = live === false ? undefined : semantics.role;

  return (
    <div
      role={liveRole}
      aria-live={live === false ? undefined : semantics.live}
      style={{
        background: semantics.background,
        color: semantics.color,
        padding: ".85rem 1rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "start",
        gap: ".75rem",
        flexWrap: "wrap",
      }}
    >
      {icon ? <span aria-hidden="true" style={{ flex: "0 0 auto", lineHeight: 1.4 }}>{icon}</span> : null}
      <div style={{ display: "grid", gap: title ? ".25rem" : 0, minWidth: 0, flex: "1 1 auto" }}>
        {title ? <strong style={{ color: "var(--text)" }}>{title}</strong> : null}
        <div style={{ color: title ? "var(--text)" : semantics.color, lineHeight: 1.45 }}>{children}</div>
      </div>
      {action ? <div style={{ flex: "1 1 auto", display: "flex", justifyContent: "end", minWidth: "10rem" }}>{action}</div> : null}
    </div>
  );
}
