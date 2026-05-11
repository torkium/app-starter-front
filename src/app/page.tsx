import Link from "next/link";
import { Card } from "@/design-system/molecules/Card";
import { ButtonLink } from "@/design-system/primitives/atoms/Button";
import { Section } from "@/design-system/organisms/Section";

const starterFeatures = [
  "auth SSR par cookies httpOnly",
  "proxy API prêt pour backend externe",
  "shell realtime Mercure et SSE",
  "billing Stripe et upload média neutralisés",
  "bannière cookies et proposition PWA",
  "architecture 4 couches lisible",
];

export default function HomePage() {
  return (
    <>
      <Section
        eyebrow="App Front"
        title="Base Next.js générique prête pour des produits SaaS orientés User."
        description="Ce starter reprend les briques transversales utiles d’Akoky sans domaine dating, sans Profile, et avec une structure claire pour démarrer vite."
        titleAs="h1"
        actions={
          <>
            <ButtonLink href="/login">Se connecter</ButtonLink>
            <ButtonLink href="/register" tone="secondary">
              Créer un compte
            </ButtonLink>
          </>
        }
      />

      <Section title="Briques incluses" titleAs="h2" description="Chaque zone est pensée pour être remplacée par votre métier, pas pour l’imposer.">
        <div style={gridStyle}>
          {starterFeatures.map((feature) => (
            <Card key={feature} title={feature} description="Implémentation neutre, documentée et prête à brancher sur votre backend." />
          ))}
        </div>
      </Section>

      <Section title="Parcours fournis" titleAs="h2" description="Des routes publiques et privées existent déjà pour accélérer la première intégration.">
        <div style={gridStyle}>
          <Card
            title="Authentification"
            description="Inscription, connexion, confirmation email, mot de passe oublié et reset."
            footer={<Link href="/register">Voir les écrans auth</Link>}
          />
          <Card
            title="Dashboard privé"
            description="Protection SSR via proxy, contexte utilisateur hydraté côté serveur."
            footer={<Link href="/dashboard">Ouvrir le dashboard</Link>}
          />
          <Card
            title="Billing et média"
            description="Pages shell pour préparer Stripe Embedded Checkout et upload direct navigateur."
            footer={<Link href="/billing">Explorer les modules</Link>}
          />
        </div>
      </Section>
    </>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};
