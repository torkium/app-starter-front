import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SegmentedControl } from "@/design-system/molecules/SegmentedControl";

const meta = {
  title: "Design System/Molecules/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

function DefaultSegmentedControlStory() {
  const [value, setValue] = useState("all");

  return (
    <SegmentedControl
      label="Project filters"
      value={value}
      onChange={setValue}
      options={[
        { value: "all", label: "All" },
        { value: "breakfast", label: "Breakfast" },
        { value: "lunch", label: "Lunch" },
        { value: "dinner", label: "Dinner" },
      ]}
    />
  );
}

function CompactSegmentedControlStory() {
  const [value, setValue] = useState("week");

  return (
    <SegmentedControl
      compact
      label="Date range"
      value={value}
      onChange={setValue}
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "year", label: "Year", disabled: true },
      ]}
    />
  );
}

export const Default: Story = {
  render: () => <DefaultSegmentedControlStory />,
};

export const Compact: Story = {
  render: () => <CompactSegmentedControlStory />,
};
