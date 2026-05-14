import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "@/design-system/primitives/atoms/Avatar";

const meta = {
  title: "Design System/Primitives/Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    initials: "CN",
    "aria-label": "Camille My App",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <Avatar size="sm" initials="CN" aria-label="Small avatar" />
      <Avatar initials="CN" aria-label="Medium avatar" />
      <Avatar size="lg" initials="CN" aria-label="Large avatar" />
    </div>
  ),
};
