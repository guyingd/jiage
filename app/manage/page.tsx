"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import productsData from '@/public/data/products.json'
import { DataTable } from '@/components/data-table'
import { ProductsToolbar } from '@/components/products-toolbar'
import { PriceDisplay } from '@/components/price-display'
import { PackageIcon, PlusIcon, Edit2Icon, Check as CheckIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Product } from '@/lib/types'

interface EditingItem extends Product {
  category: string
  index: number
}

export default function ManagePage() {
  // 使用 useState 和 useEffect 来处理数据
  const [categories, setCategories] = useState<string[]>([])
  const [allProducts, setAllProducts] = useState<EditingItem[]>([])

  useEffect(() => {
    // 获取所有分类
    const cats = Object.keys(productsData)
      .filter(key => key !== '// 配置说明')
    setCategories(cats)

    // 获取所有商品数据
    const products = Object.entries(productsData)
      .filter(([key]) => key !== '// 配置说明')
      .flatMap(([category, items]) =>
        (items as Product[]).map((item, index) => ({
          ...item,
          category,
          index
        }))
      )
    setAllProducts(products)
  }, [])

  // 其他状态
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    field: 'name' | 'price'
    direction: 'asc' | 'desc'
  }>({ field: 'name', direction: 'asc' })

  // 编辑状态
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<{
    oldName: string
    newName: string
  } | null>(null)

  // 处理添加分类
  const handleAddCategory = () => {
    if (editingCategory) return
    setEditingCategory({
      oldName: '',
      newName: ''
    })
  }

  // 处理添加商品
  const handleAddProduct = () => {
    if (editingItem) return
    const defaultCategory = categories[0] || ''
    setEditingItem({
      name: '',
      price: 0,
      category: defaultCategory,
      index: -1,
      previousPrice: undefined
    } as EditingItem)
  }

  // 处理编辑
  const handleEdit = (category: string, index: number, data: Product) => {
    setEditingItem({ ...data, category, index })
  }

  // 处理保存
  const handleSave = async () => {
    if (!editingItem) return
    if (!editingItem.name.trim()) {
      toast.error('商品名称不能为空')
      return
    }
    if (editingItem.price < 0) {
      toast.error('价格不能小于0')
      return
    }

    try {
      const newData = JSON.parse(JSON.stringify(productsData))
      const { category, index, ...product } = editingItem

      // 检查商品名称是否已存在
      const existingProduct = (newData[category] as Product[])?.find(
        p => p.name === product.name && (index === -1 || (newData[category] as Product[])[index].name !== product.name)
      )
      if (existingProduct) {
        toast.error('商品名称已存在')
        return
      }

      if (index >= 0) {
        // 修改商品
        (newData[category] as Product[])[index] = product
      } else {
        // 新增商品
        if (!newData[category]) {
          newData[category] = []
        }
        (newData[category] as Product[]).push(product)
      }

      // 保存配置信息
      newData['// 配置说明'] = productsData['// 配置说明']

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      })

      if (!response.ok) throw new Error('保存失败')

      toast.success(index >= 0 ? '商品更新成功' : '商品添加成功')
      setEditingItem(null)
      window.location.reload()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('保存失败')
    }
  }

  // 处理删除
  const handleDelete = async (category: string, index: number) => {
    if (!confirm('确定要删除这个商品吗？')) return

    try {
      // TODO: 实现删除逻辑
      toast.success('删除成功')
    } catch (error) {
      toast.error('删除失败')
    }
  }

  // 处理分类编辑
  const handleEditCategory = (category: string) => {
    setEditingCategory({
      oldName: category,
      newName: category
    })
  }

  // 处理分类保存
  const handleSaveCategory = async () => {
    if (!editingCategory) return
    if (!editingCategory.newName.trim()) {
      toast.error('分类名称不能为空')
      return
    }

    try {
      const newData = JSON.parse(JSON.stringify(productsData))
      
      // 检查新名称是否已存在
      if (editingCategory.oldName !== editingCategory.newName && newData[editingCategory.newName]) {
        toast.error('分类已存在')
        return
      }

      if (editingCategory.oldName) {
        // 修改分类
        newData[editingCategory.newName] = newData[editingCategory.oldName]
        delete newData[editingCategory.oldName]
      } else {
        // 新增分类
        newData[editingCategory.newName] = []
      }

      // 保存配置信息
      newData['// 配置说明'] = productsData['// 配置说明']

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      })

      if (!response.ok) throw new Error('保存失败')

      toast.success(editingCategory.oldName ? '分类更新成功' : '分类添加成功')
      setEditingCategory(null)
      window.location.reload()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('保存失败')
    }
  }

  // 处理分类删除
  const handleDeleteCategory = async (category: string) => {
    if (!confirm(`确定要删除分类"${category}"吗？此操作将删除该分类下的所有商品。`)) return

    try {
      // 深拷贝当前数据
      const newData = JSON.parse(JSON.stringify(productsData))
      
      // 删除分类
      delete newData[category]

      // 保存到文件
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData)
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      toast.success('分类删除成功')
      
      // 刷新页面以获取最新数据
      window.location.reload()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('删除失败')
    }
  }

  const columns = [
    { 
      key: 'name' as const,
      title: '商品名称', 
      sortable: true,
      render: (value: string | number | undefined, item: EditingItem) => {
        const isEditing = editingItem?.index === item.index && editingItem?.category === item.category

        return isEditing ? (
          <input
            type="text"
            value={editingItem.name}
            onChange={e => setEditingItem(prev => prev ? {
              ...prev,
              name: e.target.value
            } : null)}
            className="w-full px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
            <span>{String(value || '')}</span>
          </div>
        )
      }
    },
    { 
      key: 'category' as const,
      title: '分类', 
      sortable: true,
      render: (value: string | number | undefined, item: EditingItem) => {
        const isEditing = editingItem?.index === item.index && editingItem?.category === item.category

        return isEditing ? (
          <input
            type="text"
            value={editingItem.category}
            onChange={e => setEditingItem(prev => prev ? {
              ...prev,
              category: e.target.value
            } : null)}
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          <span>{String(value || '')}</span>
        )
      }
    },
    { 
      key: 'price' as const,
      title: '价格', 
      sortable: true,
      render: (value: string | number | undefined, item: EditingItem) => {
        const isEditing = editingItem?.index === item.index && editingItem?.category === item.category

        return isEditing ? (
          <input
            type="number"
            value={editingItem.price}
            onChange={e => setEditingItem(prev => prev ? {
              ...prev,
              price: Number(e.target.value)
            } : null)}
            className="w-full px-2 py-1 border rounded"
            min="0"
            step="0.01"
          />
        ) : (
          <PriceDisplay 
            price={Number(value || 0)}
            previousPrice={item.previousPrice}
            size="sm"
            showDiff={item.previousPrice !== undefined}
          />
        )
      }
    },
    {
      key: 'actions' as const,
      title: '操作',
      render: (_: any, item: EditingItem) => {
        const isEditing = editingItem?.index === item.index && editingItem?.category === item.category

        return isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
            >
              <CheckIcon className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingItem(null)}
            >
              <XIcon className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(item.category, item.index, item)}
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(item.category, item.index)}
            >
              <XIcon className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      }
    }
  ] satisfies Array<{
    key: keyof EditingItem | 'actions'
    title: string
    sortable?: boolean
    render?: (value: string | number | undefined, item: EditingItem) => React.ReactNode
  }>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleAddCategory}
            disabled={!!editingCategory || !!editingItem}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            添加分类
          </Button>
          <Button 
            onClick={handleAddProduct}
            disabled={!!editingCategory || !!editingItem}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            添加商品
          </Button>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">分类管理</h2>
        <div className="grid gap-2">
          {categories.map(category => (
            <div
              key={category}
              className="flex items-center justify-between p-3 bg-card rounded-lg border"
            >
              {editingCategory?.oldName === category ? (
                <input
                  type="text"
                  value={editingCategory.newName}
                  onChange={e => setEditingCategory(prev => prev ? {
                    ...prev,
                    newName: e.target.value
                  } : null)}
                  className="flex-1 px-2 py-1 border rounded mr-4 bg-background"
                  autoFocus
                />
              ) : (
                <span className="flex-1">{category}</span>
              )}
              
              <div className="flex items-center gap-2">
                {editingCategory?.oldName === category ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveCategory}
                    >
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(null)}
                    >
                      <XIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <XIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {editingCategory?.oldName === '' && (
            <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
              <input
                type="text"
                value={editingCategory.newName}
                onChange={e => setEditingCategory(prev => prev ? {
                  ...prev,
                  newName: e.target.value
                } : null)}
                className="flex-1 px-2 py-1 border rounded mr-4 bg-background"
                autoFocus
                placeholder="请输入新分类名称"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveCategory}
                >
                  <CheckIcon className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingCategory(null)}
                >
                  <XIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 商品列表 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">商品列表</h2>
        <ProductsToolbar
          onSearch={setSearchTerm}
          onSort={(field, direction) => setSortConfig({ field, direction })}
        />
        <DataTable
          data={allProducts}
          columns={columns}
          showPagination
          pageSize={20}
        />
      </div>
    </div>
  )
} 