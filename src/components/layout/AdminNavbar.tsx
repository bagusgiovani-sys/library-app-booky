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

export default function AdminNavbar() {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const logout = useLogout()
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-gray-100"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
    >
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo + Name */}
        <motion.button
          onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          className="flex items-center gap-2"
          whileTap={{ scale: 0.97 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <img src={logo} alt="Booky" className="w-8 h-8" />
          <span className="text-lg font-bold text-gray-900">Booky</span>
        </motion.button>

        {/* Avatar + Name + Chevron */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="outline-none flex items-center gap-2"
              whileTap={{ scale: 0.97 }}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Avatar className="w-9 h-9">
                <AvatarImage src={user?.profilePhoto ?? ''} />
                <AvatarFallback style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}>
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
            className="rounded-2xl min-w-[180px] p-2 shadow-xl border border-gray-100"
          >
            <div className="px-2 py-1.5">
              <p className="text-xs text-gray-400 font-medium">Signed in as</p>
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="rounded-xl cursor-pointer text-sm font-medium mt-1"
              style={{ color: 'var(--accent-red)' }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}