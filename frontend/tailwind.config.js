/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        nobre: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fa',
          400: '#36a7f4',
          500: '#0c8de2',
          600: '#0170c1',
          700: '#02599d',
          800: '#064c81',
          900: '#0a3f6c',
          950: '#072847',
        },
        ouro: {
          400: '#e5c07b',
          500: '#c5a059',
          600: '#a68038',
        }
      }
    },
  },
  plugins: [],
}
