import Link from "next/link";
import { FormCard } from "@/design-system/molecules/FormCard";

export default function RegisterSuccessPage() {
  return (
    <FormCard
      title="Inscription enregistrée"
      description="Si votre email est valide, vous recevrez un message de confirmation pour activer votre accès."
      footer={<Link href="/login">Retour à la connexion</Link>}
    >
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        Ouvrez le message reçu et validez votre adresse pour pouvoir vous connecter.
      </p>
    </FormCard>
  );
}
