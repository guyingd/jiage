"use client"

import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from '@/components/icons'

interface PriceDisplayProps {
  price: number
  previousPrice?: number
  size?: 'sm' | 'md' | 'lg'
  showDiff?: boolean
}

export function PriceDisplay({ 
  price, 
  previousPrice, 
  size = 'md',
  showDiff = false 
}: PriceDisplayProps) {
  const diff = previousPrice ? price - previousPrice : 0
  const percentage = previousPrice ? ((price - previousPrice) / previousPrice) * 100 : 0

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`font-medium ${sizeClasses[size]} ${
        diff > 0 ? 'text-red-500 dark:text-red-400' : 
        diff < 0 ? 'text-green-500 dark:text-green-400' : 
        'text-foreground'
      }`}>
        ¥{price.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
      </span>
      {showDiff && previousPrice && (
        <div className="flex items-center gap-1 text-sm">
          {diff > 0 ? (
            <>
              <TrendingUpIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
              <span className="text-red-500 dark:text-red-400">
                +{diff.toFixed(2)} ({percentage.toFixed(1)}%)
              </span>
            </>
          ) : diff < 0 ? (
            <>
              <TrendingDownIcon className="h-4 w-4 text-green-500 dark:text-green-400" />
              <span className="text-green-500 dark:text-green-400">
                {diff.toFixed(2)} ({percentage.toFixed(1)}%)
              </span>
            </>
          ) : (
            <>
              <MinusIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">0.00 (0.0%)</span>
            </>
          )}
        </div>
      )}
    </div>
  )
} 