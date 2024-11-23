/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}', // Scans all `.html` and `.ts` files in the `src` directory.
    './public/**/*.html',   // Scans `.html` files in the `public` directory.
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#93C5FD',
          500: '#3B82F6',
          600: '#2563EB', // Define primary-600
          700: '#1D4ED8',
        },
      },
    },
  },
  plugins: [],
};
