"use client"

import { useState, useEffect, useCallback } from 'react'
import { Dialog } from '@headlessui/react'
import { SearchIcon, XIcon, Edit2Icon, ClockIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import productsData from '@/public/data/products.json'
import { PriceDisplay } from '@/components/price-display'

type Product = {
  name: string
  price: number
  category: string
}

type SearchResult = Product & {
  category: string
  highlight: {
    name: string[]
    category: string[]
  }
}

interface SearchDialogProps {
  className?: string
  buttonClassName?: string
}

const MAX_HISTORY = 5

export function SearchDialog({ className, buttonClassName }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const { data: session } = useSession()
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]')
    }
    return []
  })

  // 扁平化商品数据，添加分类信息
  const allProducts = Object.entries(productsData)
    .filter(([key]) => key !== '// 配置说明')
    .flatMap(([category, items]) =>
      (items as Array<{name: string, price: number}>).map(item => ({
        ...item,
        category
      }))
    )

  const highlightText = (text: string, query: string): string[] => {
    if (!query) return [text]
    const parts = text.toLowerCase().split(query.toLowerCase())
    const result: string[] = []
    let lastIndex = 0

    parts.forEach((part, index) => {
      const start = lastIndex
      const end = start + part.length
      result.push(text.slice(start, end))
      if (index < parts.length - 1) {
        const matchStart = end
        const matchEnd = matchStart + query.length
        result.push(text.slice(matchStart, matchEnd))
      }
      lastIndex = end + query.length
    })

    return result
  }

  const search = useCallback((term: string) => {
    if (!term) {
      setResults([])
      return
    }

    const searchResults = allProducts
      .filter(product => {
        const searchTerm = term.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        )
      })
      .map(product => ({
        ...product,
        highlight: {
          name: highlightText(product.name, term),
          category: highlightText(product.category, term)
        }
      }))
      .slice(0, 8) // 限制结果数量

    setResults(searchResults)
  }, [allProducts])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchTerm)
    }, 200) // 添加防抖

    return () => clearTimeout(timeoutId)
  }, [searchTerm, search])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev)
        break
      case 'Enter':
        if (selectedIndex >= 0 && results[selectedIndex]) {
          const result = results[selectedIndex]
          router.push(`/categories/${encodeURIComponent(result.category)}`)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  const handleItemClick = (result: SearchResult) => {
    addToHistory(searchTerm)
    router.push(`/categories/${encodeURIComponent(result.category)}`)
    setIsOpen(false)
  }

  const handleEditClick = (e: React.MouseEvent, result: SearchResult) => {
    e.stopPropagation() // 阻止冒泡，避免触发父元素的点击事件
    router.push(`/manage?category=${encodeURIComponent(result.category)}&product=${encodeURIComponent(result.name)}`)
    setIsOpen(false)
  }

  const addToHistory = (term: string) => {
    if (!term) return
    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(t => t !== term)].slice(0, MAX_HISTORY)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      return newHistory
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClassName || "p-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2"}
      >
        <div className={className || "relative w-full"}>
          <div className="flex items-center gap-2 px-4 py-3 border rounded-lg focus-within:ring-2 focus-within:ring-primary">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">搜索商品...</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-start justify-center p-4 pt-[20vh]">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-background rounded-xl shadow-2xl">
            <div className="flex items-center border-b p-4">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setSelectedIndex(-1)
                }}
                onKeyDown={handleKeyDown}
                placeholder="搜索商品..."
                className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
                autoFocus
              />
              <button onClick={() => setIsOpen(false)}>
                <XIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!searchTerm && searchHistory.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>最近搜索</span>
                    </div>
                    <button
                      onClick={clearHistory}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      清除历史
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.map((term) => (
                      <button
                        key={term}
                        className="w-full px-4 py-2 text-left hover:bg-accent/50 rounded-lg transition-colors"
                        onClick={() => {
                          setSearchTerm(term)
                          search(term)
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.map((result, index) => (
                <button
                  key={`${result.category}-${result.name}`}
                  className={`w-full flex justify-between items-center p-4 rounded-lg transition-colors ${
                    index === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => handleItemClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex flex-col items-start gap-1">
                    <div className="font-medium">
                      {result.highlight.name.map((part, i) => (
                        <span
                          key={i}
                          className={i % 2 === 1 ? "bg-yellow-200 dark:bg-yellow-800" : ""}
                        >
                          {part}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      分类：
                      {result.highlight.category.map((part, i) => (
                        <span
                          key={i}
                          className={i % 2 === 1 ? "bg-yellow-200 dark:bg-yellow-800" : ""}
                        >
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <PriceDisplay price={result.price} size="sm" />
                    {session && (
                      <button
                        onClick={(e) => handleEditClick(e, result)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </button>
              ))}
              {searchTerm && results.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  未找到相关商品
                </div>
              )}
              {!searchTerm && searchHistory.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  输入关键词开始搜索
                  <div className="mt-2 text-sm">
                    支持搜索商品名称和分类
                    {session && <span>，点击编辑图标可直接进入管理页面</span>}
                  </div>
                  <div className="mt-1 text-xs">
                    使用 <kbd className="px-1 py-0.5 bg-muted rounded">⌘</kbd>+
                    <kbd className="px-1 py-0.5 bg-muted rounded">K</kbd> 快速打开搜索
                  </div>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
} 