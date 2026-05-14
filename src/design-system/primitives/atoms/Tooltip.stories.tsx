import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "@/design-system/primitives/atoms/IconButton";
import { Tooltip } from "@/design-system/primitives/atoms/Tooltip";

const meta = {
  title: "Design System/Primitives/Atoms/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ minHeight: "8rem", display: "grid", placeItems: "center" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip content="Modifier l’élément">
      <IconButton aria-label="Modifier">✎</IconButton>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip content="Supprimer" placement="bottom">
      <IconButton aria-label="Supprimer" tone="danger">x</IconButton>
    </Tooltip>
  ),
};
