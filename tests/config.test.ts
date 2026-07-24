import { describe, it, expect } from 'bun:test'
import { ACTIVITY_GROUPS, APP_CONFIG } from '../src/server/config'
import type { VisibilityState } from '../src/server/types'

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

  it('default state is show for all stats in run group', () => {
    for (const [, stat] of Object.entries(ACTIVITY_GROUPS.run.visibility)) {
      expect((stat as { state: VisibilityState }).state).toBe('show')
    }
  })

  it('has distance with km unit for run group', () => {
    expect(ACTIVITY_GROUPS.run.visibility.distance.unit).toBe('km')
  })

  it('shows speed and hides pace for bike group', () => {
    expect(ACTIVITY_GROUPS.bike.visibility.speed.state).toBe('show')
    expect(ACTIVITY_GROUPS.bike.visibility.speed.unit).toBe('km/h')
    expect(ACTIVITY_GROUPS.bike.visibility.pace.state).toBe('hide')
  })

  it('hides total distance and elevation for badminton, strength, and other', () => {
    for (const key of ['badminton', 'strength', 'other']) {
      expect(ACTIVITY_GROUPS[key].visibility.totalDistance.state).toBe('hide')
      expect(ACTIVITY_GROUPS[key].visibility.totalElevation.state).toBe('hide')
    }
  })
})

describe('APP_CONFIG', () => {
  it('has a maskedValue string', () => {
    expect(typeof APP_CONFIG.maskedValue).toBe('string')
  })

  it('default maskedValue is ●●●', () => {
    expect(APP_CONFIG.maskedValue).toBe('●●●')
  })

  it('modal has all StatVisibility fields as objects', () => {
    const { modal } = APP_CONFIG
    const statFields = ['maxSpeed', 'maxPower', 'weightedPower', 'calories', 'elevRange', 'device', 'achievements'] as const
    for (const field of statFields) {
      expect(typeof modal[field]).toBe('object')
      expect(modal[field]).toHaveProperty('state')
      expect(modal[field]).toHaveProperty('label')
      expect(modal[field]).toHaveProperty('unit')
    }
  })

  it('modal is a boolean', () => {
    expect(typeof APP_CONFIG.modal.showMinimap).toBe('boolean')
  })

  it('modal has activity flag fields', () => {
    const { modal } = APP_CONFIG
    const flagFields = ['private', 'commute', 'trainer', 'manual'] as const
    for (const field of flagFields) {
      expect(modal[field]).toBeDefined()
      expect(typeof modal[field].state).toBe('string')
      expect(typeof modal[field].label).toBe('string')
    }
  })

  it('modal flag fields allow show/hide only for mask', () => {
    const { modal } = APP_CONFIG
    const flagFields = ['private', 'commute', 'trainer', 'manual'] as const
    for (const field of flagFields) {
      expect(modal[field].state).toMatch(/^(show|hide)$/)
    }
  })

  it('modal metric fields default to show, calories defaults to hide', () => {
    const { modal } = APP_CONFIG
    expect(modal.maxSpeed.state).toBe('show')
    expect(modal.maxPower.state).toBe('show')
    expect(modal.weightedPower.state).toBe('show')
    expect(modal.calories.state).toBe('hide')
    expect(modal.elevRange.state).toBe('show')
    expect(modal.device.state).toBe('show')
    expect(modal.achievements.state).toBe('show')
  })

  it('maxSpeed has km/h unit', () => {
    expect(APP_CONFIG.modal.maxSpeed.unit).toBe('km/h')
  })

  it('maxPower and weightedPower have W unit', () => {
    expect(APP_CONFIG.modal.maxPower.unit).toBe('W')
    expect(APP_CONFIG.modal.weightedPower.unit).toBe('W')
  })

  it('calories has kJ unit', () => {
    expect(APP_CONFIG.modal.calories.unit).toBe('kJ')
  })

  it('elevRange has m unit', () => {
    expect(APP_CONFIG.modal.elevRange.unit).toBe('m')
  })

  it('gear config exists with state, label, and value', () => {
    const { gear } = APP_CONFIG.modal
    expect(gear).toBeDefined()
    expect(typeof gear.state).toBe('string')
    expect(typeof gear.label).toBe('string')
    expect(typeof gear.value).toBe('string')
  })

  it('gear defaults to show state', () => {
    expect(APP_CONFIG.modal.gear.state).toBe('show')
  })
})
