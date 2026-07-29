export interface StravaActivityMap {
    id: string
    summary_polyline: string
    resource_state: number
}

export interface StravaActivity {
    id: number
    name: string
    sport_type: string
    start_date: string
    distance: number
    moving_time: number
    elapsed_time: number
    total_elevation_gain: number
    average_heartrate?: number
    max_heartrate?: number
    average_speed: number
    max_speed: number
    average_watts?: number
    max_watts?: number
    weighted_average_watts?: number
    kilojoules?: number
    device_watts?: boolean
    has_heartrate: boolean
    elev_high?: number
    elev_low?: number
    start_latlng?: [number, number]
    end_latlng?: [number, number]
    average_cadence?: number
    gear_id?: string
    private: boolean
    commute: boolean
    manual: boolean
    trainer: boolean
    device_name?: string
    kudos_count?: number
    suffer_score?: number
    achievement_count?: number
    map?: StravaActivityMap
}

export type VisibilityState = 'show' | 'hide' | 'mask'

export interface StatConfig {
    state: VisibilityState
    label: string
    unit: string
    valueCalculation: (activity: StravaActivity) => string | null
    showInCard: boolean
    type: 'metric' | 'detail'
    highlightInModal: boolean
    renderAs?: 'row' | 'tag'
}

export type StatsConfig = Record<string, StatConfig>

export interface StatsBarStatConfig {
    state: VisibilityState
    label: string
    unit: string
    valueCalculation: (value: number) => string
}

export interface StatsBarConfig {
    totalDistance: StatsBarStatConfig
    totalDuration: StatsBarStatConfig
    totalElevation: StatsBarStatConfig
    activeDays: StatsBarStatConfig
}

export interface ActivityGroupColor {
    accent: string
    bg: string
}

export type PartialStatsBarConfig = {
    [K in keyof StatsBarConfig]?: Partial<StatsBarConfig[K]>
}

export interface ActivityGroup {
    name: string
    label: string
    sportTypes: string[] | null
    stats: StatsConfig
    color: ActivityGroupColor
    cardClick: 'modal' | 'none'
    gearConfig?: GearConfig
    statsBarConfig?: PartialStatsBarConfig
    modalConfig?: Partial<ModalConfig>
}

export interface ModalConfig {
    showMinimap: boolean
    showTitle: boolean
    showActivityTime: boolean
    showAchievements: boolean
    showKudos: boolean
}

export type GearValueDisplay = 'brand_model' | 'nickname' | 'full_name'

export interface GearDetail {
    id: string
    name: string
    nickname?: string
    brand_name?: string
    model_name?: string
    primary: boolean
    retired: boolean
    distance: number
}

export interface GearConfig {
    state: VisibilityState
    label: string
    value: GearValueDisplay
}

export interface AppConfig {
    cardClick: 'modal' | 'none'
    modalHeader: ModalConfig
    statsBar: StatsBarConfig
    maskedValue: string
    timezone: string
    maxFetchedActivities: number
}

export interface ActivitiesResponse {
    activities: StravaActivity[]
    syncedAt: string
    fetchWindowStart: string
    fetchWindowEnd: string
}

export interface AthleteProfile {
    id: number
    firstname: string
    lastname: string
    profile: string
}

export interface StravaTokenResponse {
    token_type: string
    access_token: string
    expires_at: number
    expires_in: number
    refresh_token: string
}

