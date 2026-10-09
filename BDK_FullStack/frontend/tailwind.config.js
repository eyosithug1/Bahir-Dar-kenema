/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        'bdk-dark': '#002B5E',
        'bdk-card': 'rgba(255, 255, 255, 0.08)',
        'bdk-primary': '#0055A4',
        'bdk-light': '#4DB8FF',
        'bdk-bg': '#004785',
        'bdk-accent': {
          DEFAULT: '#FFD700',
          500: '#FFD700',
          600: '#E5C100',
        }
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at 50% 50%, rgba(77,184,255,0.2) 0%, rgba(0,71,133,1) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #0055A4 0%, #4DB8FF 100%)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 4s infinite',
        'pulse-glow': 'pulseGlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.02)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.1)' },
        }
      }
    }
  },
  plugins: [],
}
