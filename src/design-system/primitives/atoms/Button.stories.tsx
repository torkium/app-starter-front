import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/design-system/primitives/atoms/Button";
import { ButtonLink } from "@/design-system/primitives/atoms/ButtonLink";

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
      options: ["primary", "secondary", "ghost", "danger", "accent"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
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

export const Danger: Story = {
  args: {
    tone: "danger",
    children: "Delete item",
  },
};

export const Accent: Story = {
  args: {
    tone: "accent",
    children: "Highlight action",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    children: "Saving",
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

export const FormActions: Story = {
  render: () => (
    <form style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }} onSubmit={(event) => event.preventDefault()}>
      <Button tone="secondary">Cancel</Button>
      <Button type="submit">Submit explicitly</Button>
    </form>
  ),
};
