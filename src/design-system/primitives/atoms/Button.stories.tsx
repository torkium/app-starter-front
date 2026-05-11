import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, ButtonLink } from "@/design-system/primitives/atoms/Button";

const meta = {
  title: "Design System/Primitives/Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Primary action",
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["primary", "secondary", "ghost"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    tone: "secondary",
    children: "Secondary action",
  },
};

export const Ghost: Story = {
  args: {
    tone: "ghost",
    children: "Ghost action",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Unavailable action",
  },
};

export const LinkVariant: Story = {
  render: () => <ButtonLink href="/" tone="secondary">Read more</ButtonLink>,
};
