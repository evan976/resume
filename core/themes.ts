/**
 * Resume Theme Configuration
 *
 * Usage: Set the `theme` option in vite.config.ts
 * Example: theme: 'ocean'
 *
 * All colors use TailwindCSS v4 built-in color variables
 */

export type Theme = 'ocean' | 'forest' | 'violet' | 'sunset' | 'rose' | 'midnight' | 'sky' | 'amber'

export interface ThemeConfig {
  name: string
  description: string
  colors: {
    /** Primary color - headings, links, etc. */
    primary: string
    /** Accent color - decorative lines, etc. */
    accent: string
    /** Body text color */
    text: string
    /** Secondary text color - descriptions, lists, etc. */
    textMuted: string
    /** Border color */
    border: string
    /** List marker color */
    marker: string
    /** Page background color */
    bgPage: string
    /** Content area background color */
    bgContent: string
  }
}

export const themes: Record<Theme, ThemeConfig> = {
  ocean: {
    name: 'Ocean Blue',
    description: 'Classic deep blue, professional and stable',
    colors: {
      primary: 'var(--color-cyan-800)',
      accent: 'color-mix(in oklch, var(--color-red-500) 30%, transparent)',
      text: 'var(--color-gray-700)',
      textMuted: 'var(--color-gray-500)',
      border: 'var(--color-gray-200)',
      marker: 'var(--color-gray-400)',
      bgPage: 'var(--color-gray-100)',
      bgContent: 'var(--color-white)',
    }
  },

  forest: {
    name: 'Forest Green',
    description: 'Natural and fresh green tones',
    colors: {
      primary: 'var(--color-emerald-700)',
      accent: 'color-mix(in oklch, var(--color-emerald-500) 30%, transparent)',
      text: 'var(--color-gray-700)',
      textMuted: 'var(--color-gray-500)',
      border: 'var(--color-emerald-100)',
      marker: 'var(--color-emerald-400)',
      bgPage: 'var(--color-emerald-50)',
      bgContent: 'var(--color-white)',
    }
  },

  violet: {
    name: 'Elegant Violet',
    description: 'Sophisticated and mysterious purple tones',
    colors: {
      primary: 'var(--color-violet-700)',
      accent: 'color-mix(in oklch, var(--color-violet-400) 30%, transparent)',
      text: 'var(--color-gray-700)',
      textMuted: 'var(--color-gray-500)',
      border: 'var(--color-violet-100)',
      marker: 'var(--color-violet-400)',
      bgPage: 'var(--color-violet-50)',
      bgContent: 'var(--color-white)',
    }
  },

  sunset: {
    name: 'Sunset Orange',
    description: 'Warm and vibrant orange tones',
    colors: {
      primary: 'var(--color-orange-600)',
      accent: 'color-mix(in oklch, var(--color-orange-400) 30%, transparent)',
      text: 'var(--color-gray-700)',
      textMuted: 'var(--color-gray-500)',
      border: 'var(--color-orange-100)',
      marker: 'var(--color-orange-400)',
      bgPage: 'var(--color-orange-50)',
      bgContent: 'var(--color-white)',
    }
  },

  rose: {
    name: 'Rose Red',
    description: 'Elegant and soft rose tones',
    colors: {
      primary: 'var(--color-rose-600)',
      accent: 'color-mix(in oklch, var(--color-rose-400) 30%, transparent)',
      text: 'var(--color-gray-700)',
      textMuted: 'var(--color-gray-500)',
      border: 'var(--color-rose-100)',
      marker: 'var(--color-rose-400)',
      bgPage: 'var(--color-rose-50)',
      bgContent: 'var(--color-white)',
    }
  },

  midnight: {
    name: 'Midnight Black',
    description: 'Calm and restrained dark tones',
    colors: {
      primary: 'var(--color-slate-800)',
      accent: 'color-mix(in oklch, var(--color-slate-500) 30%, transparent)',
      text: 'var(--color-gray-700)',
      textMuted: 'var(--color-gray-500)',
      border: 'var(--color-gray-300)',
      marker: 'var(--color-gray-500)',
      bgPage: 'var(--color-gray-100)',
      bgContent: 'var(--color-white)',
    }
  },

  sky: {
    name: 'Sky Blue',
    description: 'Bright and refreshing light blue tones',
    colors: {
      primary: 'var(--color-sky-600)',
      accent: 'color-mix(in oklch, var(--color-sky-400) 30%, transparent)',
      text: 'var(--color-gray-700)',
      textMuted: 'var(--color-gray-500)',
      border: 'var(--color-sky-100)',
      marker: 'var(--color-sky-400)',
      bgPage: 'var(--color-sky-50)',
      bgContent: 'var(--color-white)',
    }
  },

  amber: {
    name: 'Amber Gold',
    description: 'Elegant and luxurious golden tones',
    colors: {
      primary: 'var(--color-amber-600)',
      accent: 'color-mix(in oklch, var(--color-amber-400) 30%, transparent)',
      text: 'var(--color-gray-700)',
      textMuted: 'var(--color-gray-500)',
      border: 'var(--color-amber-100)',
      marker: 'var(--color-amber-400)',
      bgPage: 'var(--color-amber-50)',
      bgContent: 'var(--color-white)',
    }
  },
}

export const defaultTheme: Theme = 'ocean'

export function getTheme(theme: Theme) {
  return themes[theme] || themes[defaultTheme]
}

export function generateThemeCSS(themeConfig: ThemeConfig) {
  const { colors } = themeConfig
  return `
:root {
  --theme-primary: ${colors.primary};
  --theme-accent: ${colors.accent};
  --theme-text: ${colors.text};
  --theme-text-muted: ${colors.textMuted};
  --theme-border: ${colors.border};
  --theme-marker: ${colors.marker};
  --theme-bg-page: ${colors.bgPage};
  --theme-bg-content: ${colors.bgContent};
}`.trim()
}

export function getThemeNames() {
  return Object.keys(themes)
}
