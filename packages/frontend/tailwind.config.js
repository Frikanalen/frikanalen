// tailwind.config.js
import { heroui } from "@heroui/react";

import vidstack from "@vidstack/react/tailwind.cjs";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "sea-green": {
          50: "#f3faf3",
          100: "#e3f5e5",
          200: "#c9e9cd",
          300: "#9ed7a6",
          400: "#6cbc77",
          500: "#489f55",
          600: "#3b8c47",
          700: "#2e6736",
          800: "#28532f",
          900: "#234429",
          950: "#0f2413",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    vidstack,
    heroui({
      themes: {
        light: {
          colors: {
            background: "#d4e4d9", // or DEFAULT
            foreground: "#11181C", // or 50 to 900 DEFAULT
            primary: {
              100: "#D8F7D2",
              200: "#ADEFA7",
              300: "#72D172",
              400: "#46A350",
              500: "#196628",
              600: "#125726",
              700: "#0C4924",
              800: "#073B20",
              900: "#04301E",
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
          },
        },
        dark: {
          colors: {
            background: "#000000", // or DEFAULT
            foreground: "#ECEDEE", // or 50 to 900 DEFAULT
            primary: {
              100: "#D8F7D2",
              200: "#ADEFA7",
              300: "#72D172",
              400: "#46A350",
              500: "#196628",
              600: "#125726",
              700: "#0C4924",
              800: "#073B20",
              900: "#04301E",
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
          },
        },
      },
    }),
  ],
};

export default config;

// "color-success-100": "#DFFAD7",
//     "color-success-200": "#B9F6B0",
//     "color-success-300": "#88E684",
//     "color-success-400": "#60CD65",
//     "color-success-500": "#32AD44",
//     "color-success-600": "#24943F",
//     "color-success-700": "#197C3A",
//     "color-success-800": "#0F6433",
//     "color-success-900": "#09532F",
//     "color-info-100": "#D6DFFE",
//     "color-info-200": "#ADBFFD",
//     "color-info-300": "#849CFB",
//     "color-info-400": "#6580F8",
//     "color-info-500": "#3353F4",
//     "color-info-600": "#253ED1",
//     "color-info-700": "#192DAF",
//     "color-info-800": "#101E8D",
//     "color-info-900": "#091475",
//     "color-warning-100": "#FEF9CC",
//     "color-warning-200": "#FEF199",
//     "color-warning-300": "#FDE766",
//     "color-warning-400": "#FBDC40",
//     "color-warning-500": "#F9CC02",
//     "color-warning-600": "#D6AB01",
//     "color-warning-700": "#B38C01",
//     "color-warning-800": "#906E00",
//     "color-warning-900": "#775800",
//     "color-danger-100": "#FCE5D2",
//     "color-danger-200": "#FAC5A6",
//     "color-danger-300": "#F19A77",
//     "color-danger-400": "#E37153",
//     "color-danger-500": "#D13821",
//     "color-danger-600": "#B32018",
//     "color-danger-700": "#961014",
//     "color-danger-800": "#790A16",
//     "color-danger-900": "#640617"
