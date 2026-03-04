import type { Book } from './book'

export interface CartItem {
  id: number
  bookId: number
  book: Book
}

export interface Cart {
  cartId: number
  items: CartItem[]
  itemCount: number
}

export interface AddToCartPayload {
  bookId: number
}

export interface CheckoutPayload {
  user: {
    name: string
    email: string
    phone: string | null
  }
  items: CartItem[]
  itemCount: number
}