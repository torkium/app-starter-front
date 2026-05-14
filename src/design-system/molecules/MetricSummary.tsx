import { Card } from "@/design-system/molecules/Card";

export type MetricTone = "primary" | "success" | "warning" | "danger" | "neutral";

const toneColor: Record<MetricTone, string> = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  neutral: "var(--text-muted)",
};

export type MetricProps = {
  label: React.ReactNode;
  value: number;
  max?: number;
  unit?: string;
  tone?: MetricTone;
  color?: string;
  helperText?: React.ReactNode;
};

export type RadialMetricProps = MetricProps & {
  size?: number;
  stroke?: number;
  progressLabel?: string;
};

export type MetricSummaryItem = MetricProps & {
  key: string;
};

export function Metric({
  label,
  value,
  max,
  unit = "",
  tone = "primary",
  color,
  helperText,
}: MetricProps) {
  const percentage = max && max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : undefined;
  const accent = color ?? toneColor[tone];

  return (
    <div style={{ display: "grid", gap: ".55rem", minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".75rem", alignItems: "baseline" }}>
        <span style={{ color: "var(--text-muted)", fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
        <strong style={{ color: accent, fontFamily: "var(--font-display)", fontSize: "1.15rem", lineHeight: 1 }}>
          {value}
          {unit}
        </strong>
      </div>
      {percentage !== undefined ? (
        <div aria-hidden="true" style={{ height: ".45rem", overflow: "hidden", borderRadius: "var(--radius-pill)", background: "var(--surface-subtle)" }}>
          <div style={{ width: `${percentage}%`, height: "100%", borderRadius: "inherit", background: accent }} />
        </div>
      ) : null}
      {helperText ? <span style={{ color: "var(--text-muted)", fontSize: ".82rem" }}>{helperText}</span> : null}
    </div>
  );
}

export function RadialMetric({
  label,
  value,
  max = 100,
  unit = "",
  tone = "primary",
  color,
  helperText,
  size = 136,
  stroke = 12,
  progressLabel,
}: RadialMetricProps) {
  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(safeMax, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const accent = color ?? toneColor[tone];
  const dashOffset = circumference * (1 - clampedValue / safeMax);

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: ".65rem", minWidth: 0 }}>
      <div
        role="progressbar"
        aria-label={progressLabel ?? (typeof label === "string" ? label : "Metric progress")}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={Math.round(clampedValue)}
        style={{ position: "relative", width: "100%", maxWidth: `${size}px`, aspectRatio: "1 / 1" }}
      >
        <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-subtle)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={accent}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
          <div>
            <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "1.35rem", lineHeight: 1 }}>
              {value}
            </strong>
            <span style={{ color: "var(--text-muted)", fontSize: ".72rem" }}>
              / {safeMax}{unit}
            </span>
          </div>
        </div>
      </div>
      <span style={{ color: "var(--text-muted)", fontSize: ".78rem", fontWeight: 700, textAlign: "center", textTransform: "uppercase" }}>{label}</span>
      {helperText ? <span style={{ color: "var(--text-muted)", fontSize: ".82rem", textAlign: "center" }}>{helperText}</span> : null}
    </div>
  );
}

export function MetricSummary({
  title = "Overview",
  description,
  items,
  variant = "linear",
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: MetricSummaryItem[];
  variant?: "linear" | "radial";
}) {
  return (
    <Card title={title} description={description}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))", gap: "1rem" }}>
        {items.map(({ key, ...item }) => (
          variant === "radial" ? <RadialMetric key={key} {...item} /> : <Metric key={key} {...item} />
        ))}
      </div>
    </Card>
  );
}
