import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/design-system/molecules/Card";
import { SidebarShell } from "@/design-system/organisms/SidebarShell";

const meta = {
  title: "Design System/Organisms/SidebarShell",
  component: SidebarShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SidebarShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Workspace: Story = {
  args: {
    navigationItems: [
      { id: "dashboard", href: "/dashboard", label: "Tableau de bord", icon: "⌂", active: true },
      { id: "planning", href: "/dashboard", label: "Planning", icon: "□" },
      { id: "projects", href: "/dashboard", label: "Projets", icon: "☰" },
      { id: "tasks", href: "/dashboard", label: "Tâches", icon: "✓" },
      { id: "reports", href: "/dashboard", label: "Indicateurs", icon: "%" },
    ],
    aside: (
      <Card title="Astuce" description="Regroupe les actions fréquentes dans la navigation." padding="md" />
    ),
    children: (
      <div style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)" }}>Tableau de bord</h1>
        <Card title="Semaine en cours" description="Vue de travail principale." />
      </div>
    ),
  },
};
