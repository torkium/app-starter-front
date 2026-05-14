import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slider } from "@/design-system/primitives/atoms/Slider";

const meta = {
  title: "Design System/Primitives/Atoms/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    defaultValue: 64,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "24rem", maxWidth: "calc(100vw - 2rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function WithValueStory() {
  const [value, setValue] = useState(1850);

  return (
    <div style={{ display: "grid", gap: ".5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: ".92rem" }}>
        <span>Progress</span>
        <strong style={{ fontFamily: "var(--font-display)", color: "var(--primary-strong)" }}>{value} %</strong>
      </div>
      <Slider min={0} max={4000} step={50} value={value} onChange={(event) => setValue(Number(event.target.value))} />
    </div>
  );
}

export const WithValue: Story = {
  render: () => <WithValueStory />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 40,
    disabled: true,
  },
};
