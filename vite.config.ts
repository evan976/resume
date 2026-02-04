import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import markdownItImsize from 'markdown-it-imsize'
import markdownToResume from './core/plugin'
import { ThemeName } from './core/themes'

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
      webTitle: '前端_张三_3年经验',
      theme: ThemeName.Midnight,
    })
  ],
  build: {
    assetsDir: './'
  }
})
