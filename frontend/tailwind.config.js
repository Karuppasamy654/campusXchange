/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        teal: {
          50: "#F0FDFA",
          500: "#14B8A6",
          600: "#0D9488",
        },
        coral: {
          500: "#F43F5E",
          600: "#E11D48",
        },
        amber: {
          500: "#F59E0B",
        },
        surface: "#FFFFFF",
        tint: "#F1F5F9",
        charcoal: "#1E293B"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
