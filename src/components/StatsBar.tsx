import { ACTIVITY_GROUPS } from '../server/config'
import { formatDistance, formatDuration, formatElevation } from '../lib/formatters'

interface AggregateStats {
  totalDistance: number
  totalDuration: number
  totalElevation: number
  activeDays: number
}

interface StatsBarProps {
  stats: AggregateStats
  group: string
}

export function StatsBar({ stats, group }: StatsBarProps) {
  const visibility = ACTIVITY_GROUPS[group]?.visibility

  function statCard(stat: { state: string; label: string; unit: string } | undefined, formatted: string) {
    if (!stat || stat.state === 'hide') return null
    return <StatCard label={stat.label} value={stat.state === 'mask' ? `●●● ${stat.unit}` : formatted} />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {statCard(visibility?.totalDistance, formatDistance(stats.totalDistance))}
      <StatCard label="Total Time" value={formatDuration(stats.totalDuration)} />
      {statCard(visibility?.totalElevation, formatElevation(stats.totalElevation))}
      <StatCard label="Active Days" value={`${stats.activeDays}`} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-secondary p-4">
      <p className="text-xs text-text-secondary uppercase tracking-wide">{label}</p>
      <p className="text-lg font-semibold text-text-primary mt-1">{value}</p>
    </div>
  )
}
