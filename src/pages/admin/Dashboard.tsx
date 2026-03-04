import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useAdminLoans, useAdminUsers, useAdminBooks, useDeleteBook } from '@/hooks/useAdmin'
import DeleteBookModal from '@/components/admin/DeleteBookModal'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime } from '@/lib/utils'
import SearchBar from '@/components/common/SearchBar'

type Tab = 'borrowed' | 'user' | 'books'

const globalStyle = `
  .book-menu-mobile { display: block; }
  .book-actions-pc { display: none; }
  .add-book-btn { width: 100%; }
  @media (min-width: 768px) {
    .book-menu-mobile { display: none !important; }
    .book-actions-pc { display: flex !important; }
    .add-book-btn { width: auto !important; padding-left: 2rem !important; padding-right: 2rem !important; }
  }
`

// ─── Skeleton ────────────────────────────────────────────────────
function Skeleton({ width = '100%', height = '16px', borderRadius = '8px' }: { width?: string; height?: string; borderRadius?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width, height, borderRadius, backgroundColor: '#e5e7eb' }}
    />
  )
}

function LoanCardSkeleton() {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="120px" height="18px" />
        <Skeleton width="140px" height="18px" />
      </div>
      <div style={{ height: '1px', backgroundColor: '#f3f4f6' }} />
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <Skeleton width="72px" height="88px" borderRadius="10px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <Skeleton width="80px" height="14px" borderRadius="999px" />
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="14px" />
            <Skeleton width="50%" height="12px" />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
          <Skeleton width="90px" height="12px" />
          <Skeleton width="110px" height="16px" />
        </div>
      </div>
    </div>
  )
}

function BookRowSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
      <Skeleton width="56px" height="72px" borderRadius="12px" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Skeleton width="70px" height="14px" borderRadius="999px" />
        <Skeleton width="55%" height="16px" />
        <Skeleton width="35%" height="13px" />
        <Skeleton width="50px" height="12px" />
      </div>
      <Skeleton width="180px" height="34px" borderRadius="999px" />
    </div>
  )
}

// ─── Stagger helpers ─────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

// ─── Borrowed List Tab ───────────────────────────────────────────
function BorrowedTab() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'returned' | 'overdue' | undefined>(undefined)
  const { data: loansData, isLoading } = useAdminLoans({ status, q: search })
  const loans = loansData?.data?.loans ?? []

  const statusFilters: { label: string; value: 'all' | 'active' | 'returned' | 'overdue' | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Active', value: 'active' },
    { label: 'Returned', value: 'returned' },
    { label: 'Overdue', value: 'overdue' },
  ]

  const statusColor: Record<string, string> = {
    BORROWED: 'var(--accent-green)',
    RETURNED: '#6b7280',
    LATE: 'var(--accent-red)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Borrowed List</h1>

      <SearchBar value={search} onChange={setSearch} placeholder="Search" />

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {statusFilters.map(({ label, value }) => (
          <button key={label} onClick={() => setStatus(value)} style={{
            flexShrink: 0, padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: 600,
            border: '2px solid', cursor: 'pointer',
            backgroundColor: status === value ? 'var(--primary-200)' : 'white',
            borderColor: status === value ? 'var(--primary-300)' : '#e5e7eb',
            color: status === value ? 'var(--primary-300)' : '#374151',
          }}>{label}</button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(3)].map((_, i) => <LoanCardSkeleton key={i} />)}
        </div>
      ) : loans.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>
          No loans found
        </motion.p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {loans.map((loan: any) => (
            <motion.div key={loan.id} variants={itemVariants} style={{
              backgroundColor: 'white', borderRadius: '16px',
              border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}>
              {/* Row 1: Status | Due Date */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Status</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: statusColor[loan.status] }}>
                    {loan.status === 'BORROWED' ? 'Active' : loan.status === 'LATE' ? 'Overdue' : 'Returned'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Due Date</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, padding: '2px 10px', borderRadius: '6px', color: 'var(--accent-red)', backgroundColor: '#fff0f0' }}>
                    {formatDate(loan.dueAt)}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#f3f4f6' }} />

              {/* Row 2: Book | Borrower */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '72px', height: '88px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f3f4f6' }}>
                    {loan.book?.coverImage ? (
                      <img src={loan.book.coverImage} alt={loan.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', backgroundColor: 'var(--primary-200)' }}>📚</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                    <span style={{ display: 'inline-block', width: 'fit-content', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', border: '1px solid #d1d5db', color: '#6b7280' }}>
                      {loan.book?.category?.name}
                    </span>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loan.book?.title}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{loan.book?.author?.name}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{formatDate(loan.borrowedAt)} · Duration {loan.durationDays} Days</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>borrower's name</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{loan.user?.name}</p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>User</h1>

      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search user" />

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
              {[...Array(5)].map((__, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Skeleton width="80px" height="14px" />
                  <Skeleton width="140px" height="14px" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>
          No users found
        </motion.p>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {users.map((user: any, index: number) => (
            <motion.div key={user.id} variants={itemVariants}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
              {[
                { label: 'No', value: (page - 1) * limit + index + 1 },
                { label: 'Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Nomor Handphone', value: user.phone ?? '-' },
                { label: 'Created at', value: formatDateTime(user.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>{label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{value}</span>
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      )}

      {meta?.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', paddingTop: '16px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ fontSize: '14px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
            ‹ Previous
          </button>
          {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: '32px', height: '32px', borderRadius: '999px', fontSize: '14px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              backgroundColor: page === p ? 'var(--primary-300)' : 'transparent',
              color: page === p ? 'white' : '#374151',
            }}>{p}</button>
          ))}
          {meta.totalPages > 5 && <span style={{ color: '#9ca3af' }}>...</span>}
          <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
            style={{ fontSize: '14px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', opacity: page === meta.totalPages ? 0.4 : 1 }}>
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

  const statusFilters: { label: string; value: 'all' | 'available' | 'borrowed' | 'returned' | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Available', value: 'available' },
    { label: 'Borrowed', value: 'borrowed' },
    { label: 'Returned', value: 'returned' },
  ]

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setOpenMenuId(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteId) return
    deleteBook(deleteId, {
      onSuccess: () => { toast.success('Book deleted'); setDeleteId(null) },
      onError: () => { toast.error('Failed to delete book'); setDeleteId(null) },
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DeleteBookModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
      <style>{globalStyle}</style>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Book List</h1>

      <div>
        <Button onClick={() => navigate('/admin/books/new')}
          className="add-book-btn rounded-full font-semibold text-white"
          style={{ backgroundColor: 'var(--primary-300)', padding: '10px 24px' }}>
          Add Book
        </Button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search book" />

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {statusFilters.map(({ label, value }) => (
          <button key={label} onClick={() => setStatus(value)} style={{
            flexShrink: 0, padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: 600,
            border: '2px solid', cursor: 'pointer',
            backgroundColor: status === value ? 'var(--primary-200)' : 'white',
            borderColor: status === value ? 'var(--primary-300)' : '#e5e7eb',
            color: status === value ? 'var(--primary-300)' : '#374151',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        {isLoading ? (
          [...Array(4)].map((_, i) => <BookRowSkeleton key={i} />)
        ) : books.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>
            No books found
          </motion.p>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            {books.map((book: any, idx: number) => (
              <motion.div key={book.id} variants={itemVariants} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                borderBottom: idx !== books.length - 1 ? '1px solid #f3f4f6' : 'none',
              }}>
                <div style={{ width: '56px', height: '72px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f3f4f6' }}>
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', backgroundColor: 'var(--primary-200)' }}>📚</div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ display: 'inline-block', width: 'fit-content', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', border: '1px solid #e5e7eb', color: '#6b7280', backgroundColor: '#f9fafb' }}>
                    {book.category?.name}
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{book.author?.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '2px' }}>
                    <Star size={12} fill="var(--accent-yellow)" color="var(--accent-yellow)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{book.rating?.toFixed(1)}</span>
                  </div>
                </div>

                <div className="book-menu-mobile" style={{ position: 'relative' }}>
                  <button onClick={() => setOpenMenuId(openMenuId === book.id ? null : book.id)}
                    style={{ padding: '4px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <MoreVertical size={18} />
                  </button>
                  <AnimatePresence>
                    {openMenuId === book.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        style={{ position: 'absolute', right: 0, top: '32px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', padding: '8px 0', zIndex: 10, width: '128px' }}>
                        <button onClick={() => { navigate(ROUTES.ADMIN_BOOK_PREVIEW(book.id)); setOpenMenuId(null) }}
                          style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '14px', color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}>Preview</button>
                        <button onClick={() => { navigate(ROUTES.ADMIN_BOOK_EDIT(book.id)); setOpenMenuId(null) }}
                          style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '14px', color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(book.id)}
                          style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '14px', color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="book-actions-pc" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => navigate(ROUTES.ADMIN_BOOK_PREVIEW(book.id))}
                    style={{ padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, border: '1px solid #e5e7eb', color: '#374151', background: 'white', cursor: 'pointer' }}
                    onMouseOver={e => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseOut={e => (e.currentTarget.style.background = 'white')}>Preview</button>
                  <button onClick={() => navigate(ROUTES.ADMIN_BOOK_EDIT(book.id))}
                    style={{ padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, border: '1px solid #e5e7eb', color: '#374151', background: 'white', cursor: 'pointer' }}
                    onMouseOver={e => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseOut={e => (e.currentTarget.style.background = 'white')}>Edit</button>
                  <button onClick={() => handleDelete(book.id)}
                    style={{ padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, border: '1px solid var(--accent-red)', color: 'var(--accent-red)', background: 'white', cursor: 'pointer' }}
                    onMouseOver={e => (e.currentTarget.style.background = '#fff0f0')}
                    onMouseOut={e => (e.currentTarget.style.background = 'white')}>Delete</button>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '999px', padding: '4px' }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            flex: 1, padding: '8px', borderRadius: '999px', fontSize: '14px', fontWeight: 600,
            border: 'none', cursor: 'pointer', transition: 'all 0.15s',
            backgroundColor: activeTab === key ? 'white' : 'transparent',
            color: activeTab === key ? 'var(--primary-300)' : '#6b7280',
            boxShadow: activeTab === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: activeTab === 'borrowed' ? 'block' : 'none' }}>
        <BorrowedTab />
      </div>
      <div style={{ display: activeTab === 'user' ? 'block' : 'none' }}>
        <UserTab />
      </div>
      <div style={{ display: activeTab === 'books' ? 'block' : 'none' }}>
        <BookListTab />
      </div>
    </div>
  )
}