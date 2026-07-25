import { ACTIVITY_GROUPS, APP_CONFIG } from '../server/config'
import type { StatsBarConfig, StatsBarStatConfig } from '../server/types'

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

function statCard(stat: StatsBarStatConfig, value: number) {
  if (stat.state === 'hide') return null
  if (stat.state === 'mask') return { label: stat.label, value: `${APP_CONFIG.maskedValue}${stat.unit ? ` ${stat.unit}` : ''}` }
  return { label: stat.label, value: `${stat.valueCalculation(value)}${stat.unit ? ` ${stat.unit}` : ''}` }
}

export function StatsBar({ stats, group }: StatsBarProps) {
  const groupConfig = ACTIVITY_GROUPS[group]
  const barConfig = Object.fromEntries(
    Object.entries(APP_CONFIG.statsBar).map(([key, defaultConfig]) => [
      key,
      { ...defaultConfig, ...groupConfig?.statsBarConfig?.[key as keyof StatsBarConfig] },
    ])
  ) as StatsBarConfig

  const cards = [
    statCard(barConfig.totalDistance, stats.totalDistance),
    statCard(barConfig.totalDuration, stats.totalDuration),
    statCard(barConfig.totalElevation, stats.totalElevation),
    statCard(barConfig.activeDays, stats.activeDays),
  ].filter(c => c != null)

  return (
    <div className="flex flex-wrap mb-6">
      {cards.map((card, i) => (
        <div
          key={card!.label}
          className="flex-1 min-w-[130px] border-2 border-border p-3 text-center"
        >
          <p className="font-mono text-xs text-text-muted uppercase tracking-tight">{card!.label}</p>
          <p className="font-mono text-xl font-bold text-text mt-0.5 tracking-tight">{card!.value}</p>
        </div>
      ))}
    </div>
  )
}
