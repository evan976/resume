# Feature Extension Prompt

You are extending **Vitae** with new functionality. Follow the existing plugin architecture to keep changes minimal and isolated.

## Extension Points

### 1. Add a Markdown-it Plugin

To support new Markdown syntax, register a plugin inside `vite.config.ts`:

```typescript
// vite.config.ts
import myPlugin from 'markdown-it-my-plugin'

markdownToResume({
  markdown: (md) => {
    md.use(myPlugin, { /* options */ })
  },
})
```

The `markdown` callback receives the `MarkdownIt` instance after the built-in plugins (`markdown-it-container`, `markdown-it-attrs`) are already registered, so your plugin runs after them.

Built-in plugins already registered in `createMarkdownIt()` (`core/index.ts`):
- `markdown-it-container` — `:::` block containers with attributes
- `markdown-it-attrs` — `{.class #id key=val}` attribute syntax
- `markdown-it-imsize` — `![alt](url =WxH)` image dimensions (via `vite.config.ts`)

---

### 2. Add a New Plugin Option

Add new user-facing options by extending `PluginOptions` in `core/plugin.ts`:

```typescript
// core/plugin.ts
export interface PluginOptions {
  pdfName: string
  webTitle: string
  markdown: (md: MarkdownIt) => void
  pdfMargin: PdfMarginInput
  theme?: Theme
  myNewOption?: string   // ← add here with a default value
}

export default function plugin(options: PluginOptions) {
  const { myNewOption = 'default' } = options
  // use it in the plugin hooks below
}
```

---

### 3. Inject Additional Content into HTML

Use `transformIndexHtml` for HTML-level modifications. The index.html shell currently uses two placeholders:

| Placeholder | Replaced with |
|---|---|
| `#[title]` | `webTitle` or `pdfName` |
| `#[content]` | Rendered Markdown HTML |

To add your own placeholder:

```typescript
// index.html
<div id="footer">#[footer]</div>

// core/plugin.ts → transformIndexHtml()
return html.replace('#[footer]', generateFooterHTML())
```

---

### 4. Transform the Build Output

Use `generateBundle` to post-process emitted assets. The existing hook minifies HTML — add your transformations alongside it:

```typescript
async generateBundle(_: unknown, bundle: OutputBundle) {
  for (const info of Object.values(bundle)) {
    if (info.type === 'asset' && info.fileName.endsWith('.html')) {
      const asset = info as OutputAsset
      // your transformation here
    }
  }
}
```

---

### 5. Add Post-Build Actions

Use `closeBundle` for actions that run after all files are written to `dist/`. PDF generation already lives here. Add new post-build steps sequentially:

```typescript
async closeBundle() {
  if (process.env.CI || process.env.VERCEL) return

  await pdfBuilder({ name: pdfName, margin: pdfMargin })
  await myPostBuildStep()   // ← runs after PDF
}
```

---

### 6. Add a New Section Layout (CSS + Markdown)

To create a new structured section (e.g. a skills matrix or timeline):

**Step 1** — Add CSS in `src/styles/index.css`:
```css
.skills-grid {
  @apply grid grid-cols-2 gap-4 mt-4;
}
```

**Step 2** — Use the container DSL in `src/resume.md`:
```markdown
::: {.skills-grid}

- JavaScript
- TypeScript

:::
```

---

## Rules

- Do not import UI frameworks into `core/`. Keep it Node.js-only.
- New plugin options should have sensible defaults so existing configs keep working.
- Any new asset type introduced at build time (e.g. fonts, images) must be inlined before PDF generation — see `prompt/pdf-pipeline.md`.
- Keep `transformIndexHtml`, `generateBundle`, and `closeBundle` as the only Vite hooks — do not add `load`, `resolveId`, or `config` hooks without a clear reason.
- Test both `pnpm dev` (hot reload) and `pnpm build` (PDF output) after any plugin change.
