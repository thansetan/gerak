import type { ActivityGroup, StatsVisibility } from './types'

export const ACTIVITY_GROUPS: ActivityGroup[] = [
  { name: 'all', label: 'All', sportTypes: null },
  { name: 'run', label: 'Run', sportTypes: ['Run', 'TrailRun', 'VirtualRun'] },
  { name: 'walk', label: 'Walk', sportTypes: ['Walk'] },
  { name: 'bike', label: 'Bike', sportTypes: ['Ride', 'MountainBikeRide', 'GravelRide', 'VirtualRide'] },
  { name: 'badminton', label: 'Badminton', sportTypes: ['Badminton'] },
  { name: 'strength', label: 'Strength', sportTypes: ['Strength', 'WeightTraining'] },
  { name: 'other', label: 'Other', sportTypes: [] },
]

export const STATS_VISIBILITY: StatsVisibility = {
  distance: { show: true, label: 'Distance', unit: 'km' },
  avgHeartRate: { show: true, label: 'Avg HR', unit: 'bpm' },
  maxHeartRate: { show: true, label: 'Max HR', unit: 'bpm' },
  pace: { show: true, label: 'Pace', unit: '/km' },
  avgPower: { show: true, label: 'Avg Power', unit: 'W' },
  cadence: { show: true, label: 'Cadence', unit: 'spm' },
  elevation: { show: true, label: 'Elevation', unit: 'm' },
}
