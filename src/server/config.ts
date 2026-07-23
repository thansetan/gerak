import type { ActivityGroup, StatsVisibility } from './types';

function defaultVisibility(): StatsVisibility {
    return {
        distance: { state: 'show', label: 'Distance', unit: 'km' },
        avgHeartRate: { state: 'show', label: 'Avg HR', unit: 'bpm' },
        maxHeartRate: { state: 'show', label: 'Max HR', unit: 'bpm' },
        pace: { state: 'show', label: 'Avg Pace', unit: '/km' },
        avgPower: { state: 'show', label: 'Avg Power', unit: 'W' },
        cadence: { state: 'show', label: 'Avg Cadence', unit: 'spm' },
        elevation: { state: 'show', label: 'Elevation', unit: 'm' },
        totalDistance: { state: 'show', label: 'Total Distance', unit: 'km' },
        totalElevation: { state: 'show', label: 'Elevation', unit: 'm' },
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
            pace: { state: 'hide', label: 'Avg Pace', unit: '/km' },
            speed: { state: 'show', label: 'Avg Speed', unit: 'km/h' },
        },
    },
    badminton: {
        name: 'badminton',
        label: 'Badminton',
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
    },
    strength: {
        name: 'strength',
        label: 'Strength',
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
    },
    other: {
        name: 'other',
        label: 'Other',
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
    },
};
