"use client"

import { useState, useEffect, useMemo } from 'react'
import { PlusIcon, Edit2Icon, Trash2Icon, FileUpIcon } from '@/components/icons'
import { CategoryDialog } from '@/components/category-dialog'
import { ProductDialog } from '@/components/product-dialog'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProductsToolbar } from '@/components/products-toolbar'
import { DataTable } from '@/components/data-table'
import { BulkActions } from '@/components/bulk-actions'
import { ImportDialog } from '@/components/import-dialog'
import { CategoryActions } from '@/components/category-actions'
import { useSearchParams } from 'next/navigation'

interface Product {
  name: string
  price: number
}

interface ProductData {
  [key: string]: Product[]
}

export default function ManagePage() {
  const [products, setProducts] = useState<ProductData>({})
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    itemName: string
  }>({
    isOpen: false,
    itemName: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    field: 'name' | 'price'
    direction: 'asc' | 'desc'
  }>({ field: 'name', direction: 'asc' })
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const category = searchParams.get('category')
    const productName = searchParams.get('product')
    
    if (category && products[category]) {
      setActiveCategory(category)
      
      if (productName) {
        const product = products[category].find(p => p.name === productName)
        if (product) {
          setEditingProduct(product)
        }
      }
    }
  }, [products, searchParams])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast.error('加载数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async (name: string) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addCategory', name })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const data = await response.json()
      setProducts(data)
      toast.success('添加分类成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '添加分类失败')
    }
  }

  const handleAddProduct = async (data: Product) => {
    if (!activeCategory) return

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addProduct',
          category: activeCategory,
          product: data
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const newData = await response.json()
      setProducts(newData)
      toast.success('添加商品成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '添加商品失败')
    }
  }

  const handleEditProduct = async (data: Product) => {
    if (!activeCategory || !editingProduct) return

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'editProduct',
          category: activeCategory,
          oldName: editingProduct.name,
          product: data
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const newData = await response.json()
      setProducts(newData)
      toast.success('编辑商品成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '编辑商品失败')
    }
  }

  const handleDeleteProduct = async (name: string) => {
    if (!activeCategory) return

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteProduct',
          category: activeCategory,
          name
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const newData = await response.json()
      setProducts(newData)
      toast.success('删除商品成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除商品失败')
    }
  }

  const handleBulkDelete = async (items: Product[]) => {
    if (!activeCategory) return

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulkDelete',
          category: activeCategory,
          names: items.map(item => item.name)
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const newData = await response.json()
      setProducts(newData)
      toast.success('批量删除成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '批量删除失败')
    }
  }

  const handleBulkUpdatePrice = async (items: Product[], priceChange: number, isPercentage: boolean) => {
    if (!activeCategory) return

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulkUpdatePrice',
          category: activeCategory,
          names: items.map(item => item.name),
          priceChange,
          isPercentage
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const newData = await response.json()
      setProducts(newData)
      toast.success('批量修改价格成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '批量修改价格失败')
    }
  }

  const handleImport = async (data: ProductData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import',
          data
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error)
      }

      const newData = await response.json()
      setProducts(newData)
    } catch (error) {
      throw error
    }
  }

  const handleEditCategory = async (oldName: string, newName: string) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'editCategory',
          oldName,
          newName
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const data = await response.json()
      setProducts(data)
      if (activeCategory === oldName) {
        setActiveCategory(newName)
      }
      toast.success('修改分类成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '修改分类失败')
    }
  }

  const handleDeleteCategory = async (name: string) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteCategory',
          name
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const data = await response.json()
      setProducts(data)
      if (activeCategory === name) {
        setActiveCategory(null)
      }
      toast.success('删除分类成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除分类失败')
    }
  }

  const columns = [
    { 
      key: 'name' as keyof Product, 
      title: '商品名称', 
      sortable: true 
    },
    { 
      key: 'price' as keyof Product, 
      title: '价格', 
      sortable: true 
    },
    {
      key: 'actions' as keyof Product,
      title: '操作',
      render: (_: any, item: Product) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditingProduct(item)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Edit2Icon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirm({ isOpen: true, itemName: item.name })}
            className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
          >
            <Trash2Icon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  const filters = [
    {
      key: 'price' as keyof Product,
      title: '价格区间',
      options: [
        { label: '0-100', value: '0-100' },
        { label: '100-500', value: '100-500' },
        { label: '500-1000', value: '500-1000' },
        { label: '1000以上', value: '1000+' }
      ]
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <LoadingSpinner className="h-6 w-6" />
          <span>加载中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsImportDialogOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <FileUpIcon className="h-4 w-4" />
            导入数据
          </button>
          <button
            onClick={() => setIsCategoryDialogOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            添加分类
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[300px,1fr] gap-8">
        {/* 分类列表 */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">分类列表</h2>
          <div className="space-y-2">
            {Object.entries(products || {})
              .filter(([key]) => key !== '// 配置说明')
              .map(([category]) => (
                <div
                  key={category}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg hover:bg-accent transition-colors ${
                    activeCategory === category ? 'bg-accent' : ''
                  }`}
                >
                  <button
                    onClick={() => setActiveCategory(category)}
                    className="flex-1 text-left"
                  >
                    {category}
                  </button>
                  <CategoryActions
                    category={category}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    isActive={activeCategory === category}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* 商品列表 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">
              {activeCategory ? `${activeCategory} 的商品` : '请选择分类'}
            </h2>
            {activeCategory && products[activeCategory] && (
              <button
                onClick={() => setIsProductDialogOpen(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                添加商品
              </button>
            )}
          </div>

          {activeCategory && (
            <>
              <ProductsToolbar
                onSearch={setSearchTerm}
                onSort={(field, direction) => setSortConfig({ field, direction })}
              />
              <DataTable
                data={products[activeCategory]}
                columns={columns}
                filters={filters}
                onSelectionChange={setSelectedProducts}
              />
              <BulkActions
                selectedItems={selectedProducts}
                onBulkDelete={handleBulkDelete}
                onBulkUpdatePrice={handleBulkUpdatePrice}
              />
            </>
          )}
        </div>
      </div>

      <CategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSubmit={handleAddCategory}
        title="添加分类"
      />

      <ProductDialog
        isOpen={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        onSubmit={handleAddProduct}
        title="添加商品"
      />

      {editingProduct && (
        <ProductDialog
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleEditProduct}
          title="编辑商品"
          initialValue={editingProduct}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, itemName: '' })}
        onConfirm={() => handleDeleteProduct(deleteConfirm.itemName)}
        title="删除商品"
        description={`确定要删除商品"${deleteConfirm.itemName}"吗？此操作不可撤销。`}
        type="danger"
        confirmText="删除"
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImport}
      />
    </div>
  )
} 