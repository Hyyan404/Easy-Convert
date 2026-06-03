/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8b5cf6', // purple-500
          secondary: '#7c3aed', // purple-600
          accent: '#d8b4fe', // purple-300
          dark: '#0a0a0a',
          surface: '#171717',
          border: '#262626',
        }
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'gradient-dark': 'linear-gradient(180deg, #171717 0%, #0a0a0a 100%)',
      },
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
