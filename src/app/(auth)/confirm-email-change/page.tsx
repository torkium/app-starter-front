import { redirect } from "next/navigation";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";
import { CleanAuthTokenUrl } from "@/domains/auth/components/CleanAuthTokenUrl";
import { confirmEmailChange, getCurrentUser } from "@/infrastructure/auth/serverAuth";
import { ApiError } from "@/infrastructure/errors/apiError";

export default async function ConfirmEmailChangePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  if (!token) {
    return (
      <AuthPanel title="Lien invalide" description="Le lien de confirmation est incomplet ou expiré.">
        <p className="ui-auth-panel__text">
          Demandez un nouveau changement d’email depuis les paramètres de votre compte.
        </p>
      </AuthPanel>
    );
  }

  const user = await getCurrentUser();
  let error: ApiError | null = null;
  try {
    await confirmEmailChange({ token });
  } catch (caught) {
    error = caught instanceof ApiError ? caught : new ApiError("Le lien de confirmation est invalide ou expiré.");
  }

  if (!error) {
    redirect(user ? "/account?emailChanged=success" : "/login?emailChanged=success");
  }

  return (
    <>
      <CleanAuthTokenUrl />
      <AuthPanel title="Lien invalide" description="Le lien de confirmation est invalide ou expiré.">
        <p className="ui-auth-panel__text">
          Demandez un nouveau changement d’email depuis les paramètres de votre compte.
        </p>
        {error.requestId ? <p className="ui-auth-panel__text">Référence: {error.requestId}</p> : null}
      </AuthPanel>
    </>
  );
}
