# PDF Pipeline Prompt

You are working on the PDF generation stage of **Vitae**. This runs in `core/index.ts` via `pdfBuilder()`, called from `core/plugin.ts` in the `closeBundle` hook.

## Pipeline Steps

```
1. Build completes → dist/index.html + dist/*.css written to disk

2. closeBundle() fires (core/plugin.ts)
   └─ guarded: skip if process.env.CI || process.env.VERCEL

3. pdfBuilder({ name, margin }) called (core/index.ts)
   ├─ resolveExecutablePath()  — finds Chrome binary
   ├─ puppeteer.launch({ headless: true, executablePath })
   ├─ page.setContent(inlinedHTML, { waitUntil: 'networkidle0' })
   └─ page.pdf({ format: 'A4', printBackground: true, path: dist/<name>.pdf })
```

## CSS Inlining

Puppeteer uses `page.setContent()` instead of `page.goto('file://...')` to avoid cross-origin resource loading failures. Before calling `setContent`, the pipeline:

1. Reads `dist/index.html` as a string.
2. Finds the `<link rel="stylesheet" href="./*.css">` tag via regex.
3. Reads that CSS file and replaces the `<link>` with an inline `<style>` block.

When modifying the build output structure, ensure the CSS link tag regex still matches:
```js
const cssMatch = html.match(/href="\.\/([^"]+\.css)"/)
```

## Chrome Resolution Order

```
1. process.env.PUPPETEER_EXECUTABLE_PATH
2. puppeteerExecutablePath option in vite.config.ts
3. Platform defaults:
   - macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
             /Applications/Chromium.app/Contents/MacOS/Chromium
   - Windows: C:\Program Files\Google\Chrome\Application\chrome.exe
              C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
   - Linux: /usr/bin/google-chrome, /usr/bin/chromium-browser, /snap/bin/chromium
```

If none found: throws `Error('Chrome executable not found. Set PUPPETEER_EXECUTABLE_PATH...')`.

## Margin Configuration

`pdfMargin` accepts three formats, all mapped to Puppeteer's `PDFOptions.margin`:

```typescript
pdfMargin: 0          // number → sets all four sides to 0
pdfMargin: '10mm'     // string → sets all four sides to '10mm'
pdfMargin: {          // object → explicit per-side control
  top: '20mm',
  bottom: '20mm',
  left: 0,
  right: 0
}
```

## Print CSS Contract

The `@media print` block in `src/styles/index.css` controls the PDF appearance:

- `@page { margin: 50px 0 }` — sets default page margin for multi-page PDFs.
- `@page :first { margin-top: 0 }` — removes top margin on the first page.
- `print-color-adjust: exact` — required for background colors and gradients to render.
- `.theme-toggle { display: none }` — hides the interactive button from PDF.

When `pdfMargin: 0` is set in the plugin options, the Puppeteer margin overrides the `@page` CSS margin.

## CI / Deployment

PDF generation is intentionally skipped in automated environments:

```typescript
if (process.env.CI || process.env.VERCEL) {
  console.log('Skipping PDF generation in CI environment')
  return
}
```

To force PDF generation locally: ensure neither env var is set, and a valid Chrome binary is reachable.

## Rules

- Do not change `waitUntil: 'networkidle0'` — this ensures fonts and styles are fully loaded before capture.
- Always use `printBackground: true` — omitting it causes theme colors to disappear.
- `format: 'A4'` is fixed to match the `.main { width: 210mm }` layout contract.
- If adding new asset types to the build output (fonts, images), they must also be inlined before calling `setContent`.
