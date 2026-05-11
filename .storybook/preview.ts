import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "starter-canvas",
      values: [
        { name: "starter-canvas", value: "#f8f5ef" },
        { name: "paper", value: "#fffdf8" },
        { name: "ink", value: "#172033" },
      ],
    },
  },
};

export default preview;
