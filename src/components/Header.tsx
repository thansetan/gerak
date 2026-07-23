import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  syncedAt?: string
  athleteName?: string
  profileUrl?: string
  activitiesCount?: number
}

export function Header({ syncedAt, athleteName, profileUrl, activitiesCount }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border pb-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          🏃 berGerak 🔥
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          {athleteName ? `${athleteName}'s latest ${activitiesCount || 0} perGerakan` : `🚀 latest ${activitiesCount || 0} perGerakan 🚀`}
        </p>
        {syncedAt && (
          <p className="text-sm text-text-secondary mt-1">
            🕐 Last synced: {new Date(syncedAt).toLocaleString()}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {profileUrl && (
          <img
            src={profileUrl}
            alt={athleteName ?? 'Profile'}
            className="w-10 h-10 rounded-full ring-2 ring-border object-cover"
          />
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
