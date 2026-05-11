export function Card({
  title,
  description,
  footer,
  children,
}: {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <article
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "1.25rem",
        boxShadow: "var(--shadow)",
        backdropFilter: "blur(16px)",
      }}
    >
      {title ? <h3 style={{ marginTop: 0, marginBottom: ".5rem" }}>{title}</h3> : null}
      {description ? <p style={{ marginTop: 0, color: "var(--text-muted)" }}>{description}</p> : null}
      {children}
      {footer ? <div style={{ marginTop: "1rem", color: "var(--primary-strong)", fontWeight: 600 }}>{footer}</div> : null}
    </article>
  );
}
