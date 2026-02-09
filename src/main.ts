import './styles/index.css'
import './resume.md'

// Theme toggle functionality
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle')
  if (!toggle) return

  // Get stored preference or default to 'system'
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') {
    document.documentElement.setAttribute('data-theme', stored)
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme')
    const isDark = current === 'dark' ||
      (!current && window.matchMedia('(prefers-color-scheme: dark)').matches)

    const newTheme = isDark ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  })
}

document.addEventListener('DOMContentLoaded', initThemeToggle)
