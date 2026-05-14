import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/design-system/primitives/atoms/Button";
import { SummaryCard } from "@/design-system/molecules/SummaryCard";

const meta = {
  title: "Design System/Molecules/SummaryCard",
  component: SummaryCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 22rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SummaryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Launch checklist",
    description: "A neutral summary card with image, tags, meta, and small metrics.",
    imageSrc: "/images/auth-background.png",
    imageAlt: "Abstract geometric background",
    tags: ["Project", "Ready"],
    meta: ["25 min", "2 owners", "4 tasks"],
    metrics: [
      { label: "Done", value: "8" },
      { label: "Open", value: "3" },
      { label: "Risk", value: "Low" },
    ],
    actions: <Button tone="ghost">Edit</Button>,
  },
};

export const TextOnly: Story = {
  args: {
    title: "Custom item",
    description: "Works without imagery for quick entries or compact planning cells.",
    tags: ["Manual"],
    meta: ["Manual item", "2 notes"],
    metrics: [
      { label: "Done", value: "2" },
      { label: "Open", value: "1" },
      { label: "Risk", value: "Low" },
    ],
  },
};
