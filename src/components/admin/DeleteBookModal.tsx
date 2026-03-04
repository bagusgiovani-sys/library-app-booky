import { motion, AnimatePresence } from 'framer-motion'

interface DeleteBookModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
}

export default function DeleteBookModal({ open, onClose, onConfirm, isPending }: DeleteBookModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed', zIndex: 51,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '28px 24px',
              width: 'calc(100% - 48px)',
              maxWidth: '360px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
              Delete Book
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
              Once deleted, you won't be able to recover this book.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onClose}
                disabled={isPending}
                style={{
                  flex: 1, padding: '12px', borderRadius: '999px',
                  fontSize: '14px', fontWeight: 600,
                  border: '1.5px solid #e5e7eb', background: 'white',
                  color: '#374151', cursor: 'pointer',
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isPending}
                style={{
                  flex: 1, padding: '12px', borderRadius: '999px',
                  fontSize: '14px', fontWeight: 600,
                  border: 'none', background: 'var(--accent-red)',
                  color: 'white', cursor: 'pointer',
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}