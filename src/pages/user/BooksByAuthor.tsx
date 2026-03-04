import { useParams, useNavigate } from 'react-router-dom'
import { BookMarked } from 'lucide-react'
import { useAuthorBooks } from '@/hooks/useAuthors'
import { ROUTES } from '@/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import BookCard from '@/components/common/BookCard'

export default function BooksByAuthor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: authorData } = useAuthorBooks(Number(id))
  const author = authorData?.data?.author
  const books = authorData?.data?.books ?? []

  return (
    <div className="px-4 pt-4 pb-10 space-y-6">
      {/* Author Info */}
      <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
        <Avatar className="w-16 h-16">
          <AvatarImage src={author?.photo ?? ''} />
          <AvatarFallback className="text-lg font-bold bg-[var(--primary-200)] text-[var(--primary-300)]">
            {author?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-bold text-gray-900">{author?.name}</p>
          <div className="flex items-center gap-1 mt-1">
            <BookMarked size={14} className="text-[var(--primary-300)]" />
            <span className="text-sm text-gray-500">{books.length} books</span>
          </div>
        </div>
      </div>

      {/* Book List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Book List</h2>
        {books.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No books found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {books.map((book: any) => (
              <BookCard key={book.id} book={book} onClick={() => navigate(ROUTES.BOOK_DETAIL(book.id))} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}