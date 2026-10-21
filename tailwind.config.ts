import type { Config } from 'tailwindcss'

// Colors are CSS variables defined in app/globals.css, so the same tokens
// drive light and dark mode.
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        card: { DEFAULT: token('card'), foreground: token('card-foreground') },
        popover: { DEFAULT: token('popover'), foreground: token('popover-foreground') },
        primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        destructive: { DEFAULT: token('destructive'), foreground: token('destructive-foreground') },
        warning: { DEFAULT: token('warning'), foreground: token('warning-foreground') },
        success: { DEFAULT: token('success'), foreground: token('success-foreground') },
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        sidebar: {
          DEFAULT: token('sidebar-background'),
          foreground: token('sidebar-foreground'),
          primary: token('sidebar-primary'),
          'primary-foreground': token('sidebar-primary-foreground'),
          accent: token('sidebar-accent'),
          'accent-foreground': token('sidebar-accent-foreground'),
          border: token('sidebar-border'),
          ring: token('sidebar-ring'),
        },
        // Fixed narrative palette for the public landing page's story sections
        // only (see rain_and_renew_visual_landing_page.html). Not theme-aware
        // on purpose, and never used by the dashboard or other app chrome.
        story: {
          night: '#060e1b',
          predawn: '#0c2336',
          sky: '#b5dcdb',
          day: '#f1f7f5',
          deep: '#0a3340',
          river: '#1b6b7a',
          leaf: '#3f7a3c',
          sun: '#f0b83a',
          ink: '#12282e',
          muted: '#4c6168',
          mist: '#e3efec',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
}

export default config
