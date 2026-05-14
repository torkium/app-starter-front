"use client";

import { Badge } from "@/design-system/primitives/atoms/Badge";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Card } from "@/design-system/molecules/Card";

export type SummaryCardMetric = {
  label: React.ReactNode;
  value: React.ReactNode;
};

export type SummaryCardProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  tags?: React.ReactNode[];
  meta?: React.ReactNode[];
  metrics?: SummaryCardMetric[];
  actionLabel?: React.ReactNode;
  onAction?: () => void;
  actions?: React.ReactNode;
};

export function SummaryCard({
  title,
  description,
  imageSrc,
  imageAlt = "",
  tags = [],
  meta = [],
  metrics = [],
  actionLabel = "Ouvrir",
  onAction,
  actions,
}: SummaryCardProps) {
  const media = imageSrc ? (
    <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", borderRadius: "var(--radius-md) var(--radius-md) 0 0", background: "var(--primary-soft)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Summary media can come from product-managed URLs outside next/image remotePatterns. */}
      <img src={imageSrc} alt={imageAlt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {tags.length > 0 ? <TagRow tags={tags.slice(0, 3)} overlay /> : null}
      {actions ? (
        <div style={{ position: "absolute", top: ".75rem", right: ".75rem", display: "flex", gap: ".4rem", flexWrap: "wrap", justifyContent: "end" }}>
          {actions}
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <Card media={media} padding="lg">
      <div style={{ display: "grid", gap: ".9rem" }}>
        {!imageSrc && tags.length > 0 ? <TagRow tags={tags.slice(0, 4)} /> : null}
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: ".75rem", flexWrap: "wrap" }}>
          <div style={{ minWidth: 0, flex: "1 1 12rem" }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.2rem", lineHeight: 1.15, overflowWrap: "anywhere" }}>{title}</h3>
            {description ? <p style={{ margin: ".5rem 0 0", color: "var(--text-muted)", lineHeight: 1.45, overflowWrap: "anywhere" }}>{description}</p> : null}
          </div>
          {!imageSrc && actions ? <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", justifyContent: "end" }}>{actions}</div> : null}
        </div>
        {meta.length > 0 ? (
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", color: "var(--text-muted)", fontSize: ".86rem" }}>
            {meta.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        ) : null}
        {metrics.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(4.75rem, 1fr))", gap: ".5rem", textAlign: "center" }}>
            {metrics.map((metric, index) => (
              <div key={index} style={{ borderRadius: "var(--radius-sm)", background: "rgba(23, 32, 51, 0.06)", padding: ".65rem .45rem" }}>
                <div style={{ color: "var(--primary-strong)", fontFamily: "var(--font-display)", fontSize: "1rem", lineHeight: 1 }}>{metric.value}</div>
                <div style={{ marginTop: ".25rem", color: "var(--text-muted)", fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase" }}>{metric.label}</div>
              </div>
            ))}
          </div>
        ) : null}
        {onAction ? (
          <Button type="button" tone="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function TagRow({ tags, overlay = false }: { tags: React.ReactNode[]; overlay?: boolean }) {
  return (
    <div
      style={{
        position: overlay ? "absolute" : undefined,
        top: overlay ? ".75rem" : undefined,
        left: overlay ? ".75rem" : undefined,
        right: overlay ? ".75rem" : undefined,
        display: "flex",
        gap: ".4rem",
        flexWrap: "wrap",
      }}
    >
      {tags.map((tag, index) => (
        <Badge key={index} tone={overlay ? "neutral" : "primary"} style={overlay ? { background: "rgba(255, 255, 255, 0.86)", color: "var(--text)" } : undefined}>
          {tag}
        </Badge>
      ))}
    </div>
  );
}
