import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropdownMenu } from "@/design-system/molecules/DropdownMenu";

const meta = {
  title: "Design System/Molecules/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ minHeight: "12rem", display: "flex", justifyContent: "center", paddingTop: "2rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Export shopping list",
    trigger: "Exporter",
    items: [
      { id: "csv", label: "CSV (Excel, Sheets)", description: "Structured spreadsheet export" },
      { id: "txt", label: "Fichier texte (.txt)", description: "Plain list for sharing" },
      { id: "copy", label: "Copier dans le presse-papier" },
    ],
  },
};

export const WithDangerItem: Story = {
  args: {
    label: "Project actions",
    trigger: "Actions",
    items: [
      { id: "edit", label: "Modifier" },
      { id: "duplicate", label: "Dupliquer" },
      { id: "delete", label: "Supprimer", tone: "danger" },
    ],
  },
};
