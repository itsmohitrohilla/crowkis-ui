import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
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
      boxShadow: {
        glow: "0 0 0 1px rgba(94, 242, 255, 0.2), 0 14px 40px rgba(159, 123, 255, 0.2)",
        card: "0 10px 30px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
