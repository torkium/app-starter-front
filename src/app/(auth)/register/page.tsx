import { redirect } from "next/navigation";
import Link from "next/link";
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
      description="Lancez votre espace My App pour suivre votre espace et vos objectifs avec simplicité."
      submitLabel="Créer mon compte"
      action={registerAction}
      liveValidation="register"
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "password", label: "Mot de passe", type: "password", autoComplete: "new-password", minLength: 12 },
        { name: "confirmPassword", label: "Confirmer le mot de passe", type: "password", autoComplete: "new-password", minLength: 12 },
      ]}
      legalChecks={[
        {
          name: "acceptTerms",
          label: (
            <>
              J’accepte les{" "}
              <Link href={{ pathname: "/cgu" }}>CGU</Link>
            </>
          ),
        },
        {
          name: "acceptCharter",
          label: (
            <>
              J’accepte la{" "}
              <Link href={{ pathname: "/charte" }}>charte</Link>
            </>
          ),
        },
      ]}
      footerLinks={[{ href: "/login", label: "Se connecter", prefix: "Déjà un compte ?" }]}
    />
  );
}
