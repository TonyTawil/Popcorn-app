/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D84315',
          dark: '#BF360C',
        },
        accent: '#FFC107',
        background: '#000000',
        text: '#FFFFFF',
      }
    },
  },
  plugins: [],
}

