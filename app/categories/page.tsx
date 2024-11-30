import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import productsData from '@/products.json'

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">商品分类</h1>
      
      <div className="grid gap-4">
        {Object.entries(productsData)
          .filter(([key]) => key !== '// 配置说明')
          .map(([category, items]) => (
            <Link
              key={category}
              href={`/categories/${encodeURIComponent(category)}`}
              className="bg-card hover:bg-accent/50 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{category}</h2>
                  <p className="text-muted-foreground mt-1">
                    {items.length} 个商品
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground" />
              </div>
            </Link>
        ))}
      </div>
    </div>
  )
} 