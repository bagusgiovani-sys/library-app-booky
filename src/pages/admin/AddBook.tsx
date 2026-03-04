import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCategories } from '@/hooks/useCategories'
import { useAdminCreateBook } from '@/hooks/useAdmin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'

const CATEGORY_ORDER = ['Fiction', 'Non-Fiction', 'Self-Improvement', 'Finance', 'Science', 'Education']

export default function AddBook() {
  const navigate = useNavigate()
  const { data: categoriesData } = useCategories()
  const { mutate: createBook, isPending } = useAdminCreateBook()

  const categories = categoriesData ?? []

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [totalPages, setTotalPages] = useState('')
  const [description, setDescription] = useState('')
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large (max 5mb)'); return }
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSave = () => {
    if (!title || !categoryId) {
      toast.error('Title and category are required')
      return
    }
    const formData = new FormData()
    formData.append('isbn', `ISBN-${Date.now()}`)
    formData.append('title', title)
    formData.append('authorName', author)
    formData.append('categoryId', String(categoryId))
    formData.append('totalPages', totalPages)
    formData.append('description', description)
    if (coverFile) formData.append('coverImage', coverFile)

    createBook(formData, {
      onSuccess: () => {
        toast.success('Book added!')
        navigate(-1)
      },
      onError: () => toast.error('Failed to add book'),
    })
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 px-4 pt-4 mb-6"
      >
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Add Book</h1>
      </motion.div>

      {/* Main Form - Centered on PC */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-2xl mx-auto px-4"
      >
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className="h-12 rounded-xl border-gray-200" />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Author</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="h-12 rounded-xl border-gray-200" />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Category</Label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:border-blue-400"
              >
                <option value="">Select Category</option>
                {categories
                  .filter((cat: any) => CATEGORY_ORDER.includes(cat.name))
                  .sort((a: any, b: any) => CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name))
                  .map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</div>
            </div>
          </div>

          {/* Number of Pages */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Number of Pages</Label>
            <Input type="number" value={totalPages} onChange={(e) => setTotalPages(e.target.value)}
              placeholder="Enter number of pages"
              className="h-12 rounded-xl border-gray-200" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Description</Label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400 resize-none" />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Cover Image</Label>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg"
              onChange={handleFileChange} className="hidden" />

            {coverPreview ? (
              <div className="space-y-3">
                <div className="w-full rounded-2xl overflow-hidden border border-dashed border-gray-300 p-2">
                  <img src={coverPreview} alt="Cover" className="w-full max-h-64 object-contain rounded-xl" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                    <Upload size={14} /> Change Image
                  </button>
                  <button onClick={() => { setCoverPreview(null); setCoverFile(null) }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-(--accent-red) text-(--accent-red) text-sm hover:bg-red-50">
                    <Trash2 size={14} /> Delete Image
                  </button>
                </div>
                <p className="text-xs text-center text-gray-400">PNG or JPG (max. 5mb)</p>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center gap-2 text-center hover:border-gray-400 transition-colors">
                <div className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center">
                  <Upload size={18} className="text-gray-400" />
                </div>
                <p className="text-sm">
                  <span className="font-semibold text-(--primary-300)">Click to upload</span>
                  {' '}or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG or JPG (max. 5mb)</p>
              </button>
            )}
          </div>

          {/* Save */}
          <Button onClick={handleSave} disabled={isPending}
            className="w-full rounded-full py-6 font-semibold text-white bg-(--primary-300) hover:bg-(--primary-300)/90">
            {isPending ? 'Adding...' : 'Save'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}