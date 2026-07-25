import { createServerFn } from '@tanstack/react-start'
import { StravaTokenResponse } from './types';

export const isAuthenticated = createServerFn({ method: 'GET' })
  .handler(async () => !!process.env.STRAVA_REFRESH_TOKEN)

export const getStravaAuthUrl = createServerFn({ method: 'GET' })
  .handler(async () => {
    const clientId = process.env.STRAVA_CLIENT_ID
    const redirectUri = process.env.STRAVA_REDIRECT_URI
    if (!clientId || !redirectUri) {
      throw new Error('Strava client credentials not configured')
    }
    return `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=activity:read_all,profile:read_all`
  })

export const exchangeAuthCode = createServerFn({ method: 'POST' })
  .validator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    const clientId = process.env.STRAVA_CLIENT_ID
    const clientSecret = process.env.STRAVA_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Strava credentials not configured')
    }

    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: data.code,
        grant_type: 'authorization_code',
      }),
    })

    if (!response.ok) {
      throw new Error(`Strava token exchange failed: ${response.status}`)
    }

    const result = (await response.json()) as StravaTokenResponse
    return { refresh_token: result.refresh_token }
  })
