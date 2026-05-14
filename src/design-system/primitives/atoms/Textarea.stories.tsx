import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "@/design-system/primitives/atoms/Textarea";

const meta = {
  title: "Design System/Primitives/Atoms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    placeholder: "Notes",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 28rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "A note that needs review.",
  },
};
