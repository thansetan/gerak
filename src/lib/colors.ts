export const SPORT_COLORS: Record<string, { accent: string; bg: string }> = {
  run: { accent: '#d94f30', bg: '#fef2f0' },
  walk: { accent: '#2a9d7a', bg: '#f0faf6' },
  bike: { accent: '#3d6dc8', bg: '#f0f4fc' },
  badminton: { accent: '#9b4dca', bg: '#f8f0fc' },
  strength: { accent: '#7a9d30', bg: '#f4f8f0' },
  other: { accent: '#7a7a7a', bg: '#f4f4f4' },
}

export const SPORT_EMOJIS: Record<string, string> = {
  run: '🏃',
  walk: '🚶',
  bike: '🚴',
  badminton: '🏸',
  strength: '💪',
  other: '🎯',
}

export const SPORT_STYLES: Record<string, { accent: string; bg: string; text: string }> = {
  run: { accent: 'border-l-sport-run', bg: 'bg-sport-run-bg', text: 'text-sport-run' },
  walk: { accent: 'border-l-sport-walk', bg: 'bg-sport-walk-bg', text: 'text-sport-walk' },
  bike: { accent: 'border-l-sport-bike', bg: 'bg-sport-bike-bg', text: 'text-sport-bike' },
  badminton: { accent: 'border-l-sport-badminton', bg: 'bg-sport-badminton-bg', text: 'text-sport-badminton' },
  strength: { accent: 'border-l-sport-strength', bg: 'bg-sport-strength-bg', text: 'text-sport-strength' },
  other: { accent: 'border-l-sport-other', bg: 'bg-sport-other-bg', text: 'text-sport-other' },
}
