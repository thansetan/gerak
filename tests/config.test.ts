import { describe, it, expect } from 'bun:test'
import { ACTIVITY_GROUPS, GROUP_VISIBILITY } from '../src/server/config'
import type { StatVisibility } from '../src/server/types'

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

describe('GROUP_VISIBILITY', () => {
  it('has entries for all activity groups', () => {
    expect(Object.keys(GROUP_VISIBILITY).sort()).toEqual([
      'all', 'badminton', 'bike', 'other', 'run', 'strength', 'walk',
    ])
  })

  it('has all stats visible by default for run group', () => {
    for (const [, stat] of Object.entries(GROUP_VISIBILITY.run)) {
      expect((stat as StatVisibility).show).toBe(true)
    }
  })

  it('has distance with km unit for run group', () => {
    expect(GROUP_VISIBILITY.run.distance.unit).toBe('km')
  })

  it('shows speed and hides pace for bike group', () => {
    expect(GROUP_VISIBILITY.bike.speed.show).toBe(true)
    expect(GROUP_VISIBILITY.bike.speed.unit).toBe('km/h')
    expect(GROUP_VISIBILITY.bike.pace.show).toBe(false)
  })
})
