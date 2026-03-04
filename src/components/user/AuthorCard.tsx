import { Bookmark } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { PopularAuthor } from '@/types/author'

interface AuthorCardProps {
  author: PopularAuthor
  onClick: () => void
}

export default function AuthorCard({ author, onClick }: AuthorCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.09)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center gap-4 bg-white rounded-2xl p-4 text-left w-full border border-gray-100 shadow-sm"
    >
      <Avatar className="w-16 h-16 flex-shrink-0">
        <AvatarImage src='' />
        <AvatarFallback
          className="text-xl font-bold"
          style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}
        >
          {author.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 min-w-0">
        <p className="text-sm font-bold text-gray-900 line-clamp-1">{author.name}</p>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--primary-300)' }}>
            <Bookmark size={11} color="white" fill="white" />
          </div>
          <span className="text-sm text-gray-500">{author.bookCount ?? 0} books</span>
        </div>
      </div>
    </motion.button>
  )
}