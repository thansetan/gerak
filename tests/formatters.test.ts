import { describe, it, expect } from 'bun:test'
import {
  formatDistance,
  formatDuration,
  formatPace,
  formatHeartRate,
  formatSpeed,
  formatCadence,
  formatElevation,
  formatMaskedValue,
} from '../src/lib/formatters'

describe('formatDistance', () => {
  it('formats 10000 meters as 10.00 km', () => {
    expect(formatDistance(10000)).toBe('10.00 km')
  })

  it('formats 42195 meters as 42.20 km', () => {
    expect(formatDistance(42195)).toBe('42.20 km')
  })

  it('formats 0 meters', () => {
    expect(formatDistance(0)).toBe('0.00 km')
  })
})

describe('formatDuration', () => {
  it('formats 3661 seconds as 1h 1m', () => {
    expect(formatDuration(3661)).toBe('1h 1m')
  })

  it('formats 0 seconds', () => {
    expect(formatDuration(0)).toBe('0m')
  })

  it('formats 1800 seconds as 30m', () => {
    expect(formatDuration(1800)).toBe('30m')
  })

  it('formats 3600 seconds as 1h 0m', () => {
    expect(formatDuration(3600)).toBe('1h 0m')
  })
})

describe('formatPace', () => {
  it('formats pace for 4 m/s', () => {
    expect(formatPace(4)).toBe('4:10 /km')
  })

  it('returns -- for 0 speed', () => {
    expect(formatPace(0)).toBe('--')
  })

  it('formats pace for 3.5 m/s', () => {
    expect(formatPace(3.5)).toBe('4:46 /km')
  })
})

describe('formatHeartRate', () => {
  it('formats heart rate', () => {
    expect(formatHeartRate(145)).toBe('145 bpm')
  })

  it('returns -- for undefined', () => {
    expect(formatHeartRate(undefined)).toBe('--')
  })
})

describe('formatSpeed', () => {
  it('converts m/s to km/h', () => {
    expect(formatSpeed(5)).toBe('18.0 km/h')
  })

  it('formats 0 speed', () => {
    expect(formatSpeed(0)).toBe('0.0 km/h')
  })
})

describe('formatCadence', () => {
  it('formats cadence', () => {
    expect(formatCadence(85)).toBe('85 spm')
  })

  it('returns -- for undefined', () => {
    expect(formatCadence(undefined)).toBe('--')
  })
})

describe('formatElevation', () => {
  it('formats elevation', () => {
    expect(formatElevation(350)).toBe('350 m')
  })

  it('formats 0 elevation', () => {
    expect(formatElevation(0)).toBe('0 m')
  })
})

describe('formatMaskedValue', () => {
  it('returns masked value with unit', () => {
    expect(formatMaskedValue('●●●', 'km')).toBe('●●● km')
  })

  it('returns just masked value without unit', () => {
    expect(formatMaskedValue('●●●', '')).toBe('●●●')
  })

  it('returns just masked value with undefined unit', () => {
    expect(formatMaskedValue('●●●')).toBe('●●●')
  })

  it('works with different masked values and units', () => {
    expect(formatMaskedValue('***', 'm')).toBe('*** m')
    expect(formatMaskedValue('???', 'km/h')).toBe('??? km/h')
  })
})
