import { APP_CONFIG } from '../server/config'

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: APP_CONFIG.timezone,
})

const dateTimeFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: APP_CONFIG.timezone,
})

const tzLabelFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: APP_CONFIG.timezone,
  timeZoneName: 'shortOffset',
})

export function getTimezoneLabel(): string {
  return tzLabelFmt.formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? ''
}

export function formatDate(isoString: string): string {
  return dateFmt.format(new Date(isoString))
}

export function formatDateTime(isoString: string): string {
  return dateTimeFmt.format(new Date(isoString))
}

export function getGearDisplayValue(gear: { name: string; nickname?: string; brand_name?: string; model_name?: string }, mode: 'brand_model' | 'nickname' | 'full_name'): string {
  switch (mode) {
    case 'brand_model':
      return [gear.brand_name, gear.model_name].filter(Boolean).join(' ')
    case 'nickname':
      return gear.nickname ?? '--'
    case 'full_name':
      return gear.name
  }
}
