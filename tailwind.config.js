/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#000000',
        text: '#ffffff',
        accent: '#1428af',
        accentSoft: '#608fff',
        support: '#2e86ab',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(96, 143, 255, 0.3), 0 0 24px rgba(20, 40, 175, 0.28)',
        card: '0 0 0 1px rgba(96, 143, 255, 0.25), 0 14px 34px rgba(0, 0, 0, 0.55)',
      },
      backgroundImage: {
        'lab-grid': 'linear-gradient(rgba(96, 143, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 143, 255, 0.08) 1px, transparent 1px)',
        'hero-radial': 'radial-gradient(circle at 12% 12%, rgba(20, 40, 175, 0.38), transparent 35%), radial-gradient(circle at 85% 16%, rgba(46, 134, 171, 0.3), transparent 38%)',
        'chip-gradient': 'linear-gradient(130deg, rgba(20, 40, 175, 0.22), rgba(96, 143, 255, 0.08))',
      },
      animation: {
        pulseline: 'pulseline 5s ease-in-out infinite',
      },
      keyframes: {
        pulseline: {
          '0%, 100%': { opacity: '0.24' },
          '50%': { opacity: '0.64' },
        },
      },
    },
  },
  plugins: [],
}
