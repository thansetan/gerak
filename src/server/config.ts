import type { ActivityGroup, StatsVisibility } from './types';

function defaultVisibility(): StatsVisibility {
    return {
        distance: { show: true, label: 'Distance', unit: 'km' },
        avgHeartRate: { show: true, label: 'Avg HR', unit: 'bpm' },
        maxHeartRate: { show: true, label: 'Max HR', unit: 'bpm' },
        pace: { show: true, label: 'Pace', unit: '/km' },
        avgPower: { show: true, label: 'Avg Power', unit: 'W' },
        cadence: { show: true, label: 'Avg Cadence', unit: 'spm' },
        elevation: { show: true, label: 'Elevation', unit: 'm' },
    };
}

export const ACTIVITY_GROUPS: Record<string, ActivityGroup> = {
    all: { name: 'all', label: 'All', sportTypes: null, visibility: defaultVisibility() },
    run: { name: 'run', label: 'Run', sportTypes: ['Run', 'TrailRun', 'VirtualRun'], visibility: defaultVisibility() },
    walk: { name: 'walk', label: 'Walk', sportTypes: ['Walk'], visibility: defaultVisibility() },
    bike: {
        name: 'bike',
        label: 'Bike',
        sportTypes: ['Ride', 'MountainBikeRide', 'GravelRide', 'VirtualRide'],
        visibility: {
            ...defaultVisibility(),
            pace: { show: false, label: 'Pace', unit: '/km' },
            speed: { show: true, label: 'Speed', unit: 'km/h' },
        },
    },
    badminton: { name: 'badminton', label: 'Badminton', sportTypes: ['Badminton'], visibility: defaultVisibility() },
    strength: { name: 'strength', label: 'Strength', sportTypes: ['Strength', 'WeightTraining'], visibility: defaultVisibility() },
    other: { name: 'other', label: 'Other', sportTypes: [], visibility: defaultVisibility() },
};
