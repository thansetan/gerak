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

export interface StatVisibility {
    state: VisibilityState
    label: string
    unit: string
}

export type StatsVisibility = Record<string, StatVisibility>

export interface ActivityGroupColor {
    accent: string
    bg: string
}

export interface ActivityGroup {
    name: string
    label: string
    sportTypes: string[] | null
    visibility: StatsVisibility
    color: ActivityGroupColor
    cardClick: 'modal' | 'none'
    gearConfig?: GearConfig
    modalConfig?: Partial<ModalConfig>
}

export interface ModalConfig {
    showMinimap: boolean
    maxSpeed: StatVisibility
    maxPower: StatVisibility
    weightedPower: StatVisibility
    calories: StatVisibility
    elevRange: StatVisibility
    device: StatVisibility
    achievements: StatVisibility
    private: StatVisibility
    commute: StatVisibility
    trainer: StatVisibility
    manual: StatVisibility
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
    modal: ModalConfig
    maskedValue: string
    timezone: string
    maxFetchedActivities: number
}

export interface ActivitiesResponse {
    activities: StravaActivity[]
    syncedAt: string
}

export interface AthleteProfile {
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

export interface ApiError {
    error: string
    message: string
}
