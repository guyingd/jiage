"use client"

import { useTheme } from "next-themes"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { SunIcon, MoonIcon, LogOutIcon, BarChartIcon } from "@/components/icons"
import { SearchDialog } from "./search-dialog"
import { MobileNav } from './mobile-nav'
import { Dialog } from '@headlessui/react'
import { useState } from 'react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              商品价格查询
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="hover:text-primary">首页</Link>
              <Link href="/categories" className="hover:text-primary">分类</Link>
              {session && (
                <Link href="/manage" className="hover:text-primary">管理</Link>
              )}
              <Link href="/about" className="hover:text-primary">关于</Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-2">
              <SearchDialog />
            </div>

            {session && (
              <div className="mr-2">
                <Link
                  href="/analysis"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <BarChartIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">数据分析</span>
                </Link>
              </div>
            )}

            <div className="mr-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="mr-2">
              {session ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                  title="退出登录"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">退出</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  登录
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-lg shadow-lg">
            <div className="p-6">
              <Dialog.Title className="text-lg font-semibold mb-4">
                确认退出
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground mb-6">
                确定要退出登录吗？
              </Dialog.Description>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  确定退出
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </nav>
  )
} 