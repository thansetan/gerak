import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { formatDate, formatDateTime, getTimezoneLabel } from '../lib/formatters'
import { AthleteProfile } from '~/server/types';

interface HeaderProps {
  syncedAt?: string
  activitiesCount?: number
  fetchWindowStart?: string
  athlete?: AthleteProfile
}

export function Header({ syncedAt, athlete, activitiesCount, fetchWindowStart }: HeaderProps) {
  const athleteName = athlete ? `${athlete.firstname} ${athlete.lastname}` : undefined
  return (
    <motion.header
      className="flex items-center justify-between border-b-2 border-border pb-4 mb-8"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="max-w-60 md:max-w-none">
        <h1 className="text-2xl font-bold tracking-tighter text-text font-mono">
          berGERAK
        </h1>
        {activitiesCount != null && (
          <p className="text-xs text-text-muted mt-1">
            {athleteName ? `${athleteName}'s ` : ''}latest {activitiesCount} perGERAKan since {formatDate(fetchWindowStart!)}
          </p>
        )}
        {syncedAt && (
          <p className="text-xs text-text-muted mt-0.5">
            Synced {formatDateTime(syncedAt)} {getTimezoneLabel()}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {athlete?.profile && (
          <a href={`https://strava.com/athletes/${athlete.id}`} target="_blank" className="cursor-pointer">
            <img
              src={athlete.profile}
              alt={athleteName}
              className="w-12 h-12 border-2 border-border object-cover"
              style={{ borderRadius: 0 }}
              />
          </a>
        )}
        <ThemeToggle />
      </div>
    </motion.header>
  )
}
