import { AuthForm } from "@/domains/auth/components/AuthForm";
import { confirmEmailChangeAction } from "@/domains/auth/actions";
import { FormCard } from "@/design-system/molecules/FormCard";
import { CleanAuthTokenUrl } from "@/domains/auth/components/CleanAuthTokenUrl";

export default async function ConfirmEmailChangePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  if (!token) {
    return (
      <FormCard title="Lien invalide" description="Le lien de confirmation est incomplet ou expiré.">
        <p>Demandez un nouveau changement d’email depuis les paramètres du compte.</p>
      </FormCard>
    );
  }

  async function submitWithToken(state: Parameters<typeof confirmEmailChangeAction>[0], formData: FormData) {
    "use server";

    formData.set("token", token);
    return confirmEmailChangeAction(state, formData);
  }

  return (
    <>
      <CleanAuthTokenUrl />
      <AuthForm
        title="Confirmer le changement d'email"
        description="Valide la nouvelle adresse email du compte."
        submitLabel="Confirmer"
        action={submitWithToken}
        fields={[]}
      />
    </>
  );
}
