export interface Product {
  name: string
  price: number
  previousPrice?: number
  updatedAt?: string
  description?: string
}

export interface ProductData {
  [category: string]: Product[]
} 