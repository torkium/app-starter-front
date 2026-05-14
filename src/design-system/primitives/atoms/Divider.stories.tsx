import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Divider } from "@/design-system/primitives/atoms/Divider";

const meta = {
  title: "Design System/Primitives/Atoms/Divider",
  component: Divider,
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <p>Above</p>
      <Divider />
      <p>Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};
