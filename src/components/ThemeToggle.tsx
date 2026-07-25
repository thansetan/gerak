import { useEffect, useState } from 'react'

function getInitialTheme(): boolean {
  if (typeof document === 'undefined') return false
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getInitialTheme()
    setDark(initial)
    document.documentElement.classList.toggle('dark', initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const toggle = () => document.documentElement.classList.toggle('dark', dark)
    if ('startViewTransition' in document) {
      document.startViewTransition(() => toggle())
    } else {
      toggle()
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark, mounted])

  if (!mounted) {
    return (
      <button
        disabled
        className="font-mono text-xs font-medium tracking-tight border-2 border-border w-14 py-0.5 text-center bg-text text-bg"
      >
        THEME
      </button>
    )
  }

  return (
    <button
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark((d) => !d)}
      className="font-mono text-xs font-medium tracking-tight border-2 border-border w-14 py-0.5 cursor-pointer
                 text-center bg-text text-bg transition-colors duration-150
                 active:translate-x-px active:translate-y-px"
    >
      {dark ? 'LIGHT' : 'DARK'}
    </button>
  )
}
