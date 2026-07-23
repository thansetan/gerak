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
      className="text-2xl cursor-pointer select-none
                 transition-transform duration-200 hover:scale-110 active:scale-95
                 focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-indigo-500 dark:focus-visible:outline-amber-400
                 rounded-md"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  )
}
