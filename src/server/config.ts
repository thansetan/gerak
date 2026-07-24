import type { ActivityGroup, StatsVisibility, AppConfig } from './types';

function defaultVisibility(): StatsVisibility {
    return {
        distance: { state: 'show', label: '📏 Distance', unit: 'km' },
        avgHeartRate: { state: 'show', label: '💓 Avg HR', unit: 'bpm' },
        maxHeartRate: { state: 'show', label: '💗 Max HR', unit: 'bpm' },
        pace: { state: 'show', label: '⏱️ Avg Pace', unit: '/km' },
        avgPower: { state: 'show', label: '⚡ Avg Power', unit: 'W' },
        cadence: { state: 'show', label: '🔄 Cadence', unit: 'spm' },
        elevation: { state: 'show', label: '⛰️ Elevation Gain', unit: 'm' },
        totalDistance: { state: 'show', label: '🛣️ Distance', unit: 'km' },
        totalDuration: { state: 'show', label: '⏱️ Time', unit: 'hrs' },
        totalElevation: { state: 'show', label: '🏔️ Elevation', unit: 'm' },
        activeDays: { state: 'show', label: '📅 Days', unit: '' },
    };
}

export const ACTIVITY_GROUPS: Record<string, ActivityGroup> = {
        all: {
            name: 'all',
            label: '📋 All',
            sportTypes: null,
            visibility: defaultVisibility(),
            cardClick: 'modal',
            gearConfig: { state: 'show', label: '👟 Gear', value: 'brand_model' },
        },
        run: {
            name: 'run',
            label: '🏃 Run',
            sportTypes: ['Run', 'TrailRun', 'VirtualRun'],
            visibility: defaultVisibility(),
            cardClick: 'modal',
            gearConfig: { state: 'show', label: '👟 Shoes', value: 'nickname' },
        },
        walk: {
            name: 'walk',
            label: '🚶 Walk',
            sportTypes: ['Walk'],
            visibility: defaultVisibility(),
            cardClick: 'modal',
            gearConfig: { state: 'show', label: '👟 Shoes', value: 'brand_model' },
        },
        bike: {
            name: 'bike',
            label: '🚴 Bike',
            sportTypes: ['Ride', 'MountainBikeRide', 'GravelRide', 'VirtualRide'],
            visibility: {
                ...defaultVisibility(),
                pace: { state: 'hide', label: 'Avg Pace', unit: '/km' },
                speed: { state: 'show', label: 'Avg Speed', unit: 'km/h' },
            },
            cardClick: 'modal',
            gearConfig: { state: 'show', label: '🚴 Bike', value: 'full_name' },
        },
        badminton: {
            name: 'badminton',
            label: '🏸 Badminton',
            sportTypes: ['Badminton'],
            visibility: {
                ...defaultVisibility(),
                totalDistance: {
                    state: 'hide',
                    label: 'Total Distance',
                    unit: 'km',
                },
                totalElevation: { state: 'hide', label: 'Elevation', unit: 'm' },
            },
            cardClick: 'modal',
            gearConfig: { state: 'show', label: '👟 Shoes', value: 'brand_model' },
        },
        strength: {
            name: 'strength',
            label: '💪 Strength',
            sportTypes: ['Strength', 'WeightTraining'],
            visibility: {
                ...defaultVisibility(),
                totalDistance: {
                    state: 'hide',
                    label: 'Total Distance',
                    unit: 'km',
                },
                totalElevation: { state: 'hide', label: 'Elevation', unit: 'm' },
            },
            cardClick: 'modal',
            gearConfig: { state: 'show', label: '👟 Shoes', value: 'brand_model' },
        },
        other: {
            name: 'other',
            label: '🎯 Other',
            sportTypes: [],
            visibility: {
                ...defaultVisibility(),
                totalDistance: {
                    state: 'hide',
                    label: 'Total Distance',
                    unit: 'km',
                },
                totalElevation: { state: 'hide', label: 'Elevation', unit: 'm' },
            },
            cardClick: 'modal',
            gearConfig: { state: 'show', label: '👟 Gear', value: 'brand_model' },
        },
};

export const APP_CONFIG: AppConfig = {
    cardClick: 'modal',
    maskedValue: '●●●',
    modal: {
        showMinimap: true,
        maxSpeed: { state: 'show', label: '🚀 Max Speed', unit: 'km/h' },
        maxPower: { state: 'show', label: '⚡ Max Power', unit: 'W' },
        weightedPower: { state: 'show', label: '⚡ Weighted Power', unit: 'W' },
        calories: { state: 'hide', label: '🔥 Calories', unit: 'kJ' },
        elevRange: { state: 'show', label: '📈 Elev Range', unit: 'm' },
        device: { state: 'show', label: '📱 Device', unit: '' },
        achievements: { state: 'show', label: '🏆 Achievements', unit: '' },
        private: { state: 'hide', label: '🔒 Private', unit: '' },
        commute: { state: 'show', label: '🚗 Commute', unit: '' },
        trainer: { state: 'show', label: '🏋️ Indoor', unit: '' },
        manual: { state: 'show', label: '✏️ Manual', unit: '' },
    },
};

export const MAX_FETCHED_ACTIVITIES: number = 200;