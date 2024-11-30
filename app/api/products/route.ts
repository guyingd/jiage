import { NextResponse } from 'next/server'
import { getProducts, saveProducts, type ProductData, type Product } from '@/lib/products'

export async function GET() {
  const products = getProducts()
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    let products = getProducts()
    
    switch (data.action) {
      case 'addCategory': {
        if (products[data.name]) {
          return NextResponse.json({ error: '分类已存在' }, { status: 400 })
        }
        products[data.name] = []
        break
      }

      case 'addProduct': {
        const { category: cat, product } = data
        if (!products[cat]) {
          return NextResponse.json({ error: '分类不存在' }, { status: 400 })
        }
        if (products[cat].some(p => p.name === product.name)) {
          return NextResponse.json({ error: '商品已存在' }, { status: 400 })
        }
        products[cat].push(product)
        break
      }

      case 'editProduct': {
        const { category: cat, oldName, product } = data
        const index = products[cat].findIndex(p => p.name === oldName)
        if (index === -1) {
          return NextResponse.json({ error: '商品不存在' }, { status: 400 })
        }
        products[cat][index] = product
        break
      }

      case 'deleteProduct': {
        const { category: cat, name } = data
        products[cat] = products[cat].filter(p => p.name !== name)
        break
      }

      case 'bulkDelete': {
        const { category: cat, names } = data
        products[cat] = products[cat].filter(p => !names.includes(p.name))
        break
      }

      case 'bulkUpdatePrice': {
        const { category: cat, names, priceChange, isPercentage } = data
        products[cat] = products[cat].map(p => {
          if (names.includes(p.name)) {
            const newPrice = isPercentage
              ? p.price * (1 + priceChange / 100)
              : p.price + priceChange
            return { ...p, price: Math.max(0, Math.round(newPrice * 100) / 100) }
          }
          return p
        })
        break
      }

      case 'import': {
        Object.entries(data.data).forEach(([category, items]) => {
          if (!products[category]) {
            products[category] = []
          }
          const existingNames = new Set(products[category].map(p => p.name))
          ;(items as Product[]).forEach(item => {
            if (!existingNames.has(item.name)) {
              products[category].push(item)
            }
          })
        })
        break
      }

      case 'editCategory': {
        const { oldName, newName } = data
        if (!products[oldName]) {
          return NextResponse.json({ error: '分类不存在' }, { status: 400 })
        }
        if (products[newName]) {
          return NextResponse.json({ error: '新分类名称已存在' }, { status: 400 })
        }
        products[newName] = products[oldName]
        delete products[oldName]
        break
      }

      case 'deleteCategory': {
        const { name } = data
        if (!products[name]) {
          return NextResponse.json({ error: '分类不存在' }, { status: 400 })
        }
        delete products[name]
        break
      }
    }

    const success = saveProducts(products)
    if (!success) {
      return NextResponse.json({ error: '保存失败' }, { status: 500 })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
} 