import { describe, it, expect } from 'bun:test'
import { getGroupForActivity, getGroupNames, getGroupLabel } from '../src/lib/groups'

describe('getGroupForActivity', () => {
  it('classifies TrailRun as run', () => {
    expect(getGroupForActivity('TrailRun')).toBe('run')
  })

  it('classifies Run as run', () => {
    expect(getGroupForActivity('Run')).toBe('run')
  })

  it('classifies VirtualRun as run', () => {
    expect(getGroupForActivity('VirtualRun')).toBe('run')
  })

  it('classifies Walk as walk', () => {
    expect(getGroupForActivity('Walk')).toBe('walk')
  })

  it('classifies Ride as bike', () => {
    expect(getGroupForActivity('Ride')).toBe('bike')
  })

  it('classifies MountainBikeRide as bike', () => {
    expect(getGroupForActivity('MountainBikeRide')).toBe('bike')
  })

  it('classifies Badminton as badminton', () => {
    expect(getGroupForActivity('Badminton')).toBe('badminton')
  })

  it('classifies Strength as strength', () => {
    expect(getGroupForActivity('Strength')).toBe('strength')
  })

  it('classifies unknown sport type as other', () => {
    expect(getGroupForActivity('Yoga')).toBe('other')
  })

  it('classifies Swim as other', () => {
    expect(getGroupForActivity('Swim')).toBe('other')
  })

  it('is case insensitive for TrailRun', () => {
    expect(getGroupForActivity('trailrun')).toBe('run')
  })
})

describe('getGroupNames', () => {
  it('returns all group names', () => {
    const names = getGroupNames()
    expect(names).toContain('all')
    expect(names).toContain('run')
    expect(names).toContain('walk')
    expect(names).toContain('other')
  })
})

describe('getGroupLabel', () => {
  it('returns label for known group', () => {
    expect(getGroupLabel('run')).toBe('🏃 Run')
  })

  it('returns name as label for unknown group', () => {
    expect(getGroupLabel('unknown')).toBe('unknown')
  })
})
