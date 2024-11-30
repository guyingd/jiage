import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:opacity-50 disabled:pointer-events-none',
          
          // 变体样式
          variant === 'default' && 'bg-primary text-white hover:bg-primary/90',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          variant === 'outline' && 'border border-input hover:bg-accent hover:text-accent-foreground',
          
          // 尺寸样式
          size === 'default' && 'h-10 py-2 px-4',
          size === 'sm' && 'h-9 px-3',
          size === 'lg' && 'h-11 px-8',
          size === 'icon' && 'h-10 w-10',
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button } 