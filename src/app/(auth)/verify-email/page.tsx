import { redirect } from "next/navigation";
import { FormCard } from "@/design-system/molecules/FormCard";
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
      <FormCard title="Lien invalide" description="Le lien de confirmation est incomplet ou expiré.">
        <p>Relancez la confirmation depuis votre espace.</p>
      </FormCard>
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
      <FormCard title="Lien invalide" description="Le lien de confirmation est invalide ou expiré.">
        <p>Relancez la confirmation depuis votre espace.</p>
        {error.requestId ? <p>Référence: {error.requestId}</p> : null}
      </FormCard>
    </>
  );
}
