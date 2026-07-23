import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getActivities } from '../server/activities'
import { Header } from '../components/Header'
import { GroupFilter } from '../components/GroupFilter'
import { StatsBar } from '../components/StatsBar'
import { ActivityList } from '../components/ActivityList'
import { ErrorState } from '../components/ErrorState'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { useFilteredActivities, useGroupCounts, useAggregateStats } from '../lib/useFilteredActivities'
import type { ActivitiesResponse } from '../server/types'

interface DashboardSearch {
  group?: string
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, string | undefined>): DashboardSearch => ({
    group: search.group ?? undefined,
  }),
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['activities'],
      queryFn: () => getActivities(),
    })
  },
  component: Dashboard,
})

function Dashboard() {
  const { group } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(),
  })

  const activities = data?.activities ?? []
  const visibility = data?.statsVisibility ?? ({} as ActivitiesResponse['statsVisibility'])
  const syncedAt = data?.syncedAt

  const groupCounts = useGroupCounts(activities)
  const filtered = useFilteredActivities(activities, group ?? null)
  const stats = useAggregateStats(filtered)

  const handleGroupChange = (name: string | null) => {
    navigate({ search: (prev: DashboardSearch) => ({ ...prev, group: name ?? undefined }) })
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <Header syncedAt={syncedAt} />
        <ErrorState
          message={error instanceof Error ? error.message : 'An unexpected error occurred'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <Header syncedAt={syncedAt} />
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <GroupFilter
            groups={groupCounts}
            active={group ?? 'all'}
            onChange={handleGroupChange}
          />
          <StatsBar stats={stats} />
          {isFetching && !isLoading && (
            <p className="text-xs text-text-secondary mb-2">Refreshing...</p>
          )}
          <ActivityList activities={filtered} statsVisibility={visibility} />
        </>
      )}
    </div>
  )
}
