import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import markdownItImsize from 'markdown-it-imsize'
import markdownToResume from './core/plugin'

export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    markdownToResume({
      markdown: (md) => {
        md.use(markdownItImsize)
      },
      pdfName: '前端_张三_3年经验',
      pdfMargin: 0,
      webTitle: 'Vitae - A minimal Markdown-based resume generator that outputs both HTML and PDF.',
      theme: 'midnight',
    })
  ],
  build: {
    assetsDir: './'
  }
})
