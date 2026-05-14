import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "@/design-system/primitives/atoms/Switch";

const meta = {
  title: "Design System/Primitives/Atoms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: {
    label: "Smart planning",
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Enabled: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
