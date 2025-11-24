'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import NotFound from '@/app/not-found'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'employee'
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Redirect to 404 to make route appear non-existent
        router.push('/404')
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Show 404 for unauthorized access
        router.push('/404')
        return
      }

    }
  }, [user, loading, isAuthenticated, requiredRole, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6812F7]"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || <NotFound />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return fallback || <NotFound />
  }

  return <>{children}</>
}

