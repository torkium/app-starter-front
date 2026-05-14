import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field } from "@/design-system/molecules/Field";
import { Input } from "@/design-system/primitives/atoms/Input";

const meta = {
  title: "Design System/Molecules/Field",
  component: Field,
  tags: ["autodocs"],
  args: {
    label: "Email address",
    hint: "Used for authentication and receipts.",
    children: undefined,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 24rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <Input type="email" placeholder="jane@example.test" />
    </Field>
  ),
};

export const WithError: Story = {
  args: {
    error: "Please provide a valid email address.",
  },
  render: (args) => (
    <Field {...args}>
      <Input type="email" placeholder="jane@example.test" aria-invalid="true" />
    </Field>
  ),
};

export const Optional: Story = {
  args: {
    label: "Internal note",
    hint: "Visible to the team only.",
    optionalText: "Optional",
  },
  render: (args) => (
    <Field {...args}>
      <Input placeholder="Add context" />
    </Field>
  ),
};

export const HiddenLabel: Story = {
  args: {
    label: "Search",
    labelHidden: true,
  },
  render: (args) => (
    <Field {...args}>
      <Input placeholder="Search by name" />
    </Field>
  ),
};
