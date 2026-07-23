import { getActivities, refreshActivities } from '../src/server/activities'

const PORT = parseInt(process.env.PORT || '3001')

Bun.serve({
  port: PORT,
  async fetch(request: Request) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }

    if (url.pathname === '/api/activities' && request.method === 'GET') {
      try {
        const data = await getActivities()
        return new Response(JSON.stringify(data), { headers })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers,
        })
      }
    }

    if (url.pathname === '/api/refresh' && request.method === 'POST') {
      try {
        const result = await refreshActivities()
        return new Response(JSON.stringify(result), { headers })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers,
        })
      }
    }

    if (url.pathname === '/api/auth/exchange' && request.method === 'POST') {
      try {
        const body = await request.json()
        const { code } = body as { code: string }
        if (!code) {
          return new Response(JSON.stringify({ error: 'Authorization code required' }), {
            status: 400,
            headers,
          })
        }

        const clientId = process.env.STRAVA_CLIENT_ID
        const clientSecret = process.env.STRAVA_CLIENT_SECRET
        if (!clientId || !clientSecret) {
          return new Response(JSON.stringify({ error: 'Strava credentials not configured' }), {
            status: 500,
            headers,
          })
        }

        const res = await fetch('https://www.strava.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
          }),
        })

        if (!res.ok) {
          throw new Error(`Strava token exchange failed: ${res.status}`)
        }

        const data = await res.json()
        return new Response(JSON.stringify({ refresh_token: data.refresh_token }), { headers })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers,
        })
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers,
    })
  },
})

console.log(`API server running on http://localhost:${PORT}`)
