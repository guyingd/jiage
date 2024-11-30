"use client"

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Column<T> {
  key: keyof T | 'actions'
  title: string
  sortable?: boolean
  render?: (value: string | number | undefined, item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  showPagination?: boolean
  pageSize?: number
  filters?: Array<{
    key: keyof T
    title: string
    options: Array<{
      label: string
      value: string
    }>
  }>
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  showPagination = false,
  pageSize = 10,
  filters
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
  
  // 修复类型错误
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(() => {
    const initialFilters: Record<string, string> = {}
    filters?.forEach(filter => {
      initialFilters[String(filter.key)] = ''
    })
    return initialFilters
  })

  // 处理排序
  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // 处理筛选
  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1)
  }

  // 应用筛选
  let filteredData = [...data]
  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value) {
      if (value.includes('-')) {
        // 处理范围筛选
        const [min, max] = value.split('-').map(Number)
        filteredData = filteredData.filter(item => {
          const itemValue = Number(item[key])
          if (max) {
            return itemValue >= min && itemValue <= max
          }
          return itemValue >= min
        })
      } else {
        // 处理普通筛选
        filteredData = filteredData.filter(item => String(item[key]) === value)
      }
    }
  })

  // 应用排序
  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T]
      const bValue = b[sortConfig.key as keyof T]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      const aString = String(aValue).toLowerCase()
      const bString = String(bValue).toLowerCase()
      return sortConfig.direction === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString)
    })
  }

  // 分页
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = showPagination
    ? filteredData.slice(startIndex, startIndex + pageSize)
    : filteredData

  return (
    <div className="space-y-4">
      {/* 筛选器 */}
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {filters.map(filter => (
            <div key={String(filter.key)} className="flex items-center gap-2">
              <span className="text-sm font-medium">{filter.title}:</span>
              <select
                value={activeFilters[String(filter.key)] || ''}
                onChange={e => handleFilter(String(filter.key), e.target.value)}
                className="px-2 py-1 border rounded-lg bg-background"
              >
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* 表格 */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key as keyof T)}
                        className="p-0.5 hover:bg-accent rounded"
                      >
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-muted/50 transition-colors"
              >
                {columns.map(column => (
                  <td key={String(column.key)} className="px-4 py-3">
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            显示 {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} 条，
            共 {filteredData.length} 条
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 