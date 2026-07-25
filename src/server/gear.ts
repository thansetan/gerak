import { createServerFn } from '@tanstack/react-start'
import { getAccessToken } from './auth'
import { getFromCache, setToCache } from './cache'
import { ACTIVITIES_CACHE_KEY } from './activities'
import type { GearDetail, ActivitiesResponse } from './types'

const GEAR_CACHE_KEY = 'strava:gear'
const GEAR_TTL = 604800

export const getGear = createServerFn().handler(async () => {
    const cached = await getFromCache<Record<string, GearDetail>>(GEAR_CACHE_KEY)
    if (cached) return cached

    const activitiesCache = await getFromCache<ActivitiesResponse>(ACTIVITIES_CACHE_KEY)
    const gearIds = [...new Set(
        (activitiesCache?.activities ?? [])
            .map((a) => a.gear_id)
            .filter(Boolean) as string[]
    )]

    if (gearIds.length === 0) return {}

    const token = await getAccessToken()
    const gearMap: Record<string, GearDetail> = {}

    for (const gearId of gearIds) {
        try {
            const response = await fetch(`https://www.strava.com/api/v3/gear/${gearId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.ok) {
                const data = (await response.json()) as GearDetail
                gearMap[gearId] = data
            }
        } catch {
            console.error(`Failed to fetch gear ${gearId}`)
        }
    }

    await setToCache(GEAR_CACHE_KEY, gearMap, GEAR_TTL)
    return gearMap
})
