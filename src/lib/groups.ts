import { ACTIVITY_GROUPS } from '../server/config'

export function getGroupForActivity(sportType: string): string {
  for (const group of ACTIVITY_GROUPS) {
    if (group.sportTypes === null) continue
    if (group.sportTypes.length === 0) continue
    if (group.sportTypes.some((t) => t.toLowerCase() === sportType.toLowerCase())) {
      return group.name
    }
  }
  return 'other'
}

export function getGroupNames(): string[] {
  return ACTIVITY_GROUPS.map((g) => g.name)
}

export function getGroupLabel(name: string): string {
  return ACTIVITY_GROUPS.find((g) => g.name === name)?.label ?? name
}
