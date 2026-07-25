import { ACTIVITY_GROUPS, APP_CONFIG } from '../server/config';
import { getGroupForActivity } from '../lib/groups';
import {
    formatCadence,
    formatDate,
    formatDistance,
    formatElevation,
    formatHeartRate,
    formatPace,
    formatSpeed,
} from '../lib/formatters';
import type { StatVisibility, StravaActivity } from '../server/types';

interface ActivityCardProps {
    activity: StravaActivity;
    onClick?: () => void;
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
    const group = getGroupForActivity(activity.sport_type)
    const groupConfig = ACTIVITY_GROUPS[group]
    const statsVisibility = groupConfig.visibility
    const color = groupConfig.color

    function renderStat(stat: StatVisibility | undefined, condition: boolean, formatted: string) {
        if (!stat || stat.state === 'hide') return null
        if (stat.state === 'mask') return <Metric label={stat.label} value={`${APP_CONFIG.maskedValue} ${stat.unit}`} />
        if (condition) return <Metric label={stat.label} value={formatted} />
        return null
    }

    return (
        <div
            onClick={onClick}
            className={`border-2 border-border bg-surface group h-full flex flex-col ${onClick ? 'cursor-pointer lg:hover:border-text transition-colors duration-150' : ''}`}
        >
            <div
              className="h-1 w-full"
              style={{ backgroundColor: color.accent }}
            />
            <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text text-sm leading-snug line-clamp-1">
                            {activity.name}
                        </h3>
                        <p className="font-mono text-xs text-text-muted mt-0.5 uppercase tracking-tight">
                            {formatDate(activity.start_date)}
                        </p>
                    </div>
                    <span
                      className="font-mono text-[11px] font-bold uppercase tracking-tight px-2 py-0.5 shrink-0 text-white"
                      style={{ backgroundColor: color.accent }}
                    >
                        {groupConfig.label}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    {renderStat(statsVisibility.distance, activity.distance > 0, formatDistance(activity.distance))}
                    {renderStat(statsVisibility.avgHeartRate, !!activity.average_heartrate, formatHeartRate(activity.average_heartrate))}
                    {renderStat(statsVisibility.maxHeartRate, !!activity.max_heartrate, formatHeartRate(activity.max_heartrate))}
                    {renderStat(statsVisibility.speed, activity.average_speed > 0, formatSpeed(activity.average_speed))}
                    {renderStat(statsVisibility.pace, activity.average_speed > 0, formatPace(activity.average_speed))}
                    {renderStat(statsVisibility.avgPower, !!activity.average_watts, `${Math.round(activity.average_watts!)} W`)}
                    {renderStat(statsVisibility.cadence, !!activity.average_cadence, formatCadence(activity.average_cadence! * 2))}
                    {renderStat(statsVisibility.elevation, activity.total_elevation_gain > 0, formatElevation(activity.total_elevation_gain))}
                </div>
            </div>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-0.5">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-tight">{label}</span>
            <span className="font-medium text-text tabular-nums">{value}</span>
        </div>
    );
}
