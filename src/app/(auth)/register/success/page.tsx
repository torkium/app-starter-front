import Link from "next/link";
import { FormCard } from "@/design-system/molecules/FormCard";

export default function RegisterSuccessPage() {
  return (
    <FormCard
      title="Inscription enregistrée"
      description="Le backend peut maintenant envoyer un email de confirmation à l'utilisateur."
      footer={<Link href="/login">Retour à la connexion</Link>}
    >
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        Branchez ici votre wording produit, votre tracking d’inscription et vos variantes d’onboarding.
      </p>
    </FormCard>
  );
}
