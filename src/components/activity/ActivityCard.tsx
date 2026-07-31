import { motion } from 'framer-motion';
import { ACTIVITY_GROUPS, APP_CONFIG } from '../../shared/config';
import { getGroupForActivity } from '../../shared/lib/groups';
import { formatDate } from '../../shared/lib/formatters';
import type { StatConfig, StravaActivity } from '../../shared/types';

interface ActivityCardProps {
    activity: StravaActivity;
    onClick?: () => void;
}

function renderCardStat(stat: StatConfig, activity: StravaActivity) {
    if (stat.state === 'hide') return null
    if (stat.state === 'mask') return <Metric label={stat.label} value={`${APP_CONFIG.maskedValue}${stat.unit ? ` ${stat.unit}` : ''}`} />
    const calc = stat.valueCalculation(activity)
    if (calc == null) return null
    return <Metric label={stat.label} value={`${calc}${stat.unit ? ` ${stat.unit}` : ''}`} />
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
    const group = getGroupForActivity(activity.sport_type)
    const groupConfig = ACTIVITY_GROUPS[group]
    const stats = groupConfig.stats
    const color = groupConfig.color

    return (
        <motion.div
            onClick={onClick}
            className={`border-2 border-border bg-surface group h-full flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
            whileHover={onClick ? { y: -2, borderColor: color.accent } : undefined}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
                    {Object.entries(stats)
                        .filter(([_, s]) => s.showInCard)
                        .map(([key, stat]) => {
                            const node = renderCardStat(stat, activity)
                            if (!node) return null
                            return <div key={key}>{node}</div>
                        })}
                </div>
            </div>
        </motion.div>
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
