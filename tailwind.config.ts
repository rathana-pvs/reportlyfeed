import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          hover: 'var(--bg-hover)',
          overlay: 'var(--bg-overlay)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          'primary-hover': 'var(--accent-primary-hover)',
          'primary-light': 'var(--accent-primary-light)',
          'primary-soft': 'var(--accent-primary-soft)',
          breaking: 'var(--accent-breaking)',
          live: 'var(--accent-live)',
          trending: 'var(--accent-trending)',
          success: 'var(--accent-success)',
          warning: 'var(--accent-warning)',
          info: 'var(--accent-info)',
        },
        border: {
          DEFAULT: 'var(--border)',
          light: 'var(--border-light)',
          subtle: 'var(--border-subtle)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      maxWidth: {
        container: 'var(--container)',
      },
      height: {
        header: 'var(--header-height)',
      },
      transitionTimingFunction: {
        fast: 'var(--transition-fast)',
        DEFAULT: 'var(--transition)',
        slow: 'var(--transition-slow)',
      },
    },
  },
  plugins: [],
}

export default config
