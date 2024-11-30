"use client"

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FileUpIcon, XIcon } from '@/components/icons'
import { toast } from 'sonner'

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: any) => Promise<void>
}

export function ImportDialog({ isOpen, onClose, onImport }: ImportDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    await handleFile(file)
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    if (file.type !== 'application/json') {
      toast.error('只支持 JSON 文件')
      return
    }

    setIsLoading(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // 验证数据格式
      if (typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('数据格式错误')
      }

      for (const [category, items] of Object.entries(data)) {
        if (!Array.isArray(items)) {
          throw new Error(`分类 "${category}" 的数据格式错误`)
        }
        for (const item of items) {
          if (!item.name || typeof item.price !== 'number') {
            throw new Error(`分类 "${category}" 中存在无效的商品数据`)
          }
        }
      }

      await onImport(data)
      toast.success('导入成功')
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '导入失败')
    } finally {
      setIsLoading(false)
    }
  }

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
              导入数据
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded-lg transition-colors"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileUpIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                拖放 JSON 文件到此处，或者
              </p>
              <label className="inline-flex">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <span className="text-sm text-primary cursor-pointer hover:underline">
                  点击选择文件
                </span>
              </label>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>支持格式：</p>
              <pre className="bg-muted p-2 rounded-lg overflow-x-auto">
{`{
  "分类1": [
    { "name": "商品1", "price": 100 },
    { "name": "商品2", "price": 200 }
  ],
  "分类2": [
    { "name": "商品3", "price": 300 }
  ]
}`}
              </pre>
            </div>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-2" />
                <p className="text-sm">导入中...</p>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 