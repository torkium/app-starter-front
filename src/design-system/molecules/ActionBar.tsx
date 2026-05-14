export type ActionBarProps = {
  leading?: React.ReactNode;
  children?: React.ReactNode;
  trailing?: React.ReactNode;
  sticky?: boolean;
};

export function ActionBar({ leading, children, trailing, sticky = false }: ActionBarProps) {
  return (
    <div
      style={{
        position: sticky ? "sticky" : undefined,
        bottom: sticky ? "1rem" : undefined,
        zIndex: sticky ? 10 : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        background: "var(--surface)",
        boxShadow: sticky ? "var(--shadow)" : undefined,
        padding: ".85rem",
        backdropFilter: "blur(16px)",
      }}
    >
      {leading ? <div style={{ minWidth: 0, color: "var(--text-muted)", fontSize: ".92rem" }}>{leading}</div> : null}
      <div style={{ display: "flex", gap: ".65rem", alignItems: "center", flexWrap: "wrap", marginLeft: leading ? "auto" : undefined }}>{children}</div>
      {trailing ? <div style={{ display: "flex", gap: ".65rem", alignItems: "center", flexWrap: "wrap" }}>{trailing}</div> : null}
    </div>
  );
}
