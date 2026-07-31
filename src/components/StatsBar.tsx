import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
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

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
}

interface CardData {
  label: string
  config: StatsBarStatConfig
  rawValue: number
  masked: boolean
}

function statCard(stat: StatsBarStatConfig, value: number): CardData | null {
  if (stat.state === 'hide') return null
  return {
    label: stat.label,
    config: stat,
    rawValue: value,
    masked: stat.state === 'mask',
  }
}

function AnimatedStatValue({ value, config }: { value: number; config: StatsBarStatConfig }) {
  const raw = useMotionValue(0)

  useEffect(() => {
    const controls = animate(raw, value, { duration: 1, ease: 'easeOut' })
    return controls.stop
  }, [value])

  const display = useTransform(raw, (v) =>
    `${config.valueCalculation(Math.round(v))}${config.unit ? ` ${config.unit}` : ''}`
  )

  return <motion.span>{display}</motion.span>
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
  ].filter(c => c != null) as CardData[]

  return (
    <motion.div
      className="flex flex-wrap mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={itemVariants}
          className="flex-1 min-w-[130px] border-2 border-border p-3 text-center"
        >
          <p className="font-mono text-xs text-text-muted uppercase tracking-tight">{card.label}</p>
          <p className="font-mono text-xl font-bold text-text mt-0.5 tracking-tight">
            {card.masked ? (
              `${APP_CONFIG.maskedValue}${card.config.unit ? ` ${card.config.unit}` : ''}`
            ) : (
              <AnimatedStatValue value={card.rawValue} config={card.config} />
            )}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
