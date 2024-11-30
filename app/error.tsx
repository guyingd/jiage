'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">出错了</h1>
        <p className="text-xl text-muted-foreground">
          抱歉，发生了一些错误
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            重试
          </button>
          <Link
            href="/"
            className="inline-block px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 