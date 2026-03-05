import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { RootState } from '@/store/index'
import { useLogout } from '@/hooks/useAuth'
import logo from '@/assets/images/Logo.svg'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Container from './Container'

export default function AdminNavbar() {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const logout = useLogout()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <Container className="py-3">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <motion.button
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
            whileTap={{ scale: 0.97 }}
          >
            <img src={logo} alt="Booky" className="w-8 h-8" />
            <span className="text-lg font-bold text-gray-900">Booky</span>
          </motion.button>

          {/* Dropdown */}
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="outline-none flex items-center gap-2 bg-transparent border-none cursor-pointer"
                whileTap={{ scale: 0.97 }}
              >
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user?.profilePhoto ?? ''} />
                  <AvatarFallback className="bg-primary-200 text-primary-300">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <ChevronDown size={16} className="text-gray-500" />
                </motion.div>
              </motion.button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="rounded-2xl min-w-[180px] p-2 shadow-xl border border-gray-100 bg-white z-[99]"
            >
              <div className="px-2 py-1.5">
                <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="rounded-xl cursor-pointer text-sm font-medium mt-1 text-accent-red focus:text-accent-red focus:bg-red-50"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </Container>
    </header>
  )
}