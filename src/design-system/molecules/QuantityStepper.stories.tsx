import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuantityStepper } from "@/design-system/molecules/QuantityStepper";

const meta = {
  title: "Design System/Molecules/QuantityStepper",
  component: QuantityStepper,
  tags: ["autodocs"],
} satisfies Meta<typeof QuantityStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

function QuantityStepperStory() {
  const [value, setValue] = useState(3);

  return <QuantityStepper label="Item quantity" value={value} onChange={setValue} min={0} max={20} step={1} unit="pcs" />;
}

export const Default: Story = {
  render: () => <QuantityStepperStory />,
};

export const Disabled: Story = {
  args: {
    label: "Item quantity",
    value: 3,
    onChange: () => undefined,
    unit: "pcs",
    disabled: true,
  },
};
