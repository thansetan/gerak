import type { ActivityGroup, StatsVisibility } from './types';

export const ACTIVITY_GROUPS: ActivityGroup[] = [
    { name: 'all', label: 'All', sportTypes: null },
    {
        name: 'run',
        label: 'Run',
        sportTypes: ['Run', 'TrailRun', 'VirtualRun'],
    },
    { name: 'walk', label: 'Walk', sportTypes: ['Walk'] },
    {
        name: 'bike',
        label: 'Bike',
        sportTypes: ['Ride', 'MountainBikeRide', 'GravelRide', 'VirtualRide'],
    },
    { name: 'badminton', label: 'Badminton', sportTypes: ['Badminton'] },
    {
        name: 'strength',
        label: 'Strength',
        sportTypes: ['Strength', 'WeightTraining'],
    },
    { name: 'other', label: 'Other', sportTypes: [] },
];

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

export const GROUP_VISIBILITY: Record<string, StatsVisibility> = {
    all: defaultVisibility(),
    run: defaultVisibility(),
    walk: defaultVisibility(),
    bike: {
        ...defaultVisibility(),
        pace: { show: false, label: 'Pace', unit: '/km' },
        speed: { show: true, label: 'Speed', unit: 'km/h' },
    },
    badminton: defaultVisibility(),
    strength: defaultVisibility(),
    other: defaultVisibility(),
};
