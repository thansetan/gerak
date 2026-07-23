import type { ActivityGroup, StatsVisibility } from './types';

function defaultVisibility(): StatsVisibility {
    return {
        distance: { show: true, label: 'Distance', unit: 'km' },
        avgHeartRate: { show: true, label: 'Avg HR', unit: 'bpm' },
        maxHeartRate: { show: true, label: 'Max HR', unit: 'bpm' },
        pace: { show: true, label: 'Avg Pace', unit: '/km' },
        avgPower: { show: true, label: 'Avg Power', unit: 'W' },
        cadence: { show: true, label: 'Avg Cadence', unit: 'spm' },
        elevation: { show: true, label: 'Elevation', unit: 'm' },
        totalDistance: { show: true, label: 'Total Distance', unit: 'km' },
        totalElevation: { show: true, label: 'Elevation', unit: 'm' },
    };
}

export const ACTIVITY_GROUPS: Record<string, ActivityGroup> = {
    all: {
        name: 'all',
        label: 'All',
        sportTypes: null,
        visibility: defaultVisibility(),
    },
    run: {
        name: 'run',
        label: 'Run',
        sportTypes: ['Run', 'TrailRun', 'VirtualRun'],
        visibility: defaultVisibility(),
    },
    walk: {
        name: 'walk',
        label: 'Walk',
        sportTypes: ['Walk'],
        visibility: defaultVisibility(),
    },
    bike: {
        name: 'bike',
        label: 'Bike',
        sportTypes: ['Ride', 'MountainBikeRide', 'GravelRide', 'VirtualRide'],
        visibility: {
            ...defaultVisibility(),
            pace: { show: false, label: 'Avg Pace', unit: '/km' },
            speed: { show: true, label: 'Avg Speed', unit: 'km/h' },
        },
    },
    badminton: {
        name: 'badminton',
        label: 'Badminton',
        sportTypes: ['Badminton'],
        visibility: {
            ...defaultVisibility(),
            totalDistance: { show: false, label: 'Total Distance', unit: 'km' },
            totalElevation: { show: false, label: 'Elevation', unit: 'm' },
        },
    },
    strength: {
        name: 'strength',
        label: 'Strength',
        sportTypes: ['Strength', 'WeightTraining'],
        visibility: {
            ...defaultVisibility(),
            totalDistance: { show: false, label: 'Total Distance', unit: 'km' },
            totalElevation: { show: false, label: 'Elevation', unit: 'm' },
        },
    },
    other: {
        name: 'other',
        label: 'Other',
        sportTypes: [],
        visibility: {
            ...defaultVisibility(),
            totalDistance: { show: false, label: 'Total Distance', unit: 'km' },
            totalElevation: { show: false, label: 'Elevation', unit: 'm' },
        },
    },
};
