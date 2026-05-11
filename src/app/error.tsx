"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/design-system/components/Button";
import { EmptyState } from "@/design-system/components/EmptyState";

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
          ? `Le rendu a échoué. Digest technique: ${error.digest}. Branchez ici votre monitoring et votre support.`
          : "Le rendu a échoué. Vérifiez l’intégration backend ou réessayez la navigation."
      }
      action={
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Button onClick={reset}>Réessayer</Button>
          <Link href="/dashboard">Retour au dashboard</Link>
        </div>
      }
    />
  );
}
