import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import * as puppeteer from 'puppeteer-core'
import type { PDFOptions } from 'puppeteer-core'
import MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItContainer from 'markdown-it-container'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export type PdfMarginInput = number | string | PDFOptions['margin']

function resolveExecutablePath(puppeteerExecutablePath?: string) {
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH
  const platformDefaults: string[] = []

  if (process.platform === 'darwin') {
    platformDefaults.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    )
  }

  if (process.platform === 'win32') {
    platformDefaults.push(
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Chromium\\Application\\chrome.exe'
    )
  }

  if (process.platform === 'linux') {
    platformDefaults.push(
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium'
    )
  }

  const candidates = [envPath, puppeteerExecutablePath, ...platformDefaults].filter(
    (value): value is string => Boolean(value)
  )

  const resolved = candidates.find((candidate) => fs.pathExistsSync(candidate))
  if (resolved) return resolved

  throw new Error(
    'Chrome executable not found. Set PUPPETEER_EXECUTABLE_PATH or pass puppeteerExecutablePath.'
  )
}

export const pdfBuilder = async (options: {
  name?: string
  margin?: PdfMarginInput
  puppeteerExecutablePath?: string
}) => {
  const { name, margin, puppeteerExecutablePath } = options
  const executablePath = resolveExecutablePath(puppeteerExecutablePath)
  const browser = await puppeteer.launch({
    headless: true,
    executablePath
  })
  const page = await browser.newPage()
  
  // Read HTML and inline CSS to avoid file:// protocol issues
  const distDir = resolve(__dirname, '../dist')
  let html = fs.readFileSync(resolve(distDir, 'index.html'), 'utf-8')
  
  // Find and inline CSS
  const cssMatch = html.match(/href="\.\/([^"]+\.css)"/)
  if (cssMatch) {
    const cssFile = cssMatch[1]
    const css = fs.readFileSync(resolve(distDir, cssFile), 'utf-8')
    html = html.replace(
      `<link rel="stylesheet" crossorigin href="./${cssFile}">`,
      `<style>${css}</style>`
    )
  }
  
  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdfOptions: PDFOptions = {
    path: resolve(__dirname, `../dist/${name || 'resume'}.pdf`),
    format: 'A4',
    displayHeaderFooter: false,
    printBackground: true
  }

  if (margin || margin === 0) {
    if (['string', 'number'].includes(typeof margin)) {
      pdfOptions.margin = {}
      const keys = ['top', 'bottom', 'left', 'right']
      keys.forEach((k) => {
        pdfOptions.margin[k] = margin
      })
    }

    if (typeof margin === 'object') pdfOptions.margin = margin
  }

  await page.pdf(pdfOptions)

  await browser.close()
}

export const createMarkdownIt = (fn: (val: MarkdownIt) => void) => {
  const md = new MarkdownIt()

  if (typeof fn === 'function') fn(md)

  md.use(markdownItContainer, 'container', {
    validate: function (params: string) {
      const reg = /^.*$/
      return reg.test(params.trim())
    },

    render: function (tokens: Token[], idx: number) {
      const token = tokens?.[idx]
      const attrs = token?.attrs

      if (!attrs?.length) {
        return token.nesting === 1 ? '<div class="container">\n' : '</div>\n'
      }

      let attrsStr = ''
      attrs.forEach(([key, val]) => {
        attrsStr += ` ${key}="${val}"`
      })

      return token.nesting === 1 ? `<div${attrsStr}>\n` : `</div>\n`
    }
  })
  md.use(markdownItAttrs)

  return md
}
