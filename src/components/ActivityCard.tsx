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
import { SPORT_EMOJIS, SPORT_STYLES } from '../lib/colors';
import type { StatVisibility, StravaActivity } from '../server/types';

interface ActivityCardProps {
    activity: StravaActivity;
    onClick?: () => void;
}

const DECORATIVE_EMOJIS = ['🌟', '💫', '✨', '⚡', '🔥', '💥'];

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
    const group = getGroupForActivity(activity.sport_type)
    const groupConfig = ACTIVITY_GROUPS[group]
    const statsVisibility = groupConfig.visibility
    const emoji = SPORT_EMOJIS[group] ?? '🎯'
    const style = SPORT_STYLES[group] ?? SPORT_STYLES.other
    const decorEmoji = DECORATIVE_EMOJIS[activity.id % DECORATIVE_EMOJIS.length]

    function renderStat(stat: StatVisibility | undefined, condition: boolean, formatted: string) {
        if (!stat || stat.state === 'hide') return null
        if (stat.state === 'mask') return <Metric label={stat.label} value={`●●● ${stat.unit}`} />
        if (condition) return <Metric label={stat.label} value={formatted} />
        return null
    }

    return (
        <div
            onClick={onClick}
            className={`rounded-xl border border-border border-l-4 ${style.accent} bg-surface p-4 duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-l-8 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
            style={{ transitionProperty: 'box-shadow, transform', contentVisibility: 'auto' }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-1">
                        {emoji} {decorEmoji} {activity.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                        📅 {new Date(activity.start_date).toLocaleDateString()}
                    </p>
                </div>
                <span className={`rounded-md ${style.bg} px-2 py-0.5 text-[11px] font-semibold ${style.text} uppercase shrink-0 ml-2`}>
                    {emoji} {activity.sport_type.replace(/([A-Z])/g, ' $1').trim().split(' ').slice(0, 2).join(' ')}
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
        <div className="flex items-center justify-between py-0.5">
            <span className="text-text-secondary">{label}</span>
            <span className="font-semibold text-text-primary">{value}</span>
        </div>
    );
}
