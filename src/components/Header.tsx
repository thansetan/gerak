import { ThemeToggle } from './ThemeToggle'
import { formatDateTime, getTimezoneLabel } from '../lib/formatters'

interface HeaderProps {
  syncedAt?: string
  athleteName?: string
  profileUrl?: string
  activitiesCount?: number
}

export function Header({ syncedAt, athleteName, profileUrl, activitiesCount }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b-2 border-border pb-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tighter text-text font-mono">
          berGERAK
        </h1>
        {activitiesCount != null && (
          <p className="text-xs text-text-muted mt-1">
            {athleteName ? `${athleteName}'s ` : ''}latest {activitiesCount} perGERAKan
          </p>
        )}
        {syncedAt && (
          <p className="text-xs text-text-muted mt-0.5">
            Synced {formatDateTime(syncedAt)} {getTimezoneLabel()}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {profileUrl && (
          <img
            src={profileUrl}
            alt={athleteName ?? 'Profile'}
            className="w-12 h-12 border-2 border-border object-cover"
            style={{ borderRadius: 0 }}
          />
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
