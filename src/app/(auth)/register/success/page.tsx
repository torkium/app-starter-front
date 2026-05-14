import { AuthPanel, StepList } from "@/design-system/molecules";
import { ButtonLink } from "@/design-system/primitives/atoms";

export default function RegisterSuccessPage() {
  return (
    <AuthPanel
      className="ui-auth-success"
      title="Inscription enregistrée"
      description="Si votre email est valide, vous recevrez un message de confirmation pour activer votre accès."
      footer={<ButtonLink href="/login" size="lg" fullWidth>Aller à la connexion</ButtonLink>}
    >
      <StepList
        aria-label="Prochaines étapes"
        items={[
          {
            id: "confirm-email",
            title: "Confirmez votre email",
            description: "Si un message My App arrive dans votre boîte, ouvrez-le et validez votre adresse pour pouvoir vous connecter.",
          },
          {
            id: "open-space",
            title: "Retrouvez votre suivi",
            description: "Activité, objectifs et préférences seront réunis dans votre espace.",
          },
        ]}
      />
    </AuthPanel>
  );
}
