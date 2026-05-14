import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/design-system/primitives/atoms/Button";
import { DialogShell } from "@/design-system/molecules/DialogShell";
import { Field } from "@/design-system/molecules/Field";
import { Input } from "@/design-system/primitives/atoms/Input";

const meta = {
  title: "Design System/Molecules/DialogShell",
  component: DialogShell,
  tags: ["autodocs"],
} satisfies Meta<typeof DialogShell>;

export default meta;

type Story = StoryObj<typeof meta>;

function DialogShellStory() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <DialogShell
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Nouvelle"
        title="Créer un élément"
        description="Shell réutilisable pour les modales de formulaire et de détail."
        footer={
          <>
            <Button tone="secondary" onClick={() => setOpen(false)}>Annuler</Button>
            <Button>Enregistrer</Button>
          </>
        }
      >
        <div style={{ display: "grid", gap: "1rem" }}>
          <Field label="Nom">
            <Input placeholder="Projet interne" />
          </Field>
          <Field label="URL image" optionalText="Optional">
            <Input placeholder="https://..." />
          </Field>
        </div>
      </DialogShell>
    </>
  );
}

export const Default: Story = {
  render: () => <DialogShellStory />,
};
