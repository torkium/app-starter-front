import { AuthPanel } from "@/design-system/molecules/AuthPanel";
import { Skeleton } from "@/design-system/primitives/atoms/Skeleton";

export default function AuthLoading() {
  return (
    <AuthPanel title="Chargement" description="Préparation de votre espace My App.">
      <div className="ui-auth-panel__form" role="status" aria-busy="true" aria-label="Chargement du formulaire">
        <Skeleton style={{ minHeight: "3.25rem" }} />
        <Skeleton style={{ minHeight: "3.25rem" }} />
        <Skeleton style={{ minHeight: "3.25rem" }} />
      </div>
    </AuthPanel>
  );
}
