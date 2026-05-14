"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="fr">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
          <section style={{ maxWidth: "36rem", textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: "2rem" }}>My App est momentanément indisponible</h1>
            <p style={{ color: "#5f6f63", lineHeight: 1.6 }}>
              Une erreur empêche le chargement initial de l’application. Réessayez dans un instant.
            </p>
            {error.digest ? <p style={{ color: "#5f6f63", fontSize: ".9rem" }}>Référence: {error.digest}</p> : null}
            <button type="button" onClick={reset} style={{ padding: ".8rem 1rem", borderRadius: "999px", border: 0, cursor: "pointer" }}>
              Réessayer
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
