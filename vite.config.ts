import { defineConfig } from 'vite'
import markdownItImsize from 'markdown-it-imsize'
import markdownToResume from './core/plugin'

export default defineConfig({
  base: './',
  plugins: [
    markdownToResume({
      markdown: (md) => {
        md.use(markdownItImsize)
      },
      pdfName: '前端_邬继华_4年经验_13547964315',
      pdfMargin: 0,
      webTitle: '前端_邬继华_4年经验_13547964315',
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  build: {
    assetsDir: './'
  }
})
