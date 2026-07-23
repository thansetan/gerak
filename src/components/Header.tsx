import { useQueryClient } from '@tanstack/react-query'

interface HeaderProps {
  syncedAt?: string
}

export function Header({ syncedAt }: HeaderProps) {
  const queryClient = useQueryClient()

  const handleRefresh = async () => {
    await fetch('/api/refresh', { method: 'POST' })
    queryClient.invalidateQueries({ queryKey: ['activities'] })
  }

  return (
    <header className="flex items-center justify-between border-b border-border pb-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">berGerak</h1>
        {syncedAt && (
          <p className="text-sm text-text-secondary mt-1">
            Last synced: {new Date(syncedAt).toLocaleString()}
          </p>
        )}
      </div>
      <button
        onClick={handleRefresh}
        className="rounded-lg bg-surface-accent px-4 py-2 text-sm font-medium text-text-on-accent transition-all hover:bg-surface-accent-hover active:scale-[0.98]"
      >
        Refresh
      </button>
    </header>
  )
}
