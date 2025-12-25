# Resume

A minimal Markdown-based resume generator that outputs both HTML and PDF.

## Features

- ✍️ Write your resume in Markdown
- 🎨 Customizable styles with SCSS
- 📄 Auto-generates PDF on build
- ⚡ Hot reload during development
- 🖨️ Print-friendly layout

## Tech Stack

- **Vite** - Fast build tool
- **Markdown-it** - Markdown parser with plugins
- **Puppeteer** - PDF generation
- **SCSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Google Chrome (for PDF generation)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

Generates HTML and PDF in the `dist/` folder:

```bash
pnpm build
```

## Usage

1. Edit your resume in `src/resume.md`
2. Customize styles in `src/styles/`
3. Configure output settings in `vite.config.ts`:

```typescript
markdownToResume({
  pdfName: 'Your_Name_Resume',
  webTitle: 'Your Name - Resume',
  pdfMargin: 0,
})
```

## Project Structure

```
├── src/
│   ├── resume.md        # Your resume content
│   └── styles/          # SCSS styles
├── core/
│   ├── index.ts         # PDF builder & Markdown config
│   └── plugin.ts        # Vite plugin
├── dist/                # Build output
└── vite.config.ts       # Vite configuration
```

## License

MIT
