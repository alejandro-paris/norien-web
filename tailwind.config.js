/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        norien: {
          bg: '#050A30',
          gold: '#C5A059',
          goldHover: '#B08D45',
          silver: '#A0A0A0',
          white: '#FAFAFA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'subtle-glow': 'radial-gradient(circle at center, rgba(197, 160, 89, 0.08) 0%, transparent 70%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
