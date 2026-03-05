import { useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

export default function BorrowSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const returnDate = location.state?.returnDate ?? ''

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-6">
      {/* Ripple Check Icon */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-36 h-36 rounded-full opacity-10" style={{ backgroundColor: 'var(--primary-300)' }} />
        <div className="absolute w-28 h-28 rounded-full opacity-20" style={{ backgroundColor: 'var(--primary-300)' }} />
        <div className="w-20 h-20 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: 'var(--primary-300)' }}>
          <Check size={36} color="white" strokeWidth={3} />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-900">Borrowing Successful!</h1>
        <p className="text-sm text-gray-500">
          Your book has been successfully borrowed.
        </p>
        {returnDate && (
          <p className="text-sm text-gray-500">
            Please return it by{' '}
            <span className="font-semibold" style={{ color: 'var(--accent-red)' }}>
              {returnDate}
            </span>
          </p>
        )}
      </div>

      {/* Button */}
      <Button
        onClick={() => navigate(ROUTES.PROFILE_BORROWED)}
        className="w-full rounded-full py-6 font-semibold text-white"
        style={{ backgroundColor: 'var(--color-primary-300)' }}
      >
        See Borrowed List
      </Button>
    </div>
  )
}