import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Progress } from "@/design-system/primitives/atoms/Progress";

const meta = {
  title: "Design System/Primitives/Atoms/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: {
    value: 64,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "24rem", maxWidth: "calc(100vw - 2rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const WithCustomMax: Story = {
  args: {
    value: 42,
    max: 70,
  },
};
