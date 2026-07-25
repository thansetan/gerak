import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { exchangeAuthCode, isAuthenticated } from '../../server/stravaAuth';

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
  beforeLoad: async ({ search }) => {
    const authenticated = await isAuthenticated()
    if (authenticated) {
      throw redirect({
        to: '/',
      });
    }
    
    if (!search.code) {
      throw redirect({
        to: '/strava/login',
      })
    }
  }
})

function StravaCallback() {
  const { code, error: oauthError } = Route.useSearch()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'exchanging' | 'success' | 'error'>('exchanging')
  const [refreshToken, setRefreshToken] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (oauthError) {
      setStatus('error')
      setErrorMessage(`Authorization denied: ${oauthError}`)
      return
    }

    if (!code) {
      setStatus('error')
      setErrorMessage('No authorization code received from Strava.')
      return
    }

    const exchangeCode = async () => {
      try {
        const result = await exchangeAuthCode({data: { code }})
        setRefreshToken(result.refresh_token)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Failed to exchange authorization code')
      }
    }

    exchangeCode()
  }, [code, oauthError])

  const handleCopy = () => {
    navigator.clipboard.writeText(refreshToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'exchanging') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-bg p-4">
        <div className="w-full max-w-sm border-2 border-border p-8 text-center">
          <p className="font-mono text-xs text-text-muted uppercase tracking-tight leading-relaxed">
            Exchanging authorization code...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-bg p-4">
      <div className="w-full max-w-lg border-2 border-border p-8 text-center">
        <h1 className="font-mono text-xl font-bold text-text mb-4 uppercase tracking-tighter">
          {status === 'success' ? 'Setup Complete' : 'Setup Failed'}
        </h1>
        {status === 'success' ? (
          <>
            <p className="font-mono text-xs text-text-muted uppercase tracking-tight mb-2 text-left">
              Refresh Token
            </p>
            <div className="border-2 border-border bg-surface p-3 flex items-start gap-2 text-left mb-3">
              <code className="flex-1 break-all font-mono text-xs text-text leading-relaxed">
                {refreshToken}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 font-mono text-xs font-medium uppercase tracking-tight border-2 border-border px-2 py-1 cursor-pointer hover:bg-text hover:text-bg transition-colors duration-150"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-xs text-text-muted mb-4 text-left leading-relaxed">
              Add this to your .env as{' '}
              <code className="text-text bg-surface px-1 py-0.5 rounded">
                STRAVA_REFRESH_TOKEN
              </code>
            </p>
            <button
              onClick={() => navigate({ to: '/' })}
              className="font-mono text-xs font-medium uppercase tracking-tight border-2 border-border px-5 py-2 cursor-pointer hover:bg-text hover:text-bg transition-colors duration-150"
            >
              Go Home
            </button>
          </>
        ) : (
          <pre className="border-2 border-border p-4 text-left font-mono text-xs text-text whitespace-pre-wrap leading-relaxed">
            {errorMessage}
          </pre>
        )}
      </div>
    </div>
  )
}
