import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize'
const TOKEN_URL = 'https://www.strava.com/oauth/token'

interface StravaCallbackSearch {
  code?: string
  error?: string
}

export const Route = createFileRoute('/strava/callback')({
  validateSearch: (search: Record<string, string | undefined>): StravaCallbackSearch => ({
    code: search.code ?? undefined,
    error: search.error ?? undefined,
  }),
  component: StravaCallback,
})

function StravaCallback() {
  const { code, error: oauthError } = Route.useSearch()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'exchanging' | 'success' | 'error'>('exchanging')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (oauthError) {
      setStatus('error')
      setMessage(`Authorization denied: ${oauthError}`)
      return
    }

    if (!code) {
      setStatus('error')
      setMessage('No authorization code received from Strava.')
      return
    }

    const exchangeCode = async () => {
      try {
        const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID
        const clientSecret = import.meta.env.VITE_STRAVA_CLIENT_SECRET

        if (!clientId || !clientSecret) {
          const res = await fetch('/api/auth/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          })
          if (!res.ok) throw new Error('Failed to exchange code on server')
          const data = await res.json()
          setMessage(
            `Refresh token obtained: ${data.refresh_token}\n\nAdd this to your .env as STRAVA_REFRESH_TOKEN`,
          )
        } else {
          const res = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code,
              grant_type: 'authorization_code',
            }),
          })
          if (!res.ok) throw new Error('Failed to exchange authorization code')
          const data = await res.json()
          setMessage(
            `Your refresh token: ${data.refresh_token}\n\nAdd this to your .env as STRAVA_REFRESH_TOKEN`,
          )
        }
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Failed to exchange authorization code')
      }
    }

    exchangeCode()
  }, [code, oauthError])

  if (status === 'exchanging') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-text-secondary">Exchanging authorization code for refresh token...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-text-primary mb-4">
        {status === 'success' ? 'Setup Complete' : 'Setup Failed'}
      </h1>
      <pre className="rounded-lg bg-surface-secondary p-4 text-left text-sm text-text-primary whitespace-pre-wrap">
        {message}
      </pre>
      {status === 'success' && (
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-6 rounded-lg bg-surface-accent px-6 py-3 text-sm font-medium text-text-on-accent transition-all hover:bg-surface-accent-hover active:scale-[0.98]"
        >
          Go to Dashboard
        </button>
      )}
    </div>
  )
}
