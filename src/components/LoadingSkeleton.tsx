export function LoadingSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl p-4 shimmer-bg">
            <div className="h-3 w-16 rounded mb-2" style={{ background: 'oklch(80% 0.02 100 / 0.5)' }} />
            <div className="h-5 w-24 rounded" style={{ background: 'oklch(80% 0.02 100 / 0.5)' }} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4 shimmer-bg">
            <div className="h-4 w-32 rounded mb-2" style={{ background: 'oklch(80% 0.02 100 / 0.5)' }} />
            <div className="h-3 w-20 rounded mb-4" style={{ background: 'oklch(80% 0.02 100 / 0.5)' }} />
            <div className="space-y-2">
              <div className="h-3 w-full rounded" style={{ background: 'oklch(80% 0.02 100 / 0.5)' }} />
              <div className="h-3 w-3/4 rounded" style={{ background: 'oklch(80% 0.02 100 / 0.5)' }} />
              <div className="h-3 w-1/2 rounded" style={{ background: 'oklch(80% 0.02 100 / 0.5)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
