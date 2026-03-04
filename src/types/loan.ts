import type { Book } from './book'
import type { User } from './user'

export interface Loan {
  id: number
  userId: number
  bookId: number
  status: 'BORROWED' | 'LATE' | 'RETURNED'
  displayStatus: string
  borrowedAt: string
  dueAt: string
  durationDays: number
  returnByMessage?: string
  book?: Book
  borrower?: User
}

export interface CreateLoanPayload {
  bookId: number
  days: number
}

export interface CreateLoanFromCartPayload {
  itemIds: number[]
  days: 3 | 5 | 10
  borrowDate?: string
}

export interface AdminCreateLoanPayload {
  userId: number
  bookId: number
  dueAt?: string
}

export interface UpdateLoanPayload {
  dueAt?: string
  status?: 'BORROWED' | 'LATE' | 'RETURNED'
}