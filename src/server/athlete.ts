import { createServerFn } from '@tanstack/react-start'
import { getAccessToken } from './auth'
import { getFromCache, setToCache } from './cache'
import type { AthleteProfile } from '../shared/types'

const ATHLETE_CACHE_KEY = 'strava:athlete'
const ATHLETE_TTL = 86400

export const getAthlete = createServerFn().handler(async () => {
    const cached = await getFromCache<AthleteProfile>(ATHLETE_CACHE_KEY)
    if (cached) return cached

    const token = await getAccessToken()
    const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch athlete: ${response.status}`)
    }

    const data = (await response.json()) as AthleteProfile
    await setToCache(ATHLETE_CACHE_KEY, data, ATHLETE_TTL)
    return data
})
