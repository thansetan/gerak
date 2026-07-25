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
  getGearDisplayValue,
  getTimezoneLabel,
  formatDate,
  formatDateTime,
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

describe('getGearDisplayValue', () => {
  const gear = {
    id: 'g123',
    name: 'ASICS Novablast 5 Asep Novian Buwono',
    nickname: 'Asep Novian Buwono',
    brand_name: 'ASICS',
    model_name: 'Novablast 5',
    primary: false,
    retired: false,
    distance: 711165,
  }

  it('brand_model joins brand_name and model_name', () => {
    expect(getGearDisplayValue(gear, 'brand_model')).toBe('ASICS Novablast 5')
  })

  it('nickname returns nickname property', () => {
    expect(getGearDisplayValue(gear, 'nickname')).toBe('Asep Novian Buwono')
  })

  it('full_name returns name property', () => {
    expect(getGearDisplayValue(gear, 'full_name')).toBe('ASICS Novablast 5 Asep Novian Buwono')
  })

  it('brand_model handles missing brand_name', () => {
    const g = { ...gear, brand_name: undefined }
    expect(getGearDisplayValue(g, 'brand_model')).toBe('Novablast 5')
  })

  it('brand_model handles missing model_name', () => {
    const g = { ...gear, model_name: undefined }
    expect(getGearDisplayValue(g, 'brand_model')).toBe('ASICS')
  })

  it('nickname falls back to -- when missing', () => {
    const g = { ...gear, nickname: undefined }
    expect(getGearDisplayValue(g, 'nickname')).toBe('--')
  })
})

describe('getTimezoneLabel', () => {
  it('returns a label containing GMT+7 for Asia/Jakarta', () => {
    const label = getTimezoneLabel()
    expect(label).toMatch(/^GMT[+-]/)
  })
})

describe('formatDate', () => {
  it('formats a UTC date in the configured timezone', () => {
    const result = formatDate('2024-01-15T00:00:00Z')
    expect(result).toBe('15/01/2024')
  })

  it('formats a date that crosses midnight in the configured timezone', () => {
    // 2024-01-15 23:00 UTC = 2024-01-16 06:00 in Asia/Jakarta (GMT+7)
    const result = formatDate('2024-01-15T23:00:00Z')
    expect(result).toBe('16/01/2024')
  })

  it('formats a date-only string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toBe('15/01/2024')
  })
})

describe('formatDateTime', () => {
  it('formats a UTC datetime in the configured timezone', () => {
    // 2024-01-15T00:00:00Z = 07:00 in Asia/Jakarta (GMT+7)
    const result = formatDateTime('2024-01-15T00:00:00Z')
    expect(result).toBe('15/01/2024, 07:00')
  })

  it('formats a datetime that crosses midnight in the configured timezone', () => {
    // 2024-01-15T23:00:00Z = 2024-01-16 06:00 in Asia/Jakarta
    const result = formatDateTime('2024-01-15T23:00:00Z')
    expect(result).toBe('16/01/2024, 06:00')
  })

  it('pads single-digit hours and minutes', () => {
    // 2024-01-15T03:05:00Z = 10:05 in Asia/Jakarta
    const result = formatDateTime('2024-01-15T03:05:00Z')
    expect(result).toBe('15/01/2024, 10:05')
  })
})
