import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth'

interface ProtectedRouteProps {
  requiredPermission?: string
}

export function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRoutePermission } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredPermission && !hasRoutePermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
