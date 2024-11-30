"use client"

import { useState } from 'react'
import { MenuIcon, XIcon } from '@/components/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from "next-auth/react"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const { data: session } = useSession()

  const links = [
    { href: '/', label: '首页' },
    { href: '/categories', label: '分类' },
    ...(session ? [
      { href: '/manage', label: '管理' },
      { href: '/analysis', label: '数据分析' }
    ] : []),
    { href: '/about', label: '关于' }
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-accent rounded-lg transition-colors"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-background border-l z-50"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">菜单</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block px-4 py-2 rounded-lg transition-colors ${
                          pathname === link.href
                            ? 'bg-accent'
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 