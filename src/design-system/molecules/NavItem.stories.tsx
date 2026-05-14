import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ListItem, NavItem } from "@/design-system/molecules/NavItem";

const meta = {
  title: "Design System/Molecules/NavItem",
  component: NavItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 20rem)", display: "grid", gap: ".35rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Projects",
    description: "Library and filters",
    href: "/dashboard",
    trailing: "12",
  },
};

export const Active: Story = {
  args: {
    label: "Planning",
    description: "Weekly calendar",
    active: true,
    trailing: "5/7",
  },
};

export const List: Story = {
  render: () => (
    <>
      <ListItem label="Semaine type" description="Created today" trailing="Load" />
      <ListItem label="Sprint courant" description="6 items" trailing="Saved" active />
      <ListItem label="Archive" description="Indisponible" trailing="Verrouillé" disabled />
    </>
  ),
};
