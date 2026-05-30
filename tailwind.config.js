/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        navy: {
          50:  '#f1f5fa',
          100: '#e1eaf3',
          200: '#bcd0e4',
          300: '#8badcd',
          400: '#5786b3',
          500: '#356a9a',
          600: '#265280',
          700: '#1F4E79',
          800: '#193e60',
          900: '#152f48',
          950: '#0d1d2e',
        },
        accent: {
          DEFAULT: '#2E75B6',
          50:  '#eef5fb',
          100: '#d7e7f4',
          500: '#2E75B6',
          600: '#235e96',
        },
        success: { DEFAULT: '#27AE60', soft: '#e6f6ec' },
        warn:    { DEFAULT: '#F39C12', soft: '#fdf1de' },
        danger:  { DEFAULT: '#E74C3C', soft: '#fde7e4' },
        ink: {
          50:  '#f7f8fa',
          100: '#eef0f4',
          200: '#dde1e8',
          300: '#c2c8d3',
          400: '#8a93a3',
          500: '#5b6473',
          600: '#3d4654',
          700: '#283041',
          800: '#1a2030',
          900: '#0e1320',
        },
        telegram: '#229ED9',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        pop:  '0 10px 30px -10px rgba(15, 23, 42, 0.20), 0 4px 10px -4px rgba(15, 23, 42, 0.10)',
        glow: '0 20px 60px -20px rgba(31, 78, 121, 0.45)',
      },
    },
  },
  plugins: [],
};
