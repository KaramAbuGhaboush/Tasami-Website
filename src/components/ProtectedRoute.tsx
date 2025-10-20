'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
        router.push('/login')
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
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting to login...</h1>
        </div>
      </div>
    )
  }

  if (requiredRole && user?.role !== requiredRole) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page not found</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#6812F7] text-white px-6 py-3 rounded-lg hover:bg-[#5a0fd4] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
