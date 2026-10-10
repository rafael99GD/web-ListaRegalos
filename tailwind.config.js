/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          dark: '#081510',
          forest: '#0F291E',
          pine: '#183B2B',
          emerald: '#235942',
          wine: '#5C141C',
          cranberry: '#8C1D2B',
          ruby: '#B32638',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          goldDark: '#997A15',
          parchment: '#FBF8F2',
          parchmentMuted: '#EFE9DE',
          card: '#14251F',
          border: '#274B3B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
        display: ['"Cinzel"', 'serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'glow-ruby': '0 0 25px -5px rgba(179, 38, 56, 0.4)',
        'card-holiday': '0 12px 35px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'festive-gradient': 'radial-gradient(ellipse at top, #1A4031 0%, #0D241B 50%, #071510 100%)',
        'parchment-pattern': 'linear-gradient(135deg, #FBF8F2 0%, #F5EFE3 100%)',
      }
    },
  },
  plugins: [],
}
