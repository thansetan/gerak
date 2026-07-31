import { describe, it, expect } from 'bun:test'
import { getGroupForActivity, getGroupNames, getGroupLabel } from '../src/shared/lib/groups'

describe('getGroupForActivity (integration with config)', () => {
  it('all groups contain valid names from getGroupNames', () => {
    const names = getGroupNames()
    const allWithLabels = names.map((n) => ({ name: n, label: getGroupLabel(n) }))
    expect(allWithLabels.find((g) => g.name === 'run')?.label).toBe('Run')
    expect(allWithLabels.find((g) => g.name === 'bike')?.label).toBe('Bike')
  })
})

describe('useFilteredActivities logic (pure version)', () => {
  const mockActivities = [
    { sport_type: 'Run', id: 1, start_date: '2024-01-01T00:00:00Z', distance: 5000, moving_time: 1800, total_elevation_gain: 50, average_speed: 2.78, has_heartrate: false, private: false, commute: false, manual: false, trainer: false, name: 'Morning Run' },
    { sport_type: 'Ride', id: 2, start_date: '2024-01-02T00:00:00Z', distance: 20000, moving_time: 3600, total_elevation_gain: 200, average_speed: 5.56, has_heartrate: false, private: false, commute: false, manual: false, trainer: false, name: 'Afternoon Ride' },
    { sport_type: 'Swim', id: 3, start_date: '2024-01-03T00:00:00Z', distance: 1500, moving_time: 2700, total_elevation_gain: 0, average_speed: 0.56, has_heartrate: false, private: false, commute: false, manual: false, trainer: false, name: 'Pool Swim' },
  ]

  it('filters activities to run group', () => {
    const runs = mockActivities.filter((a) => getGroupForActivity(a.sport_type) === 'run')
    expect(runs).toHaveLength(1)
    expect(runs[0].id).toBe(1)
  })

  it('filters activities to bike group', () => {
    const bikes = mockActivities.filter((a) => getGroupForActivity(a.sport_type) === 'bike')
    expect(bikes).toHaveLength(1)
    expect(bikes[0].id).toBe(2)
  })

  it('classifies swim as other', () => {
    const other = mockActivities.filter((a) => getGroupForActivity(a.sport_type) === 'other')
    expect(other).toHaveLength(1)
    expect(other[0].id).toBe(3)
  })
})
