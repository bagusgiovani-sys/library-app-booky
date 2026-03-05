import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminLoans, useAdminUsers, useAdminBooks, useDeleteBook, useAdminUpdateLoan } from '@/hooks/useAdmin'
import DeleteBookModal from '@/components/admin/DeleteBookModal'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime } from '@/lib/utils'
import SearchBar from '@/components/common/SearchBar'
import Container from '@/components/layout/Container'

type Tab = 'borrowed' | 'user' | 'books'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } as const,
}

// ─── Skeleton ────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      className={`bg-gray-200 rounded-lg ${className}`}
    />
  )
}

function LoanCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3.5 flex justify-between">
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-36 h-4" />
      </div>
      <div className="h-px bg-gray-100" />
      <div className="px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex gap-3 flex-1">
          <Skeleton className="w-18 h-22 rounded-xl shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="w-20 h-3.5 rounded-full" />
            <Skeleton className="w-3/5 h-4" />
            <Skeleton className="w-2/5 h-3.5" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-28 h-4" />
        </div>
      </div>
    </div>
  )
}

function BookRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
      <Skeleton className="w-14 h-18 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="w-16 h-3.5 rounded-full" />
        <Skeleton className="w-[55%] h-4" />
        <Skeleton className="w-[35%] h-3" />
        <Skeleton className="w-12 h-3" />
      </div>
      <Skeleton className="w-44 h-9 rounded-full" />
    </div>
  )
}

// ─── Return Button ───────────────────────────────────────────────
function ReturnButton({ loanId }: { loanId: number }) {
  const { mutate: updateLoan, isPending } = useAdminUpdateLoan(loanId)
  return (
    <button
      onClick={() => updateLoan(
        { status: 'RETURNED' },
        {
          onSuccess: () => toast.success('Book returned'),
          onError: () => toast.error('Failed to return book'),
        }
      )}
      disabled={isPending}
      className="text-xs font-semibold px-3 py-1 rounded-full border border-accent-green text-accent-green hover:bg-accent-green hover:text-white transition-colors disabled:opacity-50"
    >
      {isPending ? 'Returning...' : 'Return'}
    </button>
  )
}

// ─── Status filter pill ──────────────────────────────────────────
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all cursor-pointer
        ${active
          ? 'bg-primary-200 border-primary-300 text-primary-300'
          : 'bg-white border-gray-200 text-gray-700'
        }`}
    >
      {label}
    </button>
  )
}

// ─── Borrowed List Tab ───────────────────────────────────────────
function BorrowedTab() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'returned' | 'overdue' | undefined>(undefined)
  const { data: loansData, isLoading } = useAdminLoans({ status, q: search })
  const loans = loansData?.data?.loans ?? []

  const statusFilters: { label: string; value: typeof status }[] = [
    { label: 'All', value: undefined },
    { label: 'Active', value: 'active' },
    { label: 'Returned', value: 'returned' },
    { label: 'Overdue', value: 'overdue' },
  ]

  const statusClass: Record<string, string> = {
    BORROWED: 'text-accent-green',
    RETURNED: 'text-gray-500',
    LATE: 'text-accent-red',
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Borrowed List</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search" />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map(({ label, value }) => (
          <FilterPill key={label} label={label} active={status === value} onClick={() => setStatus(value)} />
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => <LoanCardSkeleton key={i} />)}
        </div>
      ) : loans.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 py-10">
          No loans found
        </motion.p>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-3">
          {loans.map((loan: any) => (
            <motion.div key={loan.id} variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Status row */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-sm font-bold ${statusClass[loan.status]}`}>
                    {loan.status === 'BORROWED' ? 'Active' : loan.status === 'LATE' ? 'Overdue' : 'Returned'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500">Due Date</span>
                  <span className="text-sm font-bold text-accent-red bg-red-50 px-2.5 py-0.5 rounded-md">
                    {formatDate(loan.dueAt)}
                  </span>
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              {/* Book + borrower row */}
              <div className="flex items-center justify-between px-5 py-3.5 gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-18 h-22 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    {loan.book?.coverImage ? (
                      <img src={loan.book.coverImage} alt={loan.book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-primary-200">📚</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="inline-block w-fit text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-300 text-gray-500">
                      {loan.book?.category?.name}
                    </span>
                    <p className="text-sm font-bold text-gray-900 truncate">{loan.book?.title}</p>
                    <p className="text-xs text-gray-500">{loan.book?.author?.name}</p>
                    <p className="text-xs text-gray-400">{formatDate(loan.borrowedAt)} · Duration {loan.durationDays} Days</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">borrower's name</p>
                    <p className="text-sm font-bold text-gray-900">{loan.user?.name}</p>
                  </div>
                  {loan.status !== 'RETURNED' && <ReturnButton loanId={loan.id} />}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

// ─── User Tab ────────────────────────────────────────────────────
function UserTab() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10
  const { data: usersData, isLoading } = useAdminUsers({ q: search, page, limit })
  const users = usersData?.data?.users ?? []
  const meta = usersData?.data

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">User</h1>
      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search user" />

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 border-b border-gray-100 pb-4">
              {[...Array(5)].map((__, j) => (
                <div key={j} className="flex justify-between items-center">
                  <Skeleton className="w-20 h-3.5" />
                  <Skeleton className="w-36 h-3.5" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 py-10">
          No users found
        </motion.p>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-4">
          {users.map((user: any, index: number) => (
            <motion.div key={user.id} variants={itemVariants}
              className="flex flex-col gap-2 border-b border-gray-100 pb-4">
              {[
                { label: 'No', value: (page - 1) * limit + index + 1 },
                { label: 'Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Nomor Handphone', value: user.phone ?? '-' },
                { label: 'Created at', value: formatDateTime(user.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      )}

      {meta?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="text-sm text-gray-500 disabled:opacity-40 cursor-pointer">
            ‹ Previous
          </button>
          {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-full text-sm font-semibold cursor-pointer transition-colors
                ${page === p ? 'bg-primary-300 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              {p}
            </button>
          ))}
          {meta.totalPages > 5 && <span className="text-gray-400">...</span>}
          <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
            className="text-sm text-gray-500 disabled:opacity-40 cursor-pointer">
            Next ›
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Book List Tab ───────────────────────────────────────────────
function BookListTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'available' | 'borrowed' | 'returned' | undefined>(undefined)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { data: booksData, isLoading } = useAdminBooks({ q: search, status })
  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook()
  const books = booksData?.data?.books ?? []

  const statusFilters: { label: string; value: typeof status }[] = [
    { label: 'All', value: undefined },
    { label: 'Available', value: 'available' },
    { label: 'Borrowed', value: 'borrowed' },
    { label: 'Returned', value: 'returned' },
  ]

  const handleConfirmDelete = () => {
    if (!deleteId) return
    deleteBook(deleteId, {
      onSuccess: () => { toast.success('Book deleted'); setDeleteId(null) },
      onError: () => { toast.error('Failed to delete book'); setDeleteId(null) },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <DeleteBookModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />

      <h1 className="text-2xl font-bold text-gray-900">Book List</h1>

      <div>
        <Button onClick={() => navigate('/admin/books/new')}
          className="w-full md:w-auto md:px-8 rounded-full font-semibold">
          Add Book
        </Button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search book" />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map(({ label, value }) => (
          <FilterPill key={label} label={label} active={status === value} onClick={() => setStatus(value)} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          [...Array(4)].map((_, i) => <BookRowSkeleton key={i} />)
        ) : books.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-10">
            No books found
          </motion.p>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            {books.map((book: any, idx: number) => (
              <motion.div key={book.id} variants={itemVariants}
                className={`flex items-center gap-4 px-5 py-4 ${idx !== books.length - 1 ? 'border-b border-gray-100' : ''}`}>
                {/* Cover */}
                <div className="w-14 h-18 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl bg-primary-200">📚</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="inline-block w-fit text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 bg-gray-50">
                    {book.category?.name}
                  </span>
                  <p className="text-sm font-bold text-gray-900 truncate">{book.title}</p>
                  <p className="text-xs text-gray-500">{book.author?.name}</p>
                  <div className="flex items-center gap-1 pt-0.5">
                    <Star size={12} fill="#fdb022" color="#fdb022" />
                    <span className="text-xs font-semibold text-gray-700">{book.rating?.toFixed(1)}</span>
                  </div>
                </div>

                {/* Mobile 3-dot menu */}
                <div className="relative md:hidden">
                  <button onClick={() => setOpenMenuId(openMenuId === book.id ? null : book.id)}
                    className="p-1 text-gray-400 cursor-pointer">
                    <MoreVertical size={18} />
                  </button>
                  <AnimatePresence>
                    {openMenuId === book.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-8 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[99] w-32">
                        <button onClick={() => { navigate(ROUTES.ADMIN_BOOK_PREVIEW(book.id)); setOpenMenuId(null) }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Preview</button>
                        <button onClick={() => { navigate(ROUTES.ADMIN_BOOK_EDIT(book.id)); setOpenMenuId(null) }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Edit</button>
                        <button onClick={() => { setDeleteId(book.id); setOpenMenuId(null) }}
                          className="w-full text-left px-4 py-2 text-sm text-accent-red hover:bg-red-50 cursor-pointer">Delete</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop action buttons */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  <button onClick={() => navigate(ROUTES.ADMIN_BOOK_PREVIEW(book.id))}
                    className="px-5 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    Preview
                  </button>
                  <button onClick={() => navigate(ROUTES.ADMIN_BOOK_EDIT(book.id))}
                    className="px-5 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => setDeleteId(book.id)}
                    className="px-5 py-2 rounded-full text-sm font-medium border border-accent-red text-accent-red hover:bg-red-50 transition-colors cursor-pointer">
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('borrowed')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'borrowed', label: 'Borrowed List' },
    { key: 'user', label: 'User' },
    { key: 'books', label: 'Book List' },
  ]

  return (
    <Container className="py-6">
      <div className="flex flex-col gap-4">
        <div className="flex bg-gray-100 rounded-full p-1">
          {tabs.map(({ key, label }) => (
            <motion.button key={key} onClick={() => setActiveTab(key)} whileTap={{ scale: 0.97 }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer
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
            {activeTab === 'borrowed' && <BorrowedTab />}
            {activeTab === 'user' && <UserTab />}
            {activeTab === 'books' && <BookListTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Container>
  )
}