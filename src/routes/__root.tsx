import { Outlet, createRootRoute } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

export const Route = createRootRoute<{ queryClient: QueryClient }>({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-[100dvh]">
      <Outlet />
    </div>
  )
}
