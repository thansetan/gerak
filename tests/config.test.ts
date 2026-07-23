import { describe, it, expect } from 'bun:test'
import { ACTIVITY_GROUPS, STATS_VISIBILITY } from '../src/server/config'

describe('ACTIVITY_GROUPS', () => {
  it('has all group with null sportTypes', () => {
    const allGroup = ACTIVITY_GROUPS.find((g) => g.name === 'all')
    expect(allGroup).toBeDefined()
    expect(allGroup!.sportTypes).toBeNull()
  })

  it('has run group with TrailRun', () => {
    const runGroup = ACTIVITY_GROUPS.find((g) => g.name === 'run')
    expect(runGroup).toBeDefined()
    expect(runGroup!.sportTypes).toContain('TrailRun')
  })

  it('has other group with empty sportTypes', () => {
    const otherGroup = ACTIVITY_GROUPS.find((g) => g.name === 'other')
    expect(otherGroup).toBeDefined()
    expect(otherGroup!.sportTypes).toEqual([])
  })

  it('has all required groups', () => {
    const names = ACTIVITY_GROUPS.map((g) => g.name).sort()
    expect(names).toEqual(['all', 'badminton', 'bike', 'other', 'run', 'strength', 'walk'])
  })
})

describe('STATS_VISIBILITY', () => {
  it('has all required stat keys', () => {
    expect(Object.keys(STATS_VISIBILITY).sort()).toEqual([
      'avgHeartRate',
      'avgPower',
      'cadence',
      'distance',
      'elevation',
      'maxHeartRate',
      'pace',
    ])
  })

  it('has all stats visible by default', () => {
    for (const [, stat] of Object.entries(STATS_VISIBILITY)) {
      expect(stat.show).toBe(true)
    }
  })

  it('has distance with km unit', () => {
    expect(STATS_VISIBILITY.distance.unit).toBe('km')
  })
})
