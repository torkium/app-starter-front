import { AuthForm } from "@/domains/auth/components/AuthForm";
import { verifyEmailAction } from "@/domains/auth/actions";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  return (
    <AuthForm
      title="Confirmer l'email"
      description="Route minimale pour finaliser une confirmation de compte."
      submitLabel="Confirmer"
      action={verifyEmailAction}
      fields={[{ name: "token", label: "Token", defaultValue: token }]}
    />
  );
}
