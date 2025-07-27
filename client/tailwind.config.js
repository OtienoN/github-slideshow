/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Kingdom Snacks Brand Colors
        primary: {
          50: '#fff8f1',
          100: '#ffecd1',
          200: '#ffd4a3',
          300: '#ffb366',
          400: '#ff8c00', // Main orange
          500: '#e67e00',
          600: '#cc7000',
          700: '#b35f00',
          800: '#994f00',
          900: '#804000',
        },
        secondary: {
          50: '#fefaf8',
          100: '#fdf2e9',
          200: '#fbe5d6',
          300: '#f7d1b8',
          400: '#f1b896',
          500: '#e89c74', // Cream/off-white
          600: '#db7f52',
          700: '#c96437',
          800: '#b4532b',
          900: '#9c4524',
        },
        accent: {
          50: '#f7f3f0',
          100: '#ede2db',
          200: '#dbc4b8',
          300: '#c4a090',
          400: '#a67c69', // Light brown
          500: '#8b5f47',
          600: '#744a37',
          700: '#5d3a2a',
          800: '#4a2e20',
          900: '#3c251a',
        },
        // Status colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Neutral grays
        gray: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(255, 140, 0, 0.3)',
        'glow-sm': '0 0 10px rgba(255, 140, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ff8c00\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Custom plugin for Kingdom Snacks utilities
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.text-gradient': {
          'background': 'linear-gradient(45deg, #ff8c00, #ff6b35)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };

      const newComponents = {
        '.btn-primary': {
          '@apply bg-primary-400 hover:bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-soft hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-primary-300': {},
        },
        '.btn-secondary': {
          '@apply bg-secondary-200 hover:bg-secondary-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-soft hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-secondary-300': {},
        },
        '.btn-outline': {
          '@apply border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-300': {},
        },
        '.card': {
          '@apply bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300 border border-gray-100': {},
        },
        '.card-hover': {
          '@apply transform hover:scale-105 transition-transform duration-300': {},
        },
        '.input-primary': {
          '@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-colors duration-200 placeholder-gray-400': {},
        },
      };

      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
};