export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: ".45rem" }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      {children}
      {hint ? <span style={{ color: "var(--text-muted)", fontSize: ".92rem" }}>{hint}</span> : null}
      {error ? <span style={{ color: "var(--danger)", fontSize: ".92rem" }}>{error}</span> : null}
    </label>
  );
}
