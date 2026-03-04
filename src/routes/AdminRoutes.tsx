import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { ROUTES } from '@/constants'
import AdminLayout from '@/components/layout/AdminLayout'
import Dashboard from '@/pages/admin/Dashboard'
import BookEdit from '@/pages/admin/BookEdit'
import BookPreview from '@/pages/admin/BookPreview'
import AddBook from '@/pages/admin/AddBook'

export default function AdminRoutes() {
  const { token, user } = useSelector((state: RootState) => state.auth)

  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books/new" element={<AddBook />} />
        <Route path="books/:id/edit" element={<BookEdit />} />
        <Route path="books/:id/preview" element={<BookPreview />} />
        <Route path="*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
      </Routes>
    </AdminLayout>
  )
}