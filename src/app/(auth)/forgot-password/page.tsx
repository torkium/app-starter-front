import { AuthForm } from "@/domains/auth/components/AuthForm";
import { forgotPasswordAction } from "@/domains/auth/actions";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Mot de passe oublié"
      description="Indiquez votre email et nous vous enverrons un lien pour choisir un nouveau mot de passe."
      submitLabel="Envoyer le lien"
      action={forgotPasswordAction}
      fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
      footerLinks={[{ href: "/login", label: "Retour à la connexion" }]}
    />
  );
}
