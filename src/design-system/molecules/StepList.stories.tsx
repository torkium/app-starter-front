import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StepList } from "@/design-system/molecules";

const meta = {
  title: "Design System/Molecules/StepList",
  component: StepList,
  args: {
    "aria-label": "Prochaines étapes",
    items: [
      {
        title: "Confirmer l'email",
        description: "Validez l'adresse associée au compte.",
      },
      {
        title: "Ouvrir l'espace",
        description: "Retrouvez les informations préparées pendant l'inscription.",
      },
    ],
  },
} satisfies Meta<typeof StepList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
