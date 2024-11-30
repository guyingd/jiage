"use client"

import { MotionContainer } from '@/components/motion-container'
import { MotionH1, MotionP } from '@/components/client-wrapper'
import { UserIcon, MailIcon, CalendarIcon } from '@/components/icons'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* 标题区域 */}
      <MotionContainer>
        <div className="text-center space-y-4">
          <MotionH1 
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            关于系统
          </MotionH1>
          <MotionP 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            一个现代化的商品价格管理系统
          </MotionP>
        </div>
      </MotionContainer>

      {/* 系统介绍 */}
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 作者信息 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">作者信息</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">袁子兵</span>
            </div>
            <div className="flex items-center gap-3">
              <MailIcon className="h-5 w-5 text-muted-foreground" />
              <a 
                href="mailto:2739218253@qq.com" 
                className="text-primary hover:underline"
              >
                2739218253@qq.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">最后更新：2024-11-30</span>
            </div>
          </div>
        </section>

        {/* 系统特点 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">系统特点</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• 支持商品分类管理，便于组织和查找</li>
            <li>• 实时价格更新，保持信息准确性</li>
            <li>• 强大的搜索功能，快速定位商品</li>
            <li>• 数据可视化分析，直观展示统计信息</li>
            <li>• 支持批量导入导出，提高工作效率</li>
            <li>• 响应式设计，支持多种设备访问</li>
          </ul>
        </section>

        {/* 技术栈 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">技术栈</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Next.js 14 - React 框架</li>
            <li>• TypeScript - 类型安全</li>
            <li>• Tailwind CSS - 样式系统</li>
            <li>• NextAuth.js - 身份认证</li>
            <li>• Chart.js - 数据可视化</li>
            <li>• Framer Motion - 动画效果</li>
          </ul>
        </section>

        {/* 版权信息 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">版权信息</h2>
          <p className="text-muted-foreground">
            © 2024 商品价格查询系统，保留所有权利。
          </p>
        </section>
      </div>
    </div>
  )
} 