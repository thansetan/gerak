import { motion } from 'framer-motion'

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-border ${className ?? ''}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 border-2 border-border mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3 border-r-2 border-border last:border-r-0">
            <SkeletonBlock className="h-3 w-16 mb-2" />
            <SkeletonBlock className="h-5 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-2 border-border">
            <SkeletonBlock className="h-1 w-full" />
            <div className="p-4 space-y-3">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-3 w-20" />
              <div className="space-y-2 mt-4">
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-3/4" />
                <SkeletonBlock className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
