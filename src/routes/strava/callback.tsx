import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { exchangeAuthCode } from '../../server/auth'

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
        const result = await exchangeAuthCode({ code })
        setMessage(
          `Refresh token obtained: ${result.refresh_token}\n\nAdd this to your .env as STRAVA_REFRESH_TOKEN`,
        )
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
        <p className="font-mono text-xs text-text-muted uppercase tracking-tight">
          Exchanging authorization code...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-mono text-xl font-bold text-text mb-4 uppercase tracking-tight">
        {status === 'success' ? 'Setup Complete' : 'Setup Failed'}
      </h1>
      <pre className="border-2 border-border bg-surface p-4 text-left font-mono text-xs text-text whitespace-pre-wrap">
        {message}
      </pre>
      {status === 'success' && (
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-6 font-mono text-xs font-medium uppercase tracking-tight border-2 border-border px-4 py-1.5 cursor-pointer hover:bg-text hover:text-bg transition-colors duration-150"
        >
          Go to Dashboard
        </button>
      )}
    </div>
  )
}
