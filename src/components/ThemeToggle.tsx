import { useEffect, useState } from 'react'

function getInitialTheme(): boolean {
  if (typeof document === 'undefined') return false
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeToggle() {
  const [dark, setDark] = useState(() => getInitialTheme())

  useEffect(() => {
    const toggle = () => document.documentElement.classList.toggle('dark', dark)
    if ('startViewTransition' in document) {
      document.startViewTransition(() => toggle())
    } else {
      toggle()
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark((d) => !d)}
      className="font-mono text-xs font-medium tracking-tight border-2 border-border px-2 py-0.5 cursor-pointer
                 hover:bg-text hover:text-bg transition-colors duration-150
                 active:translate-x-px active:translate-y-px"
    >
      {dark ? 'LIGHT' : 'DARK'}
    </button>
  )
}
