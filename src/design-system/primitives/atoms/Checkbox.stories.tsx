import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "@/design-system/primitives/atoms/Checkbox";

const meta = {
  title: "Design System/Primitives/Atoms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Receive weekly summary",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};
