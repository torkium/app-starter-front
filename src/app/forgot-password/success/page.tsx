import Link from "next/link";
import { FormCard } from "@/design-system/components/FormCard";

export default function ForgotPasswordSuccessPage() {
  return (
    <FormCard
      title="Demande envoyée"
      description="Si l'email existe, un lien de réinitialisation a été demandé."
      footer={<Link href="/login">Retour à la connexion</Link>}
    >
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        Ce pattern évite d’exposer l’existence d’un compte à travers la réponse UI.
      </p>
    </FormCard>
  );
}
