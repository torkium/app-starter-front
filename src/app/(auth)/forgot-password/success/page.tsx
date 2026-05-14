import Link from "next/link";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";

export default function ForgotPasswordSuccessPage() {
  return (
    <AuthPanel
      title="Demande envoyée"
      description="Si un compte existe pour cet email, vous recevrez un lien de réinitialisation."
      footer={<Link href="/login">Retour à la connexion</Link>}
    >
      <p className="ui-auth-panel__text">
        Gardez un oeil sur votre boîte de réception et vos courriers indésirables.
      </p>
    </AuthPanel>
  );
}
