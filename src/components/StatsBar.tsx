import { ACTIVITY_GROUPS, APP_CONFIG } from '../server/config'
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
    return { label: stat.label, value: stat.state === 'mask' ? `${APP_CONFIG.maskedValue} ${stat.unit}` : formatted }
  }

  const cards = [
    statCard(visibility?.totalDistance, formatDistance(stats.totalDistance)),
    statCard(visibility?.totalDuration, formatDuration(stats.totalDuration)),
    statCard(visibility?.totalElevation, formatElevation(stats.totalElevation)),
    statCard(visibility?.activeDays, `${stats.activeDays}`),
  ].filter(c => c != null)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 border-2 border-border mb-6">
      {cards.map((card, i) => (
        <div
          key={card!.label}
          className={`p-3 border-border ${i < cards.length - 1 ? 'border-r-2' : ''} sm:border-r-2 last:sm:border-r-0`}
        >
          <p className="font-mono text-xs text-text-muted uppercase tracking-tight">{card!.label}</p>
          <p className="font-mono text-xl font-bold text-text mt-0.5 tracking-tight">{card!.value}</p>
        </div>
      ))}
    </div>
  )
}
