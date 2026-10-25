/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF7F0',
          100: '#F7F1E6',
          200: '#EFE3CC',
          300: '#E4D2B0',
          400: '#D4BA8E',
          500: '#C29E6B',
        },
        terracotta: {
          50: '#FBEEE6',
          100: '#F6DAC4',
          200: '#ECB595',
          300: '#E08C66',
          400: '#D26A42',
          500: '#B8501F',
          600: '#963E16',
          700: '#733013',
          800: '#4F2110',
        },
        indigo: {
          50: '#EEF0FB',
          100: '#D7DBF3',
          200: '#AEB4E6',
          300: '#828DDA',
          400: '#5C66CC',
          500: '#3D44B0',
          600: '#2C3289',
          700: '#212663',
          800: '#161944',
          900: '#0C0E2B',
        },
        moss: {
          50: '#F2F7F0',
          100: '#DEEBDB',
          200: '#BCD6B6',
          300: '#94BC8C',
          400: '#6E9D63',
          500: '#527D45',
          600: '#3E6133',
          700: '#2F4A27',
        },
        gold: {
          400: '#E0B84A',
          500: '#C9A233',
          600: '#A8851F',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(60, 40, 20, 0.12)',
        card: '0 10px 40px -16px rgba(60, 40, 20, 0.18)',
        lift: '0 22px 50px -18px rgba(60, 40, 20, 0.28)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-down': 'fade-down 0.4s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
        'slide-in-right': 'slide-in-right 0.3s ease-out both',
        'slide-in-left': 'slide-in-left 0.3s ease-out both',
        'shimmer': 'shimmer 1.6s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
      },
    },
  },
  plugins: [],
};
