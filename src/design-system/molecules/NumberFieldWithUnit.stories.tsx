import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NumberFieldWithUnit } from "@/design-system/molecules/NumberFieldWithUnit";

const meta = {
  title: "Design System/Molecules/NumberFieldWithUnit",
  component: NumberFieldWithUnit,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 18rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberFieldWithUnit>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Quantité",
    unit: "g",
    defaultValue: 100,
    min: 0,
    step: 1,
  },
};

export const WithError: Story = {
  args: {
    label: "Progress",
    unit: "%",
    defaultValue: -10,
    error: "La valeur doit être positive.",
  },
};
