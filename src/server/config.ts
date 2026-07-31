import type { ActivityGroup, AppConfig, StatsConfig, StatsBarConfig } from './types';

const DEFAULT_STATS: StatsConfig = {
    distance: {
        state: 'show',
        label: 'Distance',
        unit: 'km',
        valueCalculation: (a) => a.distance > 0 ? (Math.floor(a.distance / 1000 * 100) / 100).toFixed(2) : null,
        showInCard: true,
        type: 'metric',
        highlightInModal: true,
    },
    duration: {
        state: 'show',
        label: 'Duration',
        unit: '',
        valueCalculation: (a) => {
            const t = a.moving_time;
            const h = Math.floor(t / 3600);
            const m = Math.floor((t % 3600) / 60);
            const s = t % 60;
            if (h > 0) return `${h}h ${m}m ${s}s`;
            if (m > 0) return `${m}m ${s}s`;
            return `${s}s`;
        },
        showInCard: false,
        type: 'metric',
        highlightInModal: true,
    },
    avgHeartRate: {
        state: 'show',
        label: 'Avg HR',
        unit: 'bpm',
        valueCalculation: (a) => a.average_heartrate != null ? Math.round(a.average_heartrate).toString() : null,
        showInCard: true,
        type: 'metric',
        highlightInModal: false,
    },
    maxHeartRate: {
        state: 'show',
        label: 'Max HR',
        unit: 'bpm',
        valueCalculation: (a) => a.max_heartrate != null ? Math.round(a.max_heartrate).toString() : null,
        showInCard: true,
        type: 'metric',
        highlightInModal: false,
    },
    pace: {
        state: 'show',
        label: 'Avg Pace',
        unit: '/km',
        valueCalculation: (a) => {
            if (a.average_speed <= 0) return null;
            const mpk = 1000 / a.average_speed / 60;
            const min = Math.floor(mpk);
            const sec = Math.round((mpk - min) * 60);
            
            return `${min + Math.floor(sec /60)}:${(sec % 60).toString().padStart(2, '0')}`;
        },
        showInCard: true,
        type: 'metric',
        highlightInModal: true,
    },
    avgPower: {
        state: 'show',
        label: 'Avg Power',
        unit: 'W',
        valueCalculation: (a) => a.average_watts != null ? Math.round(a.average_watts).toString() : null,
        showInCard: true,
        type: 'metric',
        highlightInModal: false,
    },
    cadence: {
        state: 'show',
        label: 'Avg Cadence',
        unit: 'spm',
        valueCalculation: (a) => a.average_cadence != null ? Math.round(a.average_cadence * 2).toString() : null,
        showInCard: true,
        type: 'metric',
        highlightInModal: false,
    },
    elevation: {
        state: 'show',
        label: 'Elevation Gain',
        unit: 'm',
        valueCalculation: (a) => a.total_elevation_gain > 0 ? Math.round(a.total_elevation_gain).toString() : null,
        showInCard: true,
        type: 'metric',
        highlightInModal: false,
    },
    speed: {
        state: 'hide',
        label: 'Avg Speed',
        unit: 'km/h',
        valueCalculation: (a) => a.average_speed > 0 ? (a.average_speed * 3.6).toFixed(1) : null,
        showInCard: false,
        type: 'metric',
        highlightInModal: false,
    },
    maxSpeed: {
        state: 'show',
        label: 'Max Speed',
        unit: 'km/h',
        valueCalculation: (a) => a.max_speed > 0 ? (a.max_speed * 3.6).toFixed(1) : null,
        showInCard: false,
        type: 'metric',
        highlightInModal: false,
    },
    maxPower: {
        state: 'show',
        label: 'Max Power',
        unit: 'W',
        valueCalculation: (a) => a.max_watts != null ? Math.round(a.max_watts).toString() : null,
        showInCard: false,
        type: 'metric',
        highlightInModal: false,
    },
    weightedPower: {
        state: 'show',
        label: 'Weighted Power',
        unit: 'W',
        valueCalculation: (a) => a.weighted_average_watts != null ? Math.round(a.weighted_average_watts).toString() : null,
        showInCard: false,
        type: 'metric',
        highlightInModal: false,
    },
    calories: {
        state: 'hide',
        label: 'Calories',
        unit: 'kJ',
        valueCalculation: (a) => a.kilojoules != null && a.kilojoules > 0 ? Math.round(a.kilojoules * 0.239).toString() : null,
        showInCard: false,
        type: 'metric',
        highlightInModal: false,
    },
    elevRange: {
        state: 'show',
        label: 'Elev Range',
        unit: '',
        valueCalculation: (a) => a.elev_low != null && a.elev_high != null ? `${Math.round(a.elev_low)}m - ${Math.round(a.elev_high)}m` : null,
        showInCard: false,
        type: 'metric',
        highlightInModal: false,
    },
    device: {
        state: 'show',
        label: 'Device',
        unit: '',
        valueCalculation: (a) => a.device_name ?? null,
        showInCard: false,
        type: 'detail',
        highlightInModal: false,
        renderAs: 'row',
    },
    private: {
        state: 'hide',
        label: 'Private',
        unit: '',
        valueCalculation: (a) => a.private ? 'Private' : null,
        showInCard: false,
        type: 'detail',
        highlightInModal: false,
        renderAs: 'tag',
    },
    commute: {
        state: 'show',
        label: 'Commute',
        unit: '',
        valueCalculation: (a) => a.commute ? 'Commute' : null,
        showInCard: false,
        type: 'detail',
        highlightInModal: false,
        renderAs: 'tag',
    },
    trainer: {
        state: 'show',
        label: 'Indoor',
        unit: '',
        valueCalculation: (a) => a.trainer ? 'Indoor' : null,
        showInCard: false,
        type: 'detail',
        highlightInModal: false,
        renderAs: 'tag',
    },
    manual: {
        state: 'show',
        label: 'Manual',
        unit: '',
        valueCalculation: (a) => a.manual ? 'Manual' : null,
        showInCard: false,
        type: 'detail',
        highlightInModal: false,
        renderAs: 'tag',
    },
};

const DEFAULT_STATS_BAR: StatsBarConfig = {
    totalDistance: {
        state: 'show',
        label: 'Distance',
        unit: 'km',
        valueCalculation: (v) => (v / 1000).toFixed(2),
    },
    totalDuration: {
        state: 'show',
        label: 'Time',
        unit: '',
        valueCalculation: (v) => {
            const h = Math.floor(v / 3600);
            const m = Math.round((v % 3600) / 60);
            return h > 0 ? `${h}h ${m}m` : `${m}m`;
        },
    },
    totalElevation: {
        state: 'show',
        label: 'Elevation',
        unit: 'm',
        valueCalculation: (v) => Math.round(v).toString(),
    },
    activeDays: {
        state: 'show',
        label: 'Active Days',
        unit: '',
        valueCalculation: (v) => `${v} day${v !== 1 ? 's' : ''}`,
    },
};

export const ACTIVITY_GROUPS: Record<string, ActivityGroup> = {
    all: {
        name: 'all',
        label: 'All',
        sportTypes: null,
        stats: { ...DEFAULT_STATS },
        color: { accent: '#525252', bg: '#fafafa' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Gear', value: 'brand_model' },
    },
    run: {
        name: 'run',
        label: 'Run',
        sportTypes: ['Run', 'TrailRun', 'VirtualRun'],
        stats: { ...DEFAULT_STATS },
        color: { accent: '#dc2626', bg: '#fef2f2' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Shoes', value: 'nickname' },
    },
    walk: {
        name: 'walk',
        label: 'Walk',
        sportTypes: ['Walk'],
        stats: { ...DEFAULT_STATS },
        color: { accent: '#16a34a', bg: '#f0fdf4' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Shoes', value: 'nickname' },
    },
    bike: {
        name: 'bike',
        label: 'Bike',
        sportTypes: ['Ride', 'MountainBikeRide', 'GravelRide', 'VirtualRide'],
        stats: {
            ...DEFAULT_STATS,
            pace: { ...DEFAULT_STATS.pace, state: 'hide' },
            speed: { ...DEFAULT_STATS.speed, state: 'show', showInCard: true, highlightInModal: true },
        },
        color: { accent: '#2563eb', bg: '#eff6ff' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Bike', value: 'full_name' },
    },
    badminton: {
        name: 'badminton',
        label: 'Badminton',
        sportTypes: ['Badminton'],
        stats: {
            ...DEFAULT_STATS,
            maxSpeed: { ...DEFAULT_STATS.maxSpeed, state: 'hide' },
            maxPower: { ...DEFAULT_STATS.maxPower, state: 'hide' },
            weightedPower: { ...DEFAULT_STATS.weightedPower, state: 'hide' },
            elevRange: { ...DEFAULT_STATS.elevRange, state: 'hide' },
        },
        color: { accent: '#9333ea', bg: '#faf5ff' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Shoes', value: 'brand_model' },
        statsBarConfig: {
            totalDistance: { state: 'hide' },
            totalElevation: { state: 'hide' },
        },
    },
    strength: {
        name: 'strength',
        label: 'Strength',
        sportTypes: ['Strength', 'WeightTraining'],
        stats: {
            ...DEFAULT_STATS,
            maxSpeed: { ...DEFAULT_STATS.maxSpeed, state: 'hide' },
            maxPower: { ...DEFAULT_STATS.maxPower, state: 'hide' },
            weightedPower: { ...DEFAULT_STATS.weightedPower, state: 'hide' },
            elevRange: { ...DEFAULT_STATS.elevRange, state: 'hide' },
        },
        color: { accent: '#ca8a04', bg: '#fefce8' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Shoes', value: 'brand_model' },
        statsBarConfig: {
            totalDistance: { state: 'hide' },
            totalElevation: { state: 'hide' },
        },
    },
    other: {
        name: 'other',
        label: 'Other',
        sportTypes: [],
        stats: { ...DEFAULT_STATS },
        color: { accent: '#525252', bg: '#fafafa' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Gear', value: 'brand_model' },
        statsBarConfig: {
            totalDistance: { state: 'hide' },
            totalElevation: { state: 'hide' },
        },
    },
};

export const APP_CONFIG: AppConfig = {
    cardClick: 'modal',
    maskedValue: '--',
    timezone: 'Asia/Jakarta',
    maxFetchedActivities: 200,
    modalHeader: {
        showMinimap: true,
        minimapAnimation: true,
        showTitle: true,
        showActivityTime: true,
        showAchievements: true,
        showKudos: true,
    },
    statsBar: DEFAULT_STATS_BAR,
};
