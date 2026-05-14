import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/design-system/primitives/atoms/Input";

const meta = {
  title: "Design System/Primitives/Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Type here",
  },
  argTypes: {
    controlSize: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 24rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "jane@example.test",
    autoComplete: "email",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Read-only preview",
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "wrong-format",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Input controlSize="sm" placeholder="Small" />
      <Input placeholder="Medium" />
      <Input controlSize="lg" placeholder="Large" />
    </div>
  ),
};
