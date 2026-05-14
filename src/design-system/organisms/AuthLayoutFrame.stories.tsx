import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthLayoutFrame } from "@/design-system/organisms/AuthLayoutFrame";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Field } from "@/design-system/molecules/Field";
import { Input } from "@/design-system/primitives/atoms/Input";

const meta = {
  title: "Design System/Organisms/AuthLayoutFrame",
  component: AuthLayoutFrame,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AuthLayoutFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brandLabel: "My App",
    logoSrc: "/brand/app-mark.svg",
    backgroundImageSrc: "/images/auth-background.png",
    eyebrow: "Espace applicatif",
    title: "Avancez avec un socle clair.",
    description: "Suivez votre activité et vos contenus dans un espace clair, calme et pensé pour durer.",
    children: (
      <AuthPanel
        title="Se connecter"
        description="Retrouvez votre espace applicatif."
        footer="Pas encore inscrit ? Créer un compte"
      >
        <form style={{ display: "grid", gap: "1rem" }}>
          <Field label="Email">
            <Input type="email" placeholder="Email" controlSize="lg" />
          </Field>
          <Field label="Mot de passe">
            <Input type="password" placeholder="Mot de passe" controlSize="lg" />
          </Field>
          <Button type="submit" size="lg" fullWidth>
            Se connecter
          </Button>
        </form>
      </AuthPanel>
    ),
  },
};
