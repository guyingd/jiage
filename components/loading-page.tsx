import { LoadingSpinner } from './loading-spinner'

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner className="h-8 w-8" />
      <p className="text-lg text-muted-foreground animate-pulse">
        加载中，请稍候...
      </p>
    </div>
  )
} 