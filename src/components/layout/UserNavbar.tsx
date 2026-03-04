import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, LogOut, User, BookOpen, ChevronDown, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { useLogout } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { ROUTES } from '@/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import logo from '@/assets/images/logo.svg'

export default function UserNavbar() {
  const navigate = useNavigate()
  const logout = useLogout()
  const { user } = useSelector((state: RootState) => state.auth)
  const { data: cartData } = useCart()
  const cart = cartData as any
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  const menuItems = [
    { icon: <User size={15} />, label: 'Profile', route: ROUTES.PROFILE },
    { icon: <BookOpen size={15} />, label: 'Borrowed', route: ROUTES.PROFILE_BORROWED },
    { icon: <BookOpen size={15} />, label: 'Reviews', route: ROUTES.PROFILE_REVIEWS },
  ]

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-[#f6f9fe]"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
    >
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '12px 16px' }}>

        {/* Main row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <img src={logo} alt="Booky" className="w-8 h-8" />
            <span className="hidden sm:block text-lg font-bold text-[#1c65da]">Booky</span>
          </Link>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-600"
              whileTap={{ scale: 0.9 }}
            >
              {searchOpen ? <X size={22} /> : <Search size={22} />}
            </motion.button>

            <Link to={ROUTES.CART} className="relative text-gray-600">
              <ShoppingBag size={22} />
              {cart?.data?.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold bg-[#d9206e]">
                  {cart.data.itemCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setOpen(!open)}
                className="outline-none flex items-center gap-2"
                whileTap={{ scale: 0.97 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profilePhoto ?? ''} />
                  <AvatarFallback style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <ChevronDown size={16} className="text-gray-500" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[180px] z-50"
                  >
                    <div className="px-2 py-1.5 mb-1">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    </div>
                    <div className="h-px bg-gray-100 mb-1" />
                    {menuItems.map(({ icon, label, route }) => (
                      <button
                        key={label}
                        onClick={() => { navigate(route); setOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={() => { logout(); setOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-left"
                      style={{ color: 'var(--accent-red)' }}
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Search bar slide down */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'white', borderRadius: '999px',
                padding: '10px 16px', border: '1px solid #e5e7eb',
                marginTop: '12px',
              }}>
                <Search size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchValue.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
                      setSearchOpen(false)
                    }
                  }}
                  placeholder="Search books, authors..."
                  style={{
                    flex: 1, fontSize: '14px', background: 'transparent',
                    outline: 'none', border: 'none', color: '#374151',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  )
}