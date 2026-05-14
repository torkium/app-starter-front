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
      default: "app-canvas",
      values: [
        { name: "app-canvas", value: "#fbf7ef" },
        { name: "paper", value: "#fffdf8" },
        { name: "ink", value: "#18231d" },
      ],
    },
  },
};

export default preview;
