import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import productsData from '@/public/data/products.json'
import { type Product, type ConfigInfo } from '@/lib/types'

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">商品分类</h1>
      
      <div className="grid gap-4">
        {Object.entries(productsData)
          .filter(([key]) => key !== '// 配置说明')
          .map(([category, items]) => {
            // 确保 items 是商品数组
            const products = Array.isArray(items) ? items : []
            
            return (
              <Link
                key={category}
                href={`/categories/${encodeURIComponent(category)}`}
                className="bg-card hover:bg-accent/50 rounded-lg p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{category}</h2>
                    <p className="text-muted-foreground mt-1">
                      {products.length} 个商品
                    </p>
                  </div>
                  <ChevronRight className="text-muted-foreground" />
                </div>
              </Link>
            )
          })}
      </div>
    </div>
  )
} 