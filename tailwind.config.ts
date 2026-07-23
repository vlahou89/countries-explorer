import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'rgb(var(--color-primary-dark) / <alpha-value>)',
        line: 'var(--color-line)',
        shade: 'var(--color-shade)',
        faint: 'var(--color-faint)',
        chip: 'var(--color-chip)',
        button: 'var(--color-button)',
        lightgrey: 'var(--color-lightgrey)',
      },
      boxShadow: {
        bottom: 'var(--shadow-bottom)',
      },
      fontFamily: { sans: ['Lato', 'system-ui', 'sans-serif'] },
    },
  },
} satisfies Config