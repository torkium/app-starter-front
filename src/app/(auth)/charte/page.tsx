import Link from "next/link";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";

export default function CharterPage() {
  return (
    <AuthPanel
      title="Charte"
      description="Version temporaire de la charte My App."
      footer={<Link href="/register">Retour à l’inscription</Link>}
    >
      <div className="ui-auth-panel__form">
        <p className="ui-auth-panel__text">
          La charte complète sera publiée ici avant l’ouverture du service.
        </p>
        <p className="ui-auth-panel__text">
          Pour le moment, cette page sert de lien de référence pendant la finalisation du parcours d’inscription.
        </p>
      </div>
    </AuthPanel>
  );
}
