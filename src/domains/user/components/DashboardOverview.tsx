"use client";

import { Card } from "@/design-system/molecules/Card";
import { Section } from "@/design-system/organisms/Section";
import { PushNotificationsCard } from "@/infrastructure/pwa/components/PushNotificationsCard";
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { usePwa } from "@/infrastructure/pwa/PwaContext";

export function DashboardOverview() {
  const { user } = useAuth();
  const { swRegistration, isInstalled } = usePwa();

  return (
    <Section
      eyebrow="Tableau de bord"
      title="Bienvenue dans votre espace My App."
      description="Votre espace applicatif prendra forme ici avec vos contenus, vos données et vos objectifs."
      titleAs="h1"
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
