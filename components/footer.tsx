import { UserIcon } from '@/components/icons'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear}</span>
            <span>商品价格查询系统</span>
            <span>版权所有</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              关于系统
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              隐私政策
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              使用条款
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="h-4 w-4" />
            <span>袁子兵</span>
            <span>•</span>
            <span>最后更新：2024-11-30</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 