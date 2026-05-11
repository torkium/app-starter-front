"use client";

import { Card } from "@/design-system/components/Card";
import { Section } from "@/design-system/layouts/Section";
import { PushNotificationsCard } from "@/infrastructure/pwa/components/PushNotificationsCard";
import { usePwa } from "@/infrastructure/pwa/PwaContext";
import type { AuthenticatedUser } from "@/shared/types/auth";

export function DashboardOverview({ user }: { user: AuthenticatedUser | null }) {
  const { swRegistration, isInstalled } = usePwa();

  return (
    <Section
      eyebrow="Dashboard"
      title="Zone privée minimale."
      description="La route est protégée par le proxy et le layout SSR hydrate déjà le contexte utilisateur."
    >
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Card title="Utilisateur" description={user?.email ?? "Aucun utilisateur chargé"} />
        <Card title="Email vérifié" description={user?.emailVerified ? "Oui" : "Non"} />
        <Card title="Rôles" description={user?.roles.join(", ") ?? "Aucun rôle"} />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <PushNotificationsCard registration={swRegistration} isInstalled={isInstalled} />
      </div>
    </Section>
  );
}
