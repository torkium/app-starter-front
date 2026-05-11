export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: ".9rem 1rem",
        background: "rgba(255,255,255,0.9)",
        color: "var(--text)",
      }}
    />
  );
}
