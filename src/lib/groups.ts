import { ACTIVITY_GROUPS } from '../server/config'

export function getGroupForActivity(sportType: string): string {
  for (const group of Object.values(ACTIVITY_GROUPS)) {
    if (group.sportTypes === null) continue
    if (group.sportTypes.length === 0) continue
    if (group.sportTypes.some((t) => t.toLowerCase() === sportType.toLowerCase())) {
      return group.name.toLowerCase()
    }
  }
  return 'other'
}

export function getGroupNames(): string[] {
  return Object.keys(ACTIVITY_GROUPS)
}

export function getGroupLabel(name: string): string {
  return ACTIVITY_GROUPS[name]?.label ?? name
}
