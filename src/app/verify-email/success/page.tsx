import Link from "next/link";
import { FormCard } from "@/design-system/components/FormCard";

export default function VerifyEmailSuccessPage() {
  return (
    <FormCard
      title="Email confirmé"
      description="Le compte peut maintenant accéder aux parties réservées."
      footer={<Link href="/dashboard">Accéder au dashboard</Link>}
    >
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        Utilisez cette étape pour afficher un onboarding ou un rappel d’abonnement.
      </p>
    </FormCard>
  );
}
