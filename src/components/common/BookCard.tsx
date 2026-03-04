import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Book } from '@/types/book'

interface BookCardProps {
  book: Book
  onClick: () => void
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col rounded-xl overflow-hidden bg-white shadow-sm text-left w-full"
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Cover */}
      <div className="w-full overflow-hidden" style={{ aspectRatio: '2/3', backgroundColor: '#f3f4f6' }}>
        {book.coverImage ? (
          <motion.img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: 'var(--primary-200)' }}>
            📚
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 space-y-0.5">
        <p className="font-bold text-xs text-gray-900 line-clamp-1">{book.title}</p>
        <p className="text-[10px] text-gray-500 line-clamp-1">{book.author?.name}</p>
        <div className="flex items-center gap-1">
          <Star size={10} fill="#fdb022" color="#fdb022" />
          <span className="text-[10px] font-semibold text-gray-700">{book.rating?.toFixed(1)}</span>
        </div>
      </div>
    </motion.button>
  )
}