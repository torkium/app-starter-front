import Link from "next/link";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";

export default function VerifyEmailSuccessPage() {
  return (
    <AuthPanel
      title="Email confirmé"
      description="Votre adresse email est validée. Vous pouvez accéder à votre espace My App."
      footer={<Link href="/dashboard">Accéder au dashboard</Link>}
    >
      <p className="ui-auth-panel__text">
        Votre espace applicatif peut maintenant commencer dans de bonnes conditions.
      </p>
    </AuthPanel>
  );
}
