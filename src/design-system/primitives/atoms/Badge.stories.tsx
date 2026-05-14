import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/design-system/primitives/atoms/Badge";

const meta = {
  title: "Design System/Primitives/Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Planned",
    tone: "primary",
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "primary", "success", "warning", "danger", "accent"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      <Badge>Neutral</Badge>
      <Badge tone="primary">Primary</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="accent">Accent</Badge>
    </div>
  ),
};
