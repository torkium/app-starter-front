import { AuthForm } from "@/domains/auth/components/AuthForm";
import { forgotPasswordAction } from "@/domains/auth/actions";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Mot de passe oublié"
      description="Envoie une demande de reset via le backend."
      submitLabel="Envoyer le lien"
      action={forgotPasswordAction}
      fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
    />
  );
}
