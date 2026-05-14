import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/design-system/molecules/Card";
import { EmptyState } from "@/design-system/molecules/EmptyState";
import { FormCard } from "@/design-system/molecules/FormCard";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";
import { Section } from "@/design-system/organisms/Section";

const meta = {
  title: "Design System/Organisms/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "Section title",
    titleAs: "h2",
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", padding: "2rem 0" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Hero: Story = {
  args: {
    eyebrow: "Fondations",
    title: "Les sections cadrent la hiérarchie des pages My App.",
    titleAs: "h1",
    description: "Storybook sert de banc de revue pour l’espacement, la hiérarchie et les états de composants.",
    actions: (
      <>
        <Button>Action principale</Button>
        <Button tone="secondary">Action secondaire</Button>
      </>
    ),
  },
  render: (args) => (
    <Section {...args}>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <Card title="Cartes" description="Pour les résumés compacts et les groupes de navigation." />
        <Card title="Messages" description="Pour les retours système, alertes et indications contextuelles." />
        <Card title="Layouts" description="Pour maintenir un rythme de page stable." />
      </div>
    </Section>
  ),
};

export const EmptyStateExample: Story = {
  render: () => (
    <Section
      eyebrow="État vide"
      title="Les états vides méritent une vraie présence visuelle."
      titleAs="h2"
      description="Même sans données, l’interface doit rester claire, utile et agréable."
    >
      <EmptyState
        title="Aucun contenus enregistré"
        description="Ajoutez un premier contenus pour commencer votre espace applicatif."
        action={<Button>Ajouter un contenus</Button>}
      />
    </Section>
  ),
};

export const FormExample: Story = {
  render: () => (
    <Section
      eyebrow="Formulaires"
      title="Les formulaires doivent rester lisibles et focalisés."
      titleAs="h2"
      description="Cette story se concentre sur l’espacement, la densité et les affordances."
    >
      <FormCard title="Créer un compte" description="Un formulaire court pour l’onboarding et l’authentification.">
        <Input type="email" placeholder="Adresse email" />
        <Input type="password" placeholder="Mot de passe" />
        <Button>Créer le compte</Button>
      </FormCard>
    </Section>
  ),
};
