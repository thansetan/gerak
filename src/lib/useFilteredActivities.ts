import { useMemo } from 'react'
import { getGroupForActivity, getGroupNames, getGroupLabel } from './groups'
import type { StravaActivity } from '../server/types'

interface GroupCount {
  name: string
  label: string
  count: number
}

interface AggregateStats {
  totalDistance: number
  totalDuration: number
  totalElevation: number
  activeDays: number
}

export function useGroupCounts(activities: StravaActivity[]): GroupCount[] {
  return useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of activities) {
      const group = getGroupForActivity(a.sport_type)
      counts[group] = (counts[group] || 0) + 1
    }
    return getGroupNames().map((name) => ({
      name,
      label: getGroupLabel(name),
      count: counts[name] || 0,
    }))
  }, [activities])
}

export function useFilteredActivities(
  activities: StravaActivity[],
  group: string | null,
) {
  return useMemo(() => {
    if (!group || group === 'all') return activities
    return activities.filter((a) => getGroupForActivity(a.sport_type) === group)
  }, [activities, group])
}

export function useAggregateStats(activities: StravaActivity[]): AggregateStats {
  return useMemo(() => {
    const seenDays = new Set<string>()
    let totalDistance = 0
    let totalDuration = 0
    let totalElevation = 0

    for (const a of activities) {
      totalDistance += a.distance
      totalDuration += a.moving_time
      totalElevation += a.total_elevation_gain
      const day = a.start_date.slice(0, 10)
      seenDays.add(day)
    }

    return {
      totalDistance,
      totalDuration,
      totalElevation,
      activeDays: seenDays.size,
    }
  }, [activities])
}
