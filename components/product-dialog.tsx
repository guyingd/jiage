"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'
import { productSchema, type ProductFormData } from '@/lib/validations'

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => void
  title: string
  initialValue?: ProductFormData
}

export function ProductDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialValue = { name: '', price: 0 }
}: ProductDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValue
  })

  const onSubmitForm = handleSubmit((data) => {
    onSubmit(data)
    reset()
  })

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-lg shadow-lg">
          <div className="flex items-center justify-between border-b p-4">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={onSubmitForm} className="p-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                商品名称
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="请输入商品名称"
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                商品价格
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="请输入商品价格"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? '提交中...' : '确定'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 