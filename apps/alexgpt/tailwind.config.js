/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        alex: {
          primary: '#6366f1',
          dark: '#0f0f23',
          card: '#1a1a2e',
          accent: '#818cf8',
        },
      },
    },
  },
  plugins: [],
}
