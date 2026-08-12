import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Forest green — primary actions, "papan skor" feel
        brand: {
          50: "#eef7f3",
          100: "#d3ebe0",
          200: "#a8d6c1",
          500: "#1F4B3F",
          600: "#17392F",
          700: "#102A22",
        },
        // Trophy gold — highlights, prize badges, "ongoing" state
        gold: {
          50: "#fdf6e3",
          100: "#faedc0",
          400: "#F2B705",
          500: "#D9A404",
        },
        // Rust orange — closed / rejected / warning states
        rust: {
          50: "#fdeee7",
          500: "#E4572E",
          600: "#C8431D",
        },
        ink: "#1C1B19",
        paper: "#F7F7F3",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
