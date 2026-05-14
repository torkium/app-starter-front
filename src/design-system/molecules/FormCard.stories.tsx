import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormCard } from "@/design-system/molecules/FormCard";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";

const meta = {
  title: "Design System/Molecules/FormCard",
  component: FormCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 32rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Créer un compte",
    description: "Un conteneur de formulaire court pour les parcours d’accès My App.",
    footer: "Aucune carte bancaire requise",
    children: (
      <>
        <Input type="email" placeholder="Adresse email" />
        <Input type="password" placeholder="Mot de passe" />
        <Button>Créer le compte</Button>
      </>
    ),
  },
};

export const WithHeaderAction: Story = {
  args: {
    title: "Inviter un proche",
    description: "Gardez les formulaires étroits, lisibles et focalisés.",
    actions: <Button tone="ghost">Annuler</Button>,
    footer: "Les invitations expirent après 7 jours",
    children: (
      <>
        <Input type="email" placeholder="proche@example.test" />
        <Button>Envoyer l’invitation</Button>
      </>
    ),
  },
};
