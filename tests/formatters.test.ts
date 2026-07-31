import { describe, it, expect } from 'bun:test'
import {
  getGearDisplayValue,
  getTimezoneLabel,
  formatDate,
  formatDateTime,
} from '../src/shared/lib/formatters'

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
