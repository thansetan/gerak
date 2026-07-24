import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ACTIVITY_GROUPS, APP_CONFIG } from '../server/config'
import { getGear } from '../server/gear'
import { getGroupForActivity } from '../lib/groups'
import { Minimap } from './Minimap'
import { SPORT_COLORS } from '../lib/colors'
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
    formatSpeedKmh,
    getGearDisplayValue,
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
    const { data: gearMap } = useQuery({ queryKey: ['gear'], queryFn: () => getGear(), staleTime: Infinity })
    const gearDetail = gearMap?.[activity.gear_id ?? '']
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
    const showGear = groupConfig.gearConfig?.state !== 'hide' && gearDetail != null
    const maskedGear = groupConfig.gearConfig?.state === 'mask'
    const gearDisplayValue = gearDetail && groupConfig.gearConfig ? getGearDisplayValue(gearDetail, groupConfig.gearConfig.value) : '--'

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
                        <h2 className="font-mono text-lg font-bold text-text leading-snug">
                            {activity.name}
                        </h2>
                        <p className="font-mono text-xs text-text-muted mt-0.5 uppercase tracking-tight">
                            {new Date(activity.start_date).toLocaleString()}
                        </p>
                        {showAchievements && (
                            <p className="font-mono text-xs text-text-muted mt-1">
                                {maskedAchievements ? APP_CONFIG.maskedValue : (activity.achievement_count ?? 0)} achievements
                                <span className="mx-1.5">&middot;</span>
                                {maskedAchievements ? APP_CONFIG.maskedValue : (activity.kudos_count ?? 0)} kudos
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span
                          className="font-mono text-[10px] font-medium uppercase tracking-tight px-1.5 py-0.5"
                          style={{ backgroundColor: colors.bg, color: colors.accent }}
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
                    {activity.map?.summary_polyline && modal.showMinimap && (
                        <Minimap
                            summaryPolyline={activity.map.summary_polyline}
                            accentColor={colors.accent}
                            bgColor={colors.bg}
                        />
                    )}

                    <div className="grid grid-cols-3 gap-0 border-2 border-border">
                        <HeroStat
                            label="Duration"
                            value={formatDurationFull(activity.moving_time)}
                            color={colors.accent}
                        />
                        {hasDistance && (
                            <HeroStat
                                label="Distance"
                                value={formatDistance(activity.distance)}
                                color={colors.accent}
                            />
                        )}
                        {showPace && (
                            <HeroStat
                                label="Pace"
                                value={formatPace(activity.average_speed)}
                                color={colors.accent}
                            />
                        )}
                        {showSpeed && (
                            <HeroStat
                                label="Speed"
                                value={formatSpeedKmh(activity.average_speed)}
                                color={colors.accent}
                            />
                        )}
                        {!hasDistance && !showPace && !showSpeed && (
                            <HeroStat
                                label="Active Time"
                                value={formatDurationFull(activity.moving_time)}
                                color={colors.accent}
                            />
                        )}
                    </div>

                    {(vis.distance?.state !== 'hide' || vis.avgHeartRate?.state !== 'hide' ||
                      vis.maxHeartRate?.state !== 'hide' || vis.avgPower?.state !== 'hide' ||
                      vis.cadence?.state !== 'hide' || vis.elevation?.state !== 'hide' ||
                      showMaxSpeed || showMaxPower || showWeightedPower || showCalories || showElevRange) && (
                        <>
                            <div className="border-t-2 border-border pt-4">
                                <h3 className="font-mono text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                                    Metrics
                                </h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <MetricRow
                                        label={vis.distance?.label ?? 'Distance'}
                                        value={formatDistance(activity.distance)}
                                        visible={vis.distance?.state !== 'hide' && hasDistance}
                                        masked={vis.distance?.state === 'mask'}
                                        unit={vis.distance?.unit}
                                    />
                                    <MetricRow
                                        label={vis.avgHeartRate?.label ?? 'Avg HR'}
                                        value={formatHeartRate(activity.average_heartrate)}
                                        visible={vis.avgHeartRate?.state !== 'hide' && !!activity.average_heartrate}
                                        masked={vis.avgHeartRate?.state === 'mask'}
                                        unit={vis.avgHeartRate?.unit}
                                    />
                                    <MetricRow
                                        label={vis.maxHeartRate?.label ?? 'Max HR'}
                                        value={formatHeartRate(activity.max_heartrate)}
                                        visible={vis.maxHeartRate?.state !== 'hide' && !!activity.max_heartrate}
                                        masked={vis.maxHeartRate?.state === 'mask'}
                                        unit={vis.maxHeartRate?.unit}
                                    />
                                    <MetricRow
                                        label={vis.pace?.label ?? 'Pace'}
                                        value={formatPace(activity.average_speed)}
                                        visible={showPace}
                                        masked={vis.pace?.state === 'mask'}
                                        unit={vis.pace?.unit}
                                    />
                                    <MetricRow
                                        label={vis.speed?.label ?? 'Speed'}
                                        value={formatSpeedKmh(activity.average_speed)}
                                        visible={showSpeed}
                                        masked={vis.speed?.state === 'mask'}
                                        unit={vis.speed?.unit}
                                    />
                                    <MetricRow
                                        label={vis.avgPower?.label ?? 'Avg Power'}
                                        value={activity.average_watts ? `${Math.round(activity.average_watts)} W` : '--'}
                                        visible={vis.avgPower?.state !== 'hide' && !!activity.average_watts}
                                        masked={vis.avgPower?.state === 'mask'}
                                        unit={vis.avgPower?.unit}
                                    />
                                    <MetricRow
                                        label={vis.cadence?.label ?? 'Cadence'}
                                        value={formatCadence(activity.average_cadence ? activity.average_cadence * 2 : undefined)}
                                        visible={vis.cadence?.state !== 'hide' && !!activity.average_cadence}
                                        masked={vis.cadence?.state === 'mask'}
                                        unit={vis.cadence?.unit}
                                    />
                                    <MetricRow
                                        label={vis.elevation?.label ?? 'Elevation'}
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
                                        value={`${formatElevation(activity.elev_low!)} - ${formatElevation(activity.elev_high!)}`}
                                        visible={showElevRange}
                                        masked={maskedElevRange}
                                        unit={modal.elevRange.unit}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {(showDevice || showGear || (modal.private.state !== 'hide' && activity.private) || (modal.commute.state !== 'hide' && activity.commute) || (modal.trainer.state !== 'hide' && activity.trainer) || (modal.manual.state !== 'hide' && activity.manual)) && (
                        <>
                            <div className="border-t-2 border-border pt-4">
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
                                    {showDevice && (
                                        <div className="flex items-center gap-2 text-text-muted font-mono text-xs">
                                            <span className="uppercase">{modal.device.label}</span>
                                            <span>{maskedDevice ? APP_CONFIG.maskedValue : activity.device_name}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {modal.private.state !== 'hide' && activity.private && (
                                            <span className="font-mono text-[10px] uppercase tracking-tight border-2 border-border px-2 py-0.5 text-text-muted">{modal.private.label}</span>
                                        )}
                                        {modal.commute.state !== 'hide' && activity.commute && (
                                            <span className="font-mono text-[10px] uppercase tracking-tight border-2 border-border px-2 py-0.5 text-text-muted">{modal.commute.label}</span>
                                        )}
                                        {modal.trainer.state !== 'hide' && activity.trainer && (
                                            <span className="font-mono text-[10px] uppercase tracking-tight border-2 border-border px-2 py-0.5 text-text-muted">{modal.trainer.label}</span>
                                        )}
                                        {modal.manual.state !== 'hide' && activity.manual && (
                                            <span className="font-mono text-[10px] uppercase tracking-tight border-2 border-border px-2 py-0.5 text-text-muted">{modal.manual.label}</span>
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

function HeroStat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="p-3 text-center border-r-2 border-border last:border-r-0">
            <p className="font-mono text-lg font-bold text-text tabular-nums" style={{ color }}>{value}</p>
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-tight mt-0.5">{label}</p>
        </div>
    )
}

function MetricRow({ label, value, visible, masked, unit }: { label: string; value: string; visible: boolean; masked?: boolean; unit?: string }) {
    if (!visible) return null
    return (
        <div className="flex items-center justify-between py-1">
            <span className="font-mono text-[11px] text-text-muted uppercase tracking-tight">{label}</span>
            <span className="font-mono text-xs font-medium text-text tabular-nums">{masked ? formatMaskedValue(APP_CONFIG.maskedValue, unit) : value}</span>
        </div>
    )
}
