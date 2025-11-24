'use client'

import { ReactNode } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="h-screen bg-gradient-to-br from-[#F2F3FF] via-white to-[#DFC7FE]/20 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold gradient-text">
                Tasami Admin
              </h1>
              <span className="hidden sm:inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <a 
                href="/" 
                className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
              >
                Back to Site
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
