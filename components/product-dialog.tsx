"use client"

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { type Product } from '@/lib/types'

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    category: string
    product: Product
  }
}

export function ProductDialog({ isOpen, onClose, initialData }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: initialData?.product.name || '',
    price: initialData?.product.price || '',
    category: initialData?.category || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: 实现保存逻辑
      toast.success(initialData ? '商品更新成功' : '商品添加成功')
      onClose()
    } catch (error) {
      toast.error('操作失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-lg shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <Dialog.Title className="text-lg font-semibold">
              {initialData ? '编辑商品' : '添加商品'}
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                商品名称
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="请输入商品名称"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                价格
              </label>
              <input
                id="price"
                type="number"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="请输入价格"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                所属分类
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">请选择分类</option>
                {/* TODO: 添加分类选项 */}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 