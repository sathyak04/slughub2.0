import type { Config } from "tailwindcss";

export default {
  // === REQUIRED CHANGE HERE ===
  // This tells Tailwind to enable dark mode when the 'dark' class is present on the HTML tag.
  darkMode: 'class', 
  // ============================
  
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;