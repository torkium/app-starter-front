import { AuthForm } from "@/domains/auth/components/AuthForm";
import { resetPasswordAction } from "@/domains/auth/actions";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";
import { CleanAuthTokenUrl } from "@/domains/auth/components/CleanAuthTokenUrl";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  if (!token) {
    return (
      <AuthPanel title="Lien invalide" description="Le lien de réinitialisation est incomplet ou expiré.">
        <p className="ui-auth-panel__text">
          Demandez un nouveau lien pour sécuriser votre espace My App.
        </p>
      </AuthPanel>
    );
  }

  async function submitWithToken(state: Parameters<typeof resetPasswordAction>[0], formData: FormData) {
    "use server";

    formData.set("token", token);
    return resetPasswordAction(state, formData);
  }

  return (
    <>
      <CleanAuthTokenUrl />
      <AuthForm
        title="Réinitialiser le mot de passe"
        description="Choisissez un nouveau mot de passe pour sécuriser votre espace My App."
        submitLabel="Mettre à jour"
        action={submitWithToken}
        fields={[
          { name: "password", label: "Nouveau mot de passe", type: "password", autoComplete: "new-password" },
        ]}
      />
    </>
  );
}
