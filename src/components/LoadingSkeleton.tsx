export function LoadingSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-surface-secondary p-4 animate-pulse">
            <div className="h-3 w-16 bg-border rounded mb-2" />
            <div className="h-5 w-24 bg-border rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4 animate-pulse">
            <div className="h-4 w-32 bg-border rounded mb-2" />
            <div className="h-3 w-20 bg-border rounded mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-border rounded" />
              <div className="h-3 w-3/4 bg-border rounded" />
              <div className="h-3 w-1/2 bg-border rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
