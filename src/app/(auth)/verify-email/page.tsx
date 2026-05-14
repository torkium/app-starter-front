import { redirect } from "next/navigation";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";
import { CleanAuthTokenUrl } from "@/domains/auth/components/CleanAuthTokenUrl";
import { verifyEmail } from "@/infrastructure/auth/serverAuth";
import { ApiError } from "@/infrastructure/errors/apiError";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  if (!token) {
    return (
      <AuthPanel title="Lien invalide" description="Le lien de confirmation est incomplet ou expiré.">
        <p className="ui-auth-panel__text">
          Connectez-vous ou relancez la confirmation depuis votre espace My App.
        </p>
      </AuthPanel>
    );
  }

  let error: ApiError | null = null;
  try {
    await verifyEmail({ token });
  } catch (caught) {
    error = caught instanceof ApiError ? caught : new ApiError("Le lien de confirmation est invalide ou expiré.");
  }

  if (!error) {
    redirect("/verify-email/success");
  }

  return (
    <>
      <CleanAuthTokenUrl />
      <AuthPanel title="Lien invalide" description="Le lien de confirmation est invalide ou expiré.">
        <p className="ui-auth-panel__text">
          Connectez-vous ou relancez la confirmation depuis votre espace My App.
        </p>
        {error.requestId ? <p className="ui-auth-panel__text">Référence: {error.requestId}</p> : null}
      </AuthPanel>
    </>
  );
}
