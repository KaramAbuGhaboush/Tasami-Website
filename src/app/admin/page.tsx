'use client'

import { AdminLayout } from '@/components/AdminLayout'
import { OverviewPage } from '@/components/admin/OverviewPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <OverviewPage />
      </AdminLayout>
    </ProtectedRoute>
  )
}
