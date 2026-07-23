import { describe, it, expect } from 'bun:test'
import { ACTIVITY_GROUPS } from '../src/server/config'
import type { ActivityGroup, StatVisibility } from '../src/server/types'

describe('ACTIVITY_GROUPS', () => {
  it('has all required group keys', () => {
    expect(Object.keys(ACTIVITY_GROUPS).sort()).toEqual([
      'all', 'badminton', 'bike', 'other', 'run', 'strength', 'walk',
    ])
  })

  it('has all group with null sportTypes', () => {
    expect(ACTIVITY_GROUPS.all.sportTypes).toBeNull()
  })

  it('has run group with TrailRun', () => {
    expect(ACTIVITY_GROUPS.run.sportTypes).toContain('TrailRun')
  })

  it('has other group with empty sportTypes', () => {
    expect(ACTIVITY_GROUPS.other.sportTypes).toEqual([])
  })

  it('each group has a visibility property', () => {
    for (const group of Object.values(ACTIVITY_GROUPS)) {
      expect(group.visibility).toBeDefined()
      expect(typeof group.visibility).toBe('object')
    }
  })

  it('has all stats visible by default for run group', () => {
    for (const [, stat] of Object.entries(ACTIVITY_GROUPS.run.visibility)) {
      expect((stat as StatVisibility).show).toBe(true)
    }
  })

  it('has distance with km unit for run group', () => {
    expect(ACTIVITY_GROUPS.run.visibility.distance.unit).toBe('km')
  })

  it('shows speed and hides pace for bike group', () => {
    expect(ACTIVITY_GROUPS.bike.visibility.speed.show).toBe(true)
    expect(ACTIVITY_GROUPS.bike.visibility.speed.unit).toBe('km/h')
    expect(ACTIVITY_GROUPS.bike.visibility.pace.show).toBe(false)
  })

  it('hides total distance and elevation for badminton, strength, and other', () => {
    for (const key of ['badminton', 'strength', 'other']) {
      expect(ACTIVITY_GROUPS[key].visibility.totalDistance.show).toBe(false)
      expect(ACTIVITY_GROUPS[key].visibility.totalElevation.show).toBe(false)
    }
  })
})
