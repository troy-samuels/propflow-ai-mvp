/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // TutorLingua color palette
      colors: {
        // TutorLingua brand colors
        stone: {
          50: '#FDF8F5',    // TutorLingua background
          100: '#F5EDE8',   // TutorLingua secondary
          200: '#E8D5CC',
          300: '#D1B8A8',
          400: '#B89B84',
          500: '#9F7E60',
          600: '#86633C',
          700: '#6B5030',
          800: '#503C24',
          900: '#2D2A26',   // TutorLingua foreground
          950: '#1A1917',
        },
        orange: {
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDC9',
          300: '#FDAAA4',
          400: '#FB7970',
          500: '#F04438',
          600: '#D36135',    // TutorLingua primary
          700: '#B85129',    // TutorLingua primary-button
          800: '#9C2A10',
          900: '#7F1D1D',
        },
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#3E5641',    // TutorLingua accent
          900: '#14532D',
        },
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#A24936',    // TutorLingua destructive
          900: '#7F1D1D',
        }
      },
      
      // TutorLingua font families
      fontFamily: {
        'sans': ['Manrope', 'system-ui', 'sans-serif'],
        'serif': ['DM Serif Display', 'Georgia', 'serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      
      // TutorLingua border radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.625rem',      // 10px - TutorLingua base
        'md': '0.75rem',
        'lg': '0.875rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',          // 24px - TutorLingua cards
        'full': '9999px',
      },
      
      // Custom spacing for TutorLingua
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Custom shadows
      boxShadow: {
        'soft': '0 8px 30px rgba(45, 42, 38, 0.04)',
        'hover': '0 20px 40px rgba(45, 42, 38, 0.06)',
        'dramatic': '0 25px 50px rgba(0, 0, 0, 0.25)',
      },
      
      // Animation and transitions
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'shock-pulse': 'shock-pulse 2s ease-in-out infinite',
      },
      
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 8px rgba(164, 73, 54, 0.3))' 
          },
          '50%': { 
            filter: 'drop-shadow(0 0 16px rgba(164, 73, 54, 0.5))' 
          },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-up': {
          'from': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        'shock-pulse': {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'drop-shadow(0 0 8px rgba(164, 73, 54, 0.3))'
          },
          '50%': { 
            transform: 'scale(1.02)',
            filter: 'drop-shadow(0 0 16px rgba(164, 73, 54, 0.5))'
          },
        },
      },
      
      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'tutorlingua-brand': 'linear-gradient(135deg, #D36135 0%, #B85129 100%)',
        'shock-reveal': 'linear-gradient(135deg, #2D2A26 0%, #1A1917 100%)',
      },
    },
  },
  plugins: [],
};