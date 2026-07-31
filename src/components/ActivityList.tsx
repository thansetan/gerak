import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { StravaActivity } from '../server/types'
import { ActivityCard } from './ActivityCard'

interface ActivityListProps {
  activities: StravaActivity[]
  onCardClick?: (activity: StravaActivity) => void
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
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
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          variants={itemVariants}
          layout
          className="h-full"
        >
          <ActivityCard
            activity={activity}
            onClick={onCardClick ? () => onCardClick(activity) : undefined}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
