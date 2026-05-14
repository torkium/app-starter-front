import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "@/design-system/primitives/atoms/IconButton";

const meta = {
  title: "Design System/Primitives/Atoms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    "aria-label": "Add item",
    children: <span aria-hidden="true">+</span>,
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ghost: Story = {
  args: {
    tone: "ghost",
    "aria-label": "More options",
    children: <span aria-hidden="true">...</span>,
  },
};
