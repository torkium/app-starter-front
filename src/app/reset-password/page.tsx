import { AuthForm } from "@/domains/auth/components/AuthForm";
import { resetPasswordAction } from "@/domains/auth/actions";
import { FormCard } from "@/design-system/molecules/FormCard";
import { CleanAuthTokenUrl } from "@/domains/auth/components/CleanAuthTokenUrl";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  if (!token) {
    return (
      <FormCard title="Lien invalide" description="Le lien de réinitialisation est incomplet ou expiré.">
        <p>Demandez un nouveau lien depuis la page mot de passe oublié.</p>
      </FormCard>
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
        description="Le token peut provenir d'un lien email généré par le backend."
        submitLabel="Mettre à jour"
        action={submitWithToken}
        fields={[
          { name: "password", label: "Nouveau mot de passe", type: "password", autoComplete: "new-password" },
        ]}
      />
    </>
  );
}
