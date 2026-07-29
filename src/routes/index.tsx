import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getActivities } from '../server/activities'
import { getAthlete } from '../server/athlete'
import { getGear } from '../server/gear'
import { ACTIVITY_GROUPS } from '../server/config'
import { Header } from '../components/Header'
import { GroupFilter } from '../components/GroupFilter'
import { StatsBar } from '../components/StatsBar'
import { ActivityList } from '../components/ActivityList'
import { ActivityModal } from '../components/ActivityModal'
import { ErrorState } from '../components/ErrorState'
import { BackToTop } from '../components/BackToTop'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { getGroupForActivity } from '../lib/groups'
import { useFilteredActivities, useGroupCounts, useAggregateStats } from '../lib/useFilteredActivities'
import type { StravaActivity } from '../server/types'
import { isAuthenticated } from '../server/stravaAuth'

interface DashboardSearch {
  group?: string
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, string | undefined>): DashboardSearch => ({
    group: search.group ?? undefined,
  }),
  loader: async ({ context: { queryClient } }) => {
    const [activitiesData, athleteData] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['activities'],
        queryFn: () => getActivities(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['athlete'],
        queryFn: () => getAthlete(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['gear'],
        queryFn: () => getGear(),
      }),
    ])
    return { activities: activitiesData, athlete: athleteData }
  },
  component: Dashboard,
  beforeLoad: async () => {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      throw redirect({
        to: '/strava/login',
      })
    }
  }
})

function Dashboard() {
  let { group: initialGroup } = Route.useSearch()
  initialGroup = initialGroup?.trim().toLowerCase()
  if (!Object.keys(ACTIVITY_GROUPS).map((g) => g.trim().toLowerCase()).includes(initialGroup ?? '')) {
    initialGroup = 'all'
  }
  const loaderData = Route.useLoaderData()
  const [group, setGroup] = useState<string | null>(initialGroup?.toLowerCase() ?? null)
  const [selectedActivity, setSelectedActivity] = useState<StravaActivity | null>(null)

  const { data: athlete } = useQuery({
    queryKey: ['athlete'],
    queryFn: () => getAthlete(),
    initialData: loaderData?.athlete,
  })

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(),
    initialData: loaderData?.activities,
  })

  const activities = data?.activities ?? []
  const syncedAt = data?.syncedAt
  const fetchWindowStart = data?.fetchWindowStart
  const profileUrl = athlete?.profile

  const groupCounts = useGroupCounts(activities)
  const filtered = useFilteredActivities(activities, group ?? null)
  const stats = useAggregateStats(filtered)

  const handleGroupChange = (name: string | null) => {
    setGroup(name)
  }

  const handleCardClick = (activity: StravaActivity) => {
    const g = getGroupForActivity(activity.sport_type)
    if (ACTIVITY_GROUPS[g]?.cardClick === 'modal') {
      setSelectedActivity(activity)
    }
  }

  const handleCloseModal = () => setSelectedActivity(null)

  if (isError) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <Header syncedAt={syncedAt} athlete={athlete} fetchWindowStart={fetchWindowStart} />
        <ErrorState
          message={error instanceof Error ? error.message : 'An unexpected error occurred'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      {isPending ? (
        <>
          <Header />
          <LoadingSkeleton />
        </>
      ) : (
        <>
          <Header syncedAt={syncedAt} athlete={athlete} activitiesCount={activities.length} fetchWindowStart={fetchWindowStart} />
          <GroupFilter
            groups={groupCounts}
            active={group ?? 'all'}
            onChange={handleGroupChange}
          />
          <StatsBar stats={stats} group={group ?? 'all'} />
          {isFetching && (
            <p className="font-mono text-xs text-text-muted mb-2 uppercase tracking-tight">Refreshing...</p>
          )}
          <ActivityList activities={filtered} onCardClick={handleCardClick} />
        </>
      )}
      {selectedActivity && (
        <ActivityModal activity={selectedActivity} onClose={handleCloseModal} />
      )}
      <BackToTop />
    </div>
  )
}
