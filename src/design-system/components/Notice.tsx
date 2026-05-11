export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const toneMap = {
    info: { background: "rgba(15, 118, 110, 0.08)", color: "var(--text)" },
    success: { background: "rgba(2, 122, 72, 0.12)", color: "var(--success)" },
    warning: { background: "rgba(181, 71, 8, 0.12)", color: "var(--warning)" },
    danger: { background: "rgba(180, 35, 24, 0.1)", color: "var(--danger)" },
  } as const;

  return (
    <div
      style={{
        ...toneMap[tone],
        padding: ".85rem 1rem",
        borderRadius: "14px",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}
