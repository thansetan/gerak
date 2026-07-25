export function formatDistance(meters: number): string {
  const km = meters / 1000
  return `${km.toFixed(2)} km`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function formatPace(metersPerSecond: number): string {
  if (metersPerSecond <= 0) return '--'
  const minutesPerKm = 1000 / metersPerSecond / 60
  const min = Math.floor(minutesPerKm)
  const sec = Math.round((minutesPerKm - min) * 60)
  return `${min}:${sec.toString().padStart(2, '0')} /km`
}

export function formatHeartRate(bpm?: number): string {
  if (!bpm) return '--'
  return `${Math.round(bpm)} bpm`
}

export function formatSpeed(metersPerSecond: number): string {
  const kmh = metersPerSecond * 3.6
  return `${kmh.toFixed(1)} km/h`
}

export function formatCadence(rpm?: number): string {
  if (!rpm) return '--'
  return `${Math.round(rpm)} spm`
}

export function formatElevation(meters: number): string {
  return `${Math.round(meters)} m`
}

export function formatDurationFull(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatKilojoules(kj?: number): string | null {
  if (kj == null || kj <= 0) return null
  return `${Math.round(kj * 0.239)} kcal`
}

export function formatSpeedKmh(metersPerSecond: number): string {
  const kmh = metersPerSecond * 3.6
  return `${kmh.toFixed(1)} km/h`
}

export function formatNumber(val: number, suffix = ''): string {
  return `${Math.round(val)}${suffix}`
}

export function formatMaskedValue(maskedValue: string, unit?: string): string {
  return unit ? `${maskedValue} ${unit}` : maskedValue
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  const dd = d.getDate().toString().padStart(2, '0')
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function formatDateTime(isoString: string): string {
  const d = new Date(isoString)
  const date = formatDate(isoString)
  const hh = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${date}, ${hh}:${min}`
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
