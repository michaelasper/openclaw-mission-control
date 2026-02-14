/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core neutral palette
        void: '#0f1115',
        abyss: '#13161b',
        deep: '#171b21',
        surface: '#1d222a',
        elevated: '#262d38',
        muted: '#3a4352',
        
        // Primary accent (muted blue)
        cyan: {
          glow: '#7aa2ff',
          bright: '#6f95f7',
          DEFAULT: '#5f84e8',
          dim: '#4c68b8',
        },
        
        // Secondary accent
        magenta: {
          glow: '#9e8cff',
          bright: '#8f7ef0',
          DEFAULT: '#7d6ddc',
          dim: '#6559b8',
        },
        
        // Tertiary accent
        violet: {
          glow: '#8fb0ff',
          bright: '#799af0',
          DEFAULT: '#6686db',
        },
        
        // Status colors
        success: '#3fb884',
        warning: '#d39b52',
        danger: '#d06969',
        info: '#5f84e8',
        
        // Text
        'text-primary': '#e8edf5',
        'text-secondary': '#b3becf',
        'text-muted': '#7f8a9d',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        body: ['Sora', 'sans-serif'],
        reading: ['Source Serif 4', 'Georgia', 'Times New Roman', 'serif'],
        code: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 8px 24px rgba(95, 132, 232, 0.22)',
        'glow-magenta': '0 8px 24px rgba(125, 109, 220, 0.2)',
        'glow-violet': '0 8px 24px rgba(102, 134, 219, 0.2)',
        'glow-success': '0 8px 20px rgba(63, 184, 132, 0.2)',
        'glow-warning': '0 8px 20px rgba(211, 155, 82, 0.2)',
        'glow-danger': '0 8px 20px rgba(208, 105, 105, 0.2)',
        'inner-glow': 'inset 0 0 0 1px rgba(127, 138, 157, 0.2)',
        'glass': '0 8px 24px rgba(5, 7, 10, 0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': `
          linear-gradient(rgba(127, 138, 157, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(127, 138, 157, 0.06) 1px, transparent 1px)
        `,
        'holographic': 'linear-gradient(135deg, rgba(95, 132, 232, 0.12) 0%, rgba(125, 109, 220, 0.12) 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'gradient-rotate': 'gradient-rotate 4s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 245, 255, 0.3), 0 0 10px rgba(0, 245, 255, 0.2)' },
          '50%': { boxShadow: '0 0 15px rgba(0, 245, 255, 0.5), 0 0 30px rgba(0, 245, 255, 0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
