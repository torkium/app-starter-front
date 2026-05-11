export function Section({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section style={{ width: "min(var(--container), calc(100% - 2rem))", margin: "0 auto", padding: "2rem 0" }}>
      {eyebrow ? <p style={{ color: "var(--primary-strong)", fontWeight: 700, marginBottom: ".5rem" }}>{eyebrow}</p> : null}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              lineHeight: 1,
            }}
          >
            {title}
          </h1>
          {description ? <p style={{ marginBottom: 0, color: "var(--text-muted)", fontSize: "1.05rem" }}>{description}</p> : null}
        </div>
        {actions ? <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
