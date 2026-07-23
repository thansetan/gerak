import { getFromCache, setToCacheRaw, deleteCacheKey } from './cache'
import type { StravaTokenResponse } from './types'

const TOKEN_CACHE_KEY = 'strava:access_token'
const TOKEN_TTL = 21600

export async function getAccessToken(): Promise<string> {
  const cached = await getFromCache<string>(TOKEN_CACHE_KEY)
  if (cached) return cached

  const fresh = await refreshAccessToken()
  return fresh
}

export async function refreshAccessToken(): Promise<string> {
  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Strava credentials not configured')
  }

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error(`Strava token refresh failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as StravaTokenResponse
  await setToCacheRaw(TOKEN_CACHE_KEY, data.access_token, TOKEN_TTL)
  return data.access_token
}

export async function invalidateToken(): Promise<void> {
  await deleteCacheKey(TOKEN_CACHE_KEY)
}
