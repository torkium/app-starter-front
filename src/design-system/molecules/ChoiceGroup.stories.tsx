import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChoiceGroup } from "@/design-system/molecules/ChoiceGroup";

const meta = {
  title: "Design System/Molecules/ChoiceGroup",
  component: ChoiceGroup,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 42rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChoiceGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

function ChoiceGroupStory() {
  const [value, setValue] = useState("standard");

  return (
    <ChoiceGroup
      label="Tracking approach"
      value={value}
      onChange={setValue}
      options={[
        { value: "light", title: "Léger", description: "Suivi minimal des informations clés" },
        { value: "standard", title: "Standard", description: "Suivi équilibré des étapes du projet" },
        { value: "detailed", title: "Détaillé", description: "Suivi complet avec points de contrôle" },
      ]}
    />
  );
}

export const Default: Story = {
  render: () => <ChoiceGroupStory />,
};
