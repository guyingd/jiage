import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export interface Product {
  name: string
  price: number
}

export interface ProductData {
  [key: string]: Product[]
}

const PRODUCTS_FILE = join(process.cwd(), 'products.json')

export function getProducts(): ProductData {
  try {
    const data = readFileSync(PRODUCTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products file:', error)
    return {}
  }
}

export function saveProducts(data: ProductData): boolean {
  try {
    writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing products file:', error)
    return false
  }
} 