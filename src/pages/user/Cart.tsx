import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useRemoveFromCart } from '@/hooks/useCart'
import { ROUTES } from '@/constants'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const P300 = 'var(--color-primary-300)'
const P200 = 'var(--color-primary-200)'

export default function Cart() {
  const navigate = useNavigate()
  const { data: cartData } = useCart()
  const { mutate: removeFromCart } = useRemoveFromCart()

  const items = cartData?.data?.items ?? []
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const allSelected = items.length > 0 && selectedIds.length === items.length

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(items.map((item: any) => item.id))
  }

  const toggleItem = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleRemove = (itemId: number) => {
    removeFromCart(itemId, {
      onSuccess: () => {
        toast.success('Item removed')
        setSelectedIds((prev) => prev.filter((i) => i !== itemId))
      },
      onError: () => toast.error('Failed to remove item'),
    })
  }

  const handleBorrow = () => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one book')
      return
    }
    navigate(ROUTES.CHECKOUT, { state: { selectedIds } })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pb-32 space-y-4 px-4 pt-4"
    >
      <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>

      {/* Select All */}
      <div className="flex items-center gap-3">
        <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} id="select-all" />
        <label htmlFor="select-all" className="text-sm font-semibold text-gray-700 cursor-pointer">
          Select All
        </label>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-20"
          >
            Your cart is empty
          </motion.p>
        ) : (
          <AnimatePresence>
            {items.map((item: any, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm"
              >
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                {/* Cover */}
                <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.book?.coverImage ? (
                    <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: P200 }}>📚</div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{item.book?.category?.name}</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{item.book?.title}</p>
                  <p className="text-xs text-gray-500">{item.book?.author?.name}</p>
                </div>
                {/* Remove */}
                <motion.button
                  onClick={() => handleRemove(item.id)}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Floating Borrow Bar */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 font-medium">Total Book</p>
          <p className="text-sm font-bold text-gray-900">{selectedIds.length} Items</p>
        </div>
        <Button
          onClick={handleBorrow}
          disabled={selectedIds.length === 0}
          className="rounded-full px-8 font-semibold"
          style={{ backgroundColor: P300 }}
        >
          Borrow Book
        </Button>
      </div>
    </motion.div>
  )
}