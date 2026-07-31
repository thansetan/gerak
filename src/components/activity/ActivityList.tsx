import { motion } from 'framer-motion'
import type { StravaActivity } from '../../shared/types'
import { ActivityCard } from './ActivityCard'

interface ActivityListProps {
  activities: StravaActivity[]
  onCardClick?: (activity: StravaActivity) => void
}

export function ActivityList({ activities, onCardClick }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-border">
        <p className="font-mono text-sm font-medium text-text uppercase tracking-tight">No activities found</p>
        <p className="font-mono text-xs text-text-muted mt-2">Try selecting a different filter.</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          layout
          className="h-full"
        >
          <ActivityCard
            activity={activity}
            onClick={onCardClick ? () => onCardClick(activity) : undefined}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
