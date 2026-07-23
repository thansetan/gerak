import type { StravaActivity } from '../server/types'
import { ActivityCard } from './ActivityCard'

interface ActivityListProps {
  activities: StravaActivity[]
  onCardClick?: (activity: StravaActivity) => void
}

export function ActivityList({ activities, onCardClick }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-lg font-medium text-text-primary">No activities found</p>
        <p className="text-sm text-text-secondary mt-1">
          Try selecting a different filter group.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onClick={onCardClick ? () => onCardClick(activity) : undefined}
        />
      ))}
    </div>
  )
}
