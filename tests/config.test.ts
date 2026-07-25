import { describe, it, expect } from 'bun:test'
import { ACTIVITY_GROUPS, APP_CONFIG } from '../src/server/config'
import type { StravaActivity } from '../src/server/types'

const mockActivity: StravaActivity = {
    id: 1,
    name: 'Test',
    sport_type: 'Run',
    start_date: '2024-01-01T00:00:00Z',
    distance: 10000,
    moving_time: 3600,
    elapsed_time: 3600,
    total_elevation_gain: 100,
    average_heartrate: 145,
    max_heartrate: 180,
    average_speed: 4.0,
    max_speed: 6.0,
    average_watts: 200,
    max_watts: 300,
    weighted_average_watts: 250,
    kilojoules: 500,
    device_watts: true,
    has_heartrate: true,
    elev_high: 200,
    elev_low: 100,
    average_cadence: 85,
    private: false,
    commute: false,
    manual: false,
    trainer: false,
    kudos_count: 5,
    achievement_count: 3,
}

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

  it('each group has a stats property', () => {
    for (const group of Object.values(ACTIVITY_GROUPS)) {
      expect(group.stats).toBeDefined()
      expect(typeof group.stats).toBe('object')
    }
  })

  it('default stats have show states for run group', () => {
    const s = ACTIVITY_GROUPS.run.stats
    expect(s.distance?.state).toBe('show')
    expect(s.avgHeartRate?.state).toBe('show')
    expect(s.maxHeartRate?.state).toBe('show')
    expect(s.pace?.state).toBe('show')
    expect(s.avgPower?.state).toBe('show')
  })

  it('has distance with km unit for run group', () => {
    expect(ACTIVITY_GROUPS.run.stats.distance.unit).toBe('km')
  })

  it('metric stats have valueCalculation as a function', () => {
    const s = ACTIVITY_GROUPS.run.stats
    const metricKeys = ['distance', 'avgHeartRate', 'maxHeartRate', 'pace', 'avgPower', 'cadence', 'elevation']
    for (const key of metricKeys) {
      expect(typeof s[key]?.valueCalculation).toBe('function')
    }
  })

  it('valueCalculation for distance converts meters to kilometers via activity', () => {
    const calc = ACTIVITY_GROUPS.run.stats.distance.valueCalculation
    const act10k = { ...mockActivity, distance: 10000 }
    const act42k = { ...mockActivity, distance: 42195 }
    const act0 = { ...mockActivity, distance: 0 }
    expect(calc(act10k)).toBe('10.00')
    expect(calc(act42k)).toBe('42.20')
    expect(calc(act0)).toBeNull()
  })

  it('shows speed and hides pace for bike group', () => {
    expect(ACTIVITY_GROUPS.bike.stats.speed.state).toBe('show')
    expect(ACTIVITY_GROUPS.bike.stats.speed.unit).toBe('km/h')
    expect(ACTIVITY_GROUPS.bike.stats.pace.state).toBe('hide')
  })

  it('hides stats bar distance and elevation for badminton, strength, and other', () => {
    for (const key of ['badminton', 'strength', 'other']) {
      expect(ACTIVITY_GROUPS[key].statsBarConfig?.totalDistance?.state).toBe('hide')
      expect(ACTIVITY_GROUPS[key].statsBarConfig?.totalElevation?.state).toBe('hide')
    }
  })
})

describe('APP_CONFIG', () => {
  it('has a maskedValue string', () => {
    expect(typeof APP_CONFIG.maskedValue).toBe('string')
  })

  it('default maskedValue is --', () => {
    expect(APP_CONFIG.maskedValue).toBe('--')
  })

  it('has a timezone string', () => {
    expect(typeof APP_CONFIG.timezone).toBe('string')
  })

  it('timezone defaults to Asia/Jakarta', () => {
    expect(APP_CONFIG.timezone).toBe('Asia/Jakarta')
  })

  it('has maxFetchedActivities as a positive number', () => {
    expect(APP_CONFIG.maxFetchedActivities).toBeGreaterThan(0)
    expect(Number.isInteger(APP_CONFIG.maxFetchedActivities)).toBe(true)
  })

  it('maxFetchedActivities defaults to 200', () => {
    expect(APP_CONFIG.maxFetchedActivities).toBe(200)
  })

  it('modalHeader has boolean toggle fields', () => {
    const { modalHeader } = APP_CONFIG
    expect(typeof modalHeader.showMinimap).toBe('boolean')
    expect(typeof modalHeader.showTitle).toBe('boolean')
    expect(typeof modalHeader.showActivityTime).toBe('boolean')
    expect(typeof modalHeader.showAchievements).toBe('boolean')
    expect(typeof modalHeader.showKudos).toBe('boolean')
  })

  it('modalHeader defaults to true for all toggles', () => {
    const { modalHeader } = APP_CONFIG
    expect(modalHeader.showMinimap).toBe(true)
    expect(modalHeader.showTitle).toBe(true)
    expect(modalHeader.showActivityTime).toBe(true)
    expect(modalHeader.showAchievements).toBe(true)
    expect(modalHeader.showKudos).toBe(true)
  })

  it('statsBar has all four aggregate entries with state show', () => {
    const { statsBar } = APP_CONFIG
    expect(statsBar.totalDistance.state).toBe('show')
    expect(statsBar.totalDuration.state).toBe('show')
    expect(statsBar.totalElevation.state).toBe('show')
    expect(statsBar.activeDays.state).toBe('show')
  })

  it('statsBar entries have valueCalculation functions', () => {
    const { statsBar } = APP_CONFIG
    expect(typeof statsBar.totalDistance.valueCalculation).toBe('function')
    expect(typeof statsBar.totalDuration.valueCalculation).toBe('function')
    expect(typeof statsBar.totalElevation.valueCalculation).toBe('function')
    expect(typeof statsBar.activeDays.valueCalculation).toBe('function')
  })

  it('statsBar valueCalculation formats distance', () => {
    expect(APP_CONFIG.statsBar.totalDistance.valueCalculation(42195)).toBe('42.20')
  })

  it('statsBar valueCalculation formats duration', () => {
    expect(APP_CONFIG.statsBar.totalDuration.valueCalculation(5400)).toBe('1h 30m')
    expect(APP_CONFIG.statsBar.totalDuration.valueCalculation(1800)).toBe('30m')
  })

  it('gear config exists on each group with state, label, and value', () => {
    for (const group of Object.values(ACTIVITY_GROUPS)) {
      const gc = group.gearConfig
      expect(gc).toBeDefined()
      expect(typeof gc!.state).toBe('string')
      expect(typeof gc!.label).toBe('string')
      expect(typeof gc!.value).toBe('string')
    }
  })

  it('gear defaults to show state on all groups', () => {
    for (const group of Object.values(ACTIVITY_GROUPS)) {
      expect(group.gearConfig?.state).toBe('show')
    }
  })

  it('run group uses nickname gear value', () => {
    expect(ACTIVITY_GROUPS.run.gearConfig?.value).toBe('nickname')
  })

  it('bike group uses full_name gear value', () => {
    expect(ACTIVITY_GROUPS.bike.gearConfig?.value).toBe('full_name')
    expect(ACTIVITY_GROUPS.bike.gearConfig?.label).toBe('Bike')
  })
})
