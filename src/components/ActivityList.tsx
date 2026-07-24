import type { StravaActivity } from '../server/types'
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map((activity, i) => (
        <div
          key={activity.id}
          className="animate-slide-up h-full"
          style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
        >
          <ActivityCard
            activity={activity}
            onClick={onCardClick ? () => onCardClick(activity) : undefined}
          />
        </div>
      ))}
    </div>
  )
}
