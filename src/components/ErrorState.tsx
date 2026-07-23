interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-3xl mb-2">😅</p>
      <p className="text-lg font-medium text-text-primary">Something went wrong!</p>
      <p className="text-sm text-text-secondary mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-surface-accent px-4 py-2 text-sm font-medium text-text-on-accent transition-all hover:bg-surface-accent-hover active:scale-[0.98]"
        >
          🔄 Try again
        </button>
      )}
    </div>
  )
}
