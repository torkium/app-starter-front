import { AuthForm } from "@/domains/auth/components/AuthForm";
import { confirmEmailChangeAction } from "@/domains/auth/actions";

export default async function ConfirmEmailChangePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  return (
    <AuthForm
      title="Confirmer le changement d'email"
      description="Valide la nouvelle adresse email du compte."
      submitLabel="Confirmer"
      action={confirmEmailChangeAction}
      fields={[{ name: "token", label: "Token", defaultValue: token }]}
    />
  );
}
