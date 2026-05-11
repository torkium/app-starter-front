import Link from "next/link";
import { EmptyState } from "@/design-system/components/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Page introuvable"
      description="La route demandée n’existe pas, ou n’est pas encore branchée dans ce starter générique."
      action={
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Link href="/">Accueil</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      }
    />
  );
}
