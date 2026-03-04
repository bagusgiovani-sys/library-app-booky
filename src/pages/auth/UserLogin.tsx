import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { useLogin } from '@/hooks/useAuth'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logo from '@/assets/images/Logo.svg'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
}

export default function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(
      { email, password },
      {
        onSuccess: () => toast.success('Welcome back!'),
        onError: () => toast.error('Wrong email or password'),
      }
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center md:justify-center px-10">

      {/* Card wrapper for PC */}
      <div className="w-full max-w-sm md:bg-white">

        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.img
            src={logo}
            alt="Booky"
            className="w-8 h-8"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          />
          <span className="text-xl font-bold text-black">Booky</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-1"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Login
        </motion.h1>

        <motion.p
          className="text-sm mb-8 text-black"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Sign in to manage your library account.
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <motion.div
            className="space-y-2"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-white border-0 shadow-sm"
                required
              />
            </motion.div>
          </motion.div>

          {/* Password */}
          <motion.div
            className="space-y-2"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
            <div className="relative">
              <motion.div whileHover={{ scale: 1.01 }}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-white border-0 shadow-sm pr-12"
                  required
                />
              </motion.div>
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black transition"
                whileTap={{ scale: 0.85, rotate: 15 }}
                whileHover={{ scale: 1.2 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-3xl font-semibold mt-2 border-0 bg-[var(--primary-300)] hover:bg-[var(--primary-300)] focus:bg-[var(--primary-300)] disabled:bg-gray-300 disabled:text-gray-500 text-white"
              >
                {isPending ? 'Logging in...' : 'Login'}
              </Button>
            </motion.div>
          </motion.div>
        </form>

        {/* Register link */}
        <motion.p
          className="text-center text-sm text-gray-500 mt-8"
          custom={6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Don't have an account?{' '}
          <motion.span
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={ROUTES.REGISTER} className="font-semibold text-[var(--primary-300)]">
              Register
            </Link>
          </motion.span>
        </motion.p>
      </div>
    </div>
  )
}