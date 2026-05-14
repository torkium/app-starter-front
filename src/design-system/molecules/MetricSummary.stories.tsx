import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Metric, MetricSummary, RadialMetric } from "@/design-system/molecules/MetricSummary";

const meta = {
  title: "Design System/Molecules/MetricSummary",
  component: Metric,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 34rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Metric>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Completed",
    value: 86,
    max: 120,
    helperText: "This cycle",
  },
};

export const Warning: Story = {
  args: {
    label: "Budget",
    value: 82,
    max: 100,
    unit: "%",
    tone: "warning",
    helperText: "Close to limit",
  },
};

export const Radial: Story = {
  render: () => <RadialMetric label="Progress" value={68} max={100} unit="%" />,
};

export const Summary: Story = {
  render: () => (
    <MetricSummary
      title="Project health"
      description="Simple molecule ready for dashboard summaries."
      items={[
        { key: "progress", label: "Progress", value: 68, max: 100, unit: "%" },
        { key: "quality", label: "Quality", value: 92, max: 100, unit: "%", tone: "success" },
        { key: "risk", label: "Risk", value: 24, max: 100, unit: "%", color: "var(--warning)" },
        { key: "load", label: "Load", value: 54, max: 100, unit: "%", tone: "neutral" },
      ]}
      variant="radial"
    />
  ),
};
