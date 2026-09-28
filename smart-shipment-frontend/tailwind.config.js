export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        darkPanel: '#111111',
        darkBorder: '#222222',
        brand: '#0066FF',
        brandHover: '#0052CC',
        textMain: '#EDEDED',
        textMuted: '#A1A1AA',
        status: {
          transit: '#3b82f6', // blue
          delivered: '#10b981', // green
          delayed: '#f59e0b', // amber
          exception: '#ef4444', // red
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
