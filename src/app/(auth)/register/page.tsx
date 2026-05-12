import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/domains/auth/components/AuthForm";
import { registerAction } from "@/domains/auth/actions";
import { getCurrentUser } from "@/infrastructure/auth/serverAuth";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthForm
      title="Créer un compte"
      description="Base neutre d'inscription utilisateur, sans notion de profil actif."
      submitLabel="Créer mon compte"
      action={registerAction}
      fields={[
        { name: "firstName", label: "Prénom", autoComplete: "given-name" },
        { name: "lastName", label: "Nom", autoComplete: "family-name" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "password", label: "Mot de passe", type: "password", autoComplete: "new-password" },
      ]}
      footer={<Link href="/login">Déjà un compte ? Se connecter</Link>}
    />
  );
}
