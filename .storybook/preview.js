import "../src/app/globals.css";

/** @type { import("@storybook/react").Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#121212",
        },
      ],
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview; 