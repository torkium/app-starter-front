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
        <main style={mainStyle}>
          <section style={panelStyle}>
            <h1 style={titleStyle}>Application momentanément indisponible</h1>
            <p style={descriptionStyle}>
              Une erreur empêche le chargement initial. Réessayez dans un instant.
            </p>
            {error.digest ? <p style={referenceStyle}>Référence: {error.digest}</p> : null}
            <button type="button" onClick={reset} style={buttonStyle}>
              Réessayer
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "2rem",
  fontFamily: "system-ui, sans-serif",
};

const panelStyle: React.CSSProperties = {
  maxWidth: "36rem",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "2rem",
};

const descriptionStyle: React.CSSProperties = {
  color: "#475467",
  lineHeight: 1.6,
};

const referenceStyle: React.CSSProperties = {
  color: "#667085",
  fontSize: ".9rem",
};

const buttonStyle: React.CSSProperties = {
  padding: ".8rem 1rem",
  borderRadius: "999px",
  border: 0,
  cursor: "pointer",
};
