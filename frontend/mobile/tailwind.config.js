/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F8F3EA",
          50: "#FAF7F2",
          100: "#F5EFEB",
          200: "#EFE6DE",
          300: "#E3D5C8",
          400: "#D4BFA9",
        },
        brown: {
          DEFAULT: "#8A6652",
          50: "#F7F5F3",
          100: "#EBE5E0",
          200: "#D7CCC2",
          300: "#C0AEA0",
          400: "#A58C7A",
          500: "#8A6652",
          600: "#70503E",
          700: "#573D2F",
          800: "#412C21",
          900: "#2C1D16",
          950: "#1A100B",
        },
        burgundy: {
          DEFAULT: "#641F2A",
          50: "#FDF2F3",
          100: "#FBE4E7",
          200: "#F6CCD1",
          300: "#EFA4AD",
          400: "#E47080",
          500: "#D24054",
          600: "#BA273C",
          700: "#9C1C2E",
          800: "#811B2A",
          900: "#641F2A",
          950: "#3D0C13",
        },
        emerald: {
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
      },
    },
  },
  plugins: [],
};
