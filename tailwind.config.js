/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#F2FDF7',
          100: '#E0F9EC',
          200: '#B4F0CD',
          300: '#7FE6AA',
          400: '#4FD68B',
          500: '#2DB872',
          600: '#22995E',
          700: '#1A7A52',
          800: '#145A3E',
          900: '#0B3D2E',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
