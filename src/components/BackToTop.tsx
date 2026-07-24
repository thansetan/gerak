import { useState, useEffect } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' as ScrollBehavior })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40 font-mono text-xs font-medium uppercase tracking-tight
                  border-2 border-border bg-surface text-text px-3 py-1.5 cursor-pointer
                  transition-all duration-200 hover:bg-text hover:text-bg
                  ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label="Back to top"
    >
      ^ TOP
    </button>
  )
}
