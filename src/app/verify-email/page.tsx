import { AuthForm } from "@/domains/auth/components/AuthForm";
import { verifyEmailAction } from "@/domains/auth/actions";
import { FormCard } from "@/design-system/molecules/FormCard";
import { CleanAuthTokenUrl } from "@/domains/auth/components/CleanAuthTokenUrl";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  if (!token) {
    return (
      <FormCard title="Lien invalide" description="Le lien de confirmation est incomplet ou expiré.">
        <p>Relancez la confirmation depuis votre espace.</p>
      </FormCard>
    );
  }

  async function submitWithToken(state: Parameters<typeof verifyEmailAction>[0], formData: FormData) {
    "use server";

    formData.set("token", token);
    return verifyEmailAction(state, formData);
  }

  return (
    <>
      <CleanAuthTokenUrl />
      <AuthForm
        title="Confirmer l'email"
        description="Route minimale pour finaliser une confirmation de compte."
        submitLabel="Confirmer"
        action={submitWithToken}
        fields={[]}
      />
    </>
  );
}
