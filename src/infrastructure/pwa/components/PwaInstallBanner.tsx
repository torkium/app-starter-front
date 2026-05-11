"use client";

import { Button } from "@/design-system/primitives/atoms/Button";

export function PwaInstallBanner({
  canInstall,
  dismissed,
  onInstall,
  onDismiss,
}: {
  canInstall: boolean;
  dismissed: boolean;
  onInstall: () => Promise<void>;
  onDismiss: () => void;
}) {
  if (!canInstall || dismissed) {
    return null;
  }

  return (
    <div style={bannerStyle}>
      <div style={{ display: "grid", gap: ".3rem" }}>
        <strong>Application installable</strong>
        <span style={{ color: "var(--text-muted)" }}>
          Le starter embarque un shell PWA réutilisable avec service worker, onboarding et point d’entrée push.
        </span>
      </div>
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        <Button onClick={() => void onInstall()}>Installer</Button>
        <Button tone="ghost" onClick={onDismiss}>
          Plus tard
        </Button>
      </div>
    </div>
  );
}

const bannerStyle: React.CSSProperties = {
  width: "min(var(--container), calc(100% - 2rem))",
  margin: "1rem auto 0",
  background: "var(--surface-strong)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  padding: "1rem 1.25rem",
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  alignItems: "center",
  flexWrap: "wrap",
  boxShadow: "var(--shadow)",
};
