/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#34D399',
          light: '#6EE7B7',
          dark: '#059669',
          lighter: '#ECFDF5',
        },
        secondary: {
          DEFAULT: '#60A5FA',
          light: '#BFDBFE',
          dark: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
