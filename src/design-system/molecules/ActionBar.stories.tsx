import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionBar } from "@/design-system/molecules/ActionBar";
import { Button } from "@/design-system/primitives/atoms/Button";

const meta = {
  title: "Design System/Molecules/ActionBar",
  component: ActionBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 44rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    leading: "3 selected",
    children: (
      <>
        <Button tone="secondary">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
  },
};

export const WithTrailing: Story = {
  args: {
    leading: "Draft saved locally",
    children: <Button tone="secondary">Preview</Button>,
    trailing: <Button>Publish</Button>,
  },
};

export const StickyNarrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "20rem", minHeight: "14rem", display: "grid", alignItems: "end" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    sticky: true,
    leading: "5 éléments sélectionnés pour traitement",
    children: (
      <>
        <Button tone="secondary">Annuler la sélection</Button>
        <Button>Planifier</Button>
      </>
    ),
  },
};
