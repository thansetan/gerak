interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-border">
      <p className="font-mono text-sm font-bold text-text uppercase tracking-tight">Error</p>
      <p className="font-mono text-xs text-text-muted mt-2 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 font-mono text-xs font-medium uppercase tracking-tight border-2 border-border px-4 py-1.5 cursor-pointer hover:bg-text hover:text-bg transition-colors duration-150"
        >
          Retry
        </button>
      )}
    </div>
  )
}
