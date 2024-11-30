"use client"

import { useState, useMemo } from 'react'
import { ChevronUpIcon, ChevronDownIcon, PackageIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { PriceDisplay } from '@/components/price-display'

interface DataTableProps<T> {
  data: T[]
  columns: {
    key: keyof T
    title: string
    sortable?: boolean
    render?: (value: T[keyof T], item: T) => React.ReactNode
  }[]
  filters?: {
    key: keyof T
    title: string
    options: { label: string; value: string }[]
  }[]
  onSelectionChange?: (selectedItems: T[]) => void
  showPagination?: boolean
  pageSize?: number
}

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  filters,
  onSelectionChange,
  showPagination = false,
  pageSize = 10
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleFilter = (key: keyof T, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set<number>()
    if (checked) {
      filteredData.forEach((_, index) => newSelected.add(index))
    }
    setSelectedItems(newSelected)
    onSelectionChange?.(checked ? filteredData : [])
  }

  const handleSelectItem = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(index)
    } else {
      newSelected.delete(index)
    }
    setSelectedItems(newSelected)
    onSelectionChange?.(Array.from(newSelected).map(i => filteredData[i]))
  }

  const filteredData = useMemo(() => {
    let result = [...data]

    // 应用搜索
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // 应用过滤器
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        if (key === 'price') {
          // 处理价格区间过滤
          const [min, max] = value.split('-').map(Number)
          result = result.filter(item => {
            const price = Number(item[key])
            if (value === '1000+') {
              return price >= 1000
            }
            return price >= min && price <= max
          })
        } else {
          // 其他过滤器保持原样
          result = result.filter(item => String(item[key]) === value)
        }
      }
    })

    // 应用排序
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]
        const modifier = sortConfig.direction === 'asc' ? 1 : -1

        if (typeof aValue === 'string') {
          return aValue.localeCompare(String(bValue)) * modifier
        }
        return ((aValue as number) - (bValue as number)) * modifier
      })
    }

    return result
  }, [data, filterValues, sortConfig, searchTerm])

  // 计算分页数据
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = showPagination
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData

  const renderCell = (column: DataTableProps<T>['columns'][0], item: T) => {
    if (column.render) {
      return column.render(item[column.key], item)
    }

    // 默认渲染器
    const value = item[column.key]
    
    // 商品名称列
    if (column.key === 'name') {
      return (
        <div className="flex items-center gap-2">
          <PackageIcon className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    }

    // 价格列
    if (column.key === 'price') {
      return (
        <PriceDisplay 
          price={value} 
          previousPrice={item.previousPrice}
          size="sm"
          showDiff={item.previousPrice !== undefined}
        />
      )
    }

    return String(value)
  }

  return (
    <div className="space-y-4">
      {/* 搜索和过滤器 */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="搜索..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {filters?.map(filter => (
          <select
            key={String(filter.key)}
            value={filterValues[String(filter.key)] || ''}
            onChange={e => handleFilter(filter.key, e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{filter.title}</option>
            {filter.options.map(option => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* 表格 */}
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {onSelectionChange && (
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredData.length}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-left ${
                    column.sortable ? 'cursor-pointer select-none' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="border-t hover:bg-muted/50">
                {onSelectionChange && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(index)}
                      onChange={e => handleSelectItem(index, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td key={String(column.key)} className="px-4 py-3">
                    {renderCell(column, item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页和统计信息 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          共 {filteredData.length} 条记录
          {selectedItems.size > 0 && ` (已选择 ${selectedItems.size} 条)`}
        </div>
        {showPagination && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span>
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 