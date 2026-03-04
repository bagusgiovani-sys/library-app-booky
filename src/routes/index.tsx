import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants'

import AdminRoutes from './AdminRoutes'
import UserRoutes from './UserRoutes'

import UserLogin from '@/pages/auth/UserLogin'
import Register from '@/pages/auth/Register'
import NotFound from '@/pages/NotFound'
import BorrowSuccess from '@/pages/user/Success'


export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<UserLogin />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/borrow-success" element={<BorrowSuccess />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  )
}