import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Star, Search, X, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import type { RootState } from '@/store/index'
import { useMe, useUpdateProfile, useMyLoansProfile, useMyReviews } from '@/hooks/useMe'
import { useCreateReview } from '@/hooks/useReviews'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, formatDateTime } from '@/lib/utils'

type Tab = 'profile' | 'borrowed' | 'reviews'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } as const,
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16}
          fill={i <= rating ? '#fdb022' : 'transparent'}
          color={i <= rating ? '#fdb022' : '#d1d5db'}
        />
      ))}
    </div>
  )
}

// ─── Review Modal ────────────────────────────────────────────────
function ReviewModal({ bookId, onClose }: { bookId: number; onClose: () => void }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const { mutate: createReview, isPending } = useCreateReview()

  const handleSend = () => {
    if (!bookId) { toast.error('Book not found'); return }
    if (rating === 0) { toast.error('Please give a rating'); return }
    if (!comment.trim()) { toast.error('Please write a comment'); return }
    createReview(
      { bookId, star: rating, comment: comment.trim() },
      {
        onSuccess: () => { toast.success('Review submitted!'); onClose() },
        onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to submit review'),
      }
    )
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        className="relative bg-white w-full max-w-md rounded-3xl p-6 space-y-5"
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Give Review</h3>
          <button onClick={onClose} className="text-gray-400"><X size={20} /></button>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-gray-700">Give Rating</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.button key={i} whileTap={{ scale: 0.85 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(i)}
              >
                <Star size={36}
                  fill={(hovered || rating) >= i ? '#fdb022' : '#e5e7eb'}
                  color={(hovered || rating) >= i ? '#fdb022' : '#e5e7eb'}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please share your thoughts about this book"
          rows={5}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400 resize-none"
        />

        <Button onClick={handleSend} disabled={isPending}
          className="w-full rounded-full py-6 font-semibold">
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </motion.div>
    </motion.div>
  )
}

// ─── Profile Tab ────────────────────────────────────────────────
function ProfileTab() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { data: meData } = useMe()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const me = meData?.data?.user ?? user

  const [name, setName] = useState(me?.name ?? '')
  const [phone, setPhone] = useState(me?.phone ?? '')
  const [editing, setEditing] = useState(false)

  const handleUpdate = () => {
    updateProfile(
      { name, phone },
      {
        onSuccess: () => { toast.success('Profile updated!'); setEditing(false) },
        onError: () => toast.error('Failed to update profile'),
      }
    )
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.h1 variants={fadeUp} className="text-2xl font-bold text-gray-900">Profile</motion.h1>

      <motion.div variants={fadeUp} className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        {/* Avatar */}
        <div className="relative w-fit">
          <Avatar className="w-16 h-16">
            <AvatarImage src={me?.profilePhoto ?? ''} />
            <AvatarFallback className="bg-primary-200 text-primary-300">
              {me?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {editing && (
            <>
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // handle upload here — pass to updateProfile or a dedicated upload hook
                    toast.info('Photo upload coming soon')
                  }
                }}
              />
              <motion.label
                htmlFor="avatar-upload"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-300 flex items-center justify-center cursor-pointer"
              >
                <Camera size={12} className="text-white" />
              </motion.label>
            </>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-1">
          {[
            { label: 'Name', value: name, onChange: setName, editable: true },
            { label: 'Email', value: me?.email ?? '', onChange: () => {}, editable: false },
            { label: 'Nomor Handphone', value: phone, onChange: setPhone, editable: true },
          ].map(({ label, value, onChange, editable }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-400 w-32 shrink-0">{label}</span>
              {editing && editable ? (
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="text-sm font-semibold text-gray-900 text-right bg-transparent outline-none border-b border-primary-300 flex-1"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-900 text-right">{value || '-'}</span>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div key="editing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }} className="flex gap-3">
              <Button onClick={() => setEditing(false)} variant="outline"
                className="flex-1 rounded-full py-6 font-semibold">
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={isPending}
                className="flex-1 rounded-full py-6 font-semibold">
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}>
              <Button onClick={() => setEditing(true)} className="w-full rounded-full py-6 font-semibold">
                Update Profile
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Borrowed List Tab ───────────────────────────────────────────
function BorrowedTab() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'BORROWED' | 'LATE' | 'RETURNED' | undefined>(undefined)
  const [reviewBookId, setReviewBookId] = useState<number | null>(null)

  const { data: loansData } = useMyLoansProfile({ status, limit: 20 })
  const loans = loansData?.data?.loans ?? []

  const statusFilters = [
    { label: 'All', value: undefined },
    { label: 'Active', value: 'BORROWED' as const },
    { label: 'Returned', value: 'RETURNED' as const },
    { label: 'Overdue', value: 'LATE' as const },
  ]

  const statusColor: Record<string, string> = {
    BORROWED: 'text-accent-green',
    RETURNED: 'text-gray-500',
    LATE: 'text-accent-red',
  }

  const filtered = loans.filter((loan: any) =>
    loan.book?.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.h1 variants={fadeUp} className="text-2xl font-bold text-gray-900">Borrowed List</motion.h1>

      <motion.div variants={fadeUp} className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-gray-200">
        <Search size={16} className="text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search book"
          className="flex-1 text-sm bg-transparent outline-none text-gray-700" />
      </motion.div>

      <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map(({ label, value }) => (
          <button key={label} onClick={() => setStatus(value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all
              ${status === value
                ? 'bg-primary-200 border-primary-300 text-primary-300'
                : 'bg-white border-gray-200 text-gray-700'
              }`}>
            {label}
          </button>
        ))}
      </motion.div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-10">No loans found</motion.p>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
            {filtered.map((loan: any) => (
              <motion.div key={loan.id} variants={fadeUp}
                className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`text-sm font-bold ${statusColor[loan.status]}`}>
                      {loan.status === 'BORROWED' ? 'Active' : loan.status === 'LATE' ? 'Overdue' : 'Returned'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Due Date</span>
                    <span className="text-sm font-bold text-accent-red">{formatDate(loan.dueAt)}</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex gap-3">
                  <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {loan.book?.coverImage ? (
                      <img src={loan.book.coverImage} alt={loan.book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-primary-200">📚</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-300 text-gray-500">
                      {loan.book?.category?.name}
                    </span>
                    <p className="text-sm font-bold text-gray-900">{loan.book?.title}</p>
                    <p className="text-xs text-gray-500">{loan.book?.author?.name}</p>
                    <p className="text-xs text-gray-400">{formatDate(loan.borrowedAt)} · Duration {loan.durationDays} Days</p>
                  </div>
                </div>

                <Button onClick={() => { if (loan.book?.id) setReviewBookId(loan.book.id) }}
                  className="w-full rounded-full py-5 font-semibold">
                  Give Review
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {reviewBookId && (
          <ReviewModal bookId={reviewBookId} onClose={() => setReviewBookId(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Reviews Tab ─────────────────────────────────────────────────
function ReviewsTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data: reviewsData } = useMyReviews({ q: search })
  const reviews = reviewsData?.data?.reviews ?? []

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.h1 variants={fadeUp} className="text-2xl font-bold text-gray-900">Reviews</motion.h1>

      <motion.div variants={fadeUp} className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-gray-200">
        <Search size={16} className="text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search book"
          className="flex-1 text-sm bg-transparent outline-none text-gray-700" />
      </motion.div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-10">No reviews yet</motion.p>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            {reviews.map((review: any) => (
              <motion.div key={review.id} variants={fadeUp}
                className="space-y-3 border-b border-gray-100 pb-6">
                <p className="text-sm text-gray-400">{formatDateTime(review.createdAt)}</p>
                <div className="flex gap-3 cursor-pointer"
                  onClick={() => navigate(ROUTES.BOOK_DETAIL(review.book?.id))}>
                  <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {review.book?.coverImage ? (
                      <img src={review.book.coverImage} alt={review.book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl bg-primary-200">📚</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-300 text-gray-500">
                      {review.book?.category?.name}
                    </span>
                    <p className="text-sm font-bold text-gray-900">{review.book?.title}</p>
                    <p className="text-xs text-gray-500">{review.book?.author?.name}</p>
                  </div>
                </div>
                <StarRating rating={review.star ?? review.rating} />
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Profile Page ───────────────────────────────────────────
export default function ProfilePage() {
  const location = useLocation()

  const getInitialTab = (): Tab => {
    if (location.pathname.includes('borrowed')) return 'borrowed'
    if (location.pathname.includes('reviews')) return 'reviews'
    return 'profile'
  }

  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab)

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'borrowed', label: 'Borrowed List' },
    { key: 'reviews', label: 'Reviews' },
  ]

  return (
    <div className="px-4 pt-4 pb-10 space-y-4">
      <div className="flex bg-gray-100 rounded-full p-1">
        {tabs.map(({ key, label }) => (
          <motion.button key={key} onClick={() => setActiveTab(key)} whileTap={{ scale: 0.97 }}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all
              ${activeTab === key
                ? 'bg-white text-primary-300 shadow-sm'
                : 'bg-transparent text-gray-500'
              }`}>
            {label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'borrowed' && <BorrowedTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}