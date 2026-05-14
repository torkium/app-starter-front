import Link from "next/link";
import { EmptyState } from "@/design-system/molecules/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Page introuvable"
      description="La page demandée n’existe pas ou n’est plus disponible."
      action={
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Link href="/">Accueil</Link>
          <Link href="/login">Connexion</Link>
        </div>
      }
    />
  );
}
