/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F5F0',
        charcoal: '#242424',
        sage: '#A5B5A0',
        rose: '#D6A6A1'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
