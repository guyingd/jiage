"use client"

import { useState } from 'react'
import { SearchIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

interface SearchBoxProps {
  placeholder?: string
  onSearch?: (term: string) => void
  className?: string
}

export function SearchBox({ placeholder = "搜索商品名称...", onSearch, className = "" }: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm)
    } else {
      // 如果没有提供 onSearch 回调，则导航到搜索结果页面
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          搜索
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        支持商品名称搜索，快速找到您需要的商品信息
      </p>
    </div>
  )
} 