import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/design-system/molecules/Card";
import { EmptyState } from "@/design-system/molecules/EmptyState";
import { FormCard } from "@/design-system/molecules/FormCard";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";
import { Section } from "@/design-system/organisms/Section";

const meta = {
  title: "Design System/Organisms/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "Section title",
    titleAs: "h2",
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", padding: "2rem 0" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Hero: Story = {
  args: {
    eyebrow: "Foundation",
    title: "Visual primitives should be reviewable outside product pages.",
    titleAs: "h1",
    description: "Storybook gives the starter a concrete sandbox for spacing, hierarchy, and component states.",
    actions: (
      <>
        <Button>Primary action</Button>
        <Button tone="secondary">Secondary action</Button>
      </>
    ),
  },
  render: (args) => (
    <Section {...args}>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <Card title="Cards" description="Use for compact summaries and navigation clusters." />
        <Card title="Notices" description="Use for system feedback, warnings, and contextual hints." />
        <Card title="Layouts" description="Use sections to keep page rhythm stable across products." />
      </div>
    </Section>
  ),
};

export const EmptyStateExample: Story = {
  render: () => (
    <Section
      eyebrow="Fallback"
      title="Empty states still need a real visual pass."
      titleAs="h2"
      description="The starter should show what a non-happy-path screen actually looks like."
    >
      <EmptyState
        title="No projects yet"
        description="Create your first project to start wiring APIs, auth, and billing from the starter."
        action={<Button>Add a project</Button>}
      />
    </Section>
  ),
};

export const FormExample: Story = {
  render: () => (
    <Section
      eyebrow="Forms"
      title="Form shells should stay legible before any business logic exists."
      titleAs="h2"
      description="This story keeps the focus on spacing, density, and affordances."
    >
      <FormCard title="Create an account" description="A neutral shell for onboarding and auth flows.">
        <Input type="email" placeholder="Email address" />
        <Input type="password" placeholder="Password" />
        <Button>Create account</Button>
      </FormCard>
    </Section>
  ),
};
