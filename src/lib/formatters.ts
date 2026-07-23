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
