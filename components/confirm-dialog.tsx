"use client"

import { Dialog } from '@headlessui/react'
import { XIcon, AlertTriangleIcon } from '@/components/icons'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '确定',
  cancelText = '取消',
  type = 'info'
}: ConfirmDialogProps) {
  const colorClasses = {
    danger: 'bg-destructive text-destructive-foreground hover:opacity-90',
    warning: 'bg-yellow-500 text-white hover:opacity-90',
    info: 'bg-primary text-primary-foreground hover:opacity-90'
  }

  const iconClasses = {
    danger: 'text-destructive',
    warning: 'text-yellow-500',
    info: 'text-primary'
  }

  const bgClasses = {
    danger: 'bg-destructive/10',
    warning: 'bg-yellow-500/10',
    info: 'bg-primary/10'
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
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${bgClasses[type]}`}>
                <AlertTriangleIcon className={`h-6 w-6 ${iconClasses[type]}`} />
              </div>
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>
            </div>

            <Dialog.Description className="mt-4 text-muted-foreground">
              {description}
            </Dialog.Description>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className={`px-4 py-2 rounded-lg transition-opacity ${colorClasses[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 