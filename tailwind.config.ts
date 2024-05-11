import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        slide_in: {
          from: {
            opacity: "0",
            transform: "translateY(600px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
      },
      animation: {
        slideIn: "slide_in .3s linear 1 ",
      },
      colors: {
        light: "var(--background-color)",
        "header-bg-primary": "var(--header-background-color)",
        "text-primary": "var(--text-color)",
        "link-primary": "var(--link-color)",
        "btn-primary": "var(--button-color)",
        "btn-text": "var(--button-text-color)",
        accent: "var(--accent-color)",
        highlight: "var(--highlight-color)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
