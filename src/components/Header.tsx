interface HeaderProps {
  syncedAt?: string
}

export function Header({ syncedAt }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border pb-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">berGerak</h1>
        <p className="text-xs text-text-secondary mt-0.5">my last 200 perGerakan</p>
        {syncedAt && (
          <p className="text-sm text-text-secondary mt-1">
            Last synced: {new Date(syncedAt).toLocaleString()}
          </p>
        )}
      </div>
    </header>
  )
}
