import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ReTech Primary Brand Palette
        cream: {
          50: "#FCFAF6",
          100: "#F8F3EA", // Primary Cream
          200: "#EFE5D3",
          300: "#E4D4BB",
          400: "#D3BD98",
          500: "#BF9F72",
          600: "#A68254",
          700: "#86663E",
          800: "#6B5133",
          900: "#55402A",
          DEFAULT: "#F8F3EA",
        },
        brown: {
          50: "#F7F4F2",
          100: "#EDE5E1",
          200: "#DBCAC1",
          300: "#C4ABA0",
          400: "#A98878",
          500: "#8A6652", // Primary Brown
          600: "#755442",
          700: "#5E4334",
          800: "#4D362B",
          900: "#3D2B22",
          DEFAULT: "#8A6652",
        },
        burgundy: {
          50: "#F9ECEE",
          100: "#F3D2D6",
          200: "#E4A7B0",
          300: "#D37987",
          400: "#A13849",
          500: "#7F2736",
          600: "#641F2A", // Primary Burgundy
          700: "#501922",
          800: "#3F141B",
          900: "#2B0D13",
          DEFAULT: "#641F2A",
        },
        // Semantic Dark/Surface Tokens
        surface: {
          light: "#FFFFFF",
          card: "#FFFFFF",
          muted: "#F5EFEB",
          dark: "#1A1513",
          darkCard: "#251E1A",
        },
        accent: {
          green: "#2E7D32",
          teal: "#0D9488",
          amber: "#D97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-outfit)", "Outfit", "sans-serif"],
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(138, 102, 82, 0.12)",
        "warm-lg": "0 10px 25px -3px rgba(100, 31, 42, 0.15), 0 4px 6px -2px rgba(138, 102, 82, 0.08)",
        "burgundy-glow": "0 0 20px rgba(100, 31, 42, 0.35)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
