# Theme Authoring Prompt

You are adding or modifying a color theme in **Vitae**. All theme logic lives in `core/themes.ts`.

## Theme Data Model

```typescript
interface ThemeColors {
  primary: string      // Headings, links, bold text, section titles
  accent: string       // Decorative elements (e.g. dashed divider line)
  text: string         // Main body text
  textMuted: string    // Secondary text (descriptions, list items)
  border: string       // Dividers, card borders
  marker: string       // List bullet (::marker pseudo-element)
  bgPage: string       // Outer page background
  bgContent: string    // Inner content card background
}

interface ThemeConfig {
  name: string         // Display name (e.g. "Ocean Blue")
  description: string  // Short description (e.g. "Classic deep blue")
  colors: ThemeColors  // Light mode colors (required)
  darkColors?: ThemeColors  // Dark mode colors (optional; auto-generated if omitted)
}
```

## Adding a New Theme — Checklist

### 1. Extend the `Theme` union type

```typescript
// core/themes.ts
export type Theme =
  | 'ocean' | 'forest' | 'violet' | 'sunset'
  | 'rose' | 'midnight' | 'sky' | 'amber'
  | 'yourNewTheme'   // ← add here
```

### 2. Add a `ThemeConfig` entry to the `themes` record

```typescript
export const themes: Record<Theme, ThemeConfig> = {
  // ... existing themes ...

  yourNewTheme: {
    name: 'Your Theme Name',
    description: 'A short description',
    colors: {
      primary:    'var(--color-indigo-700)',
      accent:     'color-mix(in oklch, var(--color-indigo-400) 30%, transparent)',
      text:       'var(--color-gray-700)',
      textMuted:  'var(--color-gray-500)',
      border:     'var(--color-indigo-100)',
      marker:     'var(--color-indigo-400)',
      bgPage:     'var(--color-indigo-50)',
      bgContent:  'var(--color-white)',
    },
    darkColors: {
      primary:    'var(--color-indigo-400)',
      accent:     'color-mix(in oklch, var(--color-indigo-400) 30%, transparent)',
      marker:     'var(--color-indigo-600)',
      ...darkBase,   // reuse shared dark text/border/bg tokens
    },
  },
}
```

### 3. Activate in `vite.config.ts`

```typescript
markdownToResume({
  theme: 'yourNewTheme',
})
```

---

## Color Value Conventions

All color values must use **TailwindCSS v4 built-in color variables**, not raw hex or `rgb()`:

```typescript
// ✅ Good
primary: 'var(--color-cyan-800)'
accent:  'color-mix(in oklch, var(--color-red-500) 30%, transparent)'

// ❌ Bad
primary: '#0e7490'
accent:  'rgba(239, 68, 68, 0.3)'
```

Available palettes: `slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` — each with shades `50`–`950`.

## Shared Dark Base

```typescript
const darkBase = {
  text:      'var(--color-neutral-100)',
  textMuted: 'var(--color-neutral-400)',
  border:    'var(--color-neutral-700)',
  bgPage:    'var(--color-black)',
  bgContent: 'var(--color-neutral-900)',
}
```

Always spread `...darkBase` in `darkColors` — only override `primary`, `accent`, and `marker`.

## CSS Variable Output

`generateThemeCSS(themeConfig)` produces this structure injected into the page `<head>`:

```css
/* Light mode */
:root {
  --theme-primary: ...;
  --theme-accent: ...;
  --theme-text: ...;
  --theme-text-muted: ...;
  --theme-border: ...;
  --theme-marker: ...;
  --theme-bg-page: ...;
  --theme-bg-content: ...;
}

/* Dark mode — system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { ... }
}

/* Dark mode — manual override */
:root[data-theme="dark"] { ... }
```

## Rules

- Never hardcode colors — only use `var(--color-*)` TailwindCSS tokens.
- Light mode `colors` is required; `darkColors` is optional but recommended.
- Do not change `colorsToCSS()` or `generateThemeCSS()` — they are the serialization contract.
- Do not remove existing themes; they may be in use by consumers of this template.
