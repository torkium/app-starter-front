import { Card } from "@/design-system/molecules/Card";

type StatCardTone = "default" | "accent" | "success" | "warning" | "danger";

const trendColors: Record<Exclude<StatCardTone, "default" | "accent">, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export type StatCardProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  trend?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: StatCardTone;
};

export function StatCard({
  label,
  value,
  description,
  trend,
  icon,
  footer,
  tone = "default",
}: StatCardProps) {
  const trendColor = tone === "success" || tone === "warning" || tone === "danger" ? trendColors[tone] : "var(--primary-strong)";

  return (
    <Card tone={tone === "accent" ? "accent" : "default"} padding="lg" footer={footer}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start" }}>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase" }}>{label}</p>
          {icon ? (
            <span aria-hidden="true" style={{ color: "var(--primary-strong)", flex: "0 0 auto" }}>
              {icon}
            </span>
          ) : null}
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.1rem", lineHeight: 1 }}>{value}</div>
          {description ? <p style={{ margin: ".55rem 0 0", color: "var(--text-muted)", lineHeight: 1.45 }}>{description}</p> : null}
        </div>
        {trend ? <div style={{ color: trendColor, fontSize: ".92rem", fontWeight: 700 }}>{trend}</div> : null}
      </div>
    </Card>
  );
}
