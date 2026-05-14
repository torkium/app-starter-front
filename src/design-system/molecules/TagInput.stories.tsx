import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TagInput } from "@/design-system/molecules/TagInput";

const meta = {
  title: "Design System/Molecules/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 30rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagInput>;

export default meta;

type Story = StoryObj<typeof meta>;

function TagInputStory() {
  const [tags, setTags] = useState(["Frontend", "Ready"]);

  return (
    <TagInput
      label="Project tags"
      value={tags}
      onChange={setTags}
      suggestions={["Frontend", "Backend", "Ready", "Blocked", "Important", "Quick", "Internal"]}
      hint="Use Enter or comma to create a custom tag."
    />
  );
}

export const Default: Story = {
  render: () => <TagInputStory />,
};

export const Full: Story = {
  args: {
    label: "Project tags",
    value: ["Frontend", "Quick", "Important"],
    onChange: () => undefined,
    max: 3,
  },
};
