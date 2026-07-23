import type { StravaActivity, StatsVisibility } from '../server/types'
import { formatDistance, formatDuration, formatPace, formatHeartRate, formatCadence, formatElevation } from '../lib/formatters'

interface ActivityCardProps {
  activity: StravaActivity
  statsVisibility: StatsVisibility
}

export function ActivityCard({ activity, statsVisibility }: ActivityCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-1">
            {activity.name}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {new Date(activity.start_date).toLocaleDateString()}
          </p>
        </div>
        <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-secondary uppercase">
          {activity.sport_type}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        {statsVisibility.distance.show && activity.distance > 0 && (
          <Metric label={statsVisibility.distance.label} value={formatDistance(activity.distance)} />
        )}
        {statsVisibility.avgHeartRate.show && activity.average_heartrate && (
          <Metric label={statsVisibility.avgHeartRate.label} value={formatHeartRate(activity.average_heartrate)} />
        )}
        {statsVisibility.maxHeartRate.show && activity.max_heartrate && (
          <Metric label={statsVisibility.maxHeartRate.label} value={formatHeartRate(activity.max_heartrate)} />
        )}
        {statsVisibility.pace.show && activity.average_speed > 0 && (
          <Metric label={statsVisibility.pace.label} value={formatPace(activity.average_speed)} />
        )}
        {statsVisibility.avgPower.show && activity.average_watts && (
          <Metric label={statsVisibility.avgPower.label} value={`${Math.round(activity.average_watts)} W`} />
        )}
        {statsVisibility.cadence.show && activity.average_heartrate && (
          <Metric label={statsVisibility.cadence.label} value={formatCadence(activity.average_heartrate)} />
        )}
        {statsVisibility.elevation.show && activity.total_elevation_gain > 0 && (
          <Metric label={statsVisibility.elevation.label} value={formatElevation(activity.total_elevation_gain)} />
        )}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  )
}
