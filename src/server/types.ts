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

export interface ActivityGroup {
    name: string
    label: string
    sportTypes: string[] | null
    visibility: StatsVisibility
    cardClick: 'modal' | 'none'
}

export interface ModalConfig {
    showMinimap: boolean
    maxSpeed: VisibilityState
    maxPower: VisibilityState
    weightedPower: VisibilityState
    calories: VisibilityState
    elevRange: VisibilityState
    device: VisibilityState
    achievements: VisibilityState
}

export interface AppConfig {
    cardClick: 'modal' | 'none'
    modal: ModalConfig
}

export interface ActivitiesResponse {
    activities: StravaActivity[]
    syncedAt: string
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
