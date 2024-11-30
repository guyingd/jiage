import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 允许的路由列表
  const allowedRoutes = ['/', '/manage', '/categories', '/analysis', '/login']
  const { pathname } = request.nextUrl

  // 如果不是允许的路由，重定向到首页
  if (!allowedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (浏览器图标)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 