import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paper brand system — theme-aware via CSS variables (light/dark)
        paper: {
          DEFAULT: "rgb(var(--c-paper) / <alpha-value>)",
          deep: "rgb(var(--c-paper-deep) / <alpha-value>)",
          card: "rgb(var(--c-paper-card) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          soft: "rgb(var(--c-ink-soft) / <alpha-value>)",
          faint: "rgb(var(--c-ink-faint) / <alpha-value>)",
          line: "rgb(var(--c-ink-line) / <alpha-value>)",
        },
        crow: {
          DEFAULT: "rgb(var(--c-crow) / <alpha-value>)",
          deep: "rgb(var(--c-crow-deep) / <alpha-value>)",
          tint: "rgb(var(--c-crow-tint) / <alpha-value>)",
        },
        // Dark surface for terminal / operator console blocks
        roost: {
          DEFAULT: "rgb(var(--c-roost) / <alpha-value>)",
          card: "rgb(var(--c-roost-card) / <alpha-value>)",
          line: "rgb(var(--c-roost-line) / <alpha-value>)",
        },
        // Legacy tokens kept so the /app operator preview still renders
        glass: {
          100: "rgba(255, 255, 255, 0.06)",
          200: "rgba(255, 255, 255, 0.1)",
          300: "rgba(255, 255, 255, 0.16)",
        },
        brand: {
          neon: "#5ef2ff",
          violet: "#9f7bff",
          mint: "#4df0b5",
          danger: "#f87171",
        },
      },
      spacing: {
        18: "4.5rem",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        block: "4px 4px 0 0 rgb(var(--shadow-color))",
        "block-sm": "3px 3px 0 0 rgb(var(--shadow-color))",
        "block-red": "4px 4px 0 0 rgb(var(--c-crow))",
        lift: "0 18px 50px -24px rgb(var(--shadow-color) / 0.35)",
        card: "0 10px 30px rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        blink: "blink 1.1s step-end infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
