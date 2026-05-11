import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "@/design-system/molecules/EmptyState";
import { Button } from "@/design-system/primitives/atoms/Button";

const meta = {
  title: "Design System/Molecules/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No items yet",
    description: "Use empty states to keep non-happy paths intentional and understandable.",
    action: <Button>Add an item</Button>,
  },
};
