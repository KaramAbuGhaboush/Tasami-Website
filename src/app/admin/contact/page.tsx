import { AdminLayout } from '@/components/AdminLayout'
import { ContactPage } from '@/components/admin/ContactPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function ContactAdmin() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <ContactPage />
      </AdminLayout>
    </ProtectedRoute>
  )
}
