import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 font-mono text-xs font-medium uppercase tracking-tight
                      border-2 border-border bg-surface text-text px-3 py-1.5 cursor-pointer
                      hover:bg-text hover:text-bg`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          aria-label="Back to top"
        >
          ^ TOP
        </motion.button>
      )}
    </AnimatePresence>
  )
}
