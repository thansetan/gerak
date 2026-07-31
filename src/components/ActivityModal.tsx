import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ACTIVITY_GROUPS, APP_CONFIG } from '../server/config'
import { getGear } from '../server/gear'
import { getGroupForActivity } from '../lib/groups'
import { Minimap } from './Minimap'
import { formatDateTime, getTimezoneLabel, getGearDisplayValue } from '../lib/formatters'
import type { StatConfig, StravaActivity } from '../server/types'

const seenAnimations = new Set<string>()

function statDisplay(stat: StatConfig, activity: StravaActivity): string | null {
    if (stat.state === 'hide') return null
    if (stat.state === 'mask') return `${APP_CONFIG.maskedValue}${stat.unit ? ` ${stat.unit}` : ''}`
    const calc = stat.valueCalculation(activity)
    if (calc == null) return null
    return `${calc}${stat.unit ? ` ${stat.unit}` : ''}`
}

interface ActivityModalProps {
    activity: StravaActivity
    onClose: () => void
}

export function ActivityModal({ activity, onClose }: ActivityModalProps) {
    const group = getGroupForActivity(activity.sport_type)
    const groupConfig = ACTIVITY_GROUPS[group]
    const modalHeader = { ...APP_CONFIG.modalHeader, ...groupConfig.modalConfig }
    const stats = groupConfig.stats
    const { data: gearMap } = useQuery({ queryKey: ['gear'], queryFn: () => getGear(), staleTime: Infinity })
    const gearDetail = gearMap?.[activity.gear_id ?? '']
    const colors = groupConfig.color

    const ref = useRef<HTMLDivElement>(null)
    const [closing, setClosing] = useState(false)

    function handleClose() {
        setClosing(true)
        setTimeout(() => onClose(), 150)
    }

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') handleClose()
        }
        document.addEventListener('keydown', onKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = ''
        }
    }, [])

    const showGear = groupConfig.gearConfig?.state !== 'hide' && gearDetail != null
    const maskedGear = groupConfig.gearConfig?.state === 'mask'
    const gearDisplayValue = gearDetail && groupConfig.gearConfig ? getGearDisplayValue(gearDetail, groupConfig.gearConfig.value) : '--'

    const heroStats = Object.values(stats)
        .filter(s => s.highlightInModal && s.state !== 'hide')
        .map(s => {
            const value = statDisplay(s, activity)
            return value ? { label: s.label, value } : null
        })
        .filter(Boolean) as { label: string; value: string }[]

    const metricStats = Object.values(stats).filter(s =>
        s.type === 'metric' && !s.highlightInModal && s.state !== 'hide'
    )

    const detailRowStats = Object.values(stats).filter(s =>
        s.type === 'detail' && s.renderAs === 'row' && s.state !== 'hide'
    )

    const detailTagStats = Object.values(stats).filter(s =>
        s.type === 'detail' && s.renderAs === 'tag' && s.state !== 'hide'
    )

    const hasAnyMetrics = metricStats.some(s => statDisplay(s, activity) != null)
    const hasAnyDetails = detailRowStats.some(s => statDisplay(s, activity) != null) ||
        showGear ||
        detailTagStats.some(s => {
            if (s.state === 'mask') return true
            return s.valueCalculation(activity) != null
        })

    const showMinimap = !!(activity.map?.summary_polyline && modalHeader.showMinimap)
    const contentBeforeMetrics = showMinimap || heroStats.length > 0
    const contentBeforeDetails = contentBeforeMetrics || hasAnyMetrics

    const polyline = activity.map?.summary_polyline
    const skipAnimation = !modalHeader.minimapAnimation || (polyline ? seenAnimations.has(polyline) : true)
    const handleAnimationComplete = useCallback(() => {
        if (polyline) seenAnimations.add(polyline)
    }, [polyline])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
        >
            <div
              className={`absolute inset-0 bg-bg/90 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
            />
            <div
                ref={ref}
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-border bg-surface ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
            >
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: colors.accent }}
                />

                <div className="sticky top-0 z-10 flex items-start justify-between bg-surface p-5 pb-3 border-b-2 border-border">
                    <div className="flex-1 min-w-0">
                        {modalHeader.showTitle && (
                            <h2 className="font-mono text-lg font-bold text-text leading-snug">
                                {activity.name}
                            </h2>
                        )}
                        {modalHeader.showActivityTime && (
                            <p className="font-mono text-xs text-text-muted mt-0.5 uppercase tracking-tight">
                                {formatDateTime(activity.start_date)} {getTimezoneLabel()}
                            </p>
                        )}
                        {(modalHeader.showAchievements || modalHeader.showKudos) && (
                            <p className="font-mono text-xs text-text-muted mt-1">
                                {modalHeader.showAchievements && (
                                    <>{activity.achievement_count ?? 0} achievements</>
                                )}
                                {modalHeader.showAchievements && modalHeader.showKudos && (
                                    <span className="mx-1.5">&middot;</span>
                                )}
                                {modalHeader.showKudos && (
                                    <>{activity.kudos_count ?? 0} kudos</>
                                )}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span
                          className="font-mono text-[11px] font-bold uppercase tracking-tight px-2 py-0.5 text-white"
                          style={{ backgroundColor: colors.accent }}
                        >
                            {groupConfig.label}
                        </span>
                        <button
                            onClick={handleClose}
                            className="font-mono text-sm text-text-muted hover:text-text transition-colors cursor-pointer px-1 py-0.5 border-2 border-transparent hover:border-border"
                            aria-label="Close"
                        >
                            ESC
                        </button>
                    </div>
                </div>

                <div className="p-5 pt-4 space-y-4">
                    {polyline && modalHeader.showMinimap && (
                        <Minimap
                            key={polyline}
                            summaryPolyline={polyline}
                            accentColor={colors.accent}
                            bgColor={colors.bg}
                            skipAnimation={skipAnimation}
                            onAnimationComplete={handleAnimationComplete}
                        />
                    )}

                    {heroStats.length > 0 && (
                        <div className="flex flex-wrap">
                            {heroStats.map((s) => (
                                <div
                                    key={s.label}
                                    className="flex-1 min-w-[130px] border-2 border-border p-3 text-center"
                                >
                                    <p className="font-mono text-lg font-bold text-text tabular-nums" style={{ color: colors.accent }}>{s.value}</p>
                                    <p className="font-mono text-[10px] text-text-muted uppercase tracking-tight mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasAnyMetrics && (
                        <div className={'pt-4' + (contentBeforeMetrics ? ' border-t-2 border-border' : '')}>
                            <h3 className="font-mono text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                                Metrics
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {metricStats.map(stat => {
                                    const display = statDisplay(stat, activity)
                                    if (display == null) return null
                                    return (
                                        <MetricRow
                                            key={stat.label}
                                            label={stat.label}
                                            value={display}
                                            visible={true}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {hasAnyDetails && (
                        <div className={'pt-4' + (contentBeforeDetails ? ' border-t-2 border-border' : '')}>
                            <h3 className="font-mono text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                                Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                {showGear && (
                                    <div className="flex items-center gap-2 text-text-muted font-mono text-xs">
                                        <span className="uppercase">{groupConfig.gearConfig?.label}</span>
                                        <span>{maskedGear ? APP_CONFIG.maskedValue : gearDisplayValue}</span>
                                    </div>
                                )}
                                {detailRowStats.map(stat => {
                                    const display = statDisplay(stat, activity)
                                    if (display == null) return null
                                    return (
                                        <div key={stat.label} className="flex items-center gap-2 text-text-muted font-mono text-xs">
                                            <span className="uppercase">{stat.label}</span>
                                            <span>{display}</span>
                                        </div>
                                    )
                                })}
                                <div className="flex flex-wrap gap-2">
                                    {detailTagStats.map(stat => {
                                        if (stat.state === 'mask') {
                                            return (
                                                <span key={stat.label} className="font-mono text-[10px] uppercase tracking-tight border-2 border-border px-2 py-0.5 text-text-muted">
                                                    {APP_CONFIG.maskedValue}
                                                </span>
                                            )
                                        }
                                        if (stat.valueCalculation(activity) == null) return null
                                        return (
                                            <span key={stat.label} className="font-mono text-[10px] uppercase tracking-tight border-2 border-border px-2 py-0.5 text-text-muted">
                                                {stat.label}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function MetricRow({ label, value, visible }: { label: string; value: string; visible: boolean }) {
    if (!visible) return null
    return (
        <div className="flex items-center justify-between py-1">
            <span className="font-mono text-[11px] text-text-muted uppercase tracking-tight">{label}</span>
            <span className="font-mono text-xs font-medium text-text tabular-nums">{value}</span>
        </div>
    )
}
