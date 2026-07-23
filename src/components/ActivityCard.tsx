import { ACTIVITY_GROUPS } from '../server/config';
import { getGroupForActivity } from '../lib/groups';
import {
    formatCadence,
    formatDistance,
    formatElevation,
    formatHeartRate,
    formatPace,
    formatSpeed,
} from '../lib/formatters';
import type { StatVisibility, StravaActivity } from '../server/types';

interface ActivityCardProps {
    activity: StravaActivity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
    const group = getGroupForActivity(activity.sport_type)
    const statsVisibility = ACTIVITY_GROUPS[group].visibility

    function renderStat(stat: StatVisibility | undefined, condition: boolean, formatted: string) {
        if (!stat || stat.state === 'hide') return null
        if (stat.state === 'mask') return <Metric label={stat.label} value={`●●● ${stat.unit}`} />
        if (condition) return <Metric label={stat.label} value={formatted} />
        return null
    }

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
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-text-secondary">{label}</span>
            <span className="font-medium text-text-primary">{value}</span>
        </div>
    );
}
