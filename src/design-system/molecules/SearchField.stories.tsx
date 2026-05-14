import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/design-system/primitives/atoms/Input";
import { InputGroup, SearchField } from "@/design-system/molecules/SearchField";

const meta = {
  title: "Design System/Molecules/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 32rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

function SearchFieldWithClearStory() {
  const [value, setValue] = useState("portal");

  return (
    <SearchField
      label="Search projects"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
    />
  );
}

export const Default: Story = {
  args: {
    label: "Search projects",
    placeholder: "Search by project or tag",
  },
};

export const WithClear: Story = {
  render: () => <SearchFieldWithClearStory />,
};

export const InputGroupExample: Story = {
  render: () => (
    <InputGroup
      leading={<span aria-hidden="true">https://</span>}
      leadingWidth="4.75rem"
      trailing={<span style={{ color: "var(--text-muted)", fontSize: ".86rem" }}>.com</span>}
      trailingWidth="2.5rem"
    >
      <Input aria-label="Website" placeholder="project-slug" style={{ paddingLeft: "5.1rem", paddingRight: "3rem" }} />
    </InputGroup>
  ),
};
