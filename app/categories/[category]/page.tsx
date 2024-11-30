"use client"

import { useState, useMemo } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import productsData from '@/products.json'
import { ProductsToolbar } from '@/components/products-toolbar'
import { PriceDisplay } from '@/components/price-display'
import { PackageIcon } from '@/components/icons'
import { DataTable } from '@/components/data-table'
import { type Product } from '@/lib/types'

export default function CategoryPage({
  params: { category },
}: {
  params: { category: string }
}) {
  const decodedCategory = decodeURIComponent(category)
  const items = productsData[decodedCategory]
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    field: 'name' | 'price'
    direction: 'asc' | 'desc'
  }>({ field: 'name', direction: 'asc' })

  if (!items) {
    notFound()
  }

  const columns = [
    { 
      key: 'name' as keyof Product, 
      title: '商品名称', 
      sortable: true,
      render: (value: Product['name'], item: Product) => (
        <div className="flex items-center gap-2">
          <PackageIcon className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'price' as keyof Product, 
      title: '价格', 
      sortable: true,
      render: (value: Product['price'], item: Product) => (
        <PriceDisplay 
          price={value} 
          previousPrice={item.previousPrice}
          size="sm"
          showDiff={item.previousPrice !== undefined}
        />
      )
    }
  ]

  const filters = [
    {
      key: 'price' as keyof Product,
      title: '价格区间',
      options: [
        { label: '全部', value: '' },
        { label: '¥0-100', value: '0-100' },
        { label: '¥100-500', value: '100-500' },
        { label: '¥500-1000', value: '500-1000' },
        { label: '¥1000以上', value: '1000+' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/categories"
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">{decodedCategory}</h1>
      </div>

      <ProductsToolbar
        onSearch={setSearchTerm}
        onSort={(field, direction) => setSortConfig({ field, direction })}
      />

      <DataTable
        data={items}
        columns={columns}
        filters={filters}
        showPagination
        pageSize={20}
      />
    </div>
  )
} 