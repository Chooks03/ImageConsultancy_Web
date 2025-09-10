import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-vertical-stripes", // ✅ keep custom stripes
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        tennisCourt: "#53885E",
        darkSpruce: "#003320",
        babyBlush: "#FFE9F8",
        pinkyPromise: "#EC99AF",
        whimsicalEvening: "#CD83A8",
      },
      fontFamily: {
        "menu-serif": ["Libre Baskerville", "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
