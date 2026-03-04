import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import { useBookDetail } from '@/hooks/useBooks'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14}
          fill={i <= rating ? 'var(--accent-yellow)' : 'transparent'}
          color={i <= rating ? 'var(--accent-yellow)' : '#d1d5db'}
        />
      ))}
    </div>
  )
}

export default function BookPreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: bookData, isLoading } = useBookDetail(Number(id))
  const book = bookData?.data

  if (isLoading) return (
    <div className="space-y-4 animate-pulse px-4 pt-4">
      <div className="h-72 bg-gray-100 rounded-2xl" />
      <div className="h-6 bg-gray-100 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
  )

  if (!book) return <div className="text-center py-20 text-gray-400">Book not found</div>

  return (
    <div className="pb-10 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 px-4 pt-4"
      >
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Preview Book</h1>
      </motion.div>

      {/* Main Content - Responsive Grid */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Cover */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center lg:justify-start"
        >
          <div className="w-full max-w-[280px] lg:max-w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-gray-100">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl bg-(--primary-200)">📚</div>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border border-gray-300 text-gray-600">
            {book.category?.name}
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{book.title}</h2>
          <p className="text-sm text-gray-500">{book.author?.name}</p>
          <div className="flex items-center gap-1">
            <Star size={16} fill="var(--accent-yellow)" color="var(--accent-yellow)" />
            <span className="text-sm font-bold text-gray-800">{book.rating?.toFixed(1)}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            {[
              { label: 'Page', value: book.totalPages ?? '—' },
              { label: 'Rating', value: book.rating?.toFixed(0) ?? '0' },
              { label: 'Reviews', value: book.reviewCount ?? '0' },
            ].map(({ label, value }, index) => (
              <motion.div 
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex flex-col items-center py-3"
              >
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-sm text-gray-400">{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="pt-4"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{book.description}</p>
          </motion.div>

          {/* Admin Action Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="pt-4"
          >
            <Button
              onClick={() => navigate(`/admin/books/${id}/edit`)}
              className="w-full sm:w-auto px-8 bg-(--primary-300) hover:bg-(--primary-300)/90 text-white font-semibold"
              size="lg"
            >
              Edit Book
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}