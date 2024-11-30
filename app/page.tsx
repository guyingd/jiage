"use client"

import { SearchDialog } from '@/components/search-dialog'
import productsData from '@/public/data/products.json'
import Link from 'next/link'
import { StatisticsSection } from '@/components/statistics-section'
import { MotionContainer } from '@/components/motion-container'
import { MotionH1, MotionP, MotionDiv } from '@/components/client-wrapper'
import { SearchBox } from '@/components/search-box'
import { ChevronRightIcon } from '@/components/icons'
import { useSession } from 'next-auth/react'
import { type Product } from '@/lib/types'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Home() {
  const { data: session } = useSession()
  const categories = Object.entries(productsData)
    .filter(([key]) => key !== '// 配置说明')
    .map(([category, items]) => ({
      name: category,
      count: Array.isArray(items) ? items.length : 0,
      totalValue: Array.isArray(items) 
        ? items.reduce((sum, item: Product) => sum + item.price, 0)
        : 0
    }))

  return (
    <div className="space-y-12">
      {/* 欢迎区域 */}
      <MotionContainer>
        <div className="text-center space-y-4">
          <MotionH1 
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            商品价格查询系统
          </MotionH1>
          <MotionP 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            快速查询和管理您的商品价格
          </MotionP>
        </div>
      </MotionContainer>

      {/* 搜索区域 */}
      <MotionContainer delay={0.3}>
        <div className="max-w-2xl mx-auto">
          <SearchDialog
            className="w-full"
            buttonClassName="w-full"
          />
        </div>
      </MotionContainer>

      {/* 分类统计 */}
      <div>
        <MotionContainer delay={0.4}>
          <h2 className="text-2xl font-bold mb-6">商品分类</h2>
        </MotionContainer>
        <MotionDiv
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <MotionDiv key={category.name} variants={item}>
              <Link
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="group block"
              >
                <div className="bg-card rounded-lg p-6 hover:shadow-lg transition-all duration-300 border group-hover:border-primary">
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary">
                    {category.name}
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>商品数量：{category.count} 个</p>
                    <p>总价值：¥{category.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>

      {/* 数据统计 */}
      <MotionContainer delay={0.5}>
        <div>
          <h2 className="text-2xl font-bold mb-6">数据统计</h2>
          <StatisticsSection data={productsData} />
        </div>
      </MotionContainer>

      {/* 功能介绍 */}
      <div>
        <MotionContainer delay={0.6}>
          <h2 className="text-2xl font-bold mb-6">系统功能</h2>
        </MotionContainer>
        <div className="grid gap-6 md:grid-cols-3">
          {/* 快速搜索 */}
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">快速搜索</h3>
            <SearchBox className="mb-4" />
          </div>

          {/* 分类管理 */}
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">分类管理</h3>
            <p className="text-muted-foreground mb-4">
              商品分类清晰，便于管理和查找
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center text-primary hover:underline"
            >
              浏览分类
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* 价格更新 */}
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">价格更新</h3>
            <p className="text-muted-foreground mb-4">
              支持实时更新商品价格，保持信息准确性
            </p>
            {session ? (
              <Link
                href="/manage"
                className="inline-flex items-center text-primary hover:underline"
              >
                管理价格
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center text-primary hover:underline"
              >
                登录管理
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 