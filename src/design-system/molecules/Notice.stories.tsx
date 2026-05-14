import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Notice } from "@/design-system/molecules/Notice";
import { Button } from "@/design-system/primitives/atoms/Button";

const meta = {
  title: "Design System/Molecules/Notice",
  component: Notice,
  tags: ["autodocs"],
  args: {
    children: "Short feedback blocks work well for system status, validation summaries, and soft warnings.",
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 32rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Notice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    tone: "success",
    children: "Your project is now visible and ready for first traffic.",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    children: "This section needs a configured provider before it can be used in production.",
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
    children: "Something failed. Keep a clear visual distinction for blocking feedback.",
  },
};

export const WithTitleAndAction: Story = {
  args: {
    tone: "warning",
    title: "Action required",
    children: "Connect a provider before enabling automated publishing.",
    action: <Button tone="ghost" size="sm">Review</Button>,
  },
};
