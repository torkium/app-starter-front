import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatCard } from "@/design-system/molecules/StatCard";

const meta = {
  title: "Design System/Molecules/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Planned items",
    value: "18",
    description: "Across the current week",
  },
};

export const WithTrend: Story = {
  args: {
    label: "Completion",
    value: "82%",
    description: "5 days ahead of target",
    trend: "+12% vs last week",
    tone: "success",
  },
};

export const Accent: Story = {
  args: {
    label: "Projects",
    value: "12",
    description: "Ready to schedule",
    tone: "accent",
    footer: "Synced locally",
  },
};
