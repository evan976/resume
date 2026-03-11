# Architecture Prompt

You are working on **Vitae**, a Markdown-based resume generator built on Vite. Understand the full data flow before making changes.

## System Overview

```
src/resume.md
     │
     ▼
core/plugin.ts  (Vite plugin, enforce: "post")
     │
     ├─ transformIndexHtml()
     │       ├─ reads src/resume.md
     │       ├─ renders Markdown → HTML via createMarkdownIt()
     │       ├─ injects theme CSS variables via generateThemeCSS()
     │       └─ replaces #[title] and #[content] in index.html shell
     │
     ├─ transform()           — handles *.md imports as JS string exports
     │
     ├─ generateBundle()      — minifies output HTML (html-minifier-terser)
     │
     └─ closeBundle()
             └─ pdfBuilder()  — launches Puppeteer, renders dist/index.html → PDF
                               (skipped when CI=true or VERCEL=true)
```

## Module Responsibilities

| File | Role |
|---|---|
| `core/plugin.ts` | Vite plugin factory; orchestrates the full build pipeline |
| `core/index.ts` | PDF builder (`pdfBuilder`) + markdown-it factory (`createMarkdownIt`) |
| `core/themes.ts` | Theme registry; CSS variable generation for light/dark mode |
| `src/resume.md` | User-facing resume content (Markdown + custom DSL) |
| `src/styles/index.css` | TailwindCSS v4 styles; consumes `--theme-*` CSS variables |
| `src/main.ts` | Browser entry; handles dark/light mode toggle logic |
| `index.html` | Static HTML shell with `#[title]` and `#[content]` placeholders |
| `vite.config.ts` | User configuration; sets pdfName, webTitle, theme, pdfMargin |

## Key Design Decisions

- **Single source of truth**: All resume content lives in `src/resume.md`. The plugin reads it at build time via `fs.readFileSync` — not through Vite's module graph.
- **No frontend framework**: The browser runtime is vanilla TypeScript. No React, Vue, or similar.
- **Plugin enforced post**: `enforce: 'post'` ensures theme CSS injection happens after TailwindCSS processes styles.
- **CSS inlining for PDF**: `pdfBuilder` inlines `<style>` tags into HTML before passing to Puppeteer to avoid `file://` protocol resource loading issues.
- **CI detection**: PDF generation is gated behind `process.env.CI` and `process.env.VERCEL` checks — safe for serverless deployments.

## Data Flow: Dev vs Build

```
Dev  (pnpm dev)
  Vite dev server → transformIndexHtml on each request → hot reload

Build (pnpm build)
  tsc → vite build → transformIndexHtml + generateBundle → closeBundle (PDF)
```

## Constraints

- Do not use `import` to read `src/resume.md` at build time; always use `fs.readFileSync`.
- The `core/` module must remain framework-agnostic — no UI library imports.
- Theme injection must happen inside `transformIndexHtml`, not `generateBundle`, to be available at PDF render time.
- TypeScript strict mode is enabled (`tsconfig.json`). Avoid `any`.
