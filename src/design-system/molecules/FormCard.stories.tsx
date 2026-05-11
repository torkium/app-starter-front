import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormCard } from "@/design-system/molecules/FormCard";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";

const meta = {
  title: "Design System/Molecules/FormCard",
  component: FormCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 32rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Create an account",
    description: "A neutral shell for auth and onboarding flows.",
    footer: "No credit card required",
    children: (
      <>
        <Input type="email" placeholder="Email address" />
        <Input type="password" placeholder="Password" />
        <Button>Create account</Button>
      </>
    ),
  },
};
