import { resolve } from 'path'
import fs from 'fs-extra'
import { createFilter } from '@rollup/pluginutils'
import { minify as minifyHtml } from 'html-minifier-terser'
import { createMarkdownIt, pdfBuilder, __dirname } from './index'
import MarkdownIt from 'markdown-it'
import type { OutputAsset, OutputBundle } from 'rollup'
import { Theme } from './themes'
import type { PdfMarginInput } from './index'

export interface PluginOptions {
  pdfName: string
  webTitle: string
  markdown: (md: MarkdownIt) => void
  pdfMargin: PdfMarginInput
  /** Theme to apply */
  theme?: Theme
}

export default function plugin(options: PluginOptions) {
  const { pdfName, webTitle, markdown, pdfMargin, theme = 'ocean' } = options

  return {
    name: 'build',
    enforce: 'post' as const,

    async transformIndexHtml(html: string) {
      const { getTheme, generateThemeCSS } = await import('./themes')
      const themeConfig = getTheme(theme)
      const themeCSS = generateThemeCSS(themeConfig)

      const md = createMarkdownIt(markdown)
      const readme = fs.readFileSync(resolve(__dirname, '../src/resume.md')).toString()

      // Inject theme CSS before </head>
      const themeStyle = `<style id="theme-vars">${themeCSS}</style>`
      const htmlWithTheme = html.replace('</head>', `${themeStyle}\n</head>`)

      return htmlWithTheme
        .replace('#[title]', webTitle || pdfName || 'resume')
        .replace('#[content]', md.render(readme))
    },

    transform(val: string, id: string) {
      const filter = createFilter(['**/*.md'])
      if (!filter(id)) return null

      return {
        code: `export default ${JSON.stringify(val)}`
      };
    },

    async generateBundle(_: unknown, bundle: OutputBundle) {
      for (const info of Object.values(bundle)) {
        const filter = createFilter(['**/*.html'])
        if (info.type === 'asset' && filter(info.fileName)) {
          const asset = info as OutputAsset
          const source = typeof asset.source === 'string'
            ? asset.source
            : Buffer.from(asset.source).toString('utf-8')
          asset.source = await minifyHtml(source, {
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            minifyCSS: true,
          })
        }
      }
    },

    async closeBundle() {
      // Skip PDF generation in CI environments (Vercel, GitHub Actions, etc.)
      if (process.env.CI || process.env.VERCEL) {
        console.log('Skipping PDF generation in CI environment')
        return
      }
      await pdfBuilder({
        name: pdfName,
        margin: pdfMargin
      })
    }
  }
}
