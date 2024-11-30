"use client"

import { useState } from 'react'
import { Edit2Icon, Trash2Icon } from '@/components/icons'
import { Dialog } from '@headlessui/react'

interface CategoryActionsProps {
  category: string
  onEdit: (oldName: string, newName: string) => Promise<void>
  onDelete: (name: string) => Promise<void>
  isActive: boolean
}

export function CategoryActions({ category, onEdit, onDelete, isActive }: CategoryActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newName, setNewName] = useState(category)

  const handleEdit = async () => {
    if (newName && newName !== category) {
      await onEdit(category, newName)
      setIsEditDialogOpen(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setIsEditDialogOpen(true)}
        className={`p-1.5 rounded-lg transition-colors ${
          isActive ? 'hover:bg-accent/50' : 'hover:bg-accent'
        }`}
      >
        <Edit2Icon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setIsDeleteDialogOpen(true)}
        className={`p-1.5 rounded-lg transition-colors ${
          isActive ? 'hover:bg-destructive/10' : 'hover:bg-destructive/10'
        }`}
      >
        <Trash2Icon className="h-4 w-4 text-destructive" />
      </button>

      {/* 编辑对话框 */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-lg shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <Dialog.Title className="text-lg font-semibold">
                修改分类名称
              </Dialog.Title>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  分类名称
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入新的分类名称"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleEdit}
                  disabled={!newName || newName === category}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  确定修改
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-lg shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <Dialog.Title className="text-lg font-semibold">
                删除分类
              </Dialog.Title>
            </div>

            <div className="p-4 space-y-4">
              <Dialog.Description className="text-muted-foreground">
                确定要删除分类"{category}"吗？此操作将同时删除该分类下的所有商品，且不可撤销。
              </Dialog.Description>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={async () => {
                    await onDelete(category)
                    setIsDeleteDialogOpen(false)
                  }}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  确定删除
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
} 