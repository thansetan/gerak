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
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark((d) => !d)}
      className="relative w-[80px] h-[34px] rounded-full bg-surface-secondary 
                 border border-border cursor-pointer
                 transition-colors duration-300
                 focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-indigo-500 dark:focus-visible:outline-amber-400"
    >
      <span
        className="absolute z-10 left-[12px] top-1/2 -translate-y-1/2 text-sm
                   transition-opacity duration-300 select-none"
        style={{ opacity: dark ? 0.35 : 1 }}
      >
        ☀️
      </span>
      <span
        className="absolute z-10 right-[12px] top-1/2 -translate-y-1/2 text-sm
                   transition-opacity duration-300 select-none"
        style={{ opacity: dark ? 1 : 0.35 }}
      >
        🌙
      </span>
      <span
        className={[
          'absolute top-0 w-[40px] h-full rounded-full',
          'bg-white dark:bg-gray-700 shadow-md',
          'transition-[left] duration-300 ease-in-out',
          dark ? 'left-[40px]' : 'left-0',
        ].join(' ')}
      />
    </button>
  )
}
