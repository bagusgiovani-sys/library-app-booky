import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useBooks } from '@/hooks/useBooks'
import { useCategories } from '@/hooks/useCategories'
import { ROUTES } from '@/constants'
import { Star, SlidersHorizontal, X } from 'lucide-react'
import BookCard from '@/components/common/BookCard'
import { Checkbox } from '@/components/ui/checkbox'

const CATEGORY_ORDER = ['Fiction', 'Non-Fiction', 'Self-Improvement', 'Finance', 'Science', 'Education']

export default function Category() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined

  const [selectedCategories, setSelectedCategories] = useState<number[]>(initialCategoryId ? [initialCategoryId] : [])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [showFilter, setShowFilter] = useState(false)
  const [page, setPage] = useState(1)

  const { data: categoriesData } = useCategories()
  const categories = categoriesData
    ?.filter((cat: any) => CATEGORY_ORDER.includes(cat.name))
    .sort((a: any, b: any) => CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name))

  const { data: booksData, isFetching } = useBooks({
    categoryId: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
    minRating: selectedRatings.length === 1 ? selectedRatings[0] : undefined,
    page,
    limit: 8,
  })
  const books = booksData?.data?.books ?? []
  const meta = booksData?.data

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
    setPage(1)
  }

  const toggleRating = (r: number) => {
    setSelectedRatings(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    )
    setPage(1)
  }

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-bold text-gray-900">Category</p>
        {categories?.map((cat: any) => (
          <div key={cat.id} className="flex items-center gap-2">
            <Checkbox
              id={`cat-${cat.id}`}
              checked={selectedCategories.includes(cat.id)}
              onCheckedChange={() => toggleCategory(cat.id)}
            />
            <label htmlFor={`cat-${cat.id}`} className="text-sm text-gray-700 cursor-pointer">{cat.name}</label>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-bold text-gray-900">Rating</p>
        {[5, 4, 3, 2, 1].map((r) => (
          <div key={r} className="flex items-center gap-2">
            <Checkbox
              id={`rating-${r}`}
              checked={selectedRatings.includes(r)}
              onCheckedChange={() => toggleRating(r)}
            />
            <label htmlFor={`rating-${r}`} className="flex items-center gap-1 cursor-pointer">
              <Star size={14} fill="var(--accent-yellow)" color="var(--accent-yellow)" />
              <span className="text-sm text-gray-700">{r}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="px-4 pt-4 pb-10">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Book List</h1>
        <button onClick={() => setShowFilter(true)} className="p-2 rounded-xl border border-gray-200 bg-white">
          <SlidersHorizontal size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          <div className="relative ml-auto w-72 h-full bg-white p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-gray-900">FILTER</p>
              <button onClick={() => setShowFilter(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      {/* PC Layout */}
      <div className="flex gap-8">
        {/* Sidebar - PC only */}
        <aside className="hidden md:block w-48 flex-shrink-0 space-y-2">
          <p className="text-sm font-bold text-gray-500 tracking-widest">FILTER</p>
          <FilterPanel />
        </aside>

        {/* Books Grid */}
        <div className="flex-1">
          <h1 className="hidden md:block text-2xl font-bold text-gray-900 mb-4">Book List</h1>
          {isFetching ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : books.length === 0 ? (
            <p className="text-center text-gray-400 py-20">No books found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {books.map((book: any) => (
                <BookCard key={book.id} book={book} onClick={() => navigate(ROUTES.BOOK_DETAIL(book.id))} />
              ))}
            </div>
          )}

          {meta?.totalPages > page && (
            <button
              onClick={() => setPage(p => p + 1)}
              className="w-full mt-6 py-3 rounded-xl font-semibold text-sm bg-[var(--primary-200)] text-[var(--primary-300)]"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}