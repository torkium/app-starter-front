"use client";

import { useEffect } from "react";
import Link from "next/link";
import { EmptyState } from "@/design-system/molecules/EmptyState";
import { Button } from "@/design-system/primitives/atoms/Button";

export default function Error({
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
    <EmptyState
      title="Une erreur est survenue"
      description={
        error.digest
          ? `Le rendu a échoué. Référence technique: ${error.digest}.`
          : "Le rendu a échoué. Vérifiez l’intégration backend ou réessayez la navigation."
      }
      action={
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Button onClick={reset}>Réessayer</Button>
          <Link href="/login">Retour à la connexion</Link>
        </div>
      }
    />
  );
}
