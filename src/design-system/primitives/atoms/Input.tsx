import { cn } from "@/shared/utils/cn";

export function Input({ className, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn("ui-input", "ui-focus-ring", className)}
      style={{
        width: "100%",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
        padding: "var(--input-padding)",
        background: "var(--input-background)",
        color: "var(--text)",
        ...style,
      }}
    />
  );
}
