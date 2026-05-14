import { redirect } from "next/navigation";
import { AuthForm } from "@/domains/auth/components/AuthForm";
import { loginAction } from "@/domains/auth/actions";
import { getCurrentUser } from "@/infrastructure/auth/serverAuth";
import { Notice } from "@/design-system/molecules/Notice";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ emailChanged?: string; redirect?: string; reset?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  const { emailChanged = "", redirect: redirectTarget = "", reset = "" } = await searchParams;
  const successMessage = reset === "success"
    ? "Votre mot de passe a été mis à jour. Vous pouvez vous connecter."
    : emailChanged === "success"
      ? "Votre adresse email a été mise à jour. Reconnectez-vous pour continuer."
      : "";

  return (
    <AuthForm
      title="Se connecter"
      description="Retrouvez votre espace applicatif et reprenez là où vous vous êtes arrêté."
      submitLabel="Se connecter"
      action={loginAction}
      notice={successMessage ? <Notice tone="success">{successMessage}</Notice> : undefined}
      hiddenFields={redirectTarget ? [{ name: "redirect", value: redirectTarget }] : undefined}
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "password", label: "Mot de passe", type: "password", autoComplete: "current-password" },
      ]}
      footerLinks={[
        { href: "/forgot-password", label: "Mot de passe oublié ?" },
        { href: "/register", label: "Créer un compte", prefix: "Pas encore inscrit ?" },
      ]}
    />
  );
}
