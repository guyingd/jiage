"use client"

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { type CategoryFormData } from '@/lib/validations'

interface CategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  initialData?: CategoryFormData
}

export function CategoryDialog({ isOpen, onClose, initialData }: CategoryDialogProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: 实现保存逻辑
      toast.success(initialData ? '分类更新成功' : '分类添加成功')
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
              {initialData ? '编辑分类' : '添加分类'}
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                分类名称
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="请输入分类名称"
                required
              />
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