import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "@/design-system/primitives/atoms/Select";

const meta = {
  title: "Design System/Primitives/Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    defaultValue: "week",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 24rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="day">Day</option>
      <option value="week">Week</option>
      <option value="month">Month</option>
    </Select>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Select {...args} disabled>
      <option>Unavailable</option>
    </Select>
  ),
};
