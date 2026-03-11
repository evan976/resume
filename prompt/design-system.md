# Design System Prompt

You are working on the styling layer of **Vitae**. All styles live in `src/styles/index.css` using **TailwindCSS v4**.

## Token Architecture

Vitae uses a two-layer CSS variable system:

```
Theme layer (core/themes.ts)          Style layer (src/styles/index.css)
─────────────────────────────         ──────────────────────────────────
--theme-primary                  →    --color-theme-primary   (TW token)
--theme-accent                   →    --color-theme-accent
--theme-text                     →    --color-theme-text
--theme-text-muted               →    --color-theme-text-muted
--theme-border                   →    --color-theme-border
--theme-marker                   →    --color-theme-marker
--theme-bg-page                  →    --color-theme-bg-page
--theme-bg-content               →    --color-theme-bg-content
```

- `--theme-*` are raw CSS custom properties injected by the Vite plugin via `<style id="theme-vars">`.
- `--color-theme-*` are TailwindCSS v4 design tokens, registered inside `@theme {}` in `index.css`.
- Always reference colors via Tailwind utility classes (`text-theme-primary`, `bg-theme-bg-content`, etc.), never via raw `var(--theme-*)` in component styles.

## TailwindCSS v4 Specifics

- Config is CSS-first: no `tailwind.config.js`. All customization is in `@theme {}` inside `index.css`.
- Custom width token: `--width-a4: 210mm` → `w-a4` utility.
- Font stack is defined as `--font-sans` and referenced with `font-sans`.

## Layout Structure

```
body (.bg-theme-bg-page)
└── .main  (210mm wide, centered, white card, p-12)
    ├── .basic-info       (flex row, dashed bottom border)
    │   └── .left
    │       ├── .name     (h1)
    │       ├── .target   (bold, xl)
    │       └── .list     (flex wrap, contact items)
    └── .main-content
        ├── h2            (section headers, mt-8)
        ├── h3            (company/project names, mt-7)
        ├── p             (text-theme-text-muted)
        └── ul / li       (list-disc, marker uses --theme-marker)
```

## Responsive Breakpoints

- `max-width: 820px` — mobile/narrow viewport adjustments:
  - `.main`: removes margin, reduces padding to `p-6`
  - `.basic-info`: switches from row to column layout
  - `.basic-info .list li`: min-width changes from `1/3` to `1/2`
  - `.education p`: switches from flex-row to flex-col

## Dark Mode Strategy

Three tiers, in priority order:

1. `[data-theme="dark"]` on `<html>` — explicit user override (highest)
2. `[data-theme="light"]` on `<html>` — explicit light override
3. `@media (prefers-color-scheme: dark)` with `:root:not([data-theme="light"])` — system default

Theme toggle state is persisted in `localStorage` under the key `"theme"`.

## Print Styles

```css
@media print {
  @page { margin: 50px 0; }
  @page :first { margin-top: 0; }
  body { background-color: white; print-color-adjust: exact; }
  .theme-toggle { display: none; }
}
```

- `print-color-adjust: exact` is required for background colors to appear in PDF output.
- The `.theme-toggle` button is hidden from print/PDF.

## Rules

- **Never hardcode color values** in `index.css`. Use only `text-theme-*`, `bg-theme-*`, `border-theme-*` utilities.
- **Never modify** the `--theme-*` variable names — they are the contract between `core/themes.ts` and the CSS layer.
- Keep the `@theme {}` block as the single registration point for all design tokens.
- New layout sections should follow the existing class-based BEM-lite naming (`.basic-info`, `.main-content`, `.education`).
