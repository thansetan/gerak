import type { ActivityGroup, AppConfig, StatsConfig } from './types';

function defaultVisibility(): StatsConfig {
    return {
        distance: { state: 'show', label: 'Distance', unit: 'km', valueCalculation: (v) => (v / 1000).toFixed(2) },
        avgHeartRate: { state: 'mask', label: 'Avg HR', unit: 'bpm', valueCalculation: (v) => Math.round(v).toString() },
        maxHeartRate: { state: 'mask', label: 'Max HR', unit: 'bpm', valueCalculation: (v) => Math.round(v).toString() },
        pace: { state: 'mask', label: 'Avg Pace', unit: '/km', valueCalculation: (v) => { if (v <= 0) return '--'; const mpk = 1000 / v / 60; const min = Math.floor(mpk); const sec = Math.round((mpk - min) * 60); return `${min}:${sec.toString().padStart(2, '0')}` } },
        avgPower: { state: 'show', label: 'Avg Power', unit: 'W', valueCalculation: (v) => Math.round(v).toString() },
        cadence: { state: 'show', label: 'Avg Cadence', unit: 'spm', valueCalculation: (v) => Math.round(v * 2).toString() },
        elevation: { state: 'show', label: 'Elevation Gain', unit: 'm', valueCalculation: (v) => Math.round(v).toString() },
        duration: { state: 'show', label: 'Duration', unit: '', valueCalculation: (v) => { const h = Math.floor(v / 3600); const m = Math.floor((v % 3600) / 60); const s = v % 60; if (h > 0) return `${h}h ${m}m ${s}s`; if (m > 0) return `${m}m ${s}s`; return `${s}s` } },
        totalDistance: { state: 'show', label: 'Distance', unit: 'km', valueCalculation: (v) => (v / 1000).toFixed(2) },
        totalDuration: { state: 'show', label: 'Time', unit: 'hrs', valueCalculation: (v) => (v / 3600).toFixed(1) },
        totalElevation: { state: 'show', label: 'Elevation', unit: 'm', valueCalculation: (v) => Math.round(v).toString() },
        activeDays: { state: 'show', label: 'Days', unit: '', valueCalculation: (v) => Math.round(v).toString() },
    };
}

export const ACTIVITY_GROUPS: Record<string, ActivityGroup> = {
    all: {
        name: 'all',
        label: 'All',
        sportTypes: null,
        visibility: defaultVisibility(),
        color: { accent: '#525252', bg: '#fafafa' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Gear', value: 'brand_model' },
    },
    run: {
        name: 'run',
        label: 'Run',
        sportTypes: ['Run', 'TrailRun', 'VirtualRun'],
        visibility: defaultVisibility(),
        color: { accent: '#dc2626', bg: '#fef2f2' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Shoes', value: 'nickname' },
    },
    walk: {
        name: 'walk',
        label: 'Walk',
        sportTypes: ['Walk'],
        visibility: defaultVisibility(),
        color: { accent: '#16a34a', bg: '#f0fdf4' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Shoes', value: 'nickname' },
    },
    bike: {
        name: 'bike',
        label: 'Bike',
        sportTypes: ['Ride', 'MountainBikeRide', 'GravelRide', 'VirtualRide'],
        visibility: {
            ...defaultVisibility(),
            pace: { state: 'hide', label: 'Avg Pace', unit: '/km' },
            speed: { state: 'show', label: 'Avg Speed', unit: 'km/h', valueCalculation: (v) => (v * 3.6).toFixed(1) },
        },
        color: { accent: '#2563eb', bg: '#eff6ff' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Bike', value: 'full_name' },
    },
    badminton: {
        name: 'badminton',
        label: 'Badminton',
        sportTypes: ['Badminton'],
        visibility: {
            ...defaultVisibility(),
            totalDistance: { state: 'hide', label: 'Total Distance', unit: 'km', valueCalculation: (v) => (v / 1000).toFixed(2) },
            totalElevation: { state: 'hide', label: 'Elevation', unit: 'm', valueCalculation: (v) => Math.round(v).toString() },
        },
        color: { accent: '#9333ea', bg: '#faf5ff' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Shoes', value: 'brand_model' },
        modalConfig: {
            elevRange: { state: 'hide', label: 'Elev Range', unit: 'm' },
            maxSpeed: { state: 'hide', label: 'Max Speed', unit: 'km/h' },
            maxPower: { state: 'hide', label: 'Max Power', unit: 'W' },
            weightedPower: { state: 'hide', label: 'Weighted Power', unit: 'W' },
        },
    },
    strength: {
        name: 'strength',
        label: 'Strength',
        sportTypes: ['Strength', 'WeightTraining'],
        visibility: {
            ...defaultVisibility(),
            totalDistance: { state: 'hide', label: 'Total Distance', unit: 'km', valueCalculation: (v) => (v / 1000).toFixed(2) },
            totalElevation: { state: 'hide', label: 'Elevation', unit: 'm', valueCalculation: (v) => Math.round(v).toString() },
        },
        color: { accent: '#ca8a04', bg: '#fefce8' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Shoes', value: 'brand_model' },
        modalConfig: {
            elevRange: { state: 'hide', label: 'Elev Range', unit: 'm' },
            maxSpeed: { state: 'hide', label: 'Max Speed', unit: 'km/h' },
            maxPower: { state: 'hide', label: 'Max Power', unit: 'W' },
            weightedPower: { state: 'hide', label: 'Weighted Power', unit: 'W' },
        },
    },
    other: {
        name: 'other',
        label: 'Other',
        sportTypes: [],
        visibility: {
            ...defaultVisibility(),
            totalDistance: { state: 'hide', label: 'Total Distance', unit: 'km', valueCalculation: (v) => (v / 1000).toFixed(2) },
            totalElevation: { state: 'hide', label: 'Elevation', unit: 'm', valueCalculation: (v) => Math.round(v).toString() },
        },
        color: { accent: '#525252', bg: '#fafafa' },
        cardClick: 'modal',
        gearConfig: { state: 'show', label: 'Gear', value: 'brand_model' },
    },
};

export const APP_CONFIG: AppConfig = {
    cardClick: 'modal',
    maskedValue: '--',
    timezone: 'Asia/Jakarta',
    maxFetchedActivities: 200,
    modal: {
        showMinimap: true,
        maxSpeed: { state: 'show', label: 'Max Speed', unit: 'km/h', valueCalculation: (v) => (v * 3.6).toFixed(1) },
        maxPower: { state: 'show', label: 'Max Power', unit: 'W', valueCalculation: (v) => Math.round(v).toString() },
        weightedPower: { state: 'show', label: 'Weighted Power', unit: 'W', valueCalculation: (v) => Math.round(v).toString() },
        calories: { state: 'hide', label: 'Calories', unit: 'kJ', valueCalculation: (v) => Math.round(v * 0.239).toString() },
        elevRange: { state: 'show', label: 'Elev Range', unit: 'm', valueCalculation: (v) => Math.round(v).toString() },
        device: { state: 'show', label: 'Device', unit: '' },
        achievements: { state: 'show', label: 'Achievements', unit: '' },
        private: { state: 'hide', label: 'Private', unit: '' },
        commute: { state: 'show', label: 'Commute', unit: '' },
        trainer: { state: 'show', label: 'Indoor', unit: '' },
        manual: { state: 'show', label: 'Manual', unit: '' },
    },
};
