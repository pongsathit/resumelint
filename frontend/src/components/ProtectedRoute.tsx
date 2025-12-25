import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to landing page if not authenticated
  // Store the intended location so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}
