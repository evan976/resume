/**
 * Resume Theme Configuration
 *
 * Usage: Set the `theme` option in vite.config.ts
 * Example: theme: ThemeName.Ocean
 */

export enum ThemeName {
  Ocean = 'ocean',
  Forest = 'forest',
  Violet = 'violet',
  Sunset = 'sunset',
  Rose = 'rose',
  Midnight = 'midnight',
  Sky = 'sky',
  Amber = 'amber',
}

export interface Theme {
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

export const themes: Record<ThemeName, Theme> = {
  [ThemeName.Ocean]: {
    name: 'Ocean Blue',
    description: 'Classic deep blue, professional and stable',
    colors: {
      primary: '#1b4255',
      accent: '#ff000030',
      text: '#333333',
      textMuted: '#888888',
      border: '#e8e8e8',
      marker: '#bbbbbb',
      bgPage: '#f2f2f2',
      bgContent: '#ffffff',
    }
  },

  [ThemeName.Forest]: {
    name: 'Forest Green',
    description: 'Natural and fresh green tones',
    colors: {
      primary: '#2d5a45',
      accent: '#4a907030',
      text: '#333333',
      textMuted: '#666666',
      border: '#d8e8d8',
      marker: '#88aa88',
      bgPage: '#f5f8f5',
      bgContent: '#ffffff',
    }
  },

  [ThemeName.Violet]: {
    name: 'Elegant Violet',
    description: 'Sophisticated and mysterious purple tones',
    colors: {
      primary: '#5b4a7a',
      accent: '#9b7bb830',
      text: '#333333',
      textMuted: '#777777',
      border: '#e8e0f0',
      marker: '#a090b0',
      bgPage: '#f8f5fa',
      bgContent: '#ffffff',
    }
  },

  [ThemeName.Sunset]: {
    name: 'Sunset Orange',
    description: 'Warm and vibrant orange tones',
    colors: {
      primary: '#c45a2c',
      accent: '#ff8c4230',
      text: '#333333',
      textMuted: '#777777',
      border: '#f0e0d8',
      marker: '#d09070',
      bgPage: '#faf6f2',
      bgContent: '#ffffff',
    }
  },

  [ThemeName.Rose]: {
    name: 'Rose Red',
    description: 'Elegant and soft rose tones',
    colors: {
      primary: '#a04060',
      accent: '#e0708830',
      text: '#333333',
      textMuted: '#777777',
      border: '#f0e0e8',
      marker: '#c090a0',
      bgPage: '#faf5f7',
      bgContent: '#ffffff',
    }
  },

  [ThemeName.Midnight]: {
    name: 'Midnight Black',
    description: 'Calm and restrained dark tones',
    colors: {
      primary: '#2c2c2c',
      accent: '#60606030',
      text: '#333333',
      textMuted: '#666666',
      border: '#d8d8d8',
      marker: '#888888',
      bgPage: '#f0f0f0',
      bgContent: '#ffffff',
    }
  },

  [ThemeName.Sky]: {
    name: 'Sky Blue',
    description: 'Bright and refreshing light blue tones',
    colors: {
      primary: '#2878a8',
      accent: '#5cb8e830',
      text: '#333333',
      textMuted: '#666666',
      border: '#d8e8f0',
      marker: '#88b0c8',
      bgPage: '#f5f9fc',
      bgContent: '#ffffff',
    }
  },

  [ThemeName.Amber]: {
    name: 'Amber Gold',
    description: 'Elegant and luxurious golden tones',
    colors: {
      primary: '#a07030',
      accent: '#d4a04830',
      text: '#333333',
      textMuted: '#777777',
      border: '#e8e0d0',
      marker: '#c0a070',
      bgPage: '#faf8f2',
      bgContent: '#ffffff',
    }
  },
}

export const defaultTheme = ThemeName.Ocean

export function getTheme(name: ThemeName): Theme {
  return themes[name] || themes[defaultTheme]
}

export function generateThemeCSS(theme: Theme): string {
  const { colors } = theme
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

export function getThemeNames(): ThemeName[] {
  return Object.values(ThemeName)
}
