export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const toneMap = {
    info: { background: "var(--notice-info-background)", color: "var(--text)", role: "status", live: "polite" },
    success: { background: "var(--notice-success-background)", color: "var(--success)", role: "status", live: "polite" },
    warning: { background: "var(--notice-warning-background)", color: "var(--warning)", role: "alert", live: "assertive" },
    danger: { background: "var(--notice-danger-background)", color: "var(--danger)", role: "alert", live: "assertive" },
  } as const;
  const semantics = toneMap[tone];

  return (
    <div
      role={semantics.role}
      aria-live={semantics.live}
      style={{
        background: semantics.background,
        color: semantics.color,
        padding: ".85rem 1rem",
        borderRadius: "14px",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}
