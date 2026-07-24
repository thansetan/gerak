import { useEffect, useRef, useState } from 'react'
import { ACTIVITY_GROUPS, APP_CONFIG } from '../server/config'
import { getGroupForActivity } from '../lib/groups'
import { Minimap } from './Minimap'
import { SPORT_COLORS, SPORT_EMOJIS } from '../lib/colors'
import type { StravaActivity } from '../server/types'
import {
    formatCadence,
    formatDistance,
    formatDurationFull,
    formatElevation,
    formatHeartRate,
    formatKilojoules,
    formatMaskedValue,
    formatPace,
    formatSpeed,
    formatSpeedKmh,
} from '../lib/formatters'

interface ActivityModalProps {
    activity: StravaActivity
    onClose: () => void
}

export function ActivityModal({ activity, onClose }: ActivityModalProps) {
    const group = getGroupForActivity(activity.sport_type)
    const groupConfig = ACTIVITY_GROUPS[group]
    const modal = APP_CONFIG.modal
    const vis = groupConfig.visibility
    const emoji = SPORT_EMOJIS[group] ?? '🎯'
    const colors = SPORT_COLORS[group] ?? SPORT_COLORS.other

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

    const hasDistance = activity.distance > 0
    const showPace = vis.pace?.state !== 'hide' && activity.average_speed > 0
    const showSpeed = vis.speed?.state === 'show' && activity.average_speed > 0

    const showElevRange = modal.elevRange.state !== 'hide' && activity.elev_high != null && group !== 'badminton'
    const maskedElevRange = modal.elevRange.state === 'mask'
    const showMaxSpeed = modal.maxSpeed.state !== 'hide' && activity.max_speed > 0
    const maskedMaxSpeed = modal.maxSpeed.state === 'mask'
    const showMaxPower = modal.maxPower.state !== 'hide' && activity.max_watts != null
    const maskedMaxPower = modal.maxPower.state === 'mask'
    const showWeightedPower = modal.weightedPower.state !== 'hide' && activity.weighted_average_watts != null
    const maskedWeightedPower = modal.weightedPower.state === 'mask'
    const showCalories = modal.calories.state !== 'hide' && (activity.kilojoules != null && activity.kilojoules > 0)
    const maskedCalories = modal.calories.state === 'mask'
    const showDevice = modal.device.state !== 'hide' && activity.device_name
    const maskedDevice = modal.device.state === 'mask'
    const showAchievements = modal.achievements.state !== 'hide'
    const maskedAchievements = modal.achievements.state === 'mask'

    const previewSportType = activity.sport_type
        .replace(/([A-Z])/g, ' $1').trim().split(' ').slice(0, 2).join(' ')

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
        >
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${closing ? 'animate-[fadeOut_0.15s_ease-in]' : ''}`} />
            <div
                ref={ref}
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl ${closing ? 'animate-[fadeOut_0.15s_ease-in]' : 'animate-[fadeIn_0.2s_ease-out]'}`}
            >
                <div className="sticky top-0 z-10 flex items-start justify-between bg-surface p-5 pb-3 border-b border-border">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-text-primary leading-snug">
                            {emoji} {activity.name}
                        </h2>
                        <p className="text-sm text-text-secondary mt-0.5">
                            📅 {new Date(activity.start_date).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-2xl">{emoji}</span>
                        <button
                            onClick={handleClose}
                            className="rounded-full p-1.5 text-text-secondary hover:bg-surface-secondary transition-colors cursor-pointer text-lg leading-none"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-5 pt-4 space-y-4">
                    {activity.map?.summary_polyline && modal.showMinimap && (
                        <Minimap
                            summaryPolyline={activity.map.summary_polyline}
                            accentColor={colors.accent}
                            bgColor={colors.bg}
                        />
                    )}

                    <div className="grid grid-cols-3 gap-3">
                        <HeroStat
                            label="Duration"
                            value={formatDurationFull(activity.moving_time)}
                            icon="⏱️"
                            color={colors.accent}
                        />
                        {hasDistance && (
                            <HeroStat
                                label="Distance"
                                value={formatDistance(activity.distance)}
                                icon="📏"
                                color={colors.accent}
                            />
                        )}
                        {showPace && (
                            <HeroStat
                                label="Pace"
                                value={formatPace(activity.average_speed)}
                                icon="⚡"
                                color={colors.accent}
                            />
                        )}
                        {showSpeed && (
                            <HeroStat
                                label="Speed"
                                value={formatSpeedKmh(activity.average_speed)}
                                icon="🚀"
                                color={colors.accent}
                            />
                        )}
                        {!hasDistance && !showPace && !showSpeed && (
                            <HeroStat
                                label="Active Time"
                                value={formatDurationFull(activity.moving_time)}
                                icon="⏱️"
                                color={colors.accent}
                            />
                        )}
                    </div>

                    {(vis.distance?.state !== 'hide' || vis.avgHeartRate?.state !== 'hide' ||
                      vis.maxHeartRate?.state !== 'hide' || vis.avgPower?.state !== 'hide' ||
                      vis.cadence?.state !== 'hide' || vis.elevation?.state !== 'hide' ||
                      showMaxSpeed || showMaxPower || showWeightedPower || showCalories || showElevRange) && (
                        <>
                            <div className="border-t border-border pt-4">
                                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                                    📊 Detailed Metrics
                                </h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <MetricRow
                                        label={vis.distance?.label ?? '📏 Distance'}
                                        value={formatDistance(activity.distance)}
                                        visible={vis.distance?.state !== 'hide' && hasDistance}
                                        masked={vis.distance?.state === 'mask'}
                                        unit={vis.distance?.unit}
                                    />
                                    <MetricRow
                                        label={vis.avgHeartRate?.label ?? '💓 Avg HR'}
                                        value={formatHeartRate(activity.average_heartrate)}
                                        visible={vis.avgHeartRate?.state !== 'hide' && !!activity.average_heartrate}
                                        masked={vis.avgHeartRate?.state === 'mask'}
                                        unit={vis.avgHeartRate?.unit}
                                    />
                                    <MetricRow
                                        label={vis.maxHeartRate?.label ?? '💗 Max HR'}
                                        value={formatHeartRate(activity.max_heartrate)}
                                        visible={vis.maxHeartRate?.state !== 'hide' && !!activity.max_heartrate}
                                        masked={vis.maxHeartRate?.state === 'mask'}
                                        unit={vis.maxHeartRate?.unit}
                                    />
                                    <MetricRow
                                        label={vis.pace?.label ?? '⏱️ Pace'}
                                        value={formatPace(activity.average_speed)}
                                        visible={showPace}
                                        masked={vis.pace?.state === 'mask'}
                                        unit={vis.pace?.unit}
                                    />
                                    <MetricRow
                                        label={vis.speed?.label ?? '🚀 Speed'}
                                        value={formatSpeedKmh(activity.average_speed)}
                                        visible={showSpeed}
                                        masked={vis.speed?.state === 'mask'}
                                        unit={vis.speed?.unit}
                                    />
                                    <MetricRow
                                        label={vis.avgPower?.label ?? '⚡ Avg Power'}
                                        value={activity.average_watts ? `${Math.round(activity.average_watts)} W` : '--'}
                                        visible={vis.avgPower?.state !== 'hide' && !!activity.average_watts}
                                        masked={vis.avgPower?.state === 'mask'}
                                        unit={vis.avgPower?.unit}
                                    />
                                    <MetricRow
                                        label={vis.cadence?.label ?? '🔄 Cadence'}
                                        value={formatCadence(activity.average_cadence ? activity.average_cadence * 2 : undefined)}
                                        visible={vis.cadence?.state !== 'hide' && !!activity.average_cadence}
                                        masked={vis.cadence?.state === 'mask'}
                                        unit={vis.cadence?.unit}
                                    />
                                    <MetricRow
                                        label={vis.elevation?.label ?? '⛰️ Elevation'}
                                        value={formatElevation(activity.total_elevation_gain)}
                                        visible={vis.elevation?.state !== 'hide' && activity.total_elevation_gain > 0}
                                        masked={vis.elevation?.state === 'mask'}
                                        unit={vis.elevation?.unit}
                                    />
                                    <MetricRow
                                        label={modal.maxSpeed.label}
                                        value={`${(activity.max_speed * 3.6).toFixed(1)} km/h`}
                                        visible={showMaxSpeed}
                                        masked={maskedMaxSpeed}
                                        unit={modal.maxSpeed.unit}
                                    />
                                    <MetricRow
                                        label={modal.maxPower.label}
                                        value={`${Math.round(activity.max_watts!)} W`}
                                        visible={showMaxPower}
                                        masked={maskedMaxPower}
                                        unit={modal.maxPower.unit}
                                    />
                                    <MetricRow
                                        label={modal.weightedPower.label}
                                        value={`${Math.round(activity.weighted_average_watts!)} W`}
                                        visible={showWeightedPower}
                                        masked={maskedWeightedPower}
                                        unit={modal.weightedPower.unit}
                                    />
                                    <MetricRow
                                        label={modal.calories.label}
                                        value={formatKilojoules(activity.kilojoules) ?? '--'}
                                        visible={showCalories}
                                        masked={maskedCalories}
                                        unit={modal.calories.unit}
                                    />
                                    <MetricRow
                                        label={modal.elevRange.label}
                                        value={`${formatElevation(activity.elev_low!)} – ${formatElevation(activity.elev_high!)}`}
                                        visible={showElevRange}
                                        masked={maskedElevRange}
                                        unit={modal.elevRange.unit}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {(showDevice || showAchievements || (modal.private.state !== 'hide' && activity.private) || (modal.commute.state !== 'hide' && activity.commute) || (modal.trainer.state !== 'hide' && activity.trainer) || (modal.manual.state !== 'hide' && activity.manual)) && (
                        <>
                            <div className="border-t border-border pt-4">
                                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                                    ℹ️ Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {showDevice && (
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <span>{modal.device.label}</span>
                                            <span>{maskedDevice ? APP_CONFIG.maskedValue : activity.device_name}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-3">
                                        {showAchievements && (
                                            <>
                                                <span className="text-text-secondary">{modal.achievements.label} {maskedAchievements ? APP_CONFIG.maskedValue : (activity.achievement_count ?? 0)}</span>
                                                <span className="text-text-secondary">👍 {maskedAchievements ? APP_CONFIG.maskedValue : (activity.kudos_count ?? 0)} kudos</span>
                                            </>
                                        )}

                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {modal.private.state !== 'hide' && activity.private && (
                                            <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-xs text-text-secondary">{modal.private.label}</span>
                                        )}
                                        {modal.commute.state !== 'hide' && activity.commute && (
                                            <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-xs text-text-secondary">{modal.commute.label}</span>
                                        )}
                                        {modal.trainer.state !== 'hide' && activity.trainer && (
                                            <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-xs text-text-secondary">{modal.trainer.label}</span>
                                        )}
                                        {modal.manual.state !== 'hide' && activity.manual && (
                                            <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-xs text-text-secondary">{modal.manual.label}</span>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function HeroStat({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
    return (
        <div className="rounded-xl p-3 text-center" style={{ background: `${color}15` }}>
            <p className="text-lg">{icon}</p>
            <p className="text-lg font-bold text-text-primary mt-0.5" style={{ color }}>{value}</p>
            <p className="text-[11px] text-text-secondary uppercase tracking-wide mt-0.5">{label}</p>
        </div>
    )
}

function MetricRow({ label, value, visible, masked, unit }: { label: string; value: string; visible: boolean; masked?: boolean; unit?: string }) {
    if (!visible) return null
    return (
        <div className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
            <span className="text-text-secondary text-[13px]">{label}</span>
            <span className="font-semibold text-text-primary text-[13px]">{masked ? formatMaskedValue(APP_CONFIG.maskedValue, unit) : value}</span>
        </div>
    )
}
