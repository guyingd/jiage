"use client"

import { useState } from 'react'
import { SettingsIcon } from '@/components/icons'
import { Dialog } from '@headlessui/react'

interface BulkActionsProps<T> {
  selectedItems: T[]
  onBulkDelete: (items: T[]) => void
  onBulkUpdatePrice: (items: T[], priceChange: number, isPercentage: boolean) => void
}

export function BulkActions<T>({ selectedItems, onBulkDelete, onBulkUpdatePrice }: BulkActionsProps<T>) {
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
  const [priceChange, setPriceChange] = useState('')
  const [isPercentage, setIsPercentage] = useState(false)

  if (selectedItems.length === 0) return null

  const handlePriceUpdate = () => {
    const change = Number(priceChange)
    if (!isNaN(change)) {
      onBulkUpdatePrice(selectedItems, change, isPercentage)
      setIsPriceDialogOpen(false)
      setPriceChange('')
    }
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4 z-40">
        <span className="text-sm font-medium">
          已选择 {selectedItems.length} 项
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPriceDialogOpen(true)}
            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <SettingsIcon className="h-4 w-4" />
            批量修改价格
          </button>
          <button
            onClick={() => {
              if (confirm(`确定要删除选中的 ${selectedItems.length} 项吗？`)) {
                onBulkDelete(selectedItems)
              }
            }}
            className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            批量删除
          </button>
        </div>
      </div>

      <Dialog
        open={isPriceDialogOpen}
        onClose={() => setIsPriceDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-lg shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <Dialog.Title className="text-lg font-semibold">
                批量修改价格
              </Dialog.Title>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  价格变动
                </label>
                <div className="flex gap-2">
                  <select
                    value={isPercentage ? 'percentage' : 'fixed'}
                    onChange={(e) => setIsPercentage(e.target.value === 'percentage')}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="fixed">固定金额</option>
                    <option value="percentage">百分比</option>
                  </select>
                  <input
                    type="number"
                    value={priceChange}
                    onChange={(e) => setPriceChange(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={isPercentage ? "例如：10 表示涨价10%" : "例如：100"}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isPercentage
                    ? "输入正数表示涨价，负数表示降价"
                    : "输入正数表示加价，负数表示减价"}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsPriceDialogOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handlePriceUpdate}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  确定修改
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
} 