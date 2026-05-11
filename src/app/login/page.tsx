import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/domains/auth/components/AuthForm";
import { loginAction } from "@/domains/auth/actions";
import { getCurrentUser } from "@/infrastructure/auth/serverAuth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  const { redirect: redirectTarget = "" } = await searchParams;

  return (
    <AuthForm
      title="Connexion"
      description="Connexion SSR par cookies httpOnly, pensée pour un backend JWT + refresh token."
      submitLabel="Se connecter"
      action={loginAction}
      hiddenFields={redirectTarget ? [{ name: "redirect", value: redirectTarget }] : undefined}
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "password", label: "Mot de passe", type: "password", autoComplete: "current-password" },
      ]}
      footer={<Link href="/forgot-password">Mot de passe oublié ?</Link>}
    />
  );
}
