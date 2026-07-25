import { useNavigate } from '@tanstack/react-router'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-bg p-4">
      <div className="w-full max-w-sm border-2 border-border p-8 text-center">
        <h1 className="font-mono text-6xl font-bold text-text tracking-tighter">404</h1>
        <p className="font-mono text-sm font-medium text-text-muted uppercase tracking-tight mt-4">
          Page not found
        </p>
        <p className="font-mono text-xs text-text-muted mt-2 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => {
            return navigate({ to: '/' });
          }}
          className="mt-8 font-mono text-xs font-medium uppercase tracking-tight border-2 border-border px-5 py-2 cursor-pointer hover:bg-text hover:text-bg transition-colors duration-150"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}
