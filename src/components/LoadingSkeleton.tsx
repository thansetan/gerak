export function LoadingSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 border-2 border-border mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3 animate-pulse-flat border-r-2 border-border last:border-r-0">
            <div className="h-3 w-16 bg-border mb-2" />
            <div className="h-5 w-24 bg-border" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-2 border-border animate-pulse-flat">
            <div className="h-1 w-full bg-border" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-32 bg-border" />
              <div className="h-3 w-20 bg-border" />
              <div className="space-y-2 mt-4">
                <div className="h-3 w-full bg-border" />
                <div className="h-3 w-3/4 bg-border" />
                <div className="h-3 w-1/2 bg-border" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
