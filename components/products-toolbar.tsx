"use client"

import { useState } from 'react'
import { Search, SortAsc, SortDesc } from 'lucide-react'

interface ProductsToolbarProps {
  onSearch: (term: string) => void
  onSort: (field: 'name' | 'price', direction: 'asc' | 'desc') => void
}

export function ProductsToolbar({ onSearch, onSort }: ProductsToolbarProps) {
  const [sortField, setSortField] = useState<'name' | 'price'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: 'name' | 'price') => {
    if (field === sortField) {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
      setSortDirection(newDirection)
      onSort(field, newDirection)
    } else {
      setSortField(field)
      setSortDirection('asc')
      onSort(field, 'asc')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="搜索商品..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleSort('name')}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            sortField === 'name' ? 'bg-accent' : 'hover:bg-accent'
          }`}
        >
          按名称
          {sortField === 'name' && (
            sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => handleSort('price')}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            sortField === 'price' ? 'bg-accent' : 'hover:bg-accent'
          }`}
        >
          按价格
          {sortField === 'price' && (
            sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
} 