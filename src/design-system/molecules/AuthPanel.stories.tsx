import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";
import { Field } from "@/design-system/molecules/Field";

const meta = {
  title: "Design System/Molecules/AuthPanel",
  component: AuthPanel,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "var(--surface-contrast)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Se connecter",
    description: "Retrouvez votre espace applicatif.",
    footer: "Pas encore inscrit ? Créer un compte",
    children: (
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
    ),
  },
};
