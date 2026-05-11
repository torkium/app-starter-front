import { AuthForm } from "@/domains/auth/components/AuthForm";
import { resetPasswordAction } from "@/domains/auth/actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  return (
    <AuthForm
      title="Réinitialiser le mot de passe"
      description="Le token peut provenir d'un lien email généré par le backend."
      submitLabel="Mettre à jour"
      action={resetPasswordAction}
      fields={[
        { name: "token", label: "Token", defaultValue: token },
        { name: "password", label: "Nouveau mot de passe", type: "password", autoComplete: "new-password" },
      ]}
    />
  );
}
