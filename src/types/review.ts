import type { Book } from './book'
import type { User } from './user'

export interface Review {
  id: number
  bookId: number
  userId: number
  star: number
  comment: string | null
  createdAt: string
  book?: Book
  user?: User
}

export interface CreateReviewPayload {
  bookId: number
  star: number
  comment?: string
}