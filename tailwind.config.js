/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Primary Orange Accent
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        bunk: {
          flagBg: '#fef3c7',    // Amber 100
          flagBorder: '#f59e0b',// Amber 500
          flagText: '#92400e',  // Amber 800
          absentRed: '#ef4444',
          presentGreen: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
