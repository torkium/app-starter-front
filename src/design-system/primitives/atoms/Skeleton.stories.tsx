import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "@/design-system/primitives/atoms/Skeleton";

const meta = {
  title: "Design System/Primitives/Atoms/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-2)", width: "18rem" }}>
      <Skeleton style={{ width: "75%" }} />
      <Skeleton style={{ width: "100%" }} />
      <Skeleton style={{ width: "52%" }} />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "18rem" }}>
      <Skeleton style={{ aspectRatio: "16 / 9" }} />
      <Skeleton style={{ width: "70%" }} />
      <Skeleton style={{ width: "45%" }} />
    </div>
  ),
};
