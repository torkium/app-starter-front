import Link from "next/link";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";

export default function TermsPage() {
  return (
    <AuthPanel
      title="CGU"
      description="Version temporaire des conditions générales d’utilisation My App."
      footer={<Link href="/register">Retour à l’inscription</Link>}
    >
      <div className="ui-auth-panel__form">
        <p className="ui-auth-panel__text">
          Les conditions générales d’utilisation complètes seront publiées ici avant l’ouverture du service.
        </p>
        <p className="ui-auth-panel__text">
          Pour le moment, cette page sert de lien de référence pendant la finalisation du parcours d’inscription.
        </p>
      </div>
    </AuthPanel>
  );
}
