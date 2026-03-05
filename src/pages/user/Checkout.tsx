import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useCart } from '@/hooks/useCart'
import { useBorrowFromCart } from '@/hooks/useLoans'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import type { RootState } from '@/store/index'
import dayjs from 'dayjs'

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedIds: number[] = location.state?.selectedIds ?? []
  const { user } = useSelector((state: RootState) => state.auth)
  const { data: cartData } = useCart()
  const { mutate: borrowFromCart, isPending } = useBorrowFromCart()

  const [borrowDate, setBorrowDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [days, setDays] = useState<3 | 5 | 10>(3)
  const [agreedReturn, setAgreedReturn] = useState(false)
  const [agreedPolicy, setAgreedPolicy] = useState(false)

  const items = (cartData?.data?.items ?? []).filter((item: any) =>
    selectedIds.includes(item.id)
  )

  const returnDate = dayjs(borrowDate).add(days, 'day').format('D MMMM YYYY')

  const handleConfirm = () => {
    if (!agreedReturn || !agreedPolicy) {
      toast.error('Please agree to both terms')
      return
    }
    borrowFromCart(
      { itemIds: selectedIds, days, borrowDate },
      {
        onSuccess: () => {
          navigate(ROUTES.BORROW_SUCCESS, { state: { returnDate: dayjs(borrowDate).add(days, 'day').format('D MMMM YYYY') } })
        },
        onError: () => toast.error('Failed to borrow books'),
      }
    )
  }

  return (
    <div className="px-4 pt-4 pb-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      {/* User Information */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">User Information</h2>
        {[
          { label: 'Name', value: user?.name },
          { label: 'Email', value: user?.email },
          { label: 'Nomor Handphone', value: user?.phone ?? '-' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-sm font-semibold text-gray-900">{value}</span>
          </div>
        ))}
      </section>

      {/* Book List */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">Book List</h2>
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              {item.book?.coverImage ? (
                <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'var(--color-primary-300)' }}>📚</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-300 text-gray-500 mb-1">
                {item.book?.category?.name}
              </span>
              <p className="text-sm font-bold text-gray-900 truncate">{item.book?.title}</p>
              <p className="text-xs text-gray-500">{item.book?.author?.name}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Borrow Request */}
      <section className="space-y-4 rounded-2xl border border-gray-100 p-4">
        <h2 className="text-base font-bold text-gray-900">Complete Your Borrow Request</h2>

        {/* Borrow Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Borrow Date</label>
          <div className="relative">
            <input
              type="date"
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Borrow Duration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Borrow Duration</label>
          <div className="space-y-2">
            {([3, 5, 10] as const).map((d) => (
              <label key={d} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="days"
                  checked={days === d}
                  onChange={() => setDays(d)}
                  className="w-5 h-5 accent-blue-600"
                />
                <span className="text-sm text-gray-700">{d} Days</span>
              </label>
            ))}
          </div>
        </div>

        {/* Return Date */}
        <div className="rounded-xl p-4 space-y-1" style={{ backgroundColor: 'var(--primary-100)' }}>
          <p className="text-sm font-semibold text-gray-700">Return Date</p>
          <p className="text-xs text-gray-500">Please return the book no later than</p>
          <p className="text-sm font-bold" style={{ color: 'var(--accent-red)' }}>{returnDate}</p>
        </div>

        {/* Agreements */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree-return"
              checked={agreedReturn}
              onCheckedChange={(v) => setAgreedReturn(!!v)}
            />
            <label htmlFor="agree-return" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
              I agree to return the book(s) before the due date.
            </label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree-policy"
              checked={agreedPolicy}
              onCheckedChange={(v) => setAgreedPolicy(!!v)}
            />
            <label htmlFor="agree-policy" className="text-sm text-gray-600 cursor-pointer">
              I accept the library borrowing policy.
            </label>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={isPending || !agreedReturn || !agreedPolicy}
          className="w-full rounded-full py-6 font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary-300)' }}
        >
          {isPending ? 'Processing...' : 'Confirm & Borrow'}
        </Button>
      </section>
    </div>
  )
}