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

const CARD_STYLES = [
  { emoji: '🛣️', title: 'Total Distance', bg: 'bg-stat-distance-bg', text: 'text-stat-distance' },
  { emoji: '⏱️', title: 'Total Time', bg: 'bg-stat-time-bg', text: 'text-stat-time' },
  { emoji: '🏔️', title: 'Elevation', bg: 'bg-stat-elevation-bg', text: 'text-stat-elevation' },
  { emoji: '📅', title: 'Active Days', bg: 'bg-stat-days-bg', text: 'text-stat-days' },
]

export function StatsBar({ stats, group }: StatsBarProps) {
  const visibility = ACTIVITY_GROUPS[group]?.visibility

  function statCard(stat: { state: string; label: string; unit: string } | undefined, formatted: string) {
    if (!stat || stat.state === 'hide') return null
    return { label: stat.label, value: stat.state === 'mask' ? `●●● ${stat.unit}` : formatted }
  }

  const cards = [
    { ...CARD_STYLES[0], ...statCard(visibility?.totalDistance, formatDistance(stats.totalDistance)) },
    { ...CARD_STYLES[1], value: formatDuration(stats.totalDuration) },
    { ...CARD_STYLES[2], ...statCard(visibility?.totalElevation, formatElevation(stats.totalElevation)) },
    { ...CARD_STYLES[3], value: `${stats.activeDays}` },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {cards.filter(c => c.value != null).map((card) => (
        <div key={card.title} className={`rounded-xl ${card.bg} p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-md`}>
          <p className="text-xs text-text-secondary uppercase tracking-wide">
            <span className="mr-1">{card.emoji}</span>{card.title}
          </p>
          <p className={`text-lg font-bold mt-1 ${card.text}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
