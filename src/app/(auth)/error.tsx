"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";
import { Button } from "@/design-system/primitives/atoms/Button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AuthPanel
      title="Une erreur est survenue"
      description={
        error.digest
          ? `Le rendu a échoué. Référence technique: ${error.digest}.`
          : "Le formulaire n’a pas pu être chargé. Réessayez dans un instant."
      }
      footer={<Link href="/login">Retour à la connexion</Link>}
    >
      <Button type="button" onClick={reset} fullWidth>
        Réessayer
      </Button>
    </AuthPanel>
  );
}
