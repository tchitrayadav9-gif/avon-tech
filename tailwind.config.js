/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        enterprise: {
          50: '#f5f7fa',
          100: '#e4e8f0',
          200: '#c8d1e0',
          300: '#9fb0cc',
          400: '#6d88b3',
          500: '#4a6799',
          600: '#38507a',
          700: '#2e3e5f',
          800: '#1e2942',
          900: '#141c2c',
          950: '#0d121e',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        }
      }
    },
  },
  plugins: [],
}
