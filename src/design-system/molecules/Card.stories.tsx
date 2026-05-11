import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/design-system/molecules/Card";

const meta = {
  title: "Design System/Molecules/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    title: "Card title",
    description: "Use cards for concise summaries, navigation shortcuts, or soft empty states.",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 28rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFooter: Story = {
  args: {
    footer: "Review details",
  },
};

export const RichContent: Story = {
  args: {
    children: (
      <div style={{ display: "grid", gap: ".75rem" }}>
        <div style={{ height: "10rem", borderRadius: "14px", background: "var(--primary-soft)" }} />
        <p style={{ margin: 0, color: "var(--text-muted)" }}>
          Stories are useful to validate spacing, density, and visual balance before wiring business flows.
        </p>
      </div>
    ),
  },
};
